window.viewerData = {
    'coverage': {
        'totalLines': 57,
        'uncoveredLines': {
            '3': 'uncovered',
            '4': 'uncovered',
            '18': 'partial',
            '19': 'uncovered',
            '20': 'uncovered',
            '30': 'partial',
            '31': 'uncovered',
            '32': 'uncovered',
            '39': 'partial',
            '40': 'uncovered',
            '41': 'uncovered'
        },
        'uncoveredPieces': {
            '18': [
                {
                    'start': 25,
                    'end': 32
                },
                {
                    'start': 27,
                    'end': 32
                }
            ],
            '30': [
                {
                    'start': 18,
                    'end': 19
                }
            ],
            '39': [
                {
                    'start': 11,
                    'end': 12
                }
            ]
        },
        'executionCounts': {
            '0': [
                {
                    'value': 334,
                    'column': 0
                }
            ],
            '6': [
                {
                    'value': 1002,
                    'column': 0
                }
            ],
            '8': [
                {
                    'value': 2,
                    'column': 17
                }
            ],
            '11': [
                {
                    'value': 334,
                    'column': 21
                }
            ],
            '34': [
                {
                    'value': 1000,
                    'column': 35
                }
            ]
        }
    },
    'content': "function callback() {\n}\n\nfunction other() {\n}\n\nfunction method(v) {\n    // console.log(\"method\", v);\n    if (v === 2) {\n        console.log(v);\n    }\n    if (v % 3 === 0) {\n        callback();\n    }\n    if (v === 3) {\n        console.log(v);\n    }\n\n    return v === 'other' ? ()=>{\n        console.log('never covered');\n    }\n    : other;\n}\n\nconst main = ()=>{\n    // console.log('main');\n    method(1);\n    method(2);\n\n    const a = 10;\n    if (a === 11) {\n        callback();\n    }\n\n    for (let i = 0; i < 1000; i++) {\n        method(i);\n    }\n\n    const f = false;\n    if (f) {\n        console.log('never covered');\n    }\n\n    const {compress, decompress} = window['lz-utils'];\n\n    const str = '📙 Emoji — 😃 💁👌🎍😍';\n\n    console.assert(str === decompress(compress(str)));\n\n}\n;\n\nwindow.onload = ()=>{\n    main();\n}\n;\n"
};
