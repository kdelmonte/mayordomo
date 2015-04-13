var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#Wildcards', function(){
    it('should run twice', function(){
        var domo = mayordomo.new();
        var executionCounter = 0;
        domo.on('encounter*', function(){
            executionCounter++;
        });

        domo.on('encounter.friend', function(){});

        domo.on('encounter.stranger', function(){});

        domo.trigger('encounter.stranger');
        domo.trigger('encounter.friend');
    });
});