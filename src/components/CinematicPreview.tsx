"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Check } from 'lucide-react';

interface CinematicPreviewProps {
    videoUrl: string | null;
    isOpen: boolean;
    onClose: () => void;
    itemName: string;
}

export default function CinematicPreview({ videoUrl, isOpen, onClose, itemName }: CinematicPreviewProps) {
    const handleDownload = () => {
        if (!videoUrl) return;
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `objectory_${itemName.toLowerCase().replace(/\s+/g, '_')}.webm`;
        a.click();
    };

    const handleShareX = () => {
        const text = `Check out my collection on Objectory: ${itemName} #3D #Objectory`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-charcoal/40 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-[3rem] overflow-hidden max-w-lg w-full shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-center text-charcoal">
                            <div>
                                <h3 className="text-xl font-bold">Cinematic Capture</h3>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Ready to share</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Video Display */}
                        <div className="px-8 pb-8 flex-grow flex flex-col">
                            <div className="relative aspect-square bg-porcelain rounded-[2rem] overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center">
                                {videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-4 border-charcoal/10 border-t-charcoal rounded-full animate-spin" />
                                        <p className="text-[10px] font-bold tracking-widest text-gray-400">PROCESSING VIDEO...</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="w-full py-5 bg-charcoal text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Video
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleShareX}
                                        className="py-4 bg-[#F5F8FA] text-charcoal rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#E1E8ED] transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share to X
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            <p className="mt-6 text-[10px] text-center text-gray-300 font-medium">
                                FORMAT: WEBM (VP9) • HIGH DEFINITION • 60 FPS
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
