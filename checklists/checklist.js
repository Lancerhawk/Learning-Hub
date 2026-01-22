import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, RefreshCw, Trophy, BookOpen, Calculator, ArrowRightLeft, Database, Box, Download, Printer } from 'lucide-react';

const checklistData = [
    {
        category: "Core Basics",
        icon: <BookOpen className="w-5 h-5" />,
        items: [
            "C++ Basic Syntax",
            "C++ Comments",
            "C++ Hello World",
            "C++ Omitting Namespace",
            "C++ Tokens",
            "C++ Keywords",
            "C++ Identifiers",
            "C++ Data Types",
            "C++ Numeric Data Types",
            "C++ Character Data Type",
            "C++ Boolean Data Type",
            "C++ Variable Types",
            "C++ Variable Scope",
            "C++ Multiple Variables"
        ]
    },
    {
        category: "Input / Output",
        icon: <ArrowRightLeft className="w-5 h-5" />,
        items: [
            "C++ Input Output Operations",
            "C++ Basic Input/Output",
            "C++ Cin",
            "C++ Cout"
        ]
    },
    {
        category: "Operators",
        icon: <Calculator className="w-5 h-5" />,
        items: [
            "C++ Operators",
            "C++ Arithmetic Operators",
            "C++ Relational Operators",
            "C++ Logical Operators",
            "C++ Assignment Operators",
            "C++ sizeof Operator",
            "C++ Conditional Operator",
            "C++ Operators Precedence"
        ]
    },
    {
        category: "Control Flow",
        icon: <RefreshCw className="w-5 h-5" />,
        items: [
            "C++ Control Statements",
            "C++ Decision Making",
            "C++ if Statement",
            "C++ if else Statement",
            "C++ switch Statement",
            "C++ Loop Types",
            "C++ while Loop",
            "C++ for Loop",
            "C++ do while Loop",
            "C++ Jump Statements",
            "C++ break Statement",
            "C++ continue Statement",
            "C++ Return Values"
        ]
    },
    {
        category: "Functions & Recursion",
        icon: <Box className="w-5 h-5" />,
        items: [
            "C++ Functions",
            "C++ Multiple Function Parameters",
            "C++ Recursive Function",
            "C++ Default Arguments"
        ]
    },
    {
        category: "Arrays & Strings",
        icon: <Database className="w-5 h-5" />,
        items: [
            "C++ Arrays",
            "C++ Multidimensional Arrays",
            "C++ Passing Arrays to Functions",
            "C++ Strings",
            "C++ Loop Through a String",
            "C++ String Length",
            "C++ String Concatenation",
            "C++ String Comparison"
        ]
    },
    {
        category: "Pointers & References",
        icon: <ArrowRightLeft className="w-5 h-5" />,
        items: [
            "C++ Pointers",
            "C++ Dereferencing",
            "C++ Modify Pointers",
            "C++ References"
        ]
    },
    {
        category: "Structs & Classes (MINIMAL)",
        icon: <Box className="w-5 h-5" />,
        items: [
            "C++ Structures",
            "C++ Class and Objects",
            "C++ Classes & Objects",
            "C++ Class Member Functions",
            "C++ Class Access Modifiers",
            "C++ Constructors",
            "C++ Default Constructors",
            "C++ Parameterized Constructors",
            "C++ this Pointer"
        ]
    },
    {
        category: "STL (VERY IMPORTANT)",
        icon: <Trophy className="w-5 h-5 text-yellow-600" />,
        items: [
            "C++ STL Tutorial",
            "C++ Standard Library"
        ]
    }
];

