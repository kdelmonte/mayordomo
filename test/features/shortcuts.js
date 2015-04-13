var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#Wildcards', function(){
    it('should subscribe and trigger through shortcut method', function(done){
        var domo = mayordomo.new();
        domo.declare('goodbye', true);
        domo.goodbye(function(){
            done();
        });
        domo.goodbye();
    });
});