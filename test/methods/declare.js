var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#declare', function(){
    var eventName = 'myEvent';
    var event2Name = 'myEvent2';
    describe('With string',function(){
        var concatName = [eventName,event2Name].join(' ');
        it('should create a new event in the store without a shortcut',function(){
            var domo = mayordomo.new();
            domo.declare(concatName);
            domo.should.not.have.property(eventName);
            domo.should.not.have.property(event2Name);
        });
        it('should create a new event in the store with a shortcut',function(){
            var domo = mayordomo.new();
            domo.declare(concatName, true);
            domo.should.have.property(eventName);
            domo.should.have.property(event2Name);
        });
        it('should create a new event in the store with a shortcut via string declaration',function(){
            var domo = mayordomo.new();
            domo.declare('onMyEvent:' + eventName + ' ' + 'onMyEvent2:' + event2Name);
            domo.should.have.property(eventName);
        });
    });
    describe('With array of event names',function(){
        it('should create a new event in the store without a shortcut',function(){
            var domo = mayordomo.new();
            domo.declare([eventName,event2Name]);
            domo.should.not.have.property(eventName);
            domo.should.not.have.property(event2Name);
        });
        it('should create a new event in the store with a shortcut',function(){
            var domo = mayordomo.new();
            domo.declare([eventName, event2Name], true);
            domo.should.have.property(eventName);
            domo.should.have.property(event2Name);
        });
        it('should create a new event in the store with a shortcut via string declaration',function(){
            var domo = mayordomo.new();
            domo.declare(['onMyEvent:' + eventName, 'onMyEvent2:' + event2Name]);
            domo.should.have.property(eventName);
            domo.should.have.property(event2Name);
        });
    });

});