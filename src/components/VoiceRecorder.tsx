'use client';

import { useState } from 'react';
import { useDeepgram } from '@/lib/contexts/DeepgramContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Save } from 'lucide-react';
import { addDocument } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';

interface VoiceRecorderProps {
  onNoteSaved: () => void;
}

export default function VoiceRecorder({ onNoteSaved }: VoiceRecorderProps) {
  const { connectToDeepgram, disconnectFromDeepgram, realtimeTranscript, connectionState } = useDeepgram();
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleToggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await connectToDeepgram();
    } else {
      setIsRecording(false);
      disconnectFromDeepgram();
      if (realtimeTranscript && user) {
        setIsSaving(true);
        try {
          const noteData = {
            text: realtimeTranscript.trim(),
            timestamp: new Date().toISOString(),
            userId: user.uid,
          };
          
          await addDocument('notes', noteData);
          console.log('Note saved successfully:', noteData);
          onNoteSaved();
        } catch (error) {
          console.error('Error saving note:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleToggleRecording}
        disabled={isSaving}
        className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold transform hover:scale-105 active:scale-95 ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-cyan-600 hover:bg-cyan-700 text-white'
        }`}
      >
        {isRecording ? (
          <>
            <MicOff className="h-6 w-6" />
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic className="h-6 w-6" />
            <span>Start Recording</span>
          </>
        )}
      </button>

      <AnimatePresence mode="wait">
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-gray-700 rounded-2xl shadow-lg"
          >
            <div className="flex justify-center mb-6 space-x-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, 2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1 h-8 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
            <div className="min-h-[100px] p-4 bg-gray-600 rounded-lg">
              <p className="text-gray-100 text-lg text-center whitespace-pre-wrap">
                {realtimeTranscript || "Listening..."}
              </p>
            </div>
          </motion.div>
        )}

        {isSaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 bg-gray-700 rounded-2xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-12 h-12 mb-4"
            >
              <Save className="w-full h-full text-cyan-400" />
            </motion.div>
            <p className="text-gray-100 text-lg">Saving your note...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording status indicator */}
      <div className="flex justify-center items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${
          isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
        }`} />
        <span className="text-gray-300">
          {isRecording ? 'Recording in progress...' : 'Ready to record'}
        </span>
      </div>
    </div>
  );
}