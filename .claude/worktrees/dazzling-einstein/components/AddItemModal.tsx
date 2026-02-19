
import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Video, X } from 'lucide-react';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newItem: any) => void;
    editingItem?: any;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave, editingItem }) => {
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        stock: '',
        image: '',
        description: ''
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingItem) {
            setNewItem({
                name: editingItem.name,
                price: editingItem.price,
                stock: editingItem.stock.toString(),
                image: editingItem.image,
                description: editingItem.description || ''
            });
            setPreviewUrl(editingItem.image);
            // Simple heuristic for existing items: check extension or default to image
            if (editingItem.image?.match(/\.(mp4|webm|mov)$/i)) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }
        } else {
            setNewItem({ name: '', price: '', stock: '', image: '', description: '' });
            setPreviewUrl(null);
            setMediaType(null);
        }
    }, [editingItem, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Smart Logic: Check file type
            if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }

            setNewItem(prev => ({ ...prev, image: url }));
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setMediaType(null);
        setNewItem(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(newItem);
        setNewItem({ name: '', price: '', stock: '', image: '', description: '' });
        setPreviewUrl(null);
        setMediaType(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark w-[90%] max-w-sm rounded-[2rem] p-6 shadow-2xl border border-white/10 relative animate-in zoom-in-95 duration-200">

                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 tracking-tight">
                    {editingItem ? 'Edit Product' : 'Add New Product'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wide">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={newItem.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Hazy IPA"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wide">Price</label>
                            <input
                                type="text"
                                name="price"
                                required
                                value={newItem.price}
                                onChange={handleInputChange}
                                placeholder="28.00"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wide">Stock Level</label>
                            <input
                                type="number"
                                name="stock"
                                required
                                value={newItem.stock}
                                onChange={handleInputChange}
                                placeholder="100"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Hybrid Media Uploader */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wide">Product Media</label>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />

                        {previewUrl ? (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group bg-black">
                                {mediaType === 'video' ? (
                                    <video
                                        src={previewUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={triggerFileInput}
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition cursor-pointer gap-3 group"
                            >
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <ImageIcon className="text-indigo-500" size={20} />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 delay-75">
                                        <Video className="text-violet-500" size={20} />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Upload Photo or Stock Video</span>
                                    <span className="block text-xs text-slate-400 mt-1">(MP4, JPG, PNG - Max 10MB)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wide">Description (Optional)</label>
                        <textarea
                            name="description"
                            value={newItem.description}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="Product details..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-[0_10px_30px_rgba(99,102,241,0.25)] hover:scale-[1.02] transition active:scale-[0.98]"
                        >
                            {editingItem ? 'Save Changes' : 'Save Product'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full text-slate-500 dark:text-slate-400 font-medium text-sm py-2 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
