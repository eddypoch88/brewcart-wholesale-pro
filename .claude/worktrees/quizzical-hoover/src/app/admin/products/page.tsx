import React from 'react';
import { useSupabaseCollection } from '@/src/hooks/useSupabase';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

// Mock Link for Vite environment (replacing Next.js Link)
const Link = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <a href={href} className={className} onClick={(e) => { e.preventDefault(); console.log('Navigate to:', href); }}>
        {children}
    </a>
);

export default function ProductsPage() {
    const { data: products, loading } = useSupabaseCollection('products');

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                // No need to refresh, real-time listener will update the list
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    };

    // Mobile Product Card
    const ProductCard = ({ product }: any) => (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                    {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-slate-100" />
                    ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Package className="text-slate-400" size={24} />
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-slate-900">{product.name}</h3>
                        <p className="text-xs text-slate-500">{product.category || 'Uncategorized'}</p>
                        <p className="text-sm font-bold text-blue-600 mt-1">RM {product.price?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
                <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Edit size={18} />
                    <span className="text-xs font-semibold">Edit</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="text-sm text-slate-500">Manage your store inventory</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add Product</span>
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>)}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                    <p className="text-slate-500 mb-6">Get started by creating your first product.</p>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                    >
                        <Plus size={18} /> Add New Product
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile View */}
                    <div className="md:hidden">
                        {products.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                        <Package className="text-slate-400" size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{product.category || 'General'}</td>
                                        <td className="px-6 py-4 font-mono text-sm text-slate-900">RM {product.price?.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{product.stock || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                ${product.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                {product.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`} // Assuming edit page will be created/exists, or just placeholder
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
