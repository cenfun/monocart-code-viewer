import { Decoration, WidgetType } from '@codemirror/view';

import {
    createPlugin, addHighlight, removeHighlight
} from './util.js';

import state from './state.js';

const counterEventHandler = (e, view, hover) => {
    const target = e.target;
    if (target.className !== 'cm-counter') {
        return;
    }

    const index = target.getAttribute('index');
    const executionCounts = state.executionCounts || {};
    const pos = view.posAtDOM(target);
    const line = view.state.doc.lineAt(pos);
    const lineIndex = line.number - 1;
    const list = executionCounts[lineIndex];
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


const coverageCounter = createPlugin((view) => {
    const widgets = [];

    const executionCounts = state.executionCounts || {};
    for (const { from, to } of view.visibleRanges) {
        // console.log('visibleRanges from/to', from, to);
        for (let pos = from; pos <= to;) {
            const line = view.state.doc.lineAt(pos);
            const lineIndex = line.number - 1;
            // console.log('line index', lineIndex);
            const list = executionCounts[lineIndex];
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

export default coverageCounter;
