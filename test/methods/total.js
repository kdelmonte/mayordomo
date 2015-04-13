var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#total', function(){
    var domo = mayordomo.new();
    var eventName = 'myEvent';
    it('should return the number 2 which is the total amount of handlers', function(){
        domo.on(eventName, function(){});
        domo.on(eventName, function(){});
        domo.total(eventName).should.equal(2);
    });
    it('should return 0 since we removed all handlers', function(){
        domo.off();
        domo.total(eventName).should.equal(0);
    });
});