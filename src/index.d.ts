export interface CodeViewerReport {
    content: string;
    coverage?: {
        uncoveredLines?: {
            [line: string]: "comment" | "blank" | "partial" | "uncovered"
        };
        uncoveredPieces?: {
            [line: string]: {
                start: number;
                end: number
            }[]
        };
        decorations?: {
            [line: string]: {
                column: number;
                value: string;
                attrs?: {
                    [key: string]: string
                }
            }[]
        };
        executionCounts?: {
            [line: string]: {
                column: number;
                count: number;
                value: string;
                end: number;
            }[]
        }
    }
}

export interface CodeViewer {
    on: (eventType: string, handler: (e: any) => any) => void;
    update: (newReport: CodeViewerReport) => void;
    setSelection: (start: number, end: number, options: any) => void;
    setCursor: (pos: number, options: any) => void;
    /** EditorView https://codemirror.net/docs/ref/ */
    viewer: any;
}

export function createCodeViewer(container: Element | DocumentFragment, report: CodeViewerReport): CodeViewer;

export default createCodeViewer;