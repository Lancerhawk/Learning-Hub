import React from 'react';
import { BookOpen, Code, Zap, Database, Settings, Box, RefreshCw } from 'lucide-react';

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
