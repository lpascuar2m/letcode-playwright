export const pageEntriesScenario = [
        { scenario: '5 entries', entries: 5, expected: 5 },
        { scenario: '10 entries', entries: 10, expected: 10 },
        { scenario: '25 entries', entries: 25, expected: 25 }
    ];

export const paginationScenario = [
        {scenario: "Next", entries: 5, expectedPageNumber: 10},
        {scenario: "Next", entries: 10, expectedPageNumber: 5},
        {scenario: "Next", entries: 25, expectedPageNumber: 2},
    ];

export const sortingScenario = [
        {scenario: "Sorting", index: 0, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 1, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 2, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 3, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 4, expected: "Sorted in ascending order"},
        {scenario: "Sorting", index: 5, expected: "Sorted in ascending order"}
    ];