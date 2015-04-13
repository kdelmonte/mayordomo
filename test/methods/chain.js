var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#chain', function(){
    var domo = mayordomo.new();
    it('should change the chaining object returned on chainable methods', function(){
        var newChain = {};
        domo.chain(newChain);
        var chainableObject = domo.trigger('whatever');
        chainableObject.should.equal(newChain);
    });
});