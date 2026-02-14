"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Zap, Sparkles, Crown, Infinity, Camera, Palette } from 'lucide-react';

const PlanCard = ({
    title,
    price,
    description,
    features,
    isPro = false,
    delay = 0
}: {
    title: string,
    price: string,
    description: string,
    features: { icon: any, text: string }[],
    isPro?: boolean,
    delay?: number
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8 }}
            className={`relative p-8 md:p-12 rounded-[3.5rem] flex flex-col h-full bg-white/70 backdrop-blur-2xl border ${isPro ? 'border-charcoal/20 shadow-2xl' : 'border-white/50 shadow-xl'
                }`}
        >
            {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-charcoal text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-lg">
                    Recommended
                </div>
            )}

            <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${isPro ? 'text-charcoal' : 'text-gray-400'}`}>{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-light tracking-tighter text-charcoal">{price}</span>
                    <span className="text-sm text-gray-400 font-medium">/ month</span>
                </div>
                <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="flex-grow space-y-6 mb-12">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isPro ? 'bg-charcoal/5 group-hover:bg-charcoal/10' : 'bg-gray-50'
                            }`}>
                            <feature.icon className={`w-4 h-4 ${isPro ? 'text-charcoal' : 'text-gray-300'}`} />
                        </div>
                        <span className={`text-sm font-medium ${isPro ? 'text-charcoal' : 'text-gray-400'}`}>
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>

            <button className={`w-full py-5 rounded-2xl font-bold tracking-widest uppercase text-xs transition-all ${isPro
                    ? 'bg-charcoal text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-charcoal/20'
                    : 'bg-white text-charcoal border border-charcoal/10 hover:bg-gray-50'
                }`}>
                {isPro ? 'Get Started Pro' : 'Current Plan'}
            </button>
        </motion.div>
    );
};

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-porcelain relative overflow-hidden flex flex-col items-center">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-100/30 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="w-full max-w-7xl p-8 md:p-24 pb-0 flex items-center z-10 relative">
                <Link href="/gallery">
                    <motion.div whileHover={{ x: -5 }} className="flex items-center gap-4 text-charcoal group">
                        <ArrowLeft className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Gallery</span>
                    </motion.div>
                </Link>
            </header>

            <div className="w-full max-w-7xl px-8 py-12 md:py-24 z-10 relative">
                <header className="text-center mb-24 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 mb-8 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal">Objectory Professional</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-light text-charcoal tracking-tight mb-8"
                    >
                        Elevate your <span className="font-bold">Collection</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 leading-relaxed max-w-lg mx-auto"
                    >
                        Transform your items into digital legacy. Choose the plan that fits your archive's scale.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <PlanCard
                        delay={0.3}
                        title="Standard"
                        price="¥0"
                        description="Perfect for individuals starting their museum journey."
                        features={[
                            { icon: Check, text: "Up to 10 Museum Items" },
                            { icon: Camera, text: "Standard 3D Visualizer" },
                            { icon: Palette, text: "Classic Porcelain Background" },
                            { icon: Check, text: "Basic SNS Sharing" },
                        ]}
                    />

                    <PlanCard
                        delay={0.4}
                        isPro={true}
                        title="Pro"
                        price="¥2,900"
                        description="The ultimate studio for serious collectors and curators."
                        features={[
                            { icon: Infinity, text: "Unlimited Museum Items" },
                            { icon: Sparkles, text: "AI-Powered 3D Modeling API" },
                            { icon: Palette, text: "Custom Interactive Exhibits" },
                            { icon: Camera, text: "Pro Cinematic Camera Paths" },
                            { icon: Zap, text: "Priority Rendering Server" },
                            { icon: Crown, text: "Curator's Verified Profile" },
                        ]}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-24 text-center"
                >
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">
                        Safe Payment Guarantee • Cancel Anytime
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
