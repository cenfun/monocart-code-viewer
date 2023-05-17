
import { RangeSetBuilder } from '@codemirror/state';

import {
    gutter, GutterMarker, Decoration, ViewPlugin, WidgetType
} from '@codemirror/view';

const createPlugin = (handler) => {
    return ViewPlugin.fromClass(class {

        constructor(view) {
            this.decorations = handler(view);
        }

        update(update) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = handler(update.view);
            }
        }
    }, {
        decorations: (v) => v.decorations
    });
};


export const createCoverage = (coverage, extensions) => {

    if (!coverage) {
        return;
    }

    // console.log(coverage);
    // uncoveredLines: {},
    // uncoveredPieces: {},
    // executionCounts: {}

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
            const v = currentCoverage.uncoveredLines[lineIndex];
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

    const createCounter = (count) => {
        const counter = new WidgetType();
        counter.toDOM = function() {
            const wrap = document.createElement('span');
            wrap.className = 'cm-counter';
            wrap.innerHTML = `x${count}`;
            return wrap;
        };
        return counter;
    };

    const coverageCount = createPlugin((view) => {
        const widgets = [];
        for (const { from, to } of view.visibleRanges) {
            // console.log('visibleRanges from/to', from, to);
            for (let pos = from; pos <= to;) {
                const line = view.state.doc.lineAt(pos);
                const lineIndex = line.number - 1;
                // console.log('line index', lineIndex);
                const list = currentCoverage.executionCounts[lineIndex];
                if (list) {
                    list.forEach((v) => {
                        const offset = line.from + v.column;
                        if (offset >= from && offset <= to) {
                            const deco = Decoration.widget({
                                widget: createCounter(v.value),
                                side: 1
                            });
                            widgets.push(deco.range(offset));
                        }
                    });
                }
                pos = line.to + 1;
            }
        }
        // console.log('widgets', widgets);
        return Decoration.set(widgets);
    });

    extensions.push(coverageCount);

    // =====================================================================

    const uncoveredBg = Decoration.mark({
        class: 'cm-bg-uncovered'
    });

    const coverageBg = createPlugin((view) => {
        const builder = new RangeSetBuilder();
        for (const { from, to } of view.visibleRanges) {
            // console.log('visibleRanges from/to', from, to);
            for (let pos = from; pos <= to;) {
                const line = view.state.doc.lineAt(pos);
                const lineIndex = line.number - 1;
                // console.log('line index', lineIndex);
                const list = currentCoverage.uncoveredPieces[lineIndex];
                if (list) {
                    list.forEach((v) => {
                        const s = line.from + v.start;
                        const e = line.from + v.end;
                        if (s >= from && e <= to) {
                            builder.add(s, e, uncoveredBg);
                        }
                    });
                } else if (currentCoverage.uncoveredLines[lineIndex]) {
                    const offset = line.text.search(/\S/g);
                    const start = offset > 0 ? line.from + offset : line.from;
                    builder.add(start, line.to, uncoveredBg);
                }
                pos = line.to + 1;
            }
        }
        return builder.finish();
    });

    extensions.push(coverageBg);

    // =====================================================================

    return {
        update: (newCoverage) => {
            currentCoverage = newCoverage;
        }
    };
};
