
import state from './state.js';
import coverageLine from './line.js';
import highlightRange from './highlight.js';
import coverageCounter from './counter.js';
import coverageDecoration from './decoration.js';
import coverageBg from './bg.js';

export const createCoverage = (coverage, extensions) => {

    if (!coverage) {
        return;
    }

    state.coverage = coverage;

    extensions.push(coverageLine);
    extensions.push(highlightRange);
    extensions.push(coverageCounter);
    extensions.push(coverageDecoration);
    extensions.push(coverageBg);

    return {
        update: (newCoverage) => {
            if (!newCoverage) {
                return;
            }

            state.coverage = newCoverage;
        }
    };
};
