import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../header';
import GameBackground from '../GameBackground';

const replaceBlankWithUniform = (text, replacement = '________') => {
  // This will match any number of consecutive underscores
  return text.replace(/_{1,}/, replacement);
};

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
      <div
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Reuse existing Draggable and Droppable components
const Draggable = ({ id, children, disabled }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      disabled: disabled,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'none',
        touchAction: 'none',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-medium rounded-xl shadow-md will-change-transform ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-move touch-none select-none hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-200'
      }`}
    >
      {children}
    </div>
  );
};

const Droppable = ({ id, children, isOver, disabled }) => {
  const { setNodeRef } = useDroppable({
    id: id,
    disabled: disabled, // Add this line to disable dropping
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[120px] min-h-[50px] p-3 rounded-xl transition-all duration-500
        ${
          isOver && !disabled
            ? 'bg-green-100 border-2 border-green-400 shadow-lg scale-105'
            : disabled
            ? 'bg-gray-50 border-2 border-gray-200'
            : 'bg-gray-100 border-2 border-dashed border-gray-300'
        }`}
    >
      {children}
    </div>
  );
};

const GamePlay = () => {
  const { quarterId, lessonId, gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [droppedAnswer, setDroppedAnswer] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`/api/game/lessons/${lessonId}/games`);
        const foundGame = response.data.games.find(
          (g) => g.id === parseInt(gameId)
        );
        if (foundGame) {
          setGame(foundGame);
        }
      } catch (error) {
        console.error('Error fetching game:', error);
      }
    };
    fetchGame();
  }, [lessonId, gameId]);

  const handleDragStart = ({ active }) => {
    if (!active) return;

    setActiveId(active.id);
    setIsCorrect(false);
    setDroppedAnswer(null);

    // Check if rect and translated exist before accessing coordinates
    if (active.rect?.current?.translated) {
      setDragStartPosition({
        x: active.rect.current.translated.x,
        y: active.rect.current.translated.y,
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setIsOver(false);

    // Return early if no valid drop
    if (!active || !over || over.id !== 'blank' || !game) {
      return;
    }

    const choice = game.rounds[currentRound].choices.find(
      (c) => c.id === active.id
    );

    if (!choice) return;

    setDroppedAnswer(choice);

    if (choice.is_correct) {
      setIsCorrect(true);
      triggerConfetti();

      setTimeout(() => {
        if (currentRound + 1 < game.total_rounds) {
          setCurrentRound((prev) => prev + 1);
          setIsCorrect(false);
          setDroppedAnswer(null);
        } else {
          setGameComplete(true);
        }
      }, 5000);
    } else {
      toast.error("That's not correct. Try again!", {
        icon: '❌',
        duration: 5000,
      });
      setTimeout(() => {
        setDroppedAnswer(null);
      }, 5000);
    }
  };

  const handleDragOver = ({ over }) => {
    setIsOver(!!over);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePlayAgain = () => {
    setCurrentRound(0);
    setIsCorrect(false);
    setDroppedAnswer(null);
    setGameComplete(false);
  };

  const handleBackToLesson = () => {
    navigate(`/quarter/${quarterId}/lesson/${lessonId}`);
  };

  if (!game) return <div>Loading...</div>;

  // If game is complete, show the congratulations screen similar to multiple-choice
  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Congratulations!
              </h1>
              <p className="text-gray-600">
                You've successfully completed all questions
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">Game Complete</h2>
              <p className="text-gray-600">
                You've mastered all {game.total_rounds} rounds in this Fill in
                the Blank game.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleBackToLesson}>
                Back to Lesson
              </Button>
              <Button onClick={handlePlayAgain}>Play Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const round = game.rounds[currentRound];
  const [before, after] = round.question_text.split('_');

  return (
    <GameBackground>
      <div className="min-h-screen">
        <Header className="bg-white shadow-md" />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(`/quarter/${quarterId}/lesson/${lessonId}`)
              }
              className="text-red-700 hover:text-red-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lesson
            </Button>
          </div>

          {/* Game Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8 border border-gray-100">
            {/* Game Header */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Fill in the Blank
                </h1>
                <p className="text-gray-600">
                  Drag the correct word to complete the sentence
                </p>
              </div>
              <div className="flex items-center gap-4 w-full">
                <div className="bg-indigo-50 px-4 py-2 rounded-full">
                  <p className="text-sm font-medium text-indigo-700">
                    Round {currentRound + 1} of {game.total_rounds}
                  </p>
                </div>
                <div className="flex-grow">
                  <ProgressBar
                    current={currentRound + 1}
                    total={game.total_rounds}
                  />
                </div>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              modifiers={[restrictToWindowEdges]}
            >
              {/* Question Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 mb-8">
                <div className="text-2xl md:text-3xl font-medium text-gray-800 text-center leading-relaxed">
                  {droppedAnswer && droppedAnswer.is_correct
                    ? replaceBlankWithUniform(
                        round.question_text,
                        droppedAnswer.word || ''
                      )
                    : replaceBlankWithUniform(round.question_text)}
                </div>
              </div>

              {/* Answer Section */}
              <div className="flex flex-col items-center gap-6">
                <p className="text-lg font-medium text-gray-700">Your Answer</p>
                <Droppable id="blank" isOver={isOver} disabled={isCorrect}>
                  {droppedAnswer ? (
                    <div
                      className={`p-6 min-w-[250px] text-center rounded-xl transition-all duration-500 font-semibold text-lg ${
                        droppedAnswer.is_correct
                          ? 'bg-green-50 text-green-700 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : 'bg-red-50 text-red-700 border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      }`}
                    >
                      {droppedAnswer.image_url ? (
                        <img
                          src={`/uploads/${droppedAnswer.image_url}`}
                          alt="Answer"
                          className="h-16 mx-auto object-contain"
                        />
                      ) : (
                        droppedAnswer.word
                      )}
                    </div>
                  ) : (
                    <div className="h-20 w-64 flex items-center justify-center border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 transition-all duration-300 hover:bg-indigo-50">
                      <span className="text-indigo-400 font-medium">
                        {isCorrect
                          ? 'Correct answer!'
                          : 'Drop your answer here'}
                      </span>
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Choices Section */}
              <div className="flex justify-center gap-4 flex-wrap mt-12">
                {round.choices.map((choice) => (
                  <Draggable
                    key={choice.id}
                    id={choice.id}
                    disabled={isCorrect}
                  >
                    {choice.image_url ? (
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={`/uploads/${choice.image_url}`}
                          alt={choice.word || 'Choice'}
                          className="h-12 w-auto object-contain"
                        />
                        {choice.word && (
                          <span className="text-sm">{choice.word}</span>
                        )}
                      </div>
                    ) : (
                      choice.word
                    )}
                  </Draggable>
                ))}
              </div>
            </DndContext>

            {/* Feedback Messages */}
            {isCorrect && (
              <div className="text-center text-green-600 font-bold animate-bounce text-2xl bg-green-50 py-6 rounded-xl transition-all duration-1000 shadow-lg shadow-green-100">
                <span className="flex items-center justify-center gap-2">
                  Correct! Well done!
                  <span className="text-3xl">🎉</span>
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    </GameBackground>
  );
};

export default GamePlay;
