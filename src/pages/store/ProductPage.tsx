import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, addToCart } from '../../lib/storage';
import { Product } from '../../types';
import { ArrowLeft, ShoppingCart, Package, Minus, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        async function loadProduct() {
            if (!id) return;
            try {
                const fetchedProduct = await getProduct(id);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
                <Link to="/" className="text-blue-600 hover:underline font-medium">← Back to store</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart({ product: { id: product.id, name: product.name, price: product.price, images: product.images }, qty });
        window.dispatchEvent(new Event('cart-updated'));
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium transition">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* IMAGE */}
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
                    {product.images?.[0] ? (
                        <>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="hidden absolute inset-0 w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                                <Package size={64} />
                                <span className="text-sm font-semibold mt-2">Image unavailable</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package size={64} />
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="flex flex-col justify-center">
                    {product.category && (
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit mb-4">{product.category}</span>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
                    <p className="text-slate-600 leading-relaxed mb-6">{product.description || 'No description available.'}</p>

                    {/* Pricing */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl font-bold text-blue-600">RM {product.price.toFixed(2)}</span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                            <span className="text-lg text-slate-400 line-through">RM {product.compare_at_price.toFixed(2)}</span>
                        )}
                    </div>

                    {/* Stock */}
                    <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>

                    {/* Quantity + Add to Cart */}
                    {product.stock > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition">
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-slate-900">{qty}</span>
                                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                            >
                                <ShoppingCart size={18} /> Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
