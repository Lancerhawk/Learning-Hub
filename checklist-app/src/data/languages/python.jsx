import React from 'react';
import { BookOpen, Code, Zap, Database, Settings, Box, RefreshCw } from 'lucide-react';

export const pythonData = {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: ['Python Syntax', 'Variables', 'Data Types', 'Operators', 'Input/Output', 'Comments', 'Indentation']
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['if-elif-else', 'for Loop', 'while Loop', 'break and continue', 'pass Statement', 'List Comprehensions', 'Dictionary Comprehensions', 'Set Comprehensions']
        },
        {
            category: 'Strings',
            icon: <Code className="w-5 h-5" />,
            items: ['String Methods', 'String Formatting (%, format(), f-strings)', 'String Slicing', 'Regular Expressions (re module)', 'String Immutability']
        },
        {
            category: 'Functions',
            icon: <Zap className="w-5 h-5" />,
            items: ['Function Definition', 'Return Statement', 'Default Arguments', '*args and **kwargs', 'Lambda Functions', 'map(), filter(), reduce()', 'Decorators', '@lru_cache for Memoization', 'Generators', 'Generator Expressions', 'yield Keyword']
        }
    ],
    devMastery: [
        {
            category: 'OOP',
            icon: <Box className="w-5 h-5" />,
            items: ['Classes and Objects', '__init__ Constructor', 'Instance Variables', 'Class Variables', 'Methods', 'Inheritance', 'Multiple Inheritance', 'super() Function', 'Polymorphism', 'Encapsulation', 'Magic Methods (__str__, __repr__, __len__, __add__)', 'Operator Overloading', 'Property Decorators (@property)', 'Class Methods (@classmethod)', 'Static Methods (@staticmethod)', 'Abstract Classes (ABC)']
        },
        {
            category: 'File I/O',
            icon: <Database className="w-5 h-5" />,
            items: ['open() Function', 'Reading Files (read, readline, readlines)', 'Writing Files (write, writelines)', 'with Statement (Context Managers)', 'File Modes (r, w, a, r+, w+)', 'CSV Files (csv module)', 'JSON Files (json module)', 'Pickle Module', 'pathlib Module']
        },
        {
            category: 'Exception Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['try-except', 'Multiple except Blocks', 'else Clause', 'finally Block', 'raise Statement', 'Custom Exceptions', 'Exception Hierarchy', 'assert Statement']
        },
        {
            category: 'Modules & Packages',
            icon: <Box className="w-5 h-5" />,
            items: ['import Statement', 'from...import', 'Creating Modules', '__name__ == "__main__"', 'Packages', '__init__.py', 'Virtual Environments (venv)', 'pip Package Manager', 'requirements.txt', 'setup.py']
        },
        {
            category: 'Web Development',
            icon: <Settings className="w-5 h-5" />,
            items: ['Flask Basics', 'Flask Routes', 'Flask Templates (Jinja2)', 'Django Basics', 'Django Models', 'Django Views', 'Django Templates', 'FastAPI', 'REST APIs', 'SQLAlchemy ORM', 'Database Migrations']
        },
        {
            category: 'Data Science',
            icon: <Database className="w-5 h-5" />,
            items: ['NumPy Arrays', 'NumPy Operations', 'Pandas DataFrames', 'Pandas Series', 'Data Cleaning', 'Data Manipulation', 'Matplotlib Basics', 'Plotting Graphs']
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: ['unittest Module', 'pytest Framework', 'Test Cases', 'Assertions', 'Mocking', 'Test Coverage', 'pdb Debugger', 'Logging Module']
        },
        {
            category: 'Advanced',
            icon: <Zap className="w-5 h-5" />,
            items: ['Iterators and Iterables', 'Context Managers', 'Metaclasses', 'Descriptors', 'Threading', 'Multiprocessing', 'asyncio', 'Type Hints', 'Dataclasses']
        }
    ]
};