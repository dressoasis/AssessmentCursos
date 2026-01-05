import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const { logout } = useAuth();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses', {
                params: {
                    search,
                    status: status === '' ? null : status,
                    page,
                    pageSize: 5
                }
            });
            setCourses(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, status]); // Search is handled manually or debounced

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCourses();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse.id}/update`, {
                    title: newCourseTitle,
                    status: editingCourse.status // Preserve existing status
                });
                setEditingCourse(null);
            } else {
                await api.post('/courses/create', { title: newCourseTitle });
            }
            setNewCourseTitle('');
            fetchCourses();
        } catch (error) {
            alert(editingCourse ? 'Error updating course' : 'Error creating course');
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setNewCourseTitle(course.title);
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setNewCourseTitle('');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.delete(`/courses/${id}/delete`);
            fetchCourses();
        } catch (error) {
            alert('Error deleting course');
        }
    };

    const handlePublish = async (id) => {
        try {
            await api.patch(`/courses/${id}/publish`);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Error publishing course');
        }
    };

    const handleUnpublish = async (id) => {
        try {
            await api.patch(`/courses/${id}/unpublish`);
            fetchCourses();
        } catch (error) {
            alert('Error unpublishing course');
        }
    };

    return (
        <div className="courses-container">
            <header>
                <h1>Courses</h1>
                <button onClick={logout}>Logout</button>
            </header>

            <div className="controls">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="0">Draft</option>
                        <option value="1">Published</option>
                    </select>
                    <button type="submit">Search</button>
                </form>

                <form onSubmit={handleSubmit} className="create-form">
                    <input
                        type="text"
                        placeholder={editingCourse ? "Edit Course Title" : "New Course Title"}
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        required
                    />
                    <button type="submit">{editingCourse ? 'Update Course' : 'Create Course'}</button>
                    {editingCourse && (
                        <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                    )}
                </form>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="course-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Lessons</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                                    </td>
                                    <td>{course.status === 0 ? 'Draft' : 'Published'}</td>
                                    <td>{course.lessonsCount}</td>
                                    <td>
                                        {course.status === 0 ? (
                                            <button onClick={() => handlePublish(course.id)} className="action-btn publish">Publish</button>
                                        ) : (
                                            <button onClick={() => handleUnpublish(course.id)} className="action-btn unpublish">Unpublish</button>
                                        )}
                                        <button onClick={() => handleEdit(course)} className="action-btn edit">Edit</button>
                                        <button onClick={() => handleDelete(course.id)} className="action-btn delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Courses;
