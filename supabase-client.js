const SUPABASE_URL = 'https://qavvxmxajejqmpadmdjn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdnZ4bXhhamVqcW1wYWRtZGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTM0NzYsImV4cCI6MjEwMzQ4OTQ3Nn0.M1jR1ZP_7KTC1iJ4J1t_TkDJ3cAb72mg_C5lA65QANM';

const apexSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getProducts() {
  const { data, error } = await apexSupabase.from('products').select('*').eq('visible', true).eq('disabled', false).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function saveProduct(product) {
  const { data, error } = await apexSupabase.from('products').upsert(product).select().single();
  if (error) throw error;
  return data;
}

async function deleteProduct(id) {
  const { error } = await apexSupabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

async function getOrders() {
  const { data, error } = await apexSupabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function updateOrder(id, values) {
  const { data, error } = await apexSupabase.from('orders').update(values).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteOrderRecord(id) {
  const { error } = await apexSupabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

async function getQuotes() {
  const { data, error } = await apexSupabase.from('quotes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function createOrder(order) {
  const { data, error } = await apexSupabase.from('orders').insert(order).select().single();
  if (error) throw error;
  return data;
}

async function createQuote(quote) {
  const { data, error } = await apexSupabase.from('quotes').insert(quote).select().single();
  if (error) throw error;
  return data;
}
