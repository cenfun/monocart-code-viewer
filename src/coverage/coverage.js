
import state from './state.js';
import coverageLine from './line.js';
import highlightRange from './highlight.js';
import coverageCounter from './counter.js';
import coverageDecoration from './decoration.js';
import coverageBg from './bg.js';

export const createCoverage = (coverage, extensions) => {

    // no coverage extension API {update()}
    if (!coverage) {
        return;
    }

    Object.assign(state, coverage);
    extensions.push(coverageLine);
    extensions.push(highlightRange);
    extensions.push(coverageCounter);
    extensions.push(coverageDecoration);
    extensions.push(coverageBg);

    return {
        update: (newCoverage) => {
            if (!newCoverage) {
                console.log('Invalid coverage data');
                return;
            }
            Object.assign(state, newCoverage);
        }
    };
};
