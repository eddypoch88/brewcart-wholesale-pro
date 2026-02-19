import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../types';

export const OrderService = {
    /**
     * Get all orders for a specific store
     */
    async getAll(storeId: string) {
        return await supabase
            .from('orders')
            .select('*')
            .eq('store_id', storeId)
            .order('created_at', { ascending: false });
    },

    /**
     * Get a single order by ID (with store validation)
     */
    async getById(id: string, storeId: string) {
        return await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .eq('store_id', storeId)
            .single();
    },

    /**
     * Update order status
     */
    async updateStatus(
        id: string,
        storeId: string,
        status: Order['status']
    ) {
        return await supabase
            .from('orders')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('store_id', storeId);
    },

    /**
     * Create a new order
     */
    async create(order: Omit<Order, 'id' | 'created_at' | 'order_number'>, storeId: string) {
        return await supabase
            .from('orders')
            .insert([{
                ...order,
                store_id: storeId,
                created_at: new Date().toISOString()
            }]);
    },

    /**
     * Delete an order (soft delete by setting status to cancelled)
     */
    async cancel(id: string, storeId: string) {
        return await this.updateStatus(id, storeId, 'cancelled');
    },

    /**
     * Get orders by status
     */
    async getByStatus(storeId: string, status: Order['status']) {
        return await supabase
            .from('orders')
            .select('*')
            .eq('store_id', storeId)
            .eq('status', status)
            .order('created_at', { ascending: false });
    },

    /**
     * Search orders by customer name or phone
     */
    async search(storeId: string, query: string) {
        return await supabase
            .from('orders')
            .select('*')
            .eq('store_id', storeId)
            .or(`customer_name.ilike.%${query}%,customer_phone.ilike.%${query}%`)
            .order('created_at', { ascending: false });
    }
};
