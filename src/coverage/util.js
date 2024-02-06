
import { ViewPlugin } from '@codemirror/view';

import { StateEffect } from '@codemirror/state';

export const createPlugin = (handler, eventHandlers = {}) => {
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


function mapRange(range, change) {
    const from = change.mapPos(range.from);
    const to = change.mapPos(range.to);
    let undef;
    return from < to ? {
        from, to
    } : undef;
}

export const addHighlight = StateEffect.define({
    map: mapRange
});
export const removeHighlight = StateEffect.define({
    map: mapRange
});
