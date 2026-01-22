import React from 'react';
import { BookOpen, Code, Zap, Database, Settings, Box, RefreshCw } from 'lucide-react';

export const javaData = {
    name: 'Java',
    icon: '☕',
    dsaMastery: [
        {
            category: 'Core Basics',
            icon: <BookOpen className="w-5 h-5" />,
            items: [
                'Java Syntax',
                'Variables and Data Types',
                'Operators',
                'Type Casting',
                'Input/Output (Scanner, BufferedReader)',
                'Comments',
                'Keywords and Identifiers'
            ]
        },
        {
            category: 'Control Flow',
            icon: <RefreshCw className="w-5 h-5" />,
            items: [
                'if-else Statements',
                'switch Statement',
                'for Loop',
                'while Loop',
                'do-while Loop',
                'break and continue',
                'Enhanced for Loop (for-each)',
                'Labeled Statements'
            ]
        },
        {
            category: 'Arrays',
            icon: <Database className="w-5 h-5" />,
            items: [
                'Array Basics',
                'Multidimensional Arrays',
                'Array Methods',
                'Arrays Class Utility Methods',
                'Varargs (Variable Arguments)',
                'Jagged Arrays'
            ]
        },
        {
            category: 'Collections Framework',
            icon: <Database className="w-5 h-5" />,
            items: [
                'ArrayList',
                'LinkedList',
                'Vector and Stack',
                'HashMap',
                'LinkedHashMap',
                'TreeMap',
                'HashSet',
                'LinkedHashSet',
                'TreeSet',
                'PriorityQueue',
                'ArrayDeque',
                'Queue Interface',
                'Deque Interface',
                'Collections Utility Class'
            ]
        },
        {
            category: 'Strings',
            icon: <Code className="w-5 h-5" />,
            items: [
                'String Class',
                'StringBuilder',
                'StringBuffer',
                'String Methods',
                'String Pool and Immutability',
                'StringTokenizer',
                'Regular Expressions (Pattern, Matcher)'
            ]
        },
        {
            category: 'Advanced DSA Concepts',
            icon: <Zap className="w-5 h-5" />,
            items: [
                'Comparators and Comparable',
                'Streams for DSA',
                'Lambda Expressions',
                'Generics',
                'Collections Utility Methods (sort, binarySearch)',
                'Iterator and ListIterator'
            ]
        }
    ],
    devMastery: [
        {
            category: 'Object-Oriented Programming',
            icon: <Box className="w-5 h-5" />,
            items: [
                'Classes and Objects',
                'Constructors (Default, Parameterized, Copy)',
                'Inheritance (Single, Multilevel, Hierarchical)',
                'Polymorphism (Compile-time, Runtime)',
                'Encapsulation',
                'Abstraction',
                'Interfaces',
                'Abstract Classes',
                'Method Overloading',
                'Method Overriding',
                'super Keyword',
                'this Keyword',
                'final Keyword',
                'static Keyword',
                'Access Modifiers (public, private, protected, default)'
            ]
        },
        {
            category: 'Exception Handling',
            icon: <RefreshCw className="w-5 h-5" />,
            items: [
                'try-catch-finally',
                'throw and throws',
                'Custom Exceptions',
                'Checked vs Unchecked Exceptions',
                'Exception Hierarchy',
                'try-with-resources',
                'Multi-catch Block'
            ]
        },
        {
            category: 'File I/O',
            icon: <Database className="w-5 h-5" />,
            items: [
                'File Class',
                'FileReader and FileWriter',
                'BufferedReader and BufferedWriter',
                'FileInputStream and FileOutputStream',
                'Scanner Class',
                'Serialization and Deserialization',
                'NIO Package (Path, Files)',
                'ObjectInputStream and ObjectOutputStream'
            ]
        },
        {
            category: 'Multithreading',
            icon: <Zap className="w-5 h-5" />,
            items: [
                'Thread Class',
                'Runnable Interface',
                'Thread Lifecycle',
                'Synchronization',
                'synchronized Keyword',
                'Locks (ReentrantLock)',
                'Executor Framework',
                'ExecutorService',
                'Callable and Future',
                'Thread Pools',
                'CountDownLatch',
                'CyclicBarrier',
                'Semaphore'
            ]
        },
        {
            category: 'Enterprise Java',
            icon: <Settings className="w-5 h-5" />,
            items: [
                'Spring Framework Basics',
                'Spring Boot',
                'Dependency Injection (DI)',
                'Inversion of Control (IoC)',
                'Spring Annotations',
                'Maven Build Tool',
                'Gradle Build Tool',
                'JDBC (Java Database Connectivity)',
                'Hibernate ORM',
                'JPA (Java Persistence API)',
                'REST APIs with Spring',
                'Spring MVC'
            ]
        },
        {
            category: 'Testing',
            icon: <Settings className="w-5 h-5" />,
            items: [
                'JUnit Basics',
                'JUnit 5 (Jupiter)',
                'JUnit Annotations (@Test, @BeforeEach, @AfterEach)',
                'Assertions',
                'Mockito Framework',
                'Mocking and Stubbing',
                'Test-Driven Development (TDD)',
                'Integration Testing'
            ]
        },
        {
            category: 'Advanced Topics',
            icon: <Zap className="w-5 h-5" />,
            items: [
                'Reflection API',
                'Annotations',
                'Enums',
                'Nested Classes (Inner, Static, Anonymous)',
                'Java 8+ Features (Streams, Optional, LocalDate)',
                'Functional Interfaces',
                'Method References',
                'Default Methods in Interfaces'
            ]
        }
    ]
};
