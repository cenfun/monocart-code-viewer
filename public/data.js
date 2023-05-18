window.viewerData = {
    'formatted': true,
    'coverage': {
        'totalLines': 58,
        'uncoveredLines': {
            '4': 'uncovered',
            '6': 'uncovered',
            '20': 'partial',
            '21': 'uncovered',
            '22': 'partial',
            '31': 'partial',
            '32': 'uncovered',
            '33': 'uncovered',
            '40': 'partial',
            '41': 'uncovered',
            '42': 'uncovered'
        },
        'uncoveredPieces': {
            '20': [
                {
                    'start': 25,
                    'end': 34
                },
                {
                    'start': 27,
                    'end': 34
                }
            ],
            '22': [
                {
                    'start': 4,
                    'end': 5
                },
                {
                    'start': 4,
                    'end': 5
                }
            ],
            '31': [
                {
                    'start': 18,
                    'end': 19
                }
            ],
            '40': [
                {
                    'start': 11,
                    'end': 12
                }
            ]
        },
        'executionCounts': {
            '0': [
                {
                    'column': 0,
                    'value': 2,
                    'end': 848
                },
                {
                    'column': 0,
                    'value': 668,
                    'end': 24
                }
            ],
            '8': [
                {
                    'column': 0,
                    'value': 2004,
                    'end': 340
                }
            ],
            '10': [
                {
                    'column': 17,
                    'value': 4,
                    'end': 151
                }
            ],
            '13': [
                {
                    'column': 21,
                    'value': 668,
                    'end': 200
                }
            ],
            '16': [
                {
                    'column': 17,
                    'value': 2,
                    'end': 249
                }
            ],
            '25': [
                {
                    'column': 13,
                    'value': 2,
                    'end': 807
                }
            ],
            '35': [
                {
                    'column': 35,
                    'value': 2000,
                    'end': 548
                }
            ],
            '55': [
                {
                    'column': 16,
                    'value': 2,
                    'end': 847
                }
            ]
        }
    },
    'content': "function callback() {\n\n}\n\nfunction other() {\n\n}\n\nfunction method(v) {\n    // console.log(\"method\", v);\n    if (v === 2) {\n        console.log(v);\n    }\n    if (v % 3 === 0) {\n        callback();\n    }\n    if (v === 3) {\n        console.log(v);\n    }\n\n    return v === 'other' ? () => {\n        console.log('never covered');\n    } : other;\n}\n\nconst main = () => {\n    // console.log('main');\n    method(1);\n    method(2);\n\n    const a = 10;\n    if (a === 11) {\n        callback();\n    }\n\n    for (let i = 0; i < 1000; i++) {\n        method(i);\n    }\n\n    const f = false;\n    if (f) {\n        console.log('never covered');\n    }\n\n    const {\n        compress,\n        decompress\n    } = window['lz-utils'];\n\n    const str = '📙 Emoji — 😃 💁👌🎍😍';\n\n    console.assert(str === decompress(compress(str)));\n\n};\n\nwindow.onload = () => {\n    main();\n};"
};
