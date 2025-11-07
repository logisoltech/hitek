const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://svyrkggjjkbxsbvumfxj.supabase.co';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2eXJrZ2dqamtieHNidnVtZnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODgyNTEsImV4cCI6MjA3Nzg2NDI1MX0.1aRKA1GT8nM2eNKF6-bqQV9K40vP7cRSxuj-QtbpO0g';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const normalizeStatus = (status) => {
  if (!status) return 'pending';
  return status.toString().toLowerCase();
};

const isPendingStatus = (status) => {
  const normalized = normalizeStatus(status);
  return normalized === 'pending' || normalized === 'in_progress';
};

const updateUserTotals = async (userId, delta) => {
  const toNumber = (value) => {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
  };

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('totalorders, pending, completed')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('Failed to fetch user totals:', userError);
    return;
  }

  const currentTotals = {
    totalorders: toNumber(userData.totalorders),
    pending: toNumber(userData.pending),
    completed: toNumber(userData.completed),
  };

  const totalsUpdate = {
    totalorders: Math.max(0, currentTotals.totalorders + (delta.totalorders || 0)),
    pending: Math.max(0, currentTotals.pending + (delta.pending || 0)),
    completed: Math.max(0, currentTotals.completed + (delta.completed || 0)),
  };

  const { error: updateError } = await supabase
    .from('users')
    .update(totalsUpdate)
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update user totals:', updateError);
  }
};

router.post('/', async (req, res) => {
  try {
    const {
      userId,
      status = 'pending',
      totals = {},
      shippingAddress,
      billingAddress,
      paymentMethod,
      items = [],
      orderNotes,
    } = req.body;

    if (!userId || !items.length) {
      return res.status(400).json({ error: 'userId and at least one item are required' });
    }

    const normalizedStatus = normalizeStatus(status);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: normalizedStatus,
        subtotal: totals.subtotal || 0,
        tax: totals.tax || 0,
        shipping: totals.shipping || 0,
        total: totals.total || 0,
        shipping_address: shippingAddress || null,
        billing_address: billingAddress || null,
        payment_method: paymentMethod || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id || null,
      name: item.name,
      price: item.price || 0,
      quantity: item.quantity || 1,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    const totalsDelta = {
      totalorders: 1,
      pending: isPendingStatus(normalizedStatus) ? 1 : 0,
      completed: normalizedStatus === 'completed' ? 1 : 0,
    };

    updateUserTotals(userId, totalsDelta).catch((err) =>
      console.error('User total update error:', err),
    );

    res.json({ order, items: orderItems });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: error.message || 'Failed to load orders' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Fetch order by id error:', error);
    res.status(500).json({ error: error.message || 'Failed to load order' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const normalizedStatus = normalizeStatus(status);

    const { data: existingOrder, error: existingError } = await supabase
      .from('orders')
      .select('user_id, status')
      .eq('id', id)
      .single();

    if (existingError) throw existingError;

    const { data, error } = await supabase
      .from('orders')
      .update({ status: normalizedStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (existingOrder?.user_id) {
      const previousStatus = normalizeStatus(existingOrder.status);
      const delta = {
        totalorders: 0,
        pending: (isPendingStatus(normalizeStatus(existingOrder.status)) ? -1 : 0) +
          (isPendingStatus(normalizedStatus) ? 1 : 0),
        completed:
          (normalizeStatus(existingOrder.status) === 'completed' ? -1 : 0) +
          (normalizedStatus === 'completed' ? 1 : 0),
      };

      updateUserTotals(existingOrder.user_id, delta).catch((err) =>
        console.error('User totals update error:', err),
      );
    }

    res.json(data);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: error.message || 'Failed to update order' });
  }
});

module.exports = router;

