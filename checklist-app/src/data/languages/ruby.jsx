import React from 'react';
import { BookOpen, Code, Zap, Database, Settings, Box, RefreshCw } from 'lucide-react';

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
