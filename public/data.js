window.viewerData = {
    'coverage': {
        'uncoveredLines': {
            '0': 'comment', '1': 'blank', '7': 'blank', '8': 'partial', '9': 'uncovered', '10': 'uncovered', '11': 'uncovered', '12': 'uncovered', '13': 'blank', '14': 'uncovered', '15': 'comment', '16': 'uncovered', '17': 'uncovered', '18': 'partial', '19': 'blank', '29': 'blank', '31': 'comment', '34': 'blank', '43': 'blank', '45': 'comment', '49': 'partial', '50': 'uncovered', '51': 'uncovered', '53': 'blank', '55': 'blank', '66': 'blank', '68': 'blank', '74': 'blank', '75': 'uncovered', '76': 'uncovered', '77': 'uncovered', '78': 'comment', '79': 'uncovered', '80': 'uncovered', '81': 'blank', '83': 'blank', '86': 'blank', '87': 'partial', '88': 'comment', '89': 'uncovered', '90': 'uncovered', '91': 'blank', '97': 'blank', '99': 'blank', '103': 'blank'
        },
        'uncoveredPieces': {
            '8': [{
                'start': 27, 'end': 34
            }],
            '18': [{
                'start': 0, 'end': 1
            }],
            '49': [{
                'start': 28, 'end': 29
            }],
            '87': [{
                'start': 11, 'end': 12
            }]
        },
        'executionCounts': {
            '20': [{
                'column': 21, 'value': 2, 'end': 938
            }],
            '22': [{
                'column': 18, 'value': 10, 'end': 699
            }],
            '23': [{
                'column': 19, 'value': 6, 'end': 669
            }],
            '26': [{
                'column': 9, 'value': 4, 'end': 694
            }],
            '35': [{
                'column': 29, 'value': 8, 'end': 936
            }],
            '36': [{
                'column': 22, 'value': 2, 'end': 903
            }],
            '39': [{
                'column': 9, 'value': 6, 'end': 936
            }],
            '44': [{
                'column': 0, 'value': 2, 'end': 1374
            }],
            '46': [{
                'column': 39, 'value': 10, 'end': 1175
            }],
            '47': [{
                'column': 19, 'value': 4, 'end': 1106
            }],
            '49': [{
                'column': 9, 'value': 6, 'end': 1169
            }],
            '58': [{
                'column': 18, 'value': 10, 'end': 1371
            }],
            '59': [{
                'column': 19, 'value': 6, 'end': 1307
            }],
            '61': [{
                'column': 9, 'value': 4, 'end': 1352
            }]
        },
        'decorations': {
            '17': [{
                'column': 5,
                'value': 'E',
                'className': 'mcr-uncovered-else',
                'attrs': {
                    'title': 'uncovered else path'
                }
            }],
            '33': [{
                'column': 5,
                'value': 'E',
                'className': 'mcr-uncovered-else',
                'attrs': {
                    'title': 'uncovered else path'
                }
            }],
            '79': [{
                'column': 5,
                'value': 'E',
                'className': 'mcr-uncovered-else',
                'attrs': {
                    'title': 'uncovered else path'
                }
            }]
        },
        'linesSummary': {
            'covered': 59, 'uncovered': 20, 'total': 79, 'pct': 74.68, 'status': 'medium', 'blank': 19, 'comment': 6, 'skip': 0
        }
    },
    'content': "/* branches test cases */\n\nconst AssignmentPattern = require('./assignment.js');\nconst ConditionalExpression = require('./conditional.js');\nconst IfStatement = require('./if.js');\nconst LogicalExpression = require('./logical.js');\nconst SwitchStatement = require('./switch.js');\n\nconst uncoveredFunction = (a) => {\n    const list = [1, 2, 3, 4, 5];\n    list.forEach((v) => {\n        console.log(v);\n    });\n\n    if (a) {\n        // both if and else path are uncovered\n        console.log(a);\n    }\n};\n\nconst listForEach = (a) => {\n    const list = [1, 2, 3, 4, 5];\n    list.forEach((v) => {\n        if (v > 2) {\n            console.log(v);\n            return;\n        }\n        console.log(v);\n    });\n\n    if (!a) {\n        // else path should be uncovered\n        console.log(a);\n    }\n\n    for (const item of list) {\n        if (item > 3) {\n            console.log(item);\n            break;\n        }\n        console.log(item);\n    }\n};\n\nfunction coveredFunction() {\n    // branches in a block statement\n    for (let i = 0, j = 1; i < 5; i++) {\n        if (i > 2) {\n            console.log(i);\n        } else if (i > 100) {\n            uncoveredFunction();\n        }\n    }\n\n    listForEach();\n\n    const l = 5;\n    let i = 0;\n    while (i < l) {\n        if (i < 3) {\n            console.log(i);\n        } else {\n            console.log(i);\n        }\n        i++;\n    }\n\n}\n\nclass MyCLass {\n    static propTypes = 1;\n    #privateField = 42;\n    static #privateKey = 2;\n}\n\nfunction functionNeverMind(a) {\n    if (a) {\n        console.log(a);\n        // not covered\n    }\n}\n\nconst branch = (a) => {\n\n    coveredFunction();\n    coveredFunction();\n\n    if (a) {\n        // else path should be covered\n        functionNeverMind(a);\n    }\n\n    AssignmentPattern();\n    ConditionalExpression();\n    IfStatement();\n    LogicalExpression();\n    SwitchStatement();\n\n};\n\nmodule.exports = {\n    branch\n};\n"
};
