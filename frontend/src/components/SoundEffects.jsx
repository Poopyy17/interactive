import { useRef, useCallback } from 'react';

// Import audio files
import correctSoundSrc from '@/assets/CorrectAnswer.mp3';
import incorrectSoundSrc from '@/assets/IncorrectAnswer.mp3';

export const useSoundEffects = () => {
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  // Play correct answer sound
  const playCorrectSound = useCallback(() => {
    if (correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch((err) => {
        // Handle autoplay restrictions gracefully
        console.log('Could not play sound:', err);
      });
    }
  }, []);

  // Play incorrect answer sound
  const playIncorrectSound = useCallback(() => {
    if (incorrectSoundRef.current) {
      incorrectSoundRef.current.currentTime = 0;
      incorrectSoundRef.current.play().catch((err) => {
        // Handle autoplay restrictions gracefully
        console.log('Could not play sound:', err);
      });
    }
  }, []);

  return {
    playCorrectSound,
    playIncorrectSound,
    soundRefs: {
      correctSoundRef,
      incorrectSoundRef,
    },
  };
};

const SoundEffects = () => {
  return (
    <div className="hidden">
      <audio
        ref={(ref) => (window.correctSound = ref)}
        src={correctSoundSrc}
        preload="auto"
      />
      <audio
        ref={(ref) => (window.incorrectSound = ref)}
        src={incorrectSoundSrc}
        preload="auto"
      />
    </div>
  );
};

export const SoundEffectsProvider = ({ children }) => {
  return (
    <>
      <SoundEffects />
      {children}
    </>
  );
};

// A standalone component to play sounds
export const GameSounds = {
  playCorrect: () => {
    if (window.correctSound) {
      window.correctSound.currentTime = 0;
      window.correctSound
        .play()
        .catch((err) => console.log('Audio play error:', err));
    }
  },
  playIncorrect: () => {
    if (window.incorrectSound) {
      window.incorrectSound.currentTime = 0;
      window.incorrectSound
        .play()
        .catch((err) => console.log('Audio play error:', err));
    }
  },
};

export default SoundEffects;
