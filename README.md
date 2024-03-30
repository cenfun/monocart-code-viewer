# monocart-code-viewer
[![](https://img.shields.io/npm/v/monocart-code-viewer)](https://www.npmjs.com/package/monocart-code-viewer)
[![](https://badgen.net/npm/dw/monocart-code-viewer)](https://www.npmjs.com/package/monocart-code-viewer)
![](https://img.shields.io/librariesio/github/cenfun/monocart-code-viewer)
![](https://img.shields.io/github/license/cenfun/monocart-code-viewer)

## Feature
- Base on [CodeMirror](https://codemirror.net/)
- Coverage View

## Install
```sh
npm i monocart-code-viewer
```

## Usage
```js
import { createCodeViewer } from 'monocart-code-viewer';

let codeViewer;

const report = {
    content: "your source content",
    coverage: {
        uncoveredLines: {
            '0': 'comment',
            '1': 'blank',
            '8': 'partial',
            '9': 'uncovered'
        },
        uncoveredPieces: {
            '8': [
                {
                    'start': 27,
                    'end': 34
                }
            ]
        },
        decorations: {
            '14': [
                {
                    'column': 4,
                    'value': 'E',
                    'attrs': {
                        'title': 'else path uncovered'
                    }
                }
            ]
        },
        executionCounts: {
            '20': [
                {
                    'column': 22,
                    'count': 10,
                    'value': '10',
                    'end': 916
                }
            ]
        }
    }
};

if (codeViewer) {
    codeViewer.update(report);
} else {
    codeViewer = createCodeViewer($el, report);
    codeViewer.on('cursor', (loc) => {
        // console.log('cursor', loc);
    });

    // codeViewer.setSelection(start, end, options);
    // codeViewer.setCursor(pos, options);
}
```
