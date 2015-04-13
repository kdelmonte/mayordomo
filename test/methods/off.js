var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#off', function(){
    var eventName = 'myEvent';
    var event2Name = 'myEvent2';
    var concatName = [eventName,event2Name].join(' ');
    it('should remove event handlers from all events',function(){
        var domo = mayordomo.new();
        domo.on([eventName, event2Name],function(){});
        domo.off();
        domo.any(eventName).should.be.exactly(false);
        domo.any(event2Name).should.be.exactly(false);
    });
    describe('With full event handler object that has a single event name',function(){
        it('should remove event handlers from all events passed',function(){
            var domo = mayordomo.new();
            domo.on({
                name: eventName,
                handler: function(){}
            });
            domo.off({
                name: eventName
            });
            domo.any(eventName).should.be.exactly(false);
        });
    });
    describe('With full event handler object that has multiple event names',function(){
        it('should remove event handlers from all events passed',function(){
            var domo = mayordomo.new();
            domo.on({
                name: concatName,
                handler: function(){}
            });
            domo.off({
                name: concatName
            });
            domo.any(eventName).should.be.exactly(false);
            domo.any(event2Name).should.be.exactly(false);
        });
    });
    describe('With an array of full event handler objects',function(){
        it('should remove event handlers from all events passed',function(){
            var domo = mayordomo.new();
            domo.on([{
                name: eventName,
                handler: function(){}
            },{
                name: event2Name,
                handler: function(){}
            }]);
            domo.off([{
                name: eventName
            },{
                name: event2Name
            }]);
            domo.any(eventName).should.be.exactly(false);
            domo.any(event2Name).should.be.exactly(false);
        });
    });
    describe('With event names passed in a space delimited string',function(){
        it('should remove event handlers from all events passed',function(){
            var domo = mayordomo.new();
            domo.on(concatName,function(){});
            domo.off(concatName);
            domo.any(eventName).should.be.exactly(false);
            domo.any(event2Name).should.be.exactly(false);
        });
    });
    describe('With event names passed in an array',function(){
        it('should remove event handlers from all events passed',function(){
            var domo = mayordomo.new();
            domo.on([eventName, event2Name],function(){});
            domo.off([eventName, event2Name]);
            domo.any(eventName).should.be.exactly(false);
            domo.any(event2Name).should.be.exactly(false);
        });
    });
});