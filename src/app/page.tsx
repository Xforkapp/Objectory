'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import ObjectViewer from '@/components/ObjectViewer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-porcelain overflow-hidden flex flex-col items-center justify-center p-6 md:p-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-charcoal font-bold tracking-widest text-xl"
        >
          OBJECTORY
        </motion.h1>
        <Link href="/upload">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer"
          >
            <Plus className="text-charcoal w-5 h-5" />
          </motion.div>
        </Link>
      </header>

      {/* Hero 3D */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full h-[60vh] md:w-[800px] md:h-[600px] z-10"
      >
        <ObjectViewer
          src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
          name="Objectory Hero"
          autoRotate
          interactive={false}
        />


      </motion.div>

      {/* Content */}
      <div className="z-20 text-center max-w-2xl mt-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-6xl font-light text-charcoal mb-6 tracking-tight"
        >
          Cherish your belongings <br />
          <span className="font-bold">in 3D space.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 mb-12 text-sm md:text-base tracking-wide"
        >
          A minimal museum for your personal collection. <br />
          Experience your favorite items like never before.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link href="/gallery" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-full overflow-hidden transition-all hover:pr-12">
            <span className="relative z-10 font-medium">Start Gallery</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] text-charcoal font-medium"
      >
        Scroll down to explore
      </motion.div>
    </main>
  );
}
