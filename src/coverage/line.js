import { gutter, GutterMarker } from '@codemirror/view';

import state from './state.js';

const coveredMarker = new GutterMarker();
coveredMarker.elementClass = 'cm-line-covered';
const partialMarker = new GutterMarker();
partialMarker.elementClass = 'cm-line-partial';
const uncoveredMarker = new GutterMarker();
uncoveredMarker.elementClass = 'cm-line-uncovered';

const coverageLine = gutter({
    class: 'cm-coverage-line',
    lineMarker(view, blockInfo) {
        if (blockInfo.length === 0) {
            return null;
        }

        const line = view.state.doc.lineAt(blockInfo.from);
        const lineNumber = line.number;
        const lineIndex = lineNumber - 1;
        // console.log('lineIndex', lineIndex);

        const uncoveredLines = state.uncoveredLines || {};
        const v = uncoveredLines[lineIndex];
        if (v) {
            if (v === 'partial') {
                return partialMarker;
            }
            if (v === 'uncovered') {
                return uncoveredMarker;
            }
            return null;
        }
        return coveredMarker;
    }
});


export default coverageLine;
