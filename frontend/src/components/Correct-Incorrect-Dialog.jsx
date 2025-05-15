import React, { useEffect, useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CorrectIncorrectDialog = ({
  show = false,
  isCorrect = true,
  message = '',
  onClose = () => {},
  onContinue = () => {},
  continueText = 'Continue',
}) => {
  const [visible, setVisible] = useState(show);

  // Handle visibility changes from props
  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Auto-close for correct answers after a delay
  useEffect(() => {
    if (show && isCorrect) {
      const timer = setTimeout(() => {
        onContinue();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, isCorrect, onContinue]);

  // Default messages based on correct/incorrect status
  const defaultMessage = isCorrect
    ? "Great job! That's correct."
    : 'Not quite right. Try again!';

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isCorrect
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200'
                : 'bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200'
            }`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`rounded-full p-4 ${
                  isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {isCorrect ? (
                  <Check className="h-10 w-10" />
                ) : (
                  <X className="h-10 w-10" />
                )}
              </motion.div>
            </div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-2xl font-bold text-center mb-2 ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-700 text-center text-lg mb-6"
            >
              {message || defaultMessage}
            </motion.p>

            {/* Action button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Button
                onClick={onContinue}
                className={`px-6 py-2 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105 ${
                  isCorrect
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {continueText}
                <ChevronRight size={18} />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CorrectIncorrectDialog;
