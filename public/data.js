window.viewerData = {
    'coverage': {
        'line': {
            '23': 'partial',
            '24': 'uncovered',
            '25': 'uncovered',
            '33': 'partial',
            '34': 'uncovered'
        },
        'bg': {
            '23': {
                'start': 22,
                'end': 23
            },
            '33': {
                'start': 15,
                'end': 16
            }
        },
        'count': {
            '2': {
                'value': 334,
                'column': 19
            },
            '5': {
                'value': 1002,
                'column': 17
            },
            '7': {
                'value': 2,
                'column': 21
            },
            '10': {
                'value': 334,
                'column': 25
            },
            '27': {
                'value': 1000,
                'column': 39
            }
        }
    },
    'content': 'window.onload = ()=>{\n\n    var callback = ()=>{\n    }\n\n    var mothod = (v)=>{\n        //console.log("mothod", v);\n        if (v === 2) {\n            console.log("2");\n        }\n        if (v % 3 === 0) {\n            callback();\n        }\n        if (v === 3) {\n            console.log(3);\n        }\n    }\n    var main = ()=>{\n        console.log("main");\n        mothod(1);\n        mothod(2);\n\n        var a = 10;\n        if (a === 11) {\n            callback();\n        }\n\n        for (var i = 0; i < 1000; i++) {\n            mothod(i);\n        }\n\n    }\n\n    if (false) {\n    }\n\n    main();\n\n}\n'
};
