import React, { useState, useEffect } from 'react';
import { Book, Plus, Edit2, Trash2, Loader2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import elearningService from '../../api/elearningService';

export default function ElearningCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', is_published: false });

    const loadCourses = async () => {
        try {
            const data = await elearningService.getCourses();
            setCourses(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCourses(); }, []);

    const openModal = (course = null) => {
        setEditingCourse(course);
        setForm(course ? { title: course.title, description: course.description, is_published: course.is_published } : { title: '', description: '', is_published: false });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCourse) {
                await elearningService.updateCourse(editingCourse.id, form);
                toast.success('Course updated');
            } else {
                await elearningService.createCourse(form);
                toast.success('Course created');
            }
            setIsModalOpen(false);
            loadCourses();
        } catch (err) {
            toast.error("Failed to save course");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await elearningService.deleteCourse(id);
            toast.success("Course deleted");
            loadCourses();
        } catch (err) {
            toast.error("Failed to delete course");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-sky-500" size={40} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Book className="text-sky-400" size={28} /> Courses
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage eLearning courses</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95">
                    <Plus size={18} /> Create New
                </button>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500 bg-slate-900/50">
                    <Book size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Courses Found</p>
                    <p className="text-sm mt-1">Click "Create New" to add your first course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/50 transition-colors group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(course)} className="p-2 bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(course.id)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-white pr-20">{course.title}</h3>
                            <p className="text-sm text-slate-400 mt-2 line-clamp-2">{course.description || 'No description provided.'}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${course.is_published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                    {course.is_published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-6 font-['Oswald'] tracking-wider uppercase">
                            {editingCourse ? 'Edit Course' : 'New Course'}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Course Title</label>
                                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors" placeholder="e.g., Introduction to Python" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors resize-none" placeholder="Course details..." />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500" />
                                <label htmlFor="is_published" className="text-sm font-medium text-slate-300">Publish immediately</label>
                            </div>
                            <div className="flex justify-end pt-4 gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {saving ? 'Saving...' : 'Save Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
