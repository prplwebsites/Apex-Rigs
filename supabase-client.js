// ==================== SUPABASE CLIENT CONFIGURATION ====================
// SECURITY WARNING: Credentials are public-facing in client applications by design
// Implement Row-Level Security (RLS) policies in Supabase dashboard to protect data
// See: https://supabase.com/docs/guides/auth/row-level-security

const SUPABASE_URL = 'https://qavvxmxajejqmpadmdjn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdnZ4bXhhamVqcW1wYWRtZGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTM0NzYsImV4cCI6MjEwMzQ4OTQ3Nn0.M1jR1ZP_7KTC1iJ4J1t_TkDJ3cAb72mg_C5lA65QANM';

// Initialize Supabase client with error handling
let apexSupabase;
try {
  apexSupabase = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_ANON_KEY);
  if (!apexSupabase) {
    console.warn('Supabase client initialization failed');
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
  apexSupabase = null;
}
// ==================== PRODUCT OPERATIONS ====================
async function getProducts() {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    const { data, error } = await apexSupabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .eq('disabled', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

async function saveProduct(product) {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    if (!product.id) {
      product.id = crypto.randomUUID?.() || 'temp-' + Date.now();
    }
    
    const { data, error } = await apexSupabase
      .from('products')
      .upsert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    if (!id) throw new Error('Product ID required');
    
    const { error } = await apexSupabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// ==================== ORDER OPERATIONS ====================
async function getOrders() {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    const { data, error } = await apexSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

async function updateOrder(id, values) {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    if (!id) throw new Error('Order ID required');
    
    const { data, error } = await apexSupabase
      .from('orders')
      .update(values)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

async function deleteOrderRecord(id) {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    if (!id) throw new Error('Order ID required');
    
    const { error } = await apexSupabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

async function createOrder(order) {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    if (!order.order_number) throw new Error('Order number required');
    
    const { data, error } = await apexSupabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// ==================== QUOTE OPERATIONS ====================
async function getQuotes() {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    const { data, error } = await apexSupabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
}

async function createQuote(quote) {
  try {
    if (!apexSupabase) throw new Error('Supabase not initialized');
    if (!quote.name || !quote.email || !quote.phone) {
      throw new Error('Name, email, and phone required');
    }
    
    const { data, error } = await apexSupabase
      .from('quotes')
      .insert(quote)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
}
