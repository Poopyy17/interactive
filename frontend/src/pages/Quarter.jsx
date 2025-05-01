import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import Header from '@/components/header';
import QuarterBackground from '../components/QuarterBackground';
import Art from '../assets/Art.png';
import Blocks from '../assets/Blocks.png';
import Books from '../assets/Books.png';
import Chalkboard from '../assets/Chalkboard.png';
import Children from '../assets/Children.png';
import Clock from '../assets/Clock.png';
import Clouds from '../assets/Clouds.png';
import Doll from '../assets/Doll.png';
import Grass from '../assets/Grass.png';
import Grassrock from '../assets/Grassrock.png';
import Letters from '../assets/Letters.png';
import Plane from '../assets/Plane.png';
import Train from '../assets/Train.png';
import Tree from '../assets/Tree.png';

const Quarter = () => {
  const [quarters, setQuarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Array of vibrant card header colors
  const cardColors = [
    'bg-emerald-600', // green
    'bg-sky-600', // blue
    'bg-teal-600', // teal
    'bg-violet-600', // violet
  ];

  // Background image combinations for cards
  const cardBackgrounds = [
    {
      main: Clouds,
      secondary: Grass,
      position: 'bg-bottom',
      style: { opacity: 0.15 },
    },
    {
      main: Tree,
      secondary: Grassrock,
      position: 'bg-bottom',
      style: { opacity: 0.18 },
    },
    {
      main: Chalkboard,
      secondary: Books,
      position: 'bg-center',
      style: { opacity: 0.12 },
    },
    {
      main: Letters,
      secondary: Blocks,
      position: 'bg-center',
      style: { opacity: 0.15 },
    },
  ];

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch quarters data
    const fetchQuarters = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/quarters');

        if (response.data.success) {
          setQuarters(response.data.quarters);
        } else {
          setError('Failed to load quarters');
        }
      } catch (err) {
        setError('Failed to fetch quarters');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuarters();
  }, [navigate]);

  // Function to get quarter abbreviation (Q1, Q2, etc.)
  const getQuarterAbbreviation = (quarterName) => {
    // Extract number from quarter name or use index + 1
    const match = quarterName.match(/\d+/);
    const number = match ? match[0] : '';
    return `Q${number}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <QuarterBackground>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-xl p-4 flex justify-between items-center mb-8">
            <nav
              className="flex items-center text-2xl font-bold"
              aria-label="Breadcrumb"
            >
              <span className="text-gray-800">Quarter</span>
            </nav>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quarters.map((quarter, index) => {
                const bgIndex = index % cardBackgrounds.length;
                const bgSettings = cardBackgrounds[bgIndex];

                return (
                  <Card
                    key={quarter.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 rounded-lg p-0 flex flex-col"
                    style={{ height: '320px' }}
                    onClick={() => navigate(`/quarter/${quarter.id}`)}
                  >
                    <div
                      className={`${
                        cardColors[index % cardColors.length]
                      } w-full relative rounded-t-lg`}
                      style={{ height: '40%' }}
                    >
                      {/* Quarter avatar - improved design */}
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white overflow-hidden"
                        style={{ right: '16px' }}
                      >
                        <span
                          className={`font-bold text-md ${cardColors[
                            index % cardColors.length
                          ].replace('bg-', 'text-')}`}
                        >
                          {getQuarterAbbreviation(quarter.name)}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-white font-bold text-3xl">
                          {quarter.name}
                        </h3>
                      </div>
                    </div>

                    <CardContent className="bg-white p-5 flex-1 flex flex-col justify-between relative">
                      {/* Background Images */}
                      <div
                        className={`absolute inset-0 pointer-events-none ${bgSettings.position}`}
                        style={{
                          backgroundImage: `url(${bgSettings.main})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          ...bgSettings.style,
                        }}
                      ></div>

                      {bgSettings.secondary && (
                        <div
                          className="absolute inset-0 pointer-events-none bg-right-bottom"
                          style={{
                            backgroundImage: `url(${bgSettings.secondary})`,
                            backgroundSize: '30%',
                            backgroundRepeat: 'no-repeat',
                            ...bgSettings.style,
                          }}
                        ></div>
                      )}

                      {/* Content */}
                      <p className="text-gray-700 text-xl line-clamp-3 relative z-10">
                        {quarter.description}
                      </p>

                      <div className="border-t border-gray-200 -mx-5 px-5 pt-3 mt-4 relative z-10">
                        <div className="flex justify-end">
                          <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from triggering
                              navigate(`/quarter/${quarter.id}`);
                            }}
                          >
                            View
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </QuarterBackground>
  );
};

export default Quarter;
