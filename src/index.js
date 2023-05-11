import { EditorView } from 'codemirror';

import { EditorState, Compartment } from '@codemirror/state';

import {
    keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
    rectangularSelection, crosshairCursor,
    lineNumbers, highlightActiveLineGutter
} from '@codemirror/view';

import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
    foldGutter, foldKeymap
} from '@codemirror/language';

import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';

const readOnlyCompartment = new Compartment();

import { createCoverage } from './coverage.js';

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
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
            ... searchKeymap,
            ... foldKeymap
        ])
    ];

    // =====================================================================

    const readOnly = readOnlyCompartment.of(EditorState.readOnly.of(true));

    const extensions = [
        basicSetup,
        javascript(),
        css(),
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

