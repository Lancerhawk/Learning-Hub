import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * ConfirmResetModal
 *
 * Props:
 *   isOpen       - boolean, controls visibility
 *   onConfirm    - function called when user confirms reset
 *   onCancel     - function called when user cancels / closes
 *   title        - string shown in the modal header (e.g. "DSA Topics")
 */
export default function ConfirmResetModal({ isOpen, onConfirm, onCancel, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border-2 border-red-500 rounded-lg p-6 max-w-md w-full shadow-2xl shadow-red-500/20 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-400 font-mono">
                        [WARNING] RESET PROGRESS
                    </h3>
                </div>

                {/* Body */}
                <div className="mb-6 space-y-2 font-mono text-sm">
                    <p className="text-green-400">
                        You are about to reset all progress for:
                    </p>
                    <p className="text-white font-bold text-base border border-slate-700 bg-slate-800 px-3 py-2 rounded">
                        {title}
                    </p>
                    <p className="text-red-400 mt-2">
                        ⚠ This action is <span className="font-bold underline">irreversible</span>. All checked items will be permanently deleted.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={onConfirm}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded font-mono font-bold transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        YES, DELETE ALL PROGRESS
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-600 hover:border-green-500 text-green-400 hover:text-green-300 px-4 py-3 rounded font-mono font-bold transition-all"
                    >
                        <X className="w-4 h-4" />
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}
