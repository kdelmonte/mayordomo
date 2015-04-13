var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#on', function(){
    var eventName = 'myEvent';
    var event2Name = 'myEvent2';
    var concatName = [eventName,event2Name].join(' ');
    describe('With full event handler object that has a single event name',function(){
        it('should subscribe to all events passed',function(done){
            var domo = mayordomo.new();
            domo.on({
                name: eventName,
                handler: function(){
                    done();
                }
            });
            domo.trigger(eventName);
        });
    });
    describe('With full event handler object that has multiple event names',function(){
        it('should subscribe to all events passed',function(done){
            var domo = mayordomo.new();
            var executeCounter = 0;
            domo.on({
                name: concatName,
                handler: function(){
                    executeCounter++;
                    if(executeCounter === 2){
                        done();
                    }
                }
            });
            domo.trigger(concatName);
        });
    });
    describe('With an array of full event handler objects',function(){
        it('should subscribe to all events passed',function(done){
            var domo = mayordomo.new();
            var executeCounter = 0;
            domo.on([{
                name: eventName,
                handler: function(){
                    executeCounter++;
                }
            },{
                name: event2Name,
                handler: function(){
                    executeCounter++;
                    if(executeCounter === 2){
                        done();
                    }
                }
            }]);
            domo.trigger([eventName, event2Name]);
        });
    });
    describe('With event names passed in a space delimited string',function(){
        it('should subscribe to all events passed',function(done){
            var domo = mayordomo.new();
            var executeCounter = 0;
            domo.on(concatName,function(){
                executeCounter++;
                if(executeCounter === 2){
                    done();
                }
            });
            domo.trigger(concatName);
        });
    });
    describe('With event names passed in an array',function(){
        it('should subscribe to all events passed',function(done){
            var domo = mayordomo.new();
            var executeCounter = 0;
            domo.on([eventName, event2Name],function(){
                executeCounter++;
                if(executeCounter === 2){
                    done();
                }
            });
            domo.trigger([eventName, event2Name]);
        });
    });
});