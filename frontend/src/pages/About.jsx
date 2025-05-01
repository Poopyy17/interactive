import React from 'react';
import Header from '../components/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-8 hover-bounce flex items-center bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        {/* Main Content Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
            About the Interactive Supplementary Materials
          </h1>

          <div className="relative mb-10">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-200 rounded-full opacity-60 float-animation"></div>
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-green-200 rounded-full opacity-60 bounce-animation"></div>

            <div className="bg-blue-100/50 p-6 rounded-lg shadow-inner border border-blue-200 relative">
              <p className="text-lg leading-relaxed mb-4">
                This system delivers{' '}
                <span className="font-bold text-purple-700">
                  interactive supplementary materials
                </span>
                . Experience the power of interactivity for Grade 1 students!
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Our system provides supplementary materials that actively engage
                students through
                <span className="font-bold text-green-600">
                  {' '}
                  fun mini-games
                </span>
                . Students actively participate, respond to challenges, and
                experience the joy of learning through interaction.
              </p>
              <p className="text-lg leading-relaxed">
                Students don't just learn; they actively participate,
                experiment, and discover key skills.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">
              The Developers
            </h2>

            <div className="bg-purple-100/50 p-6 rounded-lg shadow-inner border border-purple-200">
              <p className="text-lg leading-relaxed mb-4">
                This interactive supplementary material for Grade 1 students
                aims to
                <span className="font-bold text-blue-700">
                  {' '}
                  empower teachers
                </span>{' '}
                by promoting more dynamic and engaging interactions with their
                students.
              </p>
              <p className="text-lg leading-relaxed">
                The developers believe this enhanced connection is vital for
                students' success. The resource is designed to provide teachers
                with increased opportunities for student connection.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Profiles Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-8 text-green-700">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Developer 1 */}
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-6 shadow-md hover-bounce">
              <div className="h-24 w-24 rounded-full bg-blue-200 mx-auto mb-4 flex items-center justify-center text-blue-600 text-2xl font-bold">
                KB
              </div>
              <h3 className="text-center font-bold text-blue-800">
                Berja, Kristian Oliver D.
              </h3>
              <p className="text-center text-blue-600 text-sm mt-2">
                Developer
              </p>
            </div>

            {/* Developer 2 */}
            <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl p-6 shadow-md hover-bounce">
              <div className="h-24 w-24 rounded-full bg-green-200 mx-auto mb-4 flex items-center justify-center text-green-600 text-2xl font-bold">
                JC
              </div>
              <h3 className="text-center font-bold text-green-800">
                Cargamento, Janz
              </h3>
              <p className="text-center text-green-600 text-sm mt-2">
                Developer
              </p>
            </div>

            {/* Developer 3 */}
            <div className="bg-gradient-to-b from-purple-50 to-purple-100 rounded-xl p-6 shadow-md hover-bounce">
              <div className="h-24 w-24 rounded-full bg-purple-200 mx-auto mb-4 flex items-center justify-center text-purple-600 text-2xl font-bold">
                JF
              </div>
              <h3 className="text-center font-bold text-purple-800">
                Fabricante, John Dexter
              </h3>
              <p className="text-center text-purple-600 text-sm mt-2">
                Developer
              </p>
            </div>

            {/* Developer 4 */}
            <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-md hover-bounce">
              <div className="h-24 w-24 rounded-full bg-yellow-200 mx-auto mb-4 flex items-center justify-center text-yellow-600 text-2xl font-bold">
                SL
              </div>
              <h3 className="text-center font-bold text-yellow-800">
                Lendio, Sherynel
              </h3>
              <p className="text-center text-yellow-600 text-sm mt-2">
                Developer
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
