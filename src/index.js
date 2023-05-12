import { EditorView } from 'codemirror';

import { EditorState, Compartment } from '@codemirror/state';

import {
    keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
    rectangularSelection, crosshairCursor,
    lineNumbers, highlightActiveLineGutter
} from '@codemirror/view';

import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
    foldGutter, foldKeymap, LRLanguage, LanguageSupport
} from '@codemirror/language';

import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

import { xcodeLight } from '@uiw/codemirror-theme-xcode';

import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';

import { parser as htmlParser } from '@lezer/html';
import { parser as jsParser } from '@lezer/javascript';
import { parser as cssParser } from '@lezer/css';
import { parseMixed } from '@lezer/common';

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

    const extensions = [
        basicSetup,
        xcodeLight,
        javascript(),
        css(),
        html(),
        mixed(),
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

