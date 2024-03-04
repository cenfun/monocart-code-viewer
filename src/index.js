import { EditorView } from 'codemirror';

import {
    EditorState, Compartment, EditorSelection
} from '@codemirror/state';

import {
    keymap, highlightSpecialChars, drawSelection, dropCursor,
    rectangularSelection, crosshairCursor,
    lineNumbers, highlightActiveLineGutter
} from '@codemirror/view';

import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
    foldGutter, foldKeymap, LRLanguage, LanguageSupport
} from '@codemirror/language';

import { searchKeymap } from '@codemirror/search';

import { xcodeLight } from '@uiw/codemirror-theme-xcode';

import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';

import { parser as htmlParser } from '@lezer/html';
import { parser as jsParser } from '@lezer/javascript';
import { parser as cssParser } from '@lezer/css';
import { parseMixed } from '@lezer/common';

import { createCoverage } from './coverage/coverage.js';

import './style.scss';

export const createCodeViewer = (container, report) => {

    container.classList.add('mcv-container');

    // https://github.com/codemirror/basic-setup/
    const basicSetup = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),

        foldGutter({
            // custom fold icon
            markerDOM: function(open) {
                const div = document.createElement('div');
                div.className = open ? 'cm-fold cm-fold-open' : 'cm-fold cm-fold-close';
                return div;
            }
        }),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, {
            fallback: true
        }),
        bracketMatching(),

        rectangularSelection(),
        crosshairCursor(),

        keymap.of([
            ... searchKeymap,
            ... foldKeymap
        ])
    ];

    // =====================================================================

    const isTouchDevice = function() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };

    // readOnly facet, on the state, which controls whether the content is supposed to be read-only (and is respected by commands and such).
    // editable facet, which only controls whether the DOM for the content is focusable/editable.
    const readOnlyCompartment = new Compartment();
    let readOnly = readOnlyCompartment.of(EditorState.readOnly.of(true));
    if (isTouchDevice()) {
        // do not popup keyboard in mobile
        readOnly = EditorView.editable.of(false);
    }

    const mixedHTMLParser = htmlParser.configure({
        wrap: parseMixed((node) => {
            if (node.name === 'StyleText') {
                return {
                    parser: cssParser
                };
            }

            if (node.name === 'ScriptText') {
                return {
                    parser: jsParser
                };
            }

            return null;
        })
    });

    const mixedHTML = LRLanguage.define({
        parser: mixedHTMLParser
    });

    const mixed = () => {
        return new LanguageSupport(mixedHTML);
    };


    // simple event handlers
    const handlers = {
        cursor: (loc) => {}
    };

    let previousHead;
    let previousRange = {};
    const onCursorChange = EditorView.updateListener.of((v) => {
        if (!v.selectionSet) {
            return;
        }
        const state = v.state;

        // for the head of the main selection range
        const {
            main, mainIndex, ranges
        } = state.selection;

        const range = ranges.find((it, i) => i !== mainIndex);

        const head = main.head;
        if (head === previousHead) {
            // only main, just check head
            if (!range) {
                return;
            }

            // multiple ranges, checking range start and end
            if (range.from === previousRange.from && range.to === previousRange.to) {
                return;
            }

        }
        previousHead = head;
        previousRange = range || {};

        const line = state.doc.lineAt(head);

        const loc = {
            line: line.number,
            column: head - line.from,
            position: head
        };

        if (range) {
            loc.start = range.from;
            loc.end = range.to;
        }

        handlers.cursor(loc);

    });

    const extensions = [
        basicSetup,
        xcodeLight,
        javascript(),
        css(),
        html(),
        mixed(),
        onCursorChange,
        readOnly
    ];

    const coverageExtension = createCoverage(report.coverage, extensions);

    const viewer = new EditorView({
        parent: container,
        doc: report.content,
        extensions
    });

    return {
        viewer,
        on: (type, handler) => {
            if (type && typeof handler === 'function') {
                handlers[type] = handler;
            }
        },
        setSelection: (start, end, options) => {
            viewer.focus();
            viewer.dispatch({
                effects: EditorView.scrollIntoView(start, {
                    x: 'center',
                    y: 'start',
                    xMargin: 5,
                    yMargin: 5,
                    ... options
                }),
                selection: EditorSelection.create([
                    EditorSelection.cursor(start),
                    EditorSelection.range(start, end)
                ])
            });
        },
        setCursor: (pos, options) => {
            viewer.focus();
            viewer.dispatch({
                effects: EditorView.scrollIntoView(pos, {
                    x: 'center',
                    y: 'start',
                    xMargin: 5,
                    yMargin: 5,
                    ... options
                }),
                selection: EditorSelection.create([
                    EditorSelection.cursor(pos)
                ])
            });
        },
        update: (newReport) => {

            if (coverageExtension) {
                coverageExtension.update(newReport.coverage);
            }

            const text = viewer.state.doc.toString();
            const transaction = viewer.state.update({
                changes: {
                    from: 0,
                    to: text.length,
                    insert: newReport.content
                }
            });
            viewer.dispatch(transaction);
            viewer.scrollDOM.scrollTo(0, 0);
        }
    };

};

export default createCodeViewer;

export const TAG = {
    VERSION: window.VERSION,
    TIMESTAMP: window.TIMESTAMP
};
