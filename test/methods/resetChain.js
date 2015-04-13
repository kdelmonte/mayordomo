var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#resetChain', function(){
    var domo = mayordomo.new();
    it('should reset the chaining object returned back to the mayordomo instance', function(){
        domo.resetChain();
        var chainableObject = domo.trigger('whatever');
        chainableObject.should.equal(domo);
    });
});