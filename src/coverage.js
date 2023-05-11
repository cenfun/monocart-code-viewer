
import { RangeSetBuilder } from '@codemirror/state';

import {
    gutter, GutterMarker, Decoration, ViewPlugin
} from '@codemirror/view';


export const createCoverage = (coverage, extensions) => {

    if (!coverage) {
        return;
    }

    // console.log(coverage);
    // line
    // count
    // bg

    let currentCoverage = coverage;

    // =====================================================================

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
            const v = currentCoverage.line[lineIndex];
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

    extensions.push(coverageLine);


    // =====================================================================

    const createCountMaker = (count) => {
        const countMarker = new GutterMarker();
        countMarker.elementClass = 'cm-line-count';
        countMarker.count = count.value;
        countMarker.toDOM = function() {
            return document.createTextNode(`${this.count}x`);
        };
        return countMarker;
    };

    const coverageCount = gutter({
        class: 'cm-coverage-count',
        lineMarker(view, line) {
            if (line.length === 0 || !currentCoverage.count) {
                return null;
            }
            const lineIndex = Math.round(line.top / line.height);
            // console.log('lineIndex', lineIndex);
            const v = currentCoverage.count[lineIndex];
            if (!v) {
                return null;
            }
            return createCountMaker(v);
        }
    });

    extensions.push(coverageCount);


    // =====================================================================

    const uncoveredBg = Decoration.mark({
        class: 'cm-bg-uncovered'
    });

    const getCoverageBg = (view) => {
        const builder = new RangeSetBuilder();
        for (const { from, to } of view.visibleRanges) {
            for (let pos = from; pos <= to;) {
                const line = view.state.doc.lineAt(pos);
                const lineIndex = line.number - 1;
                const v = currentCoverage.bg[lineIndex];
                if (v) {
                    builder.add(line.from + v.start, line.from + v.end, uncoveredBg);
                } else if (currentCoverage.line[lineIndex]) {
                    builder.add(line.from, line.to, uncoveredBg);
                }
                pos = line.to + 1;
            }
        }
        return builder.finish();
    };

    const coverageBg = ViewPlugin.fromClass(class {

        constructor(view) {
            this.decorations = getCoverageBg(view);
        }

        update(update) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = getCoverageBg(update.view);
            }
        }
    }, {
        decorations: (v) => v.decorations
    });

    extensions.push(coverageBg);

    // =====================================================================

    return {
        update: (newCoverage) => {
            currentCoverage = newCoverage;
        }
    };
};
