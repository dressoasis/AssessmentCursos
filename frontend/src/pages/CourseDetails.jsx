import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLesson, setNewLesson] = useState({ title: '', order: 1 });
    const [editingLesson, setEditingLesson] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [courseRes, lessonsRes] = await Promise.all([
                api.get(`/courses/${id}/summary`),
                api.get(`/courses/${id}/lessons`)
            ]);
            setCourse(courseRes.data);
            setLessons(lessonsRes.data);
            setNewLesson(prev => ({ ...prev, order: lessonsRes.data.length + 1 }));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/courses/${id}/lessons`, {
                title: newLesson.title,
                order: parseInt(newLesson.order)
            });
            setNewLesson({ title: '', order: lessons.length + 2 });
            fetchData();
        } catch (error) {
            alert('Error creating lesson');
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/courses/${id}/lessons/${lessonId}`);
            fetchData();
        } catch (error) {
            alert('Error deleting lesson');
        }
    };

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson);
        setEditTitle(lesson.title);
    };

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/courses/${id}/lessons/${editingLesson.id}`, {
                title: editTitle,
                order: editingLesson.order
            });
            setEditingLesson(null);
            fetchData();
        } catch (error) {
            alert('Error updating lesson');
        }
    };

    const handleMove = async (lesson, direction) => {
        const currentIndex = lessons.findIndex(l => l.id === lesson.id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= lessons.length) return;

        const targetLesson = lessons[targetIndex];

        try {
            // Swap orders
            // 1. Update current lesson to target order
            await api.patch(`/courses/${id}/lessons/${lesson.id}/reorder`, {
                newOrder: targetLesson.order
            });

            // 2. Update target lesson to current order
            await api.patch(`/courses/${id}/lessons/${targetLesson.id}/reorder`, {
                newOrder: lesson.order
            });

            fetchData();
        } catch (error) {
            alert('Error reordering lessons');
            fetchData();
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <div className="course-details-container">
            <Link to="/" className="back-link">← Back to Courses</Link>

            <header>
                <h1>{course.title}</h1>
                <span className={`status-badge ${course.status === 1 ? 'published' : 'draft'}`}>
                    {course.status === 0 ? 'Draft' : 'Published'}
                </span>
            </header>

            <div className="lessons-section">
                <h2>Lessons</h2>

                <form onSubmit={handleCreateLesson} className="create-lesson-form">
                    <input
                        type="text"
                        placeholder="Lesson Title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Order"
                        value={newLesson.order}
                        onChange={(e) => setNewLesson({ ...newLesson, order: e.target.value })}
                        required
                        min="1"
                    />
                    <button type="submit">Add Lesson</button>
                </form>

                <ul className="lesson-list">
                    {lessons.map((lesson, index) => (
                        <li key={lesson.id} className={editingLesson?.id === lesson.id ? 'editing' : ''}>
                            {editingLesson?.id === lesson.id ? (
                                <form onSubmit={handleUpdateLesson} className="edit-lesson-form">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="save-btn">Save</button>
                                    <button type="button" onClick={() => setEditingLesson(null)} className="cancel-btn">Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <div className="lesson-info">
                                        <span className="order">#{lesson.order}</span>
                                        <span className="title">{lesson.title}</span>
                                    </div>
                                    <div className="lesson-actions">
                                        <button
                                            onClick={() => handleMove(lesson, 'up')}
                                            disabled={index === 0}
                                            className="move-btn"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => handleMove(lesson, 'down')}
                                            disabled={index === lessons.length - 1}
                                            className="move-btn"
                                        >
                                            ↓
                                        </button>
                                        <button onClick={() => handleEditLesson(lesson)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDeleteLesson(lesson.id)} className="delete-btn">Delete</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseDetails;