export default function App() {
    const [checkedItems, setCheckedItems] = useState({});
    const [expandedSections, setExpandedSections] = useState({});

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cppChecklistProgress');
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
        // Initialize all sections as expanded by default
        const initialExpanded = {};
        checklistData.forEach((section, index) => {
            initialExpanded[index] = true;
        });
        setExpandedSections(initialExpanded);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('cppChecklistProgress', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const toggleItem = (item) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const calculateSectionProgress = (items) => {
        const completed = items.filter(item => checkedItems[item]).length;
        return Math.round((completed / items.length) * 100);
    };

    const resetProgress = () => {
        if (window.confirm("Are you sure you want to reset all progress?")) {
            setCheckedItems({});
        }
    };

    const handleDownloadPDF = () => {
        // 1. Force expand all sections
        const allExpanded = {};
        checklistData.forEach((_, index) => {
            allExpanded[index] = true;
        });
        setExpandedSections(allExpanded);

        // 2. Wait for UI update then print
        setTimeout(() => {
            window.print();
        }, 300);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0">
            <style>{`
        @media print {
          @page { margin: 0.5in; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-break-inside { break-inside: avoid; }
        }
      `}</style>

            <div className="max-w-4xl mx-auto print:max-w-none print:w-full">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 print:border-none print:shadow-none print:p-0 print:mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">C++ Mastery Checklist</h1>
                            <p className="text-slate-500 print:text-slate-600">Track your journey from Syntax to STL</p>
                        </div>
                        <div className="flex items-center gap-3 no-print">
                            <button
                                onClick={resetProgress}
                                className="text-sm text-slate-400 hover:text-red-500 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                Save as PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-4 print:space-y-6">
                    {checklistData.map((section, idx) => {
                        const sectionProgress = calculateSectionProgress(section.items);
                        const isComplete = sectionProgress === 100;
                        const isExpanded = expandedSections[idx];

                        return (
                            <div key={idx} className={`bg-white rounded-xl shadow-sm border transition-all duration-200 print-break-inside print:border-slate-300 print:shadow-none ${isComplete ? 'border-green-200' : 'border-slate-200'}`}>
                                {/* Section Header */}
                                <div
                                    onClick={() => toggleSection(idx)}
                                    className="p-4 cursor-pointer hover:bg-slate-50 rounded-t-xl select-none print:p-2 print:pb-0"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg no-print ${isComplete ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {section.icon}
                                            </div>
                                            {/* Icon replacement for print */}
                                            <div className="hidden print:block font-bold text-xl text-slate-800">•</div>

                                            <div>
                                                <h3 className={`font-semibold text-lg ${isComplete ? 'text-green-800' : 'text-slate-800'}`}>
                                                    {section.category}
                                                </h3>
                                                <p className="text-xs text-slate-500 no-print">
                                                    {section.items.filter(i => checkedItems[i]).length}/{section.items.length} topics
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar - Hidden on Print */}
                                        <div className="flex items-center gap-4 no-print">
                                            <div className="hidden sm:block w-24">
                                                <div className="overflow-hidden h-1.5 text-xs flex rounded bg-slate-100">
                                                    <div
                                                        style={{ width: `${sectionProgress}%` }}
                                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    ></div>
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Section Items */}
                                {(isExpanded || window.matchMedia('print').matches) && (
                                    <div className="border-t border-slate-100 p-2 print:border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2 print:grid-cols-2 print:gap-x-8 print:gap-y-2">
                                            {section.items.map((item, itemIdx) => {
                                                const isChecked = !!checkedItems[item];
                                                return (
                                                    <div
                                                        key={itemIdx}
                                                        onClick={() => toggleItem(item)}
                                                        className={`
                              group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                              ${isChecked ? 'bg-slate-50/50' : 'hover:bg-slate-50'}
                              print:p-1 print:bg-transparent
                            `}
                                                    >
                                                        <div className={`
                              w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 flex-shrink-0
                              ${isChecked ? 'bg-blue-500 border-blue-500 print:bg-white print:border-slate-800' : 'border-slate-300 bg-white group-hover:border-blue-400 print:border-slate-400'}
                            `}>
                                                            {isChecked && <Check className="w-3.5 h-3.5 text-white print:text-black" strokeWidth={3} />}
                                                        </div>
                                                        <span className={`text-sm transition-colors duration-200 ${isChecked ? 'text-slate-400 line-through print:text-slate-800 print:no-underline' : 'text-slate-700'}`}>
                                                            {item}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center text-slate-400 text-sm no-print">
                    <p>Progress is automatically saved to your browser.</p>
                </div>

            </div>
        </div>
    );
}