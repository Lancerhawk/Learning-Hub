import React from 'react';
import { BookOpen, Code, Zap, Database, Settings, Box, RefreshCw } from 'lucide-react';

export const javascriptData = {
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: [
                'JavaScript Syntax',
                'Variables (let, const, var)',
                'Data Types (Primitives and Objects)',
                'Type Conversion and Coercion',
                'Operators (Arithmetic, Logical, Comparison)',
                'Template Literals',
                'Strict Mode',
                'Comments'
            ]
        },
        {
            category: 'Arrays & Array Methods',
            icon: <Database className="w-5 h-5" />,
            items: [
                'Array Basics',
                'Array Methods (map, filter, reduce)',
                'forEach, find, findIndex, some, every',
                'Array Destructuring',
                'Spread Operator (...)',
                'Rest Parameters',
                'Array.from() and Array.of()',
                'Sorting Arrays (sort, reverse)',
                'Multidimensional Arrays',
                'Array.prototype methods'
            ]
        },
        {
            category: 'Objects & Maps',
            icon: <Box className="w-5 h-5" />,
            items: [
                'Object Basics',
                'Object Methods',
                'Object Destructuring',
                'Object.keys(), values(), entries()',
                'Object.assign() and Object Spread',
                'Map Data Structure',
                'WeakMap',
                'Object vs Map',
                'Symbol as Object Keys'
            ]
        },
        {
            category: 'Sets & Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: [
                'Set Data Structure',
                'WeakSet',
                'Set Operations (union, intersection, difference)',
                'Custom Data Structures (Stack, Queue, LinkedList)'
            ]
        },
        {
            category: 'Strings',
            icon: <Code className="w-5 h-5" />,
            items: [
                'String Methods (slice, substring, substr)',
                'String Manipulation (split, join, concat)',
                'Regular Expressions',
                'String Search Methods (indexOf, includes, startsWith, endsWith)',
                'Template Literals and Tagged Templates',
                'String.prototype methods'
            ]
        },
        {
            category: 'Functions',
            icon: <Zap className="w-5 h-5" />,
            items: [
                'Function Declaration',
                'Function Expression',
                'Arrow Functions',
                'Higher-Order Functions',
                'Callbacks',
                'Closures and Lexical Scope',
                'Closures for Memoization',
                'Recursion & Call Stack',
                'IIFE (Immediately Invoked Function Expression)',
                'Function Currying',
                'Function Composition'
            ]
        }
    ],
    devMastery: [
        {
            category: 'Modern JavaScript (ES6+)',
            icon: <Code className="w-5 h-5" />,
            items: [
                'let and const',
                'Arrow Functions',
                'Destructuring (Arrays and Objects)',
                'Spread/Rest Operators',
                'Default Parameters',
                'Optional Chaining (?.)',
                'Nullish Coalescing (??)',
                'for...of Loop',
                'for...in Loop',
                'Symbols',
                'Iterators and Generators',
                'BigInt'
            ]
        },
        {
            category: 'Asynchronous JavaScript',
            icon: <RefreshCw className="w-5 h-5" />,
            items: [
                'Callbacks',
                'Promises',
                'Async/Await',
                'Promise.all(), race(), allSettled(), any()',
                'Error Handling in Async Code',
                'Event Loop',
                'Microtasks vs Macrotasks',
                'setTimeout and setInterval',
                'Fetch API'
            ]
        },
        {
            category: 'Modules',
            icon: <Box className="w-5 h-5" />,
            items: [
                'ES6 Modules (import/export)',
                'Named Exports vs Default Exports',
                'CommonJS (require/module.exports)',
                'Dynamic Imports',
                'Module Patterns'
            ]
        },
        {
            category: 'Web APIs',
            icon: <Settings className="w-5 h-5" />,
            items: [
                'DOM Manipulation',
                'Event Handling',
                'Event Bubbling and Capturing',
                'Event Delegation',
                'Fetch API',
                'Local Storage',
                'Session Storage',
                'Cookies',
                'Web Workers',
                'Intersection Observer',
                'Mutation Observer',
                'Geolocation API'
            ]
        },
        {
            category: 'Object-Oriented JavaScript',
            icon: <Box className="w-5 h-5" />,
            items: [
                'Classes (ES6)',
                'Constructors',
                'Inheritance and extends',
                'Prototypes and Prototype Chain',
                'this Keyword',
                'bind, call, apply',
                'Getters and Setters',
                'Static Methods',
                'Private Fields (#)'
            ]
        },
        {
            category: 'Error Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: [
                'try...catch...finally',
                'throw Statement',
                'Custom Errors',
                'Error Types (TypeError, ReferenceError, etc.)',
                'Error Handling Best Practices'
            ]
        },
        {
            category: 'Testing & Debugging',
            icon: <Settings className="w-5 h-5" />,
            items: [
                'console Methods (log, error, warn, table, time)',
                'Debugger Statement',
                'Browser DevTools',
                'Jest Testing Framework',
                'Unit Testing',
                'Integration Testing',
                'Test-Driven Development (TDD)',
                'Mocking and Spies'
            ]
        }
    ]
};
