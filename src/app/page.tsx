'use client';

import VoiceRecorder from '@/components/VoiceRecorder';
import NotesList from '@/components/NotesList';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import { DeepgramContextProvider } from '@/lib/contexts/DeepgramContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, loading } = useAuth();

  const handleNoteSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 p-6 md:p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-900 p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.header 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold text-cyan-400 mb-4">Voice Notes</h1>
            <p className="text-gray-300 text-xl mb-8">Transform your thoughts into text with ease</p>
            <SignInWithGoogle />
          </motion.header>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold text-cyan-400 mb-4">Voice Notes</h1>
          <p className="text-gray-300 text-xl">Transform your thoughts into text with ease</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-8"
        >
          <DeepgramContextProvider>
            <VoiceRecorder onNoteSaved={handleNoteSaved} />
          </DeepgramContextProvider>
        </motion.div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NotesList key={refreshTrigger} />
        </motion.div>
      </div>
    </main>
  );
}
