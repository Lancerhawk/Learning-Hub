import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Trash2, Edit, ChevronRight, Globe, Lock, Copy as CopyIcon, Star } from 'lucide-react';
import { customListsAPI, progressAPI } from '../utils/api';
import TypingAnimation from './TypingAnimation';

export default function CustomListsPage() {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progressStats, setProgressStats] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            setLoading(true);
            const data = await customListsAPI.getAll();
            setLists(data);

            // Load progress stats for each list
            const stats = {};
            for (const list of data) {
                try {
                    const listStats = await progressAPI.getStats(list.id);
                    stats[list.id] = listStats;
                } catch (err) {
                    console.error(`Failed to load stats for list ${list.id}:`, err);
                    stats[list.id] = { overall_progress: 0 };
                }
            }
            setProgressStats(stats);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateList = () => {
        navigate('/custom-lists/new');
    };

    const handleViewList = (listId) => {
        navigate(`/custom-lists/${listId}`);
    };

    const handleEditList = (listId, e) => {
        e.stopPropagation();
        navigate(`/custom-lists/${listId}/edit`);
    };

    const handleDeleteList = async (listId) => {
        try {
            await customListsAPI.delete(listId);
            setShowDeleteModal(null);
            loadLists();
        } catch (err) {
            alert('Failed to delete list: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="text-green-500 font-mono text-xl">Loading custom lists...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Hero */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl shadow-green-500/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                            <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold text-green-500 font-mono">
                                    <TypingAnimation text="Custom Lists" speed={90} />
                                </h1>
                                <p className="text-green-400 font-mono text-xs md:text-sm mt-1">
                                    $ create_your_own_learning_path
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateList}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-slate-900 rounded font-mono text-sm font-bold hover:bg-green-400 transition-all w-full md:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            CREATE NEW LIST
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-6xl mx-auto mb-4">
                    <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
                        <p className="text-red-500 font-mono text-sm">Error: {error}</p>
                    </div>
                </div>
            )}

            {/* Lists Grid */}
            <div className="max-w-6xl mx-auto">
                {lists.length === 0 ? (
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-12 text-center">
                        <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-500 font-mono mb-2">
                            No Custom Lists Yet
                        </h3>
                        <p className="text-slate-600 font-mono text-sm mb-6">
                            Create your first custom learning list to get started
                        </p>
                        <button
                            onClick={handleCreateList}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-slate-900 rounded font-mono text-sm font-bold hover:bg-green-400 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            CREATE YOUR FIRST LIST
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lists.map((list) => {
                            const progress = progressStats[list.id]?.overall_progress || 0;
                            return (
                                <div
                                    key={list.id}
                                    onClick={() => handleViewList(list.id)}
                                    className="bg-slate-900 border-2 border-slate-700 rounded-lg p-6 hover:border-green-500 transition-all cursor-pointer group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{list.icon}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-green-400 font-mono group-hover:text-green-300">
                                                    {list.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => handleEditList(list.id, e)}
                                                className="p-1.5 bg-slate-800 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-slate-900 transition-all"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowDeleteModal(list);
                                                }}
                                                className="p-1.5 bg-slate-800 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {list.description && (
                                        <p className="text-green-600 font-mono text-xs mb-4 line-clamp-2">
                                            {list.description}
                                        </p>
                                    )}

                                    {/* Progress */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-mono text-green-600">Progress</span>
                                            <span className="text-xs font-mono text-green-500 font-bold">
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-green-500 h-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                        <span className="text-xs font-mono text-slate-600">
                                            {new Date(list.created_at).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-1 text-green-500 group-hover:text-green-400">
                                            <span className="text-xs font-mono font-bold">VIEW</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-red-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-red-500/30">
                        <h3 className="text-xl font-bold text-red-500 font-mono mb-4">
                            [CONFIRM DELETE]
                        </h3>
                        <p className="text-green-400 font-mono text-sm mb-6">
                            Are you sure you want to delete "
                            <span className="text-green-300">{showDeleteModal.title}</span>"?
                            This action cannot be undone.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleDeleteList(showDeleteModal.id)}
                                className="w-full bg-red-500 text-white px-4 py-3 rounded font-mono font-bold hover:bg-red-400 transition-all"
                            >
                                ✗ DELETE LIST
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="w-full bg-slate-800 border border-green-500 text-green-500 px-4 py-3 rounded font-mono font-bold hover:bg-slate-700 transition-all"
                            >
                                ✓ CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
