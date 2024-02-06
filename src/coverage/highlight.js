import { StateField } from '@codemirror/state';

import { Decoration, EditorView } from '@codemirror/view';

import { addHighlight, removeHighlight } from './util.js';

// https://codemirror.net/examples/inverted-effect/

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

const highlightRange = StateField.define({
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

export default highlightRange;
