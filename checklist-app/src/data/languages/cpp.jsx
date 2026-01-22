import React from 'react';
import { BookOpen, ArrowRightLeft, Calculator, RefreshCw, Box, Database, Trophy, Code, Zap, Settings } from 'lucide-react';

export const cppData = {
    name: 'C++',
    icon: '⚡',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: [
                'C++ Basic Syntax',
                'C++ Comments',
                'C++ Hello World',
                'C++ Omitting Namespace',
                'C++ Tokens',
                'C++ Keywords',
                'C++ Identifiers',
                'C++ Data Types',
                'C++ Numeric Data Types',
                'C++ Character Data Type',
                'C++ Boolean Data Type',
                'C++ Variable Types',
                'C++ Variable Scope',
                'C++ Multiple Variables'
            ]
        },
        {
            category: 'Input / Output',
            icon: <ArrowRightLeft className="w-5 h-5" />,
            items: [
                'C++ Input Output Operations',
                'C++ Basic Input/Output',
                'C++ Cin',
                'C++ Cout'
            ]
        },
        {
            category: 'Operators',
            icon: <Calculator className="w-5 h-5" />,
            items: [
                'C++ Operators',
                'C++ Arithmetic Operators',
                'C++ Relational Operators',
                'C++ Logical Operators',
                'C++ Assignment Operators',
                'C++ sizeof Operator',
                'C++ Conditional Operator',
                'C++ Operators Precedence'
            ]
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: [
                'C++ Control Statements',
                'C++ Decision Making',
                'C++ if Statement',
                'C++ if else Statement',
                'C++ switch Statement',
                'C++ Loop Types',
                'C++ while Loop',
                'C++ for Loop',
                'C++ do while Loop',
                'C++ Jump Statements',
                'C++ break Statement',
                'C++ continue Statement',
                'C++ Return Values'
            ]
        },
        {
            category: 'Functions & Recursion',
            icon: <Box className="w-5 h-5" />,
            items: [
                'C++ Functions',
                'C++ Multiple Function Parameters',
                'C++ Recursive Function',
                'C++ Default Arguments'
            ]
        },
        {
            category: 'Arrays & Strings',
            icon: <Database className="w-5 h-5" />,
            items: [
                'C++ Arrays',
                'C++ Multidimensional Arrays',
                'C++ Passing Arrays to Functions',
                'C++ Strings',
                'C++ Loop Through a String',
                'C++ String Length',
                'C++ String Concatenation',
                'C++ String Comparison'
            ]
        },
        {
            category: 'Pointers & References',
            icon: <ArrowRightLeft className="w-5 h-5" />,
            items: [
                'C++ Pointers',
                'C++ Dereferencing',
                'C++ Modify Pointers',
                'C++ References'
            ]
        },
        {
            category: 'Structs & Classes (MINIMAL)',
            icon: <Box className="w-5 h-5" />,
            items: [
                'C++ Structures',
                'C++ Class and Objects',
                'C++ Classes & Objects',
                'C++ Class Member Functions',
                'C++ Class Access Modifiers',
                'C++ Constructors',
                'C++ Default Constructors',
                'C++ Parameterized Constructors',
                'C++ this Pointer'
            ]
        },
        {
            category: 'STL (VERY IMPORTANT)',
            icon: <Trophy className="w-5 h-5 text-yellow-500" />,
            items: [
                'C++ STL Overview',
                'C++ Vectors',
                'C++ Lists',
                'C++ Deque',
                'C++ Maps (map, unordered_map)',
                'C++ Sets (set, unordered_set, multiset)',
                'C++ Priority Queue',
                'C++ Stack',
                'C++ Queue',
                'C++ Pair and Tuple',
                'C++ Iterators',
                'C++ Algorithms (sort, binary_search, lower_bound, upper_bound)',
                'C++ Lambda Functions with STL'
            ]
        }
    ],
    devMastery: [
        {
            category: 'Modern C++ Features',
            icon: <Code className="w-5 h-5" />,
            items: [
                'Smart Pointers (unique_ptr, shared_ptr, weak_ptr)',
                'Move Semantics and rvalue References',
                'RAII Pattern',
                'Lambda Expressions',
                'Auto Keyword and Type Inference',
                'Range-based For Loops',
                'nullptr',
                'constexpr and consteval',
                'decltype',
                'Structured Bindings (C++17)'
            ]
        },
        {
            category: 'Object-Oriented Programming',
            icon: <Box className="w-5 h-5" />,
            items: [
                'Inheritance (Single, Multiple, Multilevel)',
                'Polymorphism',
                'Virtual Functions and Virtual Tables',
                'Pure Virtual Functions',
                'Abstract Classes',
                'Interfaces',
                'Operator Overloading',
                'Friend Functions and Classes',
                'Copy Constructors',
                'Move Constructors',
                'Destructors and Virtual Destructors'
            ]
        },
        {
            category: 'Templates & Generic Programming',
            icon: <Zap className="w-5 h-5" />,
            items: [
                'Function Templates',
                'Class Templates',
                'Template Specialization',
                'Partial Template Specialization',
                'Variadic Templates',
                'SFINAE (Substitution Failure Is Not An Error)',
                'Concepts (C++20)',
                'Type Traits'
            ]
        },
        {
            category: 'Memory Management',
            icon: <Database className="w-5 h-5" />,
            items: [
                'Dynamic Memory Allocation',
                'new and delete Operators',
                'new[] and delete[] for Arrays',
                'Memory Leaks Detection',
                'Stack vs Heap Memory',
                'Custom Allocators',
                'Memory Alignment',
                'Placement new'
            ]
        },
        {
            category: 'Exception Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: [
                'try-catch Blocks',
                'throw Statement',
                'Standard Exceptions',
                'Custom Exceptions',
                'Exception Safety Guarantees',
                'noexcept Specifier',
                'Stack Unwinding'
            ]
        },
        {
            category: 'Build & Tools',
            icon: <Settings className="w-5 h-5" />,
            items: [
                'CMake Basics',
                'Makefiles',
                'Debugging with GDB',
                'Debugging with LLDB',
                'Valgrind for Memory Debugging',
                'AddressSanitizer',
                'Unit Testing (Google Test, Catch2)',
                'Static Analysis Tools (clang-tidy, cppcheck)',
                'Compilation Process (Preprocessing, Compilation, Linking)',
                'Header Guards and #pragma once'
            ]
        },
        {
            category: 'File I/O & Streams',
            icon: <Database className="w-5 h-5" />,
            items: [
                'File Streams (fstream, ifstream, ofstream)',
                'Reading Files',
                'Writing Files',
                'Binary Files',
                'String Streams (stringstream)',
                'Stream Manipulators',
                'Error Handling in File I/O'
            ]
        },
        {
            category: 'Advanced Topics',
            icon: <Zap className="w-5 h-5" />,
            items: [
                'Multithreading (std::thread)',
                'Mutexes and Locks',
                'Condition Variables',
                'Atomic Operations',
                'std::async and std::future',
                'Thread Pools',
                'Regular Expressions (std::regex)',
                'Chrono Library (Time and Duration)',
                'Filesystem Library (C++17)'
            ]
        }
    ]
};
