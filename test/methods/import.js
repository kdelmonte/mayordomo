var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#import', function(){
    var eventName = 'myEvent';
    it('should import the function handler from the object provided',function(done){
        var domo = mayordomo.new();
        var defaultEventHandlers = {
            myEvent: function(){
                done();
            }
        };
        domo.declare(eventName);
        domo.import(defaultEventHandlers);
        domo.trigger(eventName);
    });
    it('should import the full handler object from the object provided',function(done){
        var domo = mayordomo.new();
        var defaultEventHandlers = {
            myEvent: {
                handler: function(){
                    done();
                }
            }
        };
        domo.declare(eventName);
        domo.import(defaultEventHandlers);
        domo.trigger(eventName);
    });
});