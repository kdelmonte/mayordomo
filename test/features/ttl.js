var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#TTL', function(){
    it('should only run once', function(){
        var domo = mayordomo.new();
        var executionCount = 0;
        domo.once('greet', function(){
            executionCount++;
        });
        for(var x = 0; x < 10; x++){
            domo.trigger('greet');
        }
        executionCount.should.be.exactly(1);
    });
    it('should only run 5 times', function(){
        var domo = mayordomo.new();
        var executionCount = 0;
        domo.on({
            name: 'greet',
            timesToListen: 5,
            handler: function(e){
                executionCount++;
            }
        });
        for(var x = 0; x < 10; x++){
            domo.trigger('greet');
        }
        executionCount.should.be.exactly(5);
    });
});