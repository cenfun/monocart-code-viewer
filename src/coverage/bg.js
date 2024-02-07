import { RangeSetBuilder } from '@codemirror/state';

import { Decoration } from '@codemirror/view';

import { createPlugin } from './util.js';

import state from './state.js';

const uncoveredBg = Decoration.mark({
    class: 'cm-uncovered-bg'
});

const coverageBg = createPlugin((view) => {
    const builder = new RangeSetBuilder();

    const checkLine = (line, from, to) => {

        const lineIndex = line.number - 1;
        // console.log('line', line, from, to);

        const uncoveredPieces = state.uncoveredPieces || {};
        const lineRanges = uncoveredPieces[lineIndex];
        if (lineRanges) {
            // a line have multiple ranges
            lineRanges.forEach((range) => {
                // large range
                // range {start: 4798, end: 194624}
                let s = line.from + range.start;
                let e = line.from + range.end;
                if (s > to || e < from) {
                    return;
                }

                s = Math.max(s, from);
                e = Math.min(e, to);

                builder.add(s, e, uncoveredBg);

            });
            return;
        }

        const uncoveredLines = state.uncoveredLines || {};
        const uncoveredType = uncoveredLines[lineIndex];
        if (uncoveredType === 'uncovered') {
            const offset = line.text.search(/\S/g);
            const start = offset > 0 ? line.from + offset : line.from;
            builder.add(start, line.to, uncoveredBg);
        }

    };


    for (const { from, to } of view.visibleRanges) {
        // console.log('visibleRanges from/to', from, to);
        for (let pos = from; pos <= to;) {
            const line = view.state.doc.lineAt(pos);
            checkLine(line, from, to);
            pos = line.to + 1;
        }
    }
    return builder.finish();
});


export default coverageBg;
