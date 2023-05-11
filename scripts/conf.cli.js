// starfall-cli config
// https://github.com/cenfun/starfall-cli

// const fs = require('fs');
// const path = require('path');

module.exports = {

    build: {

        vendors: ['monocart-code-viewer'],

        before: (item, Util) => {
            // console.log('before build');

            if (item.production) {
                item.devtool = false;
            }

            return 0;
        },

        after: (item, Util) => {
            // console.log('after build');
            return 0;
        }


        // afterAll: (option, Util) => {
        //     console.log('after build all');
        //     return 0;
        // }
    }

};
