import React from 'react';
import { BookOpen, Code, Zap, Database, Settings, Box, RefreshCw } from 'lucide-react';

export const pythonData = {
    name: 'Python',
    icon: '🐍',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: ['Python Syntax', 'Variables', 'Data Types', 'Operators', 'Input/Output', 'Comments', 'Indentation']
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['if-elif-else', 'for Loop', 'while Loop', 'break and continue', 'pass Statement', 'List Comprehensions']
        },
        {
            category: 'Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: ['Lists', 'Tuples', 'Sets', 'Dictionaries', 'Named Tuples', 'Collections Module (deque, Counter, defaultdict)', 'heapq Module']
        },
        {
            category: 'Strings',
            icon: <Code className="w-5 h-5" />,
            items: ['String Methods', 'String Formatting', 'f-strings', 'Regular Expressions']
        },
        {
            category: 'Functions',
            icon: <Zap className="w-5 h-5" />,
            items: ['Function Definition', 'Lambda Functions', 'map(), filter(), reduce()', 'Decorators for Memoization', 'Generators', '*args and **kwargs']
        },
        {
            category: 'Advanced DSA',
            icon: <Zap className="w-5 h-5" />,
            items: ['Recursion', 'Dynamic Programming', 'Sorting Algorithms', 'Binary Search', 'Two Pointers', 'Sliding Window']
        }
    ],
    devMastery: [
        {
            category: 'OOP',
            icon: <Box className="w-5 h-5" />,
            items: ['Classes and Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Magic Methods', 'Property Decorators', 'Class Methods and Static Methods']
        },
        {
            category: 'File I/O',
            icon: <Database className="w-5 h-5" />,
            items: ['Reading Files', 'Writing Files', 'with Statement', 'CSV Files', 'JSON Files', 'Pickle']
        },
        {
            category: 'Exception Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['try-except', 'raise Statement', 'Custom Exceptions', 'finally Block', 'else Clause']
        },
        {
            category: 'Modules & Packages',
            icon: <Box className="w-5 h-5" />,
            items: ['import Statement', 'Creating Modules', 'Packages', '__init__.py', 'Virtual Environments (venv)', 'pip']
        },
        {
            category: 'Web Development',
            icon: <Settings className="w-5 h-5" />,
            items: ['Flask Basics', 'Django Basics', 'FastAPI', 'REST APIs', 'Jinja2 Templates', 'SQLAlchemy']
        },
        {
            category: 'Data Science',
            icon: <Database className="w-5 h-5" />,
            items: ['NumPy Basics', 'Pandas Basics', 'Matplotlib', 'Data Analysis']
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: ['unittest', 'pytest', 'Mocking', 'Test Coverage']
        }
    ]
};

export const rubyData = {
    name: 'Ruby',
    icon: '💎',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: ['Ruby Syntax', 'Variables', 'Data Types', 'Operators', 'Input/Output', 'Comments']
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['if-elsif-else', 'unless', 'case-when', 'for Loop', 'while Loop', 'until Loop', 'break and next']
        },
        {
            category: 'Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: ['Arrays', 'Hashes', 'Symbols', 'Ranges', 'Sets']
        },
        {
            category: 'Enumerables',
            icon: <Zap className="w-5 h-5" />,
            items: ['each', 'map', 'select', 'reject', 'reduce', 'find', 'Enumerable Methods']
        },
        {
            category: 'Blocks, Procs & Lambdas',
            icon: <Code className="w-5 h-5" />,
            items: ['Blocks', 'yield Keyword', 'Procs', 'Lambdas', 'Closures']
        },
        {
            category: 'Advanced DSA',
            icon: <Zap className="w-5 h-5" />,
            items: ['Recursion', 'Metaprogramming for DSA', 'Custom Iterators']
        }
    ],
    devMastery: [
        {
            category: 'OOP',
            icon: <Box className="w-5 h-5" />,
            items: ['Classes and Objects', 'Modules', 'Mixins', 'Inheritance', 'attr_accessor', 'Class Methods', 'Instance Methods']
        },
        {
            category: 'Exception Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['begin-rescue', 'raise', 'ensure', 'Custom Exceptions']
        },
        {
            category: 'File I/O',
            icon: <Database className="w-5 h-5" />,
            items: ['File Class', 'Reading Files', 'Writing Files', 'CSV', 'JSON']
        },
        {
            category: 'Ruby on Rails',
            icon: <Settings className="w-5 h-5" />,
            items: ['MVC Pattern', 'ActiveRecord', 'Routing', 'Controllers', 'Views', 'Migrations', 'Validations']
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: ['RSpec', 'Minitest', 'Test-Driven Development', 'Mocking']
        }
    ]
};

export const golangData = {
    name: 'Go',
    icon: '🔷',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: ['Go Syntax', 'Variables', 'Data Types', 'Constants', 'Operators', 'fmt Package']
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['if-else', 'switch', 'for Loop', 'break and continue']
        },
        {
            category: 'Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: ['Arrays', 'Slices', 'Maps', 'Structs']
        },
        {
            category: 'Pointers',
            icon: <Code className="w-5 h-5" />,
            items: ['Pointer Basics', 'Pointer to Struct', 'Pointer Receivers']
        },
        {
            category: 'Functions',
            icon: <Zap className="w-5 h-5" />,
            items: ['Function Declaration', 'Multiple Return Values', 'Variadic Functions', 'Anonymous Functions', 'Closures']
        },
        {
            category: 'Advanced DSA',
            icon: <Zap className="w-5 h-5" />,
            items: ['Interfaces for DSA', 'Sorting with sort Package', 'Custom Data Structures', 'Recursion']
        }
    ],
    devMastery: [
        {
            category: 'Concurrency',
            icon: <Zap className="w-5 h-5" />,
            items: ['Goroutines', 'Channels', 'Select Statement', 'sync Package', 'WaitGroups', 'Mutexes']
        },
        {
            category: 'Error Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['Error Type', 'Custom Errors', 'Defer', 'Panic', 'Recover']
        },
        {
            category: 'Interfaces & Methods',
            icon: <Box className="w-5 h-5" />,
            items: ['Interface Definition', 'Implementing Interfaces', 'Empty Interface', 'Type Assertions', 'Methods']
        },
        {
            category: 'Packages & Modules',
            icon: <Box className="w-5 h-5" />,
            items: ['Creating Packages', 'Importing Packages', 'Go Modules', 'go.mod', 'Vendoring']
        },
        {
            category: 'Web Development',
            icon: <Settings className="w-5 h-5" />,
            items: ['net/http Package', 'HTTP Servers', 'Routing', 'Middleware', 'JSON Handling', 'REST APIs']
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: ['testing Package', 'Table-Driven Tests', 'Benchmarks', 'Test Coverage']
        }
    ]
};
