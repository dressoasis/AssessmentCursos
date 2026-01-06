import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [activeView, setActiveView] = useState('courses'); // 'dashboard', 'courses', 'lessons'

    // Courses State
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]); // Lessons for selected course

    // Global Lessons State
    const [globalLessons, setGlobalLessons] = useState([]);
    const [loadingLessons, setLoadingLessons] = useState(false);

    // Dashboard Metrics State
    const [metrics, setMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);

    // Modals State
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [editCourseTitle, setEditCourseTitle] = useState('');
    const [editCourseStatus, setEditCourseStatus] = useState('');
    const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [editingLesson, setEditingLesson] = useState(null);
    const [editLessonTitle, setEditLessonTitle] = useState('');

    // Fetch Courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses/search', {
                params: {
                    q: search,
                    status: status === '' ? null : status,
                    page,
                    pageSize: 50
                }
            });
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Global Lessons
    const fetchGlobalLessons = async () => {
        setLoadingLessons(true);
        try {
            const response = await api.get('/lessons');
            setGlobalLessons(response.data || []);
        } catch (error) {
            console.error('Error fetching global lessons:', error);
            setGlobalLessons([]);
        } finally {
            setLoadingLessons(false);
        }
    };

    // Fetch Dashboard Metrics
    const fetchDashboardMetrics = async () => {
        setLoadingMetrics(true);
        try {
            const response = await api.get('/dashboard/metrics');
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            setMetrics(null);
        } finally {
            setLoadingMetrics(false);
        }
    };

    useEffect(() => {
        if (activeView === 'courses') {
            fetchCourses();
        } else if (activeView === 'lessons') {
            fetchGlobalLessons();
        } else if (activeView === 'dashboard') {
            fetchDashboardMetrics();
        }
    }, [activeView, search, status, page]);

    // Fetch Lessons when a course is selected (in Courses view)
    useEffect(() => {
        if (selectedCourse) {
            fetchLessons(selectedCourse.id);
        } else {
            setLessons([]);
        }
    }, [selectedCourse]);

    const fetchLessons = async (courseId) => {
        try {
            const response = await api.get(`/courses/${courseId}/lessons`);
            setLessons(response.data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    // Course Actions
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses/create', { title: newCourseTitle });
            setNewCourseTitle('');
            setShowCreateCourseModal(false);
            fetchCourses();
        } catch (error) {
            alert('Error creating course');
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/courses/${editingCourse.id}/update`, {
                title: editCourseTitle,
                status: editCourseStatus
            });
            setEditingCourse(null);
            setEditCourseTitle('');
            setEditCourseStatus('');
            fetchCourses();
            if (selectedCourse?.id === editingCourse.id) {
                setSelectedCourse(prev => ({ ...prev, title: editCourseTitle, status: editCourseStatus }));
            }
        } catch (error) {
            alert('Error updating course: ' + (error.response?.data || error.message));
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.delete(`/courses/${id}/delete`);
            if (selectedCourse?.id === id) setSelectedCourse(null);
            fetchCourses();
        } catch (error) {
            alert('Error deleting course');
        }
    };

    const handlePublishCourse = async (id) => {
        try {
            await api.patch(`/courses/${id}/publish`);
            fetchCourses();
            if (selectedCourse?.id === id) setSelectedCourse(prev => ({ ...prev, status: 'Published' }));
        } catch (error) {
            alert('Error publishing course');
        }
    };

    const handleUnpublishCourse = async (id) => {
        try {
            await api.patch(`/courses/${id}/unpublish`);
            fetchCourses();
            if (selectedCourse?.id === id) setSelectedCourse(prev => ({ ...prev, status: 'Draft' }));
        } catch (error) {
            alert('Error unpublishing course');
        }
    };

    // Lesson Actions
    const handleCreateLesson = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;
        try {
            await api.post(`/courses/${selectedCourse.id}/lessons`, {
                title: newLessonTitle,
                order: lessons.length + 1
            });
            setNewLessonTitle('');
            setShowCreateLessonModal(false);
            fetchLessons(selectedCourse.id);
        } catch (error) {
            alert('Error creating lesson');
        }
    };

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        if (!selectedCourse || !editingLesson) return;
        try {
            await api.put(`/courses/${selectedCourse.id}/lessons/${editingLesson.id}`, {
                title: editLessonTitle,
                order: editingLesson.order
            });
            setEditingLesson(null);
            setEditLessonTitle('');
            fetchLessons(selectedCourse.id);
        } catch (error) {
            alert('Error updating lesson');
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/courses/${selectedCourse.id}/lessons/${lessonId}`);
            fetchLessons(selectedCourse.id);
        } catch (error) {
            alert('Error deleting lesson');
        }
    };

    const handleReorderLesson = async (lesson, direction) => {
        const currentIndex = lessons.findIndex(l => l.id === lesson.id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= lessons.length) return;

        const targetLesson = lessons[targetIndex];

        try {
            await api.patch(`/courses/${selectedCourse.id}/lessons/${lesson.id}/reorder`, { newOrder: targetLesson.order });
            await api.patch(`/courses/${selectedCourse.id}/lessons/${targetLesson.id}/reorder`, { newOrder: lesson.order });
            fetchLessons(selectedCourse.id);
        } catch (error) {
            alert('Error reordering lessons');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-surface-dark px-6 py-3 h-16 shrink-0 z-20">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Course Admin</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-green-500"></span>
                        <span className="text-xs text-text-secondary font-medium">System Online</span>
                    </div>
                    <div className="h-8 w-px bg-border-dark"></div>
                    <button onClick={logout} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span>Logout</span>
                    </button>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-border-dark" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYZPSfBeCmOQWd3ux-Hbcvth3_XVroXbFy7YZM2qAafrSJ4iaTESgfI4oODphIpECfC9nA51Q63okIGVLZsK8GI_USNIDlZyHDJ98f286RdlD3hQL2BAyHowP0iyJKo97hNLnJC1KE0GiyOIFem9uve3hpDIVSkAfcm-shqk_av4erYEJNvuV7hay2DVoksVfJpi4heVMBVb_DAdlBC2J2qtB7bRnxoF4Op3E4lTG28SiS0fNpF67s5sh1Mgd8dJhwN77J-Go0_q_9")' }}></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar (Left) */}
                <aside className="w-80 flex flex-col border-r border-border-dark bg-background-dark/50 overflow-y-auto shrink-0 hidden lg:flex">
                    {/* Navigation Menu */}
                    <div className="p-5 border-b border-border-dark">
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveView('courses')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'courses' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">library_books</span>
                                Courses
                            </button>
                            <button
                                onClick={() => setActiveView('lessons')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'lessons' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">menu_book</span>
                                Lessons
                            </button>
                        </nav>
                    </div>

                    {/* Filters (Only for Courses view) */}
                    {activeView === 'courses' && (
                        <div className="p-5">
                            <h3 className="text-lg font-bold mb-1">Filters</h3>
                            <p className="text-text-secondary text-sm mb-6">Refine your course list view.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Search</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary">search</span>
                                        <input
                                            className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            placeholder="Search by title..."
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && fetchCourses()}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status</label>
                                    <select
                                        className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button (Only for Courses view) */}
                    {activeView === 'courses' && (
                        <div className="mt-auto p-5 border-t border-border-dark">
                            <button
                                onClick={() => setShowCreateCourseModal(true)}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create New Course
                            </button>
                        </div>
                    )}
                </aside>

                {/* Content Area */}
                <section className="flex-1 flex flex-col min-w-0 bg-background-dark relative overflow-hidden">

                    {/* DASHBOARD VIEW */}
                    {activeView === 'dashboard' && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
                                <p className="text-text-secondary">Overview of your courses and lessons</p>
                            </div>

                            {loadingMetrics ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : metrics ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Total Courses Card */}
                                    <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-3xl text-blue-400">school</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-text-secondary mb-1">Total Courses</p>
                                                <p className="text-3xl font-bold text-white">{metrics.totalCourses}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Lessons Card */}
                                    <div className="group bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-3xl text-purple-400">menu_book</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-text-secondary mb-1">Total Lessons</p>
                                                <p className="text-3xl font-bold text-white">{metrics.totalLessons}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Published Courses Card */}
                                    <div className="group bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-3xl text-green-400">check_circle</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-text-secondary mb-1">Published</p>
                                                <p className="text-3xl font-bold text-white">{metrics.publishedCourses}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Draft Courses Card */}
                                    <div className="group bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-3xl text-amber-400">draft</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-text-secondary mb-1">Draft Courses</p>
                                                <p className="text-3xl font-bold text-white">{metrics.draftCourses}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-text-secondary">
                                    <p>Failed to load metrics</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* COURSES VIEW */}
                    {activeView === 'courses' && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-4">
                            {courses.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => setSelectedCourse(course)}
                                    className={`group relative rounded-xl border ${selectedCourse?.id === course.id ? 'border-primary bg-surface-dark/80 ring-1 ring-primary/20' : 'border-border-dark bg-surface-dark hover:border-primary/50'} p-5 shadow-lg transition-all cursor-pointer`}
                                >
                                    {selectedCourse?.id === course.id && <div className="absolute -left-px top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${course.status === 'Published' ? 'bg-green-400/10 text-green-400 ring-green-400/20' : 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20'}`}>
                                                    {course.status}
                                                </span>
                                                <span className="text-xs text-text-secondary">ID: #{course.id.substring(0, 4)}</span>
                                            </div>
                                            <h3 className={`text-lg font-bold truncate ${selectedCourse?.id === course.id ? 'text-white' : 'text-white group-hover:text-primary transition-colors'}`}>{course.title}</h3>
                                            <p className="text-sm text-text-secondary truncate mt-1">{course.lessonsCount} Lessons</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingCourse(course);
                                                    setEditCourseTitle(course.title);
                                                    setEditCourseStatus(course.status);
                                                }}
                                                className="size-9 rounded-lg bg-surface-dark border border-border-dark hover:bg-primary hover:text-white hover:border-primary text-text-secondary flex items-center justify-center transition-all"
                                                title="Edit Course"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <div className="relative group/dropdown">
                                                <button className="size-9 rounded-lg bg-surface-dark border border-border-dark hover:border-gray-500 text-text-secondary flex items-center justify-center transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border-dark bg-[#1e2736] shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 p-1">
                                                    {course.status === 'Published' ? (
                                                        <button onClick={(e) => { e.stopPropagation(); handleUnpublishCourse(course.id); }} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white">
                                                            <span className="material-symbols-outlined text-[18px]">unpublished</span> Unpublish
                                                        </button>
                                                    ) : (
                                                        <button onClick={(e) => { e.stopPropagation(); handlePublishCourse(course.id); }} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white">
                                                            <span className="material-symbols-outlined text-[18px]">publish</span> Publish
                                                        </button>
                                                    )}
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* LESSONS VIEW */}
                    {activeView === 'lessons' && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
                            <div className="space-y-3">
                                {globalLessons.map(lesson => (
                                    <div key={lesson.id} className="group flex items-center gap-4 p-4 rounded-xl bg-surface-dark border border-border-dark hover:border-primary/50 transition-all">
                                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">play_circle</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-white truncate">{lesson.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-text-secondary bg-white/5 px-2 py-0.5 rounded">
                                                    {lesson.courseTitle}
                                                </span>
                                                <span className="text-xs text-text-secondary">•</span>
                                                <span className="text-xs text-text-secondary">Order: {lesson.order}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            {new Date(lesson.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {globalLessons.length === 0 && !loadingLessons && (
                                    <div className="text-center py-10 text-text-secondary">
                                        <p>No lessons found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Lessons Panel (Right) - Only visible in Courses view when a course is selected */}
                {activeView === 'courses' && selectedCourse && (
                    <aside className="w-[440px] border-l border-border-dark bg-[#141b26] flex flex-col shrink-0 shadow-2xl z-10 transition-transform duration-300 absolute lg:relative right-0 h-full lg:translate-x-0 translate-x-full lg:flex">
                        <div className="p-6 border-b border-border-dark bg-[#141b26]">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-primary uppercase tracking-wider">Managing Content</p>
                                <button onClick={() => setSelectedCourse(null)} className="lg:hidden text-text-secondary hover:text-white">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-4 line-clamp-1">{selectedCourse.title}</h2>
                            <button
                                onClick={() => setShowCreateLessonModal(true)}
                                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 border-dashed py-3 px-4 rounded-lg font-medium transition-all group"
                            >
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                                Create New Lesson
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <div className="flex flex-col gap-3">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="group flex items-center gap-3 p-3 rounded-lg bg-surface-dark border border-border-dark hover:border-primary/30 transition-all">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleReorderLesson(lesson, 'up')}
                                                disabled={index === 0}
                                                className="text-text-secondary hover:text-white disabled:opacity-30"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                                            </button>
                                            <button
                                                onClick={() => handleReorderLesson(lesson, 'down')}
                                                disabled={index === lessons.length - 1}
                                                className="text-text-secondary hover:text-white disabled:opacity-30"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                                            </button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate">{lesson.order}. {lesson.title}</h4>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingLesson(lesson); setEditLessonTitle(lesson.title); }}
                                                className="p-1.5 rounded hover:bg-white/10 text-text-secondary hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="p-1.5 rounded hover:bg-red-500/10 text-text-secondary hover:text-red-400"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}
            </main>

            {/* Create Course Modal */}
            {showCreateCourseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-surface-dark p-6 rounded-xl w-full max-w-md border border-border-dark">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Course</h3>
                        <form onSubmit={handleCreateCourse}>
                            <input
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white mb-4"
                                placeholder="Course Title"
                                value={newCourseTitle}
                                onChange={(e) => setNewCourseTitle(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateCourseModal(false)} className="text-text-secondary hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Course Modal */}
            {editingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-surface-dark p-6 rounded-xl w-full max-w-md border border-border-dark">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Course</h3>
                        <form onSubmit={handleUpdateCourse}>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title</label>
                                    <input
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white"
                                        placeholder="Course Title"
                                        value={editCourseTitle}
                                        onChange={(e) => setEditCourseTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Status</label>
                                    <select
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white appearance-none cursor-pointer"
                                        value={editCourseStatus}
                                        onChange={(e) => setEditCourseStatus(e.target.value)}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditingCourse(null)} className="text-text-secondary hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Lesson Modal */}
            {showCreateLessonModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-surface-dark p-6 rounded-xl w-full max-w-md border border-border-dark">
                        <h3 className="text-xl font-bold text-white mb-4">Add Lesson</h3>
                        <form onSubmit={handleCreateLesson}>
                            <input
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white mb-4"
                                placeholder="Lesson Title"
                                value={newLessonTitle}
                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateLessonModal(false)} className="text-text-secondary hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Lesson Modal */}
            {editingLesson && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-surface-dark p-6 rounded-xl w-full max-w-md border border-border-dark">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Lesson</h3>
                        <form onSubmit={handleUpdateLesson}>
                            <input
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white mb-4"
                                placeholder="Lesson Title"
                                value={editLessonTitle}
                                onChange={(e) => setEditLessonTitle(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditingLesson(null)} className="text-text-secondary hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #232f48; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #324467; }
            `}</style>
        </div>
    );
};

export default Dashboard;
