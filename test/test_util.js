var util = require("../lib/util");
var assert = require('chai').assert;

describe('UTIL', ()=> {
    describe("#purify_title()", () => {
        var title = "'Apple'Red'Watch";
        it(`purify [${title}]`, () => {
            assert.equal("&#x27;Apple&#x27;Red&#x27;Watch", util.purify_title(title));
        });

    })
});
