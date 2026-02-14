'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, AlertTriangle, X } from 'lucide-react';
import { useCollection } from '@/context/CollectionContext';
import ObjectViewer from '@/components/ObjectViewer';

export default function Gallery() {
    const { items, deleteCategory } = useCollection();
    const [activeCategory, setActiveCategory] = useState('All');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const categories = useMemo(() => {
        const cats = ['All', ...Array.from(new Set(items.map(item => item.category)))];
        return cats;
    }, [items]);

    const filteredItems = useMemo(() => {
        if (activeCategory === 'All') return items;
        return items.filter(item => item.category === activeCategory);
    }, [items, activeCategory]);

    const handleDeleteCategory = () => {
        deleteCategory(activeCategory);
        setActiveCategory('All');
        setShowDeleteConfirm(false);
    };

    return (
        <main className="min-h-screen bg-porcelain p-8 md:p-24 flex flex-col items-center relative">
            {/* Header */}
            <header className="w-full max-w-6xl flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <motion.div whileHover={{ x: -5 }} className="cursor-pointer">
                            <ArrowLeft className="w-6 h-6 text-charcoal" />
                        </motion.div>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-widest text-charcoal uppercase">Gallery</h1>
                </div>
                <Link href="/upload">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-full text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                    </motion.div>
                </Link>
            </header>

            {/* Category Tabs */}
            <div className="w-full max-w-6xl mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide items-center">
                {categories.map((cat) => (
                    <div key={cat} className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap flex items-center gap-2 ${activeCategory === cat
                                ? 'bg-charcoal text-white shadow-lg'
                                : 'bg-white text-gray-400 hover:text-charcoal border border-gray-100'
                                }`}
                        >
                            {cat}
                        </button>

                        {activeCategory === cat && cat !== 'All' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                title="Delete this category"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                        )}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link href={`/view/${item.id}`}>
                                <div className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                                    {/* 3D Preview */}
                                    <div className="w-full h-full p-8 group-hover:scale-110 transition-transform duration-500">
                                        <ObjectViewer
                                            src={item.glbSrc}
                                            name={item.name}
                                            poster={item.poster}
                                            autoRotate={false}
                                            interactive={false}
                                        />

                                    </div>

                                    {/* Overlay Info */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/90 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">{item.category}</p>
                                        <h3 className="text-charcoal font-bold">{item.name}</h3>
                                    </div>

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-32 text-center text-gray-400">
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>

            {/* Category Delete Confirmation Overlay */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/20 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-charcoal mb-3">Delete Category?</h2>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                This will permanently remove the <span className="font-bold text-charcoal">{activeCategory}</span> category and <span className="font-bold text-charcoal">all items</span> within it.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDeleteCategory}
                                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-red-200"
                                >
                                    Delete All Items
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
