import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductPublic, addToCart } from '../../lib/storage';
import { Product, SelectedVariant } from '../../types';
import { ArrowLeft, ShoppingCart, Package, Minus, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProductPage() {
    const { id, slug } = useParams<{ id: string; slug?: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    // Track selected option index per variant group: { "Size": 0, "Color": 1 }
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

    useEffect(() => {
        async function loadProduct() {
            if (!id) return;
            try {
                const fetchedProduct = await getProductPublic(id);
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

    const storeLink = slug ? `/store/${slug}` : '/';

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
                <Link to={storeLink} className="text-blue-600 hover:underline font-medium">← Back to store</Link>
            </div>
        );
    }

    // ── Variant helpers ─────────────────────────────────────────────────────
    const hasVariants = product.variants && product.variants.length > 0;

    // Calculate total price modifier from all selected variant options
    const totalPriceModifier = hasVariants
        ? Object.entries(selectedOptions).reduce((sum, [variantName, optionIdx]) => {
            const variant = product.variants!.find(v => v.name === variantName);
            const option = variant?.options[optionIdx];
            return sum + (option?.price_modifier || 0);
        }, 0)
        : 0;

    const displayPrice = product.price + totalPriceModifier;

    // Check if all variant groups have a selection
    const allVariantsSelected = !hasVariants ||
        product.variants!.every(v => selectedOptions[v.name] !== undefined);

    // Build the SelectedVariant object for cart/order
    const buildSelectedVariant = (): SelectedVariant | undefined => {
        if (!hasVariants) return undefined;
        const label = Object.entries(selectedOptions)
            .map(([variantName, optionIdx]) => {
                const variant = product.variants!.find(v => v.name === variantName);
                const option = variant?.options[optionIdx];
                return `${variantName}: ${option?.name || '?'}`;
            })
            .join(', ');
        return { label, priceModifier: totalPriceModifier };
    };

    const handleAddToCart = () => {
        if (hasVariants && !allVariantsSelected) {
            toast.error('Please select all options before adding to cart');
            return;
        }
        addToCart({
            product: { id: product.id, name: product.name, price: product.price, images: product.images },
            qty,
            selectedVariant: buildSelectedVariant(),
        });
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
                        <span className="text-3xl font-bold text-blue-600">RM {displayPrice.toFixed(2)}</span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                            <span className="text-lg text-slate-400 line-through">RM {product.compare_at_price.toFixed(2)}</span>
                        )}
                    </div>

                    {/* ── VARIANT SELECTOR ─────────────────────────────────── */}
                    {hasVariants && (
                        <div className="space-y-4 mb-6">
                            {product.variants!.map((variant) => (
                                <div key={variant.name}>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {variant.name}
                                        {selectedOptions[variant.name] === undefined && (
                                            <span className="text-red-400 ml-1">*</span>
                                        )}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {variant.options.map((option, optIdx) => {
                                            const isSelected = selectedOptions[variant.name] === optIdx;
                                            return (
                                                <button
                                                    key={option.name}
                                                    onClick={() => setSelectedOptions(prev => ({ ...prev, [variant.name]: optIdx }))}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                                                        }`}
                                                >
                                                    {option.name}
                                                    {option.price_modifier ? (
                                                        <span className="ml-1 text-xs text-slate-400">
                                                            {option.price_modifier > 0 ? '+' : ''}RM{option.price_modifier.toFixed(2)}
                                                        </span>
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

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
                                disabled={hasVariants && !allVariantsSelected}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

