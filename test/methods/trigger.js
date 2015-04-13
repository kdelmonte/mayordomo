var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#trigger', function(){
    var eventName = 'myEvent';
    var event2Name = 'myEvent2';
    it('should forward the extraArguments',function(done){
        var domo = mayordomo.new();
        var myObj = {};
        var myArray = [];
        var myNumber = 5;
        domo.on(eventName,function(event, obj, arr, num){
            obj.should.be.exactly(myObj);
            arr.should.be.exactly(myArray);
            num.should.be.exactly(myNumber);
            done();
        });
        domo.trigger(eventName,[myObj, myArray, myNumber]);
    });
    it('should use the custom context',function(done){
        var domo = mayordomo.new();
        var myContext = {};
        domo.on(eventName,function(){
            myContext.should.be.exactly(this);
            done();
        });
        domo.trigger(eventName, null, myContext);
    });
    describe('With event names passed in a space delimited string',function(){
        var concatName = [eventName,event2Name].join(' ');
        it('should trigger all events passed',function(done){
            var domo = mayordomo.new();
            var executeCounter = 0;
            domo.on(eventName,function(){
                executeCounter++;
            });
            domo.on(event2Name,function(){
                executeCounter++;
                executeCounter.should.be.exactly(2);
                done();
            });
            domo.trigger(concatName);
        });
    });
    describe('With event names passed in an array',function(){
        it('should trigger all events passed',function(done){
            var domo = mayordomo.new();
            var executeCounter = 0;
            domo.on(eventName,function(){
                executeCounter++;
            });
            domo.on(event2Name,function(){
                executeCounter++;
                executeCounter.should.be.exactly(2);
                done();
            });
            domo.trigger([eventName, event2Name]);
        });
    });
});