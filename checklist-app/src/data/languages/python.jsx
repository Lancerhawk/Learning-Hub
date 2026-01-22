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
            items: ['if-elif-else', 'for Loop', 'while Loop', 'break and continue', 'pass Statement', 'List Comprehensions', 'Dictionary Comprehensions', 'Set Comprehensions']
        },
        {
            category: 'Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: ['Lists', 'List Methods', 'Tuples', 'Named Tuples', 'Sets', 'Set Operations', 'Dictionaries', 'Dictionary Methods', 'Collections Module (deque, Counter, defaultdict, OrderedDict)', 'heapq Module', 'bisect Module']
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
        },
        {
            category: 'Advanced DSA',
            icon: <Zap className="w-5 h-5" />,
            items: ['Recursion', 'Dynamic Programming', 'Backtracking', 'Binary Search', 'Two Pointers', 'Sliding Window', 'Sorting (sorted, sort)', 'Time Complexity', 'Space Complexity']
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

export const rubyData = {
    name: 'Ruby',
    icon: '💎',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: ['Ruby Syntax', 'Variables', 'Data Types', 'Operators', 'Input/Output (gets, puts, print)', 'Comments', 'String Interpolation']
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['if-elsif-else', 'unless Statement', 'case-when', 'Ternary Operator', 'for Loop', 'while Loop', 'until Loop', 'loop do', 'break and next', 'redo and retry']
        },
        {
            category: 'Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: ['Arrays', 'Array Methods (push, pop, shift, unshift)', 'Array Slicing', 'Hashes', 'Hash Methods', 'Symbols', 'Ranges', 'Sets']
        },
        {
            category: 'Strings',
            icon: <Code className="w-5 h-5" />,
            items: ['String Methods', 'String Interpolation', 'String Concatenation', 'Regular Expressions', 'String Encoding']
        },
        {
            category: 'Enumerables',
            icon: <Zap className="w-5 h-5" />,
            items: ['each Method', 'map/collect', 'select/filter', 'reject', 'reduce/inject', 'find/detect', 'any? and all?', 'each_with_index', 'zip', 'Enumerable Module']
        },
        {
            category: 'Blocks, Procs & Lambdas',
            icon: <Code className="w-5 h-5" />,
            items: ['Blocks', 'yield Keyword', 'block_given?', 'Procs', 'Lambdas', 'Closures', 'Proc.new vs lambda']
        },
        {
            category: 'Advanced DSA',
            icon: <Zap className="w-5 h-5" />,
            items: ['Recursion', 'Metaprogramming for DSA', 'Custom Iterators', 'Method Chaining', 'Sorting (sort, sort_by)']
        }
    ],
    devMastery: [
        {
            category: 'OOP',
            icon: <Box className="w-5 h-5" />,
            items: ['Classes and Objects', 'initialize Method', 'Instance Variables (@variable)', 'Class Variables (@@variable)', 'attr_accessor, attr_reader, attr_writer', 'Instance Methods', 'Class Methods (self.method)', 'Inheritance', 'super Keyword', 'Modules', 'Mixins (include, extend)', 'Namespacing', 'Method Visibility (public, private, protected)']
        },
        {
            category: 'Exception Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['begin-rescue', 'raise', 'ensure', 'retry', 'Custom Exceptions', 'Exception Hierarchy', 'rescue_from']
        },
        {
            category: 'File I/O',
            icon: <Database className="w-5 h-5" />,
            items: ['File Class', 'Reading Files (File.read, File.readlines)', 'Writing Files (File.write)', 'File.open with Block', 'CSV Library', 'JSON Library', 'YAML', 'File Paths (File.join, Dir)']
        },
        {
            category: 'Metaprogramming',
            icon: <Zap className="w-5 h-5" />,
            items: ['define_method', 'method_missing', 'send Method', 'eval', 'class_eval and instance_eval', 'const_missing', 'Reflection (methods, instance_variables)']
        },
        {
            category: 'Ruby on Rails',
            icon: <Settings className="w-5 h-5" />,
            items: ['MVC Pattern', 'Rails Directory Structure', 'ActiveRecord Basics', 'Models', 'Migrations', 'Validations', 'Associations (has_many, belongs_to)', 'Controllers', 'Routes', 'Views (ERB)', 'Partials', 'Helpers', 'RESTful Routes', 'Strong Parameters']
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: ['RSpec Basics', 'describe and context', 'it Blocks', 'expect Syntax', 'Matchers', 'before and after Hooks', 'let and let!', 'Mocking and Stubbing', 'FactoryBot', 'Minitest', 'TDD']
        },
        {
            category: 'Gems & Bundler',
            icon: <Box className="w-5 h-5" />,
            items: ['Gemfile', 'bundle install', 'bundle update', 'Creating Gems', 'Popular Gems', 'Gem Versioning']
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
            items: ['Go Syntax', 'Variables (var, :=)', 'Data Types', 'Constants', 'Operators', 'fmt Package', 'Type Conversion', 'Zero Values']
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['if-else', 'if with Short Statement', 'switch', 'switch without Condition', 'for Loop', 'for as while', 'Infinite Loop', 'break and continue', 'defer Statement']
        },
        {
            category: 'Data Structures',
            icon: <Database className="w-5 h-5" />,
            items: ['Arrays', 'Slices', 'Slice Operations (append, copy)', 'make Function', 'Maps', 'Map Operations', 'Structs', 'Struct Embedding', 'Anonymous Structs']
        },
        {
            category: 'Pointers',
            icon: <Code className="w-5 h-5" />,
            items: ['Pointer Basics', 'Pointer to Struct', 'Pointer Receivers', 'new Function']
        },
        {
            category: 'Functions',
            icon: <Zap className="w-5 h-5" />,
            items: ['Function Declaration', 'Multiple Return Values', 'Named Return Values', 'Variadic Functions', 'Anonymous Functions', 'Closures', 'Recursion', 'defer, panic, recover']
        },
        {
            category: 'Interfaces',
            icon: <Box className="w-5 h-5" />,
            items: ['Interface Definition', 'Implementing Interfaces', 'Empty Interface (interface{})', 'Type Assertions', 'Type Switches', 'Stringer Interface', 'Error Interface']
        },
        {
            category: 'Advanced DSA',
            icon: <Zap className="w-5 h-5" />,
            items: ['Sorting with sort Package', 'sort.Slice', 'Custom Sorting', 'Binary Search', 'Custom Data Structures', 'Heap (container/heap)']
        }
    ],
    devMastery: [
        {
            category: 'Concurrency',
            icon: <Zap className="w-5 h-5" />,
            items: ['Goroutines', 'Channels', 'Buffered Channels', 'Channel Direction', 'Select Statement', 'Default Selection', 'Closing Channels', 'Range over Channels', 'sync.WaitGroup', 'sync.Mutex', 'sync.RWMutex', 'sync.Once', 'Worker Pools', 'Rate Limiting']
        },
        {
            category: 'Error Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: ['Error Type', 'errors.New', 'fmt.Errorf', 'Custom Errors', 'Error Wrapping', 'errors.Is and errors.As', 'defer', 'panic', 'recover', 'Error Handling Patterns']
        },
        {
            category: 'Methods',
            icon: <Box className="w-5 h-5" />,
            items: ['Methods on Structs', 'Pointer Receivers vs Value Receivers', 'Methods on Non-Struct Types', 'Method Sets']
        },
        {
            category: 'Packages & Modules',
            icon: <Box className="w-5 h-5" />,
            items: ['Package Declaration', 'Importing Packages', 'Exported vs Unexported Names', 'init Function', 'Go Modules (go.mod)', 'go get', 'go mod tidy', 'Vendoring', 'Internal Packages', 'Package Organization']
        },
        {
            category: 'File I/O',
            icon: <Database className="w-5 h-5" />,
            items: ['os Package', 'Reading Files (os.ReadFile)', 'Writing Files (os.WriteFile)', 'File Operations (os.Open, os.Create)', 'bufio Package', 'io Package', 'Working with Directories']
        },
        {
            category: 'Web Development',
            icon: <Settings className="w-5 h-5" />,
            items: ['net/http Package', 'HTTP Servers', 'http.HandleFunc', 'http.Handler Interface', 'ServeMux', 'Routing', 'Middleware', 'Request and Response', 'JSON Encoding/Decoding', 'REST APIs', 'Context Package', 'Gorilla Mux', 'Gin Framework']
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: ['testing Package', 'Writing Tests', 't.Error and t.Fatal', 'Table-Driven Tests', 'Subtests (t.Run)', 'Benchmarks', 'Example Tests', 'Test Coverage', 'Mocking', 'testify Package']
        },
        {
            category: 'Advanced',
            icon: <Zap className="w-5 h-5" />,
            items: ['Reflection (reflect package)', 'Generics (Go 1.18+)', 'Type Parameters', 'Context Package', 'Build Tags', 'CGo', 'Profiling (pprof)', 'Race Detector', 'Embedding Files (embed package)']
        }
    ]
};
