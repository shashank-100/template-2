'use client';

import { useEffect, useState } from 'react';
import { getDocuments, Note } from '../lib/firebase/firebaseUtils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getDocuments<Note>('notes');
      console.log('Fetched notes:', fetchedNotes);
      setNotes(fetchedNotes.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Your Voice Notes</h2>
      </div>
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-gray-100 text-lg">{note.text}</p>
            <p className="text-sm text-gray-400 mt-3">
              {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
            </p>
          </motion.div>
        ))}
        {notes.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-300 text-lg">
              No voice notes yet. Start recording to create one!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
} 