import {
    RangeSetBuilder, StateEffect, StateField
} from '@codemirror/state';

import {
    gutter, GutterMarker, Decoration, ViewPlugin, WidgetType, EditorView
} from '@codemirror/view';

const createPlugin = (handler, eventHandlers = {}) => {
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
        decorations: (v) => v.decorations,
        eventHandlers
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

    // https://codemirror.net/examples/inverted-effect/

    function mapRange(range, change) {
        const from = change.mapPos(range.from);
        const to = change.mapPos(range.to);
        let undef;
        return from < to ? {
            from, to
        } : undef;
    }

    const addHighlight = StateEffect.define({
        map: mapRange
    });
    const removeHighlight = StateEffect.define({
        map: mapRange
    });

    const highlight = Decoration.mark({
        class: 'cm-highlight-bg'
    });

    function cutRange(ranges, r) {
        const leftover = [];
        ranges.between(r.from, r.to, (from, to, deco) => {
            if (from < r.from) {
                leftover.push(deco.range(from, r.from));
            }
            if (to > r.to) {
                leftover.push(deco.range(r.to, to));
            }
        });
        return ranges.update({
            filterFrom: r.from,
            filterTo: r.to,
            filter: () => false,
            add: leftover
        });
    }

    function addRange(ranges, r) {
        ranges.between(r.from, r.to, (from, to) => {
            if (from < r.from) {
                r = {
                    from, to: r.to
                };
            }
            if (to > r.to) {
                r = {
                    from: r.from, to
                };
            }
        });
        return ranges.update({
            filterFrom: r.from,
            filterTo: r.to,
            filter: () => false,
            add: [highlight.range(r.from, r.to)]
        });
    }

    const highlightedRanges = StateField.define({
        create() {
            return Decoration.none;
        },
        update(ranges, tr) {
            ranges = ranges.map(tr.changes);
            for (const e of tr.effects) {
                if (e.is(addHighlight)) {
                    ranges = addRange(ranges, e.value);
                } else if (e.is(removeHighlight)) {
                    ranges = cutRange(ranges, e.value);
                }
            }
            return ranges;
        },
        provide: (field) => EditorView.decorations.from(field)
    });

    extensions.push(highlightedRanges);

    // =====================================================================

    const counterEventHandler = (e, view, hover) => {
        const target = e.target;
        if (target.className !== 'cm-counter') {
            return;
        }

        const index = target.getAttribute('index');

        const pos = view.posAtDOM(target);
        const line = view.state.doc.lineAt(pos);
        const lineIndex = line.number - 1;
        const list = currentCoverage.executionCounts[lineIndex];
        if (!list) {
            return;
        }

        const item = list[index];
        if (!item) {
            return;
        }

        // console.log(hover, item.end);

        const highlightEffect = hover ? addHighlight : removeHighlight;
        view.dispatch({
            effects: highlightEffect.of({
                from: pos,
                to: item.end
            })
        });
    };

    const createCounter = (count, index) => {
        const counter = new WidgetType();
        counter.toDOM = function() {
            const wrap = document.createElement('span');
            wrap.className = 'cm-counter';
            wrap.setAttribute('index', index);
            wrap.innerHTML = `x${count}`;
            return wrap;
        };
        counter.ignoreEvent = () => {
            return false;
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
                    list.forEach((v, index) => {
                        const offset = line.from + v.column;
                        if (offset >= from && offset <= to) {
                            const deco = Decoration.widget({
                                widget: createCounter(v.value, index),
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
    }, {
        mouseover: (e, view) => {
            counterEventHandler(e, view, true);
        },
        mouseout: (e, view) => {
            counterEventHandler(e, view, false);
        }
    });

    extensions.push(coverageCount);

    // =====================================================================

    const uncoveredBg = Decoration.mark({
        class: 'cm-uncovered-bg'
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
