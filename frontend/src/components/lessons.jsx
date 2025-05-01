import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Plus,
  BookOpen,
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import QuarterBackground from './QuarterBackground';

const Lessons = () => {
  const navigate = useNavigate();
  const { quarterId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const nextLessonNumber = lessons.length + 1;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [editedLessonTitle, setEditedLessonTitle] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  // Array of vibrant card accent colors
  const cardColors = [
    'border-l-emerald-500', // green
    'border-l-sky-500', // blue
    'border-l-teal-500', // teal
    'border-l-amber-500', // amber
  ];

  useEffect(() => {
    fetchLessons();
  }, [quarterId]);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      // Updated API endpoint to match backend route
      const response = await axios.get(`/api/lessons/${quarterId}/lessons`);
      if (response.data.success) {
        setLessons(response.data.lessons);
      }
    } catch (error) {
      console.error('Error:', error);
      setLessons([]); // Ensure empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLesson = async () => {
    try {
      const response = await axios.post(`/api/lessons/${quarterId}/lessons`, {
        title: newLessonTitle,
      });

      if (response.data.success) {
        setIsDialogOpen(false);
        setNewLessonTitle('');
        fetchLessons();
      }
      toast.success('Lesson created successfully!');
    } catch (error) {
      setError('Failed to add lesson');
      console.error('Error:', error);
    }
  };

  const handleEditLesson = async () => {
    try {
      const response = await axios.put(`/api/lessons/${lessonToEdit.id}`, {
        title: editedLessonTitle,
      });

      if (response.data.success) {
        // Update the lessons list with the edited lesson
        const updatedLessons = lessons.map((lesson) =>
          lesson.id === lessonToEdit.id ? response.data.lesson : lesson
        );

        setLessons(updatedLessons);
        setIsEditDialogOpen(false);
        setLessonToEdit(null);
        toast.success('Lesson updated successfully!');
      }
    } catch (error) {
      setError('Failed to update lesson');
      console.error('Error:', error);
      toast.error('Failed to update lesson');
    }
  };

  const handleDeleteLesson = async () => {
    try {
      const response = await axios.delete(`/api/lessons/${lessonToDelete.id}`);

      if (response.data.success) {
        // Remove the deleted lesson from the list
        const updatedLessons = lessons.filter(
          (lesson) => lesson.id !== lessonToDelete.id
        );
        setLessons(updatedLessons);
        setIsDeleteDialogOpen(false);
        setLessonToDelete(null);
        toast.success('Lesson deleted successfully!');
      }
    } catch (error) {
      setError('Failed to delete lesson');
      console.error('Error:', error);
      toast.error('Failed to delete lesson');
    }
  };

  const openEditDialog = (lesson) => {
    setLessonToEdit(lesson);
    setEditedLessonTitle(lesson.title || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lesson) => {
    setLessonToDelete(lesson);
    setIsDeleteDialogOpen(true);
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/quarter/${quarterId}/lesson/${lessonId}`);
  };

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
              <Button
                onClick={() => navigate('/quarter')}
                variant="link"
                className="p-0 h-auto font-bold text-2xl hover:underline hover:text-inherit"
              >
                Quarter
              </Button>
              <ChevronRight className="mx-1 h-5 w-5 flex-shrink-0 text-gray-400" />
              <span className="text-gray-800">Lessons</span>
            </nav>

            {/* Button Group with Back and Add Lesson */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/quarter')}
                variant="outline"
                className="flex items-center bg-white border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-indigo-700 text-white hover:bg-indigo-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Lesson
              </Button>
            </div>
          </div>

          {/* Add Lesson Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Lesson Number</Label>
                  <Input
                    value={nextLessonNumber}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lesson Title</Label>
                  <Input
                    placeholder="Enter lesson title"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-700 text-white hover:bg-indigo-800"
                  onClick={handleAddLesson}
                  disabled={!newLessonTitle.trim()}
                >
                  Create Lesson
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {isLoading ? (
            <div className="text-center">Loading lessons...</div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Lessons Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first lesson
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-indigo-700 text-white hover:bg-indigo-800"
              >
                <Plus className="w-4 h-4" />
                Create First Lesson
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className={`hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 shadow rounded-lg overflow-hidden border-l-8 ${
                    cardColors[index % cardColors.length]
                  }`}
                >
                  <div className="flex items-center p-5">
                    <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      <BookOpenCheck className="h-6 w-6 text-gray-600" />
                    </div>
                    <div
                      className="flex-1"
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      <div className="text-medium uppercase font-semibold text-xl text-indigo-500 mb-1">
                        Lesson {lesson.lesson_number}
                      </div>
                      <h3 className="font-medium text-xl text-gray-800">
                        {lesson.title || 'No title set'}
                      </h3>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(lesson)}
                            className="text-indigo-600 hover:text-indigo-700 focus:text-indigo-700"
                          >
                            <Pencil className="mr-2 h-4 w-4 text-indigo-700" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(lesson)}
                            className="text-red-600 hover:text-red-700 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-700" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div
                    className="px-5 py-4 flex justify-end items-center border-t"
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <span className="text-sm font-medium text-blue-600 flex items-center">
                      View lesson
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Edit Lesson Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lesson Number</Label>
              <Input
                value={lessonToEdit?.lesson_number || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input
                placeholder="Enter lesson title"
                value={editedLessonTitle}
                onChange={(e) => setEditedLessonTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-700 text-white hover:bg-indigo-800"
              onClick={handleEditLesson}
              disabled={!editedLessonTitle.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Lesson{' '}
              {lessonToDelete?.lesson_number}:{' '}
              {lessonToDelete?.title || 'Untitled'}? This will permanently
              remove the lesson and all its content including presentations and
              games. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </QuarterBackground>
  );
};

export default Lessons;
