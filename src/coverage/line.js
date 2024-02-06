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
    lineMarker(view, line) {
        if (line.length === 0) {
            return null;
        }
        const lineIndex = Math.round(line.top / line.height);
        // console.log('lineIndex', lineIndex);
        const v = state.coverage.uncoveredLines[lineIndex];
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
