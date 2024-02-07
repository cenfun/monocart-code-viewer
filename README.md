# monocart-code-viewer

Code Viewer with Coverage View base on [CodeMirror](https://codemirror.net/)

```js
import { createCodeViewer } from 'monocart-code-viewer';

let codeViewer;

const report = {
    content: "",
    coverage: {
        uncoveredLines: {},
        uncoveredPieces: {},
        executionCounts: {},
        decorations: {}
    }
};

if (codeViewer) {
    codeViewer.update(report);
} else {
    codeViewer = createCodeViewer($el, report);
}
```
