'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useCollection } from '@/context/CollectionContext';
import ObjectViewer from '@/components/ObjectViewer';

export default function Gallery() {
    const { items } = useCollection();
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = useMemo(() => {
        const cats = ['All', ...Array.from(new Set(items.map(item => item.category)))];
        return cats;
    }, [items]);

    const filteredItems = useMemo(() => {
        if (activeCategory === 'All') return items;
        return items.filter(item => item.category === activeCategory);
    }, [items, activeCategory]);

    return (
        <main className="min-h-screen bg-porcelain p-8 md:p-24 flex flex-col items-center">
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
            <div className="w-full max-w-6xl mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategory === cat
                            ? 'bg-charcoal text-white shadow-lg'
                            : 'bg-white text-gray-400 hover:text-charcoal border border-gray-100'
                            }`}
                    >
                        {cat}
                    </button>
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
        </main>
    );
}
