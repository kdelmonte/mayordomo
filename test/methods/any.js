var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#any', function(){
    var domo = mayordomo.new();
    var eventName = 'myEvent';
    it('should return true since the event has handlers', function(){
        domo.on(eventName, function(){});
        domo.any(eventName).should.be.exactly(true);
    });
    it('should return false since we removed all handlers', function(){
        domo.off();
        domo.any(eventName).should.be.exactly(false);
    });
});