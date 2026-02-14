'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Share2, Info, Lightbulb, ChevronDown, ChevronUp, Trash2,
    AlertTriangle, Video, Camera, Sparkles, Loader2
} from 'lucide-react';
import { useCollection } from '@/context/CollectionContext';
import ObjectViewer, { ObjectViewerRef } from '@/components/ObjectViewer';
import CinematicPreview from '@/components/CinematicPreview';


export default function DetailView() {
    const params = useParams();
    const router = useRouter();
    const { getItemById, deleteItem } = useCollection();
    const item = getItemById(params.id as string);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Recording States
    const viewerRef = useRef<ObjectViewerRef>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingProgress, setRecordingProgress] = useState(0);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    if (!item) {
        return (
            <div className="min-h-screen bg-porcelain flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold text-charcoal mb-4">Item not found</h1>
                <Link href="/gallery" className="text-gray-500 hover:text-charcoal underline">
                    Return to Gallery
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        deleteItem(item.id);
        router.push('/gallery');
    };

    const startCinematicCapture = async () => {
        if (!viewerRef.current) return;

        setIsRecording(true);
        setRecordingProgress(0);

        // 5秒間の撮影
        const duration = 5000;
        const interval = 100;
        let elapsed = 0;

        const progressTimer = setInterval(() => {
            elapsed += interval;
            setRecordingProgress(Math.min((elapsed / duration) * 100, 100));
        }, interval);

        try {
            const blob = await viewerRef.current.startRecording(duration);
            const url = URL.createObjectURL(blob);
            setRecordedVideoUrl(url);
            setShowPreview(true);
        } catch (error) {
            console.error("Recording failed", error);
            alert("Recording failed. Please try again.");
        } finally {
            clearInterval(progressTimer);
            setIsRecording(false);
            setRecordingProgress(0);
        }
    };

    return (
        <main className="relative h-screen w-full bg-porcelain overflow-hidden">
            {/* Header Overlay */}
            <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/gallery">
                        <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-charcoal" />
                        </motion.div>
                    </Link>
                </div>
                <div className="pointer-events-auto flex gap-3">
                    <button
                        onClick={startCinematicCapture}
                        disabled={isRecording}
                        className={`p-2 rounded-full backdrop-blur-sm shadow-sm transition-all group ${isRecording ? 'bg-charcoal text-white ring-4 ring-charcoal/10' : 'bg-white/50 text-charcoal hover:bg-white'
                            }`}
                        title="Cinematic Capture"
                    >
                        {isRecording ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-red-50 transition-colors group"
                    >
                        <Trash2 className="w-5 h-5 text-charcoal group-hover:text-red-500 transition-colors" />
                    </button>
                    <button className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                        <Share2 className="w-5 h-5 text-charcoal" />
                    </button>
                </div>
            </header>

            {/* Recording Progress Bar */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center gap-3 px-6 py-3 bg-charcoal text-white rounded-full shadow-2xl">
                            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Cinematic Recording in progress</span>
                            <span className="text-[10px] font-mono">{Math.round(recordingProgress)}%</span>
                        </div>
                        <div className="w-64 h-1 bg-charcoal/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-charcoal"
                                initial={{ width: 0 }}
                                animate={{ width: `${recordingProgress}%` }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Canvas */}
            <div className={`absolute inset-0 z-10 cursor-grab active:cursor-grabbing transition-all duration-1000 ${isRecording ? 'scale-90 opacity-90' : 'scale-100 opacity-100'
                }`}>
                <ObjectViewer
                    ref={viewerRef}
                    src={item.glbSrc}
                    poster={item.poster}
                    name={item.name}
                    interactive={!isRecording}
                    autoRotate={false}
                />
            </div>

            {/* Info Panel */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: isRecording ? 0 : 1,
                    y: isRecording ? 20 : 0,
                }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-8 left-0 w-full md:left-8 md:w-80 md:bottom-8 z-20 px-4 md:px-0 pointer-events-none"
            >
                <motion.div
                    layout
                    className="relative bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden pointer-events-auto"
                >
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-charcoal/5 hover:bg-charcoal/10 transition-colors z-30"
                    >
                        {isCollapsed ? <ChevronUp className="w-4 h-4 text-charcoal" /> : <ChevronDown className="w-4 h-4 text-charcoal" />}
                    </button>

                    <div className="p-8">
                        <div className="mb-4 pr-8">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-1">
                                {item.brand}
                            </span>
                            <h1 className="text-3xl font-light text-charcoal tracking-tight">{item.name}</h1>
                        </div>

                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                                        {item.description || "No description available for this piece."}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <button className="text-charcoal flex flex-col items-center gap-1">
                                                <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center">
                                                    <Lightbulb className="w-4 h-4" />
                                                </div>
                                                <span className="text-[8px] uppercase tracking-widest font-bold">Lighting</span>
                                            </button>
                                            <button className="text-charcoal flex flex-col items-center gap-1">
                                                <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <span className="text-[8px] uppercase tracking-widest font-bold">Details</span>
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Acquired</span>
                                            <span className="text-sm font-medium text-charcoal">{item.date}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>

            {/* Video Preview Modal */}
            <CinematicPreview
                videoUrl={recordedVideoUrl}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                itemName={item.name}
            />

            {/* Delete Confirmation Overlay */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/20 backdrop-blur-md"
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
                            <h2 className="text-2xl font-bold text-charcoal mb-3">Remove Item?</h2>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                This will permanently remove <span className="font-bold text-charcoal">{item.name}</span> from your collection. This action cannot be undone.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDelete}
                                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-red-200"
                                >
                                    Delete Item
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

            {/* Interaction Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2 }}
                className="absolute top-1/2 right-8 -translate-y-1/2 hidden md:block z-30 pointer-events-none"
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-[1px] h-12 bg-charcoal" />
                    <span className="text-[8px] uppercase tracking-[0.4em] vertical-text transform rotate-180 font-bold">Rotate Object</span>
                    <div className="w-[1px] h-12 bg-charcoal" />
                </div>
            </motion.div>
        </main>
    );
}
