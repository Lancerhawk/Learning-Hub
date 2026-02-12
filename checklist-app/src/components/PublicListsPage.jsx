import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Copy, Users, TrendingUp, Clock, X, CheckCircle, AlertCircle, History, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import LineageModal from './LineageModal';

export default function PublicListsPage() {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [copying, setCopying] = useState(null);
    const [modal, setModal] = useState(null); // { type: 'success' | 'error', message: '' }
    const [lineageModal, setLineageModal] = useState(null); // { listId, lineage }
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const listsPerPage = 9;

    const fetchPublicLists = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                sort: sortBy,
                limit: listsPerPage,
                offset: (currentPage - 1) * listsPerPage,
                ...(searchQuery && { search: searchQuery })
            };
            const data = await API.publicLists.getAll(params);
            setLists(data.lists || []);
            setTotalPages(Math.ceil((data.total || 0) / listsPerPage));
        } catch (error) {
            console.error('Failed to fetch public lists:', error);
        } finally {
            setLoading(false);
        }
    }, [sortBy, searchQuery, currentPage]);

    useEffect(() => {
        fetchPublicLists();
    }, [fetchPublicLists]);

    // Reset to page 1 when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [sortBy, searchQuery]);

    const handleCopy = async (listId) => {
        try {
            setCopying(listId);
            await API.publicLists.copy(listId);
            setModal({
                type: 'success',
                title: 'Success!',
                message: 'List copied successfully! Check "My Lists" to see it.'
            });
            // Refresh the list to update copy count
            fetchPublicLists();
        } catch (error) {
            setModal({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to copy list'
            });
        } finally {
            setCopying(null);
        }
    };

    const handleViewLineage = async (listId) => {
        try {
            const data = await API.publicLists.getLineage(listId);
            setLineageModal(data.lineage);
        } catch { // Removed unused error
            setModal({
                type: 'error',
                title: 'Error',
                message: 'Failed to load version history'
            });
        }
    };

    const getRatingStars = (avgRating) => {
        const rating = avgRating || 0;
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-slate-600'
                            }`}
                    />
                ))}
                <span className="text-xs text-slate-400 ml-1">
                    ({avgRating ? avgRating.toFixed(1) : '0.0'})
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-mono text-green-500 mb-2 terminal-glow">
                        &gt; Explore Public Lists
                    </h1>
                    <p className="text-slate-400 font-mono text-sm">
                        Discover and copy learning lists created by the community
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        <input
                            type="text"
                            placeholder="Search lists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-green-700 rounded text-green-400 font-mono placeholder-slate-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full px-4 py-3 pr-10 bg-slate-900 border-2 border-green-700 rounded text-green-400 font-mono focus:outline-none focus:border-green-500 cursor-pointer"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="rating">Highest Rated</option>
                            <option value="popular">Most Copied</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-green-500 pointer-events-none" />
                    </div>
                </div>

                {/* Lists Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-green-500 font-mono">Loading lists...</p>
                    </div>
                ) : lists.length === 0 ? (
                    <div className="text-center py-12 border-2 border-green-700 rounded-lg bg-slate-900/50">
                        <p className="text-slate-400 font-mono">No public lists found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lists.map((list) => (
                                <div
                                    key={list.id}
                                    className="border-2 border-green-700 rounded-lg bg-slate-900 p-4 hover:border-green-500 transition-all min-h-[280px] flex flex-col"
                                >
                                    {/* Icon and Title */}
                                    <div className="flex-grow">
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className="text-3xl">{list.icon || '📚'}</span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-green-400 font-mono truncate">
                                                    {list.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-mono">
                                                    {list.original_creator_username ? (
                                                        <span className="flex items-center gap-2 flex-wrap">
                                                            <span>
                                                                Published by <span className="text-green-500">{list.owner_username}</span>
                                                                {' • '}
                                                                Originally by <span className="text-blue-400">{list.original_creator_username}</span>
                                                            </span>
                                                            <button
                                                                onClick={() => handleViewLineage(list.id)}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-blue-500 text-blue-400 rounded font-mono text-xs hover:bg-slate-700 transition-all"
                                                            >
                                                                <History className="w-3 h-3" />
                                                                History
                                                            </button>
                                                        </span>
                                                    ) : (
                                                        <>by {list.owner_username}</>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {list.description && (
                                            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                                                {list.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{list.topic_count || 0} topics</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Copy className="w-4 h-4" />
                                                <span>{list.copy_count || 0} copies</span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2">
                                                {getRatingStars(parseFloat(list.averageRating) || 0)}
                                                <span className="text-xs text-slate-500 font-mono">
                                                    ({list.rating_count || 0} {(list.rating_count || 0) === 1 ? 'rating' : 'ratings'})
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-auto">
                                        <Link
                                            to={`/explore/${list.id}`}
                                            className="flex-1 px-3 py-2 bg-slate-800 border border-green-700 text-green-400 rounded font-mono text-xs text-center hover:bg-slate-700 transition-all"
                                        >
                                            View Details
                                        </Link>
                                        {user && list.user_id === user.id ? (
                                            <div className="px-3 py-2 bg-blue-500/10 border border-blue-500 text-blue-400 rounded font-mono text-xs font-bold flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Your List
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleCopy(list.id)}
                                                disabled={copying === list.id}
                                                className="px-3 py-2 bg-green-500 text-slate-900 rounded font-mono text-xs font-bold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {copying === list.id ? (
                                                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-slate-800 border border-green-700 text-green-400 rounded font-mono text-sm hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 font-mono text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-slate-800 border border-green-700 text-green-400 rounded font-mono text-sm hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-green-500/30">
                        <div className="flex items-start gap-3 mb-4">
                            {modal.type === 'success' ? (
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold font-mono mb-2 ${modal.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {modal.title}
                                </h3>
                                <p className="text-green-400 font-mono text-sm">
                                    {modal.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setModal(null)}
                                className="text-slate-500 hover:text-green-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={() => setModal(null)}
                            className="w-full bg-green-500 text-slate-900 px-4 py-2 rounded font-mono font-bold hover:bg-green-400 transition-all"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Lineage Modal */}
            {lineageModal && (
                <LineageModal
                    lineage={lineageModal}
                    onClose={() => setLineageModal(null)}
                />
            )}
        </div>
    );
}