import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, User, Calendar } from 'lucide-react';

export default function LineageModal({ lineage, onClose }) {
    if (!lineage || lineage.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-6 max-w-2xl w-full shadow-2xl shadow-green-500/30 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-green-500 font-mono">
                        [VERSION HISTORY]
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-green-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {lineage.map((version, index) => {
                        const isOriginal = index === 0;
                        const isCurrent = index === lineage.length - 1;

                        return (
                            <div key={version.id}>
                                <div className={`p-4 rounded-lg border-2 ${isCurrent
                                        ? 'bg-green-500/10 border-green-500'
                                        : isOriginal
                                            ? 'bg-blue-500/10 border-blue-500'
                                            : 'bg-slate-800 border-slate-700'
                                    }`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {isOriginal && (
                                                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-mono font-bold rounded">
                                                        ORIGINAL
                                                    </span>
                                                )}
                                                {isCurrent && (
                                                    <span className="px-2 py-1 bg-green-500 text-slate-900 text-xs font-mono font-bold rounded">
                                                        CURRENT
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500 font-mono">
                                                    v{index + 1}
                                                </span>
                                            </div>

                                            <h4 className="text-green-400 font-mono font-bold mb-1">
                                                {version.title}
                                            </h4>

                                            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{version.username}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(version.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {version.is_public && (
                                            <Link
                                                to={`/explore/${version.id}`}
                                                onClick={onClose}
                                                className="px-3 py-2 bg-slate-800 border border-green-700 text-green-400 rounded font-mono text-xs hover:bg-slate-700 transition-all whitespace-nowrap"
                                            >
                                                View
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {index < lineage.length - 1 && (
                                    <div className="flex justify-center py-2">
                                        <ArrowRight className="w-5 h-5 text-green-500 rotate-90" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 font-mono text-center">
                        This list has been copied and republished {lineage.length - 1} time{lineage.length - 1 !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        </div>
    );
}
