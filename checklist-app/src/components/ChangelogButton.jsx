import React, { useState } from 'react';
import { History } from 'lucide-react';
import ChangelogModal from './ChangelogModal';

export default function ChangelogButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-400 text-slate-900 p-4 rounded-full shadow-lg shadow-green-500/50 transition-all hover:scale-110 group"
                title="View Changelog"
            >
                <History className="w-6 h-6" />

                {/* Pulse Animation */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>

                {/* Tooltip */}
                <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 border-2 border-green-500 text-green-400 text-xs font-mono rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Version History
                </span>
            </button>

            {/* Modal */}
            <ChangelogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
