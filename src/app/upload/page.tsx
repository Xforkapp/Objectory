'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, CheckCircle2, Scan, ChevronRight, Watch, Smartphone, Box, Sparkles } from 'lucide-react';
import { useCollection, ItemType } from '@/context/CollectionContext';

export default function UploadPage() {
    const router = useRouter();
    const { addItem, getCategories } = useCollection();

    const [step, setStep] = useState<'info' | 'simulating' | 'success'>('info');
    const [progress, setProgress] = useState(0);
    
    // Form State
    const [itemName, setItemName] = useState('');
    const [itemBrand, setItemBrand] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemType, setItemType] = useState<ItemType>('sculpture');
    const [newCategory, setNewCategory] = useState('');
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

    const categories = getCategories();

    const startScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim() || !itemBrand.trim() || (!itemCategory && !newCategory)) {
            return;
        }
        setStep('simulating');
        setProgress(0);
    };

    useEffect(() => {
        if (step === 'simulating') {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1.5;
                });
            }, 30);

            const timeout = setTimeout(() => {
                const finalCategory = isAddingNewCategory ? newCategory.trim() : itemCategory;
                const colors = ['#8B4513', '#E5E5E5', '#1A1A1A', '#4A90E2', '#FF6B6B', '#FAD02E'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                addItem({
                    name: itemName,
                    brand: itemBrand,
                    type: itemType,
                    category: finalCategory || 'General',
                    color: randomColor,
                    glbSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
                    description: `A precision digital twin of ${itemName} by ${itemBrand}, categorized under ${finalCategory}.`
                });

                setStep('success');
            }, 3500);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        } else if (step === 'success') {
            const timeout = setTimeout(() => {
                router.push('/gallery');
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [step, addItem, router, itemName, itemBrand, itemCategory, newCategory, isAddingNewCategory, itemType]);

    return (
        <main className="min-h-screen bg-porcelain text-charcoal flex flex-col p-6 md:p-12 overflow-x-hidden">
            {/* Header */}
            <header className="w-full max-w-4xl mx-auto flex justify-between items-center mb-12">
                <button onClick={() => router.back()} className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-sm font-bold tracking-[0.3em] uppercase opacity-40">Digital Archive</h1>
                <div className="w-10"></div>
            </header>

            <div className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {step === 'info' ? (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                        >
                            {/* Left Side: Form */}
                            <form onSubmit={startScan} className="space-y-8">
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-light tracking-tight mb-8">Register your <span className="font-bold">Piece</span></h2>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Object Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            placeholder="e.g. Vintage Submariner"
                                            className="w-full bg-white rounded-2xl px-6 py-4 outline-none border border-transparent focus:border-charcoal/10 shadow-sm transition-all text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Brand / Maker</label>
                                        <input
                                            required
                                            type="text"
                                            value={itemBrand}
                                            onChange={(e) => setItemBrand(e.target.value)}
                                            placeholder="e.g. Rolex"
                                            className="w-full bg-white rounded-2xl px-6 py-4 outline-none border border-transparent focus:border-charcoal/10 shadow-sm transition-all text-lg"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Category</label>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => {
                                                        setItemCategory(cat);
                                                        setIsAddingNewCategory(false);
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${itemCategory === cat && !isAddingNewCategory ? 'bg-charcoal text-white shadow-lg' : 'bg-white text-gray-400 hover:text-charcoal'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingNewCategory(true)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isAddingNewCategory ? 'bg-charcoal text-white shadow-lg' : 'bg-white text-gray-400 hover:text-charcoal border-dashed border-2 border-gray-100'}`}
                                            >
                                                + New Category
                                            </button>
                                        </div>
                                        
                                        {isAddingNewCategory && (
                                            <motion.input
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                placeholder="Enter category name..."
                                                className="w-full bg-white rounded-2xl px-6 py-4 outline-none border-2 border-charcoal/5 shadow-inner transition-all text-lg"
                                            />
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!itemName || !itemBrand || (!itemCategory && !newCategory)}
                                    className="w-full group bg-charcoal text-white rounded-2xl py-6 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                    <Scan className="w-5 h-5 group-hover:animate-pulse" />
                                    <span className="font-bold uppercase tracking-[0.2em] text-sm">Start 3D Scan</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </form>

                            {/* Right Side: Type Selection / Visual */}
                            <div className="hidden lg:flex flex-col gap-8 justify-center">
                                <div className="bg-white/50 backdrop-blur-sm p-12 rounded-[3rem] border border-white shadow-sm flex flex-col items-center">
                                    <div className="w-32 h-32 mb-8 bg-porcelain rounded-full flex items-center justify-center relative overflow-hidden">
                                        <motion.div 
                                            animate={{ 
                                                scale: [1, 1.1, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute inset-0 bg-charcoal/5"
                                        />
                                        {itemType === 'watch' && <Watch className="w-12 h-12 opacity-40" />}
                                        {itemType === 'sneaker' && <Box className="w-12 h-12 opacity-40" />}
                                        {itemType === 'camera' && <Camera className="w-12 h-12 opacity-40" />}
                                        {itemType === 'sculpture' && <Sparkles className="w-12 h-12 opacity-40" />}
                                    </div>
                                    <p className="text-center text-sm text-gray-400 mb-8 max-w-[200px]">Select the object type to calibrate the scanner</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {(['watch', 'sneaker', 'camera', 'sculpture'] as ItemType[]).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setItemType(t)}
                                                className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${itemType === t ? 'border-charcoal bg-white shadow-md' : 'border-transparent bg-white/30 hover:bg-white/50 opacity-40'}`}
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : step === 'simulating' ? (
                        <motion.div
                            key="simulating"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-16 w-full max-w-xl"
                        >
                            <div className="relative w-80 h-80">
                                {/* Outer ring */}
                                <motion.div 
                                    className="absolute inset-0 border-[1px] border-charcoal/5 rounded-full"
                                    animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                {/* Scanning bar */}
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="w-1 h-full bg-gradient-to-b from-transparent via-charcoal/20 to-transparent blur-sm" />
                                </motion.div>
                                
                                <div className="absolute inset-10 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
                                     <motion.div
                                        initial={{ y: 200 }}
                                        animate={{ y: -200 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-charcoal/5 blur-xl pointer-events-none"
                                     />
                                     <div className="flex flex-col items-center">
                                         <Scan className="w-12 h-12 mb-4 animate-pulse opacity-20" />
                                         <span className="text-5xl font-mono tracking-tighter">{Math.floor(progress)}%</span>
                                     </div>
                                </div>
                            </div>

                            <div className="text-center w-full space-y-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">Calibrating Vertices</span>
                                <h2 className="text-3xl font-light tracking-tight">Digitizing <span className="font-bold">{itemName}</span></h2>
                                <div className="h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-charcoal"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                                className="w-32 h-32 rounded-full bg-charcoal flex items-center justify-center shadow-2xl"
                            >
                                <CheckCircle2 className="w-16 h-16 text-white" />
                            </motion.div>
                            <div className="text-center space-y-2">
                                <h2 className="text-4xl font-light tracking-tight">Object <span className="font-bold">Archived</span></h2>
                                <p className="text-gray-400 animate-pulse">Synchronizing with Gallery...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
