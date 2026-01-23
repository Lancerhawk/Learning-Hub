import React from 'react';
import { cppData } from './languages/cpp';
import { javascriptData } from './languages/javascript';
import { javaData } from './languages/java';
import { pythonData } from './languages/python';
import { rubyData } from './languages/ruby';
import { golangData } from './languages/golang';

// Export all language data
export const languagesData = {
    cpp: cppData,
    javascript: javascriptData,
    java: javaData,
    python: pythonData,
    ruby: rubyData,
    golang: golangData
};

// DSA Topics (Language-agnostic) - WITH REAL LEETCODE PROBLEMS
import { BookOpen, Database, GitBranch, Zap, Code2 } from 'lucide-react';

export const dsaTopicsData = [
    {
        category: 'Arrays & Hashing',
        icon: <Database className="w-5 h-5" />,
        items: [
            {
                name: 'Two Pointers',
                resources: {
                    videos: [
                        { title: 'Two Pointers Technique - NeetCode', url: 'https://www.youtube.com/watch?v=On03HWe2tZM' },
                        { title: 'Two Pointers Pattern Explained', url: 'https://www.youtube.com/watch?v=jzZsG8n2R9A' }
                    ],
                    practice: [
                        { title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode' },
                        { title: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', platform: 'LeetCode' },
                        { title: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', platform: 'LeetCode' },
                        { title: '3Sum', url: 'https://leetcode.com/problems/3sum/', platform: 'LeetCode' },
                        { title: 'Remove Duplicates from Sorted Array', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', platform: 'LeetCode' },
                        { title: 'Move Zeroes', url: 'https://leetcode.com/problems/move-zeroes/', platform: 'LeetCode' },
                        { title: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Sliding Window',
                resources: {
                    videos: [
                        { title: 'Sliding Window Technique - NeetCode', url: 'https://www.youtube.com/watch?v=jM2dhDPYMQM' },
                        { title: 'Sliding Window Algorithm Tutorial', url: 'https://www.youtube.com/watch?v=GcW4mgmgSbw' }
                    ],
                    practice: [
                        { title: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', platform: 'LeetCode' },
                        { title: 'Minimum Window Substring', url: 'https://leetcode.com/problems/minimum-window-substring/', platform: 'LeetCode' },
                        { title: 'Longest Repeating Character Replacement', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', platform: 'LeetCode' },
                        { title: 'Permutation in String', url: 'https://leetcode.com/problems/permutation-in-string/', platform: 'LeetCode' },
                        { title: 'Maximum Average Subarray I', url: 'https://leetcode.com/problems/maximum-average-subarray-i/', platform: 'LeetCode' },
                        { title: 'Fruit Into Baskets', url: 'https://leetcode.com/problems/fruit-into-baskets/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Hash Maps',
                resources: {
                    videos: [
                        { title: 'Hash Tables Explained - CS Dojo', url: 'https://www.youtube.com/watch?v=shs0KM3wKv8' },
                        { title: 'HashMap Implementation', url: 'https://www.youtube.com/watch?v=KyUTuwz_b7Q' }
                    ],
                    practice: [
                        { title: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', platform: 'LeetCode' },
                        { title: 'Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/', platform: 'LeetCode' },
                        { title: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', platform: 'LeetCode' },
                        { title: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', platform: 'LeetCode' },
                        { title: 'Longest Consecutive Sequence', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', platform: 'LeetCode' },
                        { title: 'Subarray Sum Equals K', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Prefix Sum',
                resources: {
                    videos: [
                        { title: 'Prefix Sum Array Technique', url: 'https://www.youtube.com/watch?v=pVS3yhlzrlQ' }
                    ],
                    practice: [
                        { title: 'Range Sum Query - Immutable', url: 'https://leetcode.com/problems/range-sum-query-immutable/', platform: 'LeetCode' },
                        { title: 'Contiguous Array', url: 'https://leetcode.com/problems/contiguous-array/', platform: 'LeetCode' },
                        { title: 'Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Kadane\'s Algorithm',
                resources: {
                    videos: [
                        { title: 'Kadane\'s Algorithm - Maximum Subarray', url: 'https://www.youtube.com/watch?v=86CQq3pKSUw' },
                        { title: 'Maximum Subarray Problem', url: 'https://www.youtube.com/watch?v=2MmGzdiKR9Y' }
                    ],
                    practice: [
                        { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', platform: 'LeetCode' },
                        { title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', platform: 'LeetCode' },
                        { title: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Linked Lists',
        icon: <GitBranch className="w-5 h-5" />,
        items: [
            {
                name: 'Reverse Linked List',
                resources: {
                    videos: [
                        { title: 'Reverse Linked List - NeetCode', url: 'https://www.youtube.com/watch?v=G0_I-ZF0S38' }
                    ],
                    practice: [
                        { title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', platform: 'LeetCode' },
                        { title: 'Reverse Linked List II', url: 'https://leetcode.com/problems/reverse-linked-list-ii/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Detect Cycle',
                resources: {
                    videos: [
                        { title: 'Floyd\'s Cycle Detection Algorithm', url: 'https://www.youtube.com/watch?v=gBTe7lFR3vc' }
                    ],
                    practice: [
                        { title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', platform: 'LeetCode' },
                        { title: 'Linked List Cycle II', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', platform: 'LeetCode' },
                        { title: 'Happy Number', url: 'https://leetcode.com/problems/happy-number/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Merge Two Lists',
                resources: {
                    videos: [
                        { title: 'Merge Two Sorted Lists', url: 'https://www.youtube.com/watch?v=XIdigk956u0' }
                    ],
                    practice: [
                        { title: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', platform: 'LeetCode' },
                        { title: 'Merge k Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Remove Nth Node',
                resources: {
                    videos: [
                        { title: 'Remove Nth Node From End', url: 'https://www.youtube.com/watch?v=XVuQxVej6y8' }
                    ],
                    practice: [
                        { title: 'Remove Nth Node From End of List', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', platform: 'LeetCode' },
                        { title: 'Delete Node in a Linked List', url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Fast & Slow Pointers',
                resources: {
                    videos: [
                        { title: 'Fast and Slow Pointer Technique', url: 'https://www.youtube.com/watch?v=Fj91yqJrR4s' }
                    ],
                    practice: [
                        { title: 'Middle of the Linked List', url: 'https://leetcode.com/problems/middle-of-the-linked-list/', platform: 'LeetCode' },
                        { title: 'Palindrome Linked List', url: 'https://leetcode.com/problems/palindrome-linked-list/', platform: 'LeetCode' },
                        { title: 'Reorder List', url: 'https://leetcode.com/problems/reorder-list/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Stacks & Queues',
        icon: <Database className="w-5 h-5" />,
        items: [
            {
                name: 'Valid Parentheses',
                resources: {
                    videos: [
                        { title: 'Valid Parentheses - NeetCode', url: 'https://www.youtube.com/watch?v=WTzjTskDFMg' }
                    ],
                    practice: [
                        { title: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', platform: 'LeetCode' },
                        { title: 'Generate Parentheses', url: 'https://leetcode.com/problems/generate-parentheses/', platform: 'LeetCode' },
                        { title: 'Longest Valid Parentheses', url: 'https://leetcode.com/problems/longest-valid-parentheses/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Min Stack',
                resources: {
                    videos: [
                        { title: 'Min Stack Problem', url: 'https://www.youtube.com/watch?v=WxCuL3jleUA' }
                    ],
                    practice: [
                        { title: 'Min Stack', url: 'https://leetcode.com/problems/min-stack/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Monotonic Stack',
                resources: {
                    videos: [
                        { title: 'Monotonic Stack Explained', url: 'https://www.youtube.com/watch?v=Dq_ObZwTY_Q' }
                    ],
                    practice: [
                        { title: 'Daily Temperatures', url: 'https://leetcode.com/problems/daily-temperatures/', platform: 'LeetCode' },
                        { title: 'Next Greater Element I', url: 'https://leetcode.com/problems/next-greater-element-i/', platform: 'LeetCode' },
                        { title: 'Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Queue using Stacks',
                resources: {
                    videos: [
                        { title: 'Implement Queue using Stacks', url: 'https://www.youtube.com/watch?v=ma1S6vtkw1A' }
                    ],
                    practice: [
                        { title: 'Implement Queue using Stacks', url: 'https://leetcode.com/problems/implement-queue-using-stacks/', platform: 'LeetCode' },
                        { title: 'Implement Stack using Queues', url: 'https://leetcode.com/problems/implement-stack-using-queues/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Circular Queue',
                resources: {
                    videos: [
                        { title: 'Design Circular Queue', url: 'https://www.youtube.com/watch?v=aBr3W4XGTYE' }
                    ],
                    practice: [
                        { title: 'Design Circular Queue', url: 'https://leetcode.com/problems/design-circular-queue/', platform: 'LeetCode' },
                        { title: 'Design Circular Deque', url: 'https://leetcode.com/problems/design-circular-deque/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Trees',
        icon: <GitBranch className="w-5 h-5" />,
        items: [
            {
                name: 'Binary Tree Traversal',
                resources: {
                    videos: [
                        { title: 'Tree Traversals - Preorder Inorder Postorder', url: 'https://www.youtube.com/watch?v=WLvU5EQVZqY' },
                        { title: 'Binary Tree Traversal - NeetCode', url: 'https://www.youtube.com/watch?v=gm8DUJJhmY4' }
                    ],
                    practice: [
                        { title: 'Binary Tree Inorder Traversal', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', platform: 'LeetCode' },
                        { title: 'Binary Tree Preorder Traversal', url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', platform: 'LeetCode' },
                        { title: 'Binary Tree Postorder Traversal', url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Level Order Traversal',
                resources: {
                    videos: [
                        { title: 'Level Order Traversal (BFS)', url: 'https://www.youtube.com/watch?v=6ZnyEApgFYg' }
                    ],
                    practice: [
                        { title: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', platform: 'LeetCode' },
                        { title: 'Binary Tree Zigzag Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Binary Search Tree',
                resources: {
                    videos: [
                        { title: 'Binary Search Tree Operations', url: 'https://www.youtube.com/watch?v=cySVml6e_Fc' }
                    ],
                    practice: [
                        { title: 'Validate Binary Search Tree', url: 'https://leetcode.com/problems/validate-binary-search-tree/', platform: 'LeetCode' },
                        { title: 'Kth Smallest Element in a BST', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Lowest Common Ancestor',
                resources: {
                    videos: [
                        { title: 'Lowest Common Ancestor of BST', url: 'https://www.youtube.com/watch?v=gs2LMfuOR9k' }
                    ],
                    practice: [
                        { title: 'Lowest Common Ancestor of a Binary Search Tree', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', platform: 'LeetCode' },
                        { title: 'Lowest Common Ancestor of a Binary Tree', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Tree Height & Depth',
                resources: {
                    videos: [
                        { title: 'Maximum Depth of Binary Tree', url: 'https://www.youtube.com/watch?v=hTM3phVI6YQ' }
                    ],
                    practice: [
                        { title: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', platform: 'LeetCode' },
                        { title: 'Minimum Depth of Binary Tree', url: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Balanced Binary Tree',
                resources: {
                    videos: [
                        { title: 'Balanced Binary Tree Explained', url: 'https://www.youtube.com/watch?v=LU4fGD-fgJQ' }
                    ],
                    practice: [
                        { title: 'Balanced Binary Tree', url: 'https://leetcode.com/problems/balanced-binary-tree/', platform: 'LeetCode' },
                        { title: 'Convert Sorted Array to Binary Search Tree', url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Graphs',
        icon: <GitBranch className="w-5 h-5" />,
        items: [
            {
                name: 'DFS (Depth-First Search)',
                resources: {
                    videos: [
                        { title: 'Graph DFS Algorithm', url: 'https://www.youtube.com/watch?v=7fujbpJ0LB4' },
                        { title: 'DFS Traversal - William Fiset', url: 'https://www.youtube.com/watch?v=PMMc4VsIacU' }
                    ],
                    practice: [
                        { title: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', platform: 'LeetCode' },
                        { title: 'Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', platform: 'LeetCode' },
                        { title: 'Pacific Atlantic Water Flow', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', platform: 'LeetCode' },
                        { title: 'Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'BFS (Breadth-First Search)',
                resources: {
                    videos: [
                        { title: 'Graph BFS Algorithm', url: 'https://www.youtube.com/watch?v=oDqjPvD54Ss' }
                    ],
                    practice: [
                        { title: 'Rotting Oranges', url: 'https://leetcode.com/problems/rotting-oranges/', platform: 'LeetCode' },
                        { title: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder/', platform: 'LeetCode' },
                        { title: 'Shortest Path in Binary Matrix', url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Dijkstra\'s Algorithm',
                resources: {
                    videos: [
                        { title: 'Dijkstra\'s Shortest Path Algorithm', url: 'https://www.youtube.com/watch?v=pVfj6mxhdMw' },
                        { title: 'Dijkstra Algorithm Explained', url: 'https://www.youtube.com/watch?v=XB4MIexjvY0' }
                    ],
                    practice: [
                        { title: 'Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', platform: 'LeetCode' },
                        { title: 'Path with Maximum Probability', url: 'https://leetcode.com/problems/path-with-maximum-probability/', platform: 'LeetCode' },
                        { title: 'Cheapest Flights Within K Stops', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Topological Sort',
                resources: {
                    videos: [
                        { title: 'Topological Sort Algorithm', url: 'https://www.youtube.com/watch?v=eL-KzMXSXXI' }
                    ],
                    practice: [
                        { title: 'Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', platform: 'LeetCode' },
                        { title: 'Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'LeetCode' },
                        { title: 'Alien Dictionary', url: 'https://leetcode.com/problems/alien-dictionary/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Union Find',
                resources: {
                    videos: [
                        { title: 'Union Find Data Structure', url: 'https://www.youtube.com/watch?v=ibjEGG7ylHk' },
                        { title: 'Disjoint Set Union (DSU)', url: 'https://www.youtube.com/watch?v=wU6udHRIkcc' }
                    ],
                    practice: [
                        { title: 'Number of Provinces', url: 'https://leetcode.com/problems/number-of-provinces/', platform: 'LeetCode' },
                        { title: 'Redundant Connection', url: 'https://leetcode.com/problems/redundant-connection/', platform: 'LeetCode' },
                        { title: 'Accounts Merge', url: 'https://leetcode.com/problems/accounts-merge/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Minimum Spanning Tree',
                resources: {
                    videos: [
                        { title: 'Kruskal\'s Algorithm', url: 'https://www.youtube.com/watch?v=JZBQLXgSGfs' },
                        { title: 'Prim\'s Algorithm', url: 'https://www.youtube.com/watch?v=cplfcGZmX7I' }
                    ],
                    practice: [
                        { title: 'Min Cost to Connect All Points', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', platform: 'LeetCode' },
                        { title: 'Connecting Cities With Minimum Cost', url: 'https://leetcode.com/problems/connecting-cities-with-minimum-cost/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Dynamic Programming',
        icon: <Zap className="w-5 h-5" />,
        items: [
            {
                name: 'Fibonacci Patterns',
                resources: {
                    videos: [
                        { title: 'Dynamic Programming for Beginners', url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk' }
                    ],
                    practice: [
                        { title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', platform: 'LeetCode' },
                        { title: 'Fibonacci Number', url: 'https://leetcode.com/problems/fibonacci-number/', platform: 'LeetCode' },
                        { title: 'Min Cost Climbing Stairs', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: '0/1 Knapsack',
                resources: {
                    videos: [
                        { title: '0/1 Knapsack Problem - Dynamic Programming', url: 'https://www.youtube.com/watch?v=8LusJS5-AGo' }
                    ],
                    practice: [
                        { title: 'Partition Equal Subset Sum', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', platform: 'LeetCode' },
                        { title: 'Target Sum', url: 'https://leetcode.com/problems/target-sum/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Unbounded Knapsack',
                resources: {
                    videos: [
                        { title: 'Unbounded Knapsack Problem', url: 'https://www.youtube.com/watch?v=aycn9KO8_Ls' }
                    ],
                    practice: [
                        { title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', platform: 'LeetCode' },
                        { title: 'Coin Change 2', url: 'https://leetcode.com/problems/coin-change-2/', platform: 'LeetCode' },
                        { title: 'Perfect Squares', url: 'https://leetcode.com/problems/perfect-squares/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Longest Common Subsequence',
                resources: {
                    videos: [
                        { title: 'LCS Dynamic Programming', url: 'https://www.youtube.com/watch?v=Ua0GhsJSlWM' }
                    ],
                    practice: [
                        { title: 'Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/', platform: 'LeetCode' },
                        { title: 'Edit Distance', url: 'https://leetcode.com/problems/edit-distance/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Longest Increasing Subsequence',
                resources: {
                    videos: [
                        { title: 'LIS Problem', url: 'https://www.youtube.com/watch?v=cjWnW0hdF1Y' }
                    ],
                    practice: [
                        { title: 'Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Matrix Chain Multiplication',
                resources: {
                    videos: [
                        { title: 'Matrix Chain Multiplication DP', url: 'https://www.youtube.com/watch?v=prx1psByp7U' }
                    ],
                    practice: [
                        { title: 'Burst Balloons', url: 'https://leetcode.com/problems/burst-balloons/', platform: 'LeetCode' },
                        { title: 'Minimum Cost Tree From Leaf Values', url: 'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Backtracking',
        icon: <Zap className="w-5 h-5" />,
        items: [
            {
                name: 'Permutations',
                resources: {
                    videos: [
                        { title: 'Backtracking - Permutations', url: 'https://www.youtube.com/watch?v=s7AvT7cGdSo' }
                    ],
                    practice: [
                        { title: 'Permutations', url: 'https://leetcode.com/problems/permutations/', platform: 'LeetCode' },
                        { title: 'Permutations II', url: 'https://leetcode.com/problems/permutations-ii/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Combinations',
                resources: {
                    videos: [
                        { title: 'Combinations Backtracking', url: 'https://www.youtube.com/watch?v=q0s6m7AiM7o' }
                    ],
                    practice: [
                        { title: 'Combinations', url: 'https://leetcode.com/problems/combinations/', platform: 'LeetCode' },
                        { title: 'Combination Sum', url: 'https://leetcode.com/problems/combination-sum/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Subsets',
                resources: {
                    videos: [
                        { title: 'Subsets Problem', url: 'https://www.youtube.com/watch?v=REOH22Xwdkk' }
                    ],
                    practice: [
                        { title: 'Subsets', url: 'https://leetcode.com/problems/subsets/', platform: 'LeetCode' },
                        { title: 'Subsets II', url: 'https://leetcode.com/problems/subsets-ii/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'N-Queens',
                resources: {
                    videos: [
                        { title: 'N-Queens Problem - Backtracking', url: 'https://www.youtube.com/watch?v=Ph95IHmRp5M' }
                    ],
                    practice: [
                        { title: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/', platform: 'LeetCode' },
                        { title: 'N-Queens II', url: 'https://leetcode.com/problems/n-queens-ii/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Sudoku Solver',
                resources: {
                    videos: [
                        { title: 'Sudoku Solver using Backtracking', url: 'https://www.youtube.com/watch?v=FWAIf_EVUKE' }
                    ],
                    practice: [
                        { title: 'Sudoku Solver', url: 'https://leetcode.com/problems/sudoku-solver/', platform: 'LeetCode' },
                        { title: 'Valid Sudoku', url: 'https://leetcode.com/problems/valid-sudoku/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Word Search',
                resources: {
                    videos: [
                        { title: 'Word Search - Backtracking', url: 'https://www.youtube.com/watch?v=pfiQ_PS1g8E' }
                    ],
                    practice: [
                        { title: 'Word Search', url: 'https://leetcode.com/problems/word-search/', platform: 'LeetCode' },
                        { title: 'Word Search II', url: 'https://leetcode.com/problems/word-search-ii/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Greedy Algorithms',
        icon: <Zap className="w-5 h-5" />,
        items: [
            {
                name: 'Activity Selection',
                resources: {
                    videos: [
                        { title: 'Activity Selection Problem', url: 'https://www.youtube.com/watch?v=hVhOeaONg1Y' }
                    ],
                    practice: [
                        { title: 'Non-overlapping Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/', platform: 'LeetCode' },
                        { title: 'Minimum Number of Arrows to Burst Balloons', url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Huffman Coding',
                resources: {
                    videos: [
                        { title: 'Huffman Coding Algorithm', url: 'https://www.youtube.com/watch?v=co4_ahEDCho' }
                    ],
                    practice: [
                        { title: 'Minimum Cost to Connect Sticks', url: 'https://leetcode.com/problems/minimum-cost-to-connect-sticks/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Job Sequencing',
                resources: {
                    videos: [
                        { title: 'Job Sequencing Problem', url: 'https://www.youtube.com/watch?v=zPtI8q9gvX8' }
                    ],
                    practice: [
                        { title: 'Maximum Profit in Job Scheduling', url: 'https://leetcode.com/problems/maximum-profit-in-job-scheduling/', platform: 'LeetCode' },
                        { title: 'Course Schedule III', url: 'https://leetcode.com/problems/course-schedule-iii/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Fractional Knapsack',
                resources: {
                    videos: [
                        { title: 'Fractional Knapsack Problem', url: 'https://www.youtube.com/watch?v=oTTzNMHM05I' }
                    ],
                    practice: [
                        { title: 'Maximum Units on a Truck', url: 'https://leetcode.com/problems/maximum-units-on-a-truck/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Minimum Platforms',
                resources: {
                    videos: [
                        { title: 'Minimum Platforms Problem', url: 'https://www.youtube.com/watch?v=dxVcMDI7vyI' }
                    ],
                    practice: [
                        { title: 'Meeting Rooms II', url: 'https://leetcode.com/problems/meeting-rooms-ii/', platform: 'LeetCode' },
                        { title: 'Car Pooling', url: 'https://leetcode.com/problems/car-pooling/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Binary Search',
        icon: <Database className="w-5 h-5" />,
        items: [
            {
                name: 'Binary Search on Array',
                resources: {
                    videos: [
                        { title: 'Binary Search Algorithm', url: 'https://www.youtube.com/watch?v=P3YID7liBug' }
                    ],
                    practice: [
                        { title: 'Binary Search', url: 'https://leetcode.com/problems/binary-search/', platform: 'LeetCode' },
                        { title: 'Search Insert Position', url: 'https://leetcode.com/problems/search-insert-position/', platform: 'LeetCode' },
                        { title: 'First Bad Version', url: 'https://leetcode.com/problems/first-bad-version/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Search in Rotated Array',
                resources: {
                    videos: [
                        { title: 'Search in Rotated Sorted Array', url: 'https://www.youtube.com/watch?v=U8XENwh8Oy8' }
                    ],
                    practice: [
                        { title: 'Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Find Peak Element',
                resources: {
                    videos: [
                        { title: 'Find Peak Element', url: 'https://www.youtube.com/watch?v=kMzJy9es7Hc' }
                    ],
                    practice: [
                        { title: 'Find Peak Element', url: 'https://leetcode.com/problems/find-peak-element/', platform: 'LeetCode' },
                        { title: 'Peak Index in a Mountain Array', url: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Binary Search on Answer',
                resources: {
                    videos: [
                        { title: 'Binary Search on Answer Space', url: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ' }
                    ],
                    practice: [
                        { title: 'Koko Eating Bananas', url: 'https://leetcode.com/problems/koko-eating-bananas/', platform: 'LeetCode' },
                        { title: 'Capacity To Ship Packages Within D Days', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', platform: 'LeetCode' },
                        { title: 'Split Array Largest Sum', url: 'https://leetcode.com/problems/split-array-largest-sum/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Median of Two Sorted Arrays',
                resources: {
                    videos: [
                        { title: 'Median of Two Sorted Arrays', url: 'https://www.youtube.com/watch?v=q6IEA26hvXc' }
                    ],
                    practice: [
                        { title: 'Median of Two Sorted Arrays', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    },
    {
        category: 'Heaps & Priority Queues',
        icon: <Database className="w-5 h-5" />,
        items: [
            {
                name: 'Kth Largest Element',
                resources: {
                    videos: [
                        { title: 'Heaps and Priority Queues', url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U' }
                    ],
                    practice: [
                        { title: 'Kth Largest Element in an Array', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', platform: 'LeetCode' },
                        { title: 'Kth Smallest Element in a Sorted Matrix', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Merge K Sorted Lists',
                resources: {
                    videos: [
                        { title: 'Merge K Sorted Lists using Heap', url: 'https://www.youtube.com/watch?v=ptYUCjfNhJY' }
                    ],
                    practice: [
                        { title: 'Merge k Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Top K Frequent Elements',
                resources: {
                    videos: [
                        { title: 'Top K Frequent Elements', url: 'https://www.youtube.com/watch?v=YPTqKIgVk-k' }
                    ],
                    practice: [
                        { title: 'Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/', platform: 'LeetCode' },
                        { title: 'Top K Frequent Words', url: 'https://leetcode.com/problems/top-k-frequent-words/', platform: 'LeetCode' }
                    ]
                }
            },
            {
                name: 'Median from Data Stream',
                resources: {
                    videos: [
                        { title: 'Find Median from Data Stream', url: 'https://www.youtube.com/watch?v=itmhHWaHupI' }
                    ],
                    practice: [
                        { title: 'Find Median from Data Stream', url: 'https://leetcode.com/problems/find-median-from-data-stream/', platform: 'LeetCode' },
                        { title: 'Sliding Window Median', url: 'https://leetcode.com/problems/sliding-window-median/', platform: 'LeetCode' }
                    ]
                }
            }
        ]
    }
];
