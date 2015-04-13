var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#new', function(){
    it('should create a new instance of mayordomo', function(){
        var domo = mayordomo.new();
        domo.should.have.property('on');
        domo.should.not.equal(mayordomo);
    });
});