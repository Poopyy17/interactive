import React from 'react';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import all your instruction images
import image1 from '../assets/1.png';
import image2 from '../assets/2.png';
import image3 from '../assets/3.png';
import image4 from '../assets/4.png';
import image5 from '../assets/5.png';
import image6 from '../assets/6.png';
import image7 from '../assets/7.png';
import image8 from '../assets/8.png';
import image9 from '../assets/9.png';
import image10 from '../assets/10.png';
import image11 from '../assets/11.png';
import image12 from '../assets/12.png';
import image13 from '../assets/13.png';
import image14 from '../assets/14.png';
import image15 from '../assets/15.png';
import image16 from '../assets/16.png';
import image17 from '../assets/17.png';

const Instructions = () => {
  const navigate = useNavigate();

  // Array of instruction steps with text and corresponding image
  const instructionSteps = [
    {
      text: 'Logging in to the App.',
      image: image1,
    },
    {
      text: 'Quarter/Grading Selection.',
      image: image2,
    },
    {
      text: 'Adding and Selecting a Lesson.',
      image: image3,
    },
    {
      text: 'Add a title to the Lesson.',
      image: image4,
    },
    {
      text: 'Added Lesson.',
      image: image5,
    },
    {
      text: 'Content Uploads.',
      image: image6,
    },
    {
      text: 'Game Creation.',
      image: image7,
    },
    {
      text: 'Creating a Drag and Drop game.',
      image: image8,
    },
    {
      text: 'Configure the game settings.',
      image: image9,
    },
    {
      text: 'Game created.',
      image: image10,
    },
    {
      text: 'Creating a Matching game.',
      image: image11,
    },
    {
      text: 'Configure the game settings.',
      image: image12,
    },
    {
      text: 'Configure the matching pairs.',
      image: image13,
    },
    {
      text: 'Game created.',
      image: image14,
    },
    {
      text: 'Creating a Multiple Choice game.',
      image: image15,
    },
    {
      text: 'Configure the game settings.',
      image: image16,
    },
    {
      text: 'Game Created.',
      image: image17,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6 hover-bounce flex items-center bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        {/* Page Title */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800">Instructions</h1>
          <p className="text-gray-600 mt-2">
            Follow these steps to use the Interactive Supplementary Materials
            system
          </p>
        </div>

        {/* Instructions List */}
        <div className="space-y-12">
          {instructionSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Instruction Text */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <p className="ml-4 text-lg text-gray-800 pt-1.5">
                    {step.text}
                  </p>
                </div>
              </div>

              {/* Instruction Image */}
              <div className="p-4">
                <img
                  src={step.image}
                  alt={`Instruction step ${index + 1}`}
                  className="w-full rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tips Section */}
        <div className="bg-yellow-50 rounded-xl p-6 shadow-md mt-10 border-l-4 border-yellow-400">
          <h2 className="text-xl font-bold text-yellow-800 mb-3">
            Additional Tips
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              Make sure to review your content before presenting it to students
            </li>
            <li>
              Create game rounds with increasing difficulty to challenge
              students
            </li>
            <li>
              Use a combination of text, images, and videos for better
              engagement
            </li>
            <li>
              Take advantage of the different game types to reinforce different
              skills
            </li>
            <li>
              Use clear and simple language appropriate for Grade 1 students
            </li>
          </ul>
        </div>

        {/* Footer help section */}
        <div className="text-center mt-12 mb-8">
          <p className="text-gray-600">
            Need more help? Contact the system administrator.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Instructions;
