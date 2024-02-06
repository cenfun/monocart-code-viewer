import { Decoration, WidgetType } from '@codemirror/view';

import { createPlugin } from './util.js';

import state from './state.js';

const createDecoration = (item) => {
    const counter = new WidgetType();
    counter.toDOM = function() {
        const {
            value, className, attrs
        } = item;
        const wrap = document.createElement('span');
        wrap.innerHTML = value;
        const cls = ['cm-decoration'];
        if (className) {
            cls.push(className);
        }
        wrap.className = cls.join(' ');
        if (attrs) {
            Object.keys(attrs).forEach((key) => {
                wrap.setAttribute(key, attrs[key]);
            });
        }
        return wrap;
    };
    counter.ignoreEvent = () => {
        return false;
    };
    return counter;
};


const coverageDecoration = createPlugin((view) => {
    const widgets = [];
    for (const { from, to } of view.visibleRanges) {
        // console.log('visibleRanges from/to', from, to);
        for (let pos = from; pos <= to;) {
            const line = view.state.doc.lineAt(pos);
            const lineIndex = line.number - 1;
            // console.log('line index', lineIndex);
            const list = state.coverage.decorations[lineIndex];
            if (list) {
                list.forEach((v, index) => {
                    const offset = line.from + v.column;
                    if (offset >= from && offset <= to) {
                        const deco = Decoration.widget({
                            widget: createDecoration(v),
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

export default coverageDecoration;
