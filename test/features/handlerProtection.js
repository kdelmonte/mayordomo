var should = require('should');
var mayordomo = require('../../mayordomo.js');
describe('#Handler Protection', function(){
    it('should not be able to remove a permanent handler', function(){
        var domo = mayordomo.new();
        domo.on({
            name: 'goodbye',
            handler: function(){},
            permanent: true
        });

        domo.off('greet');
        domo.off();

        domo.any('goodbye').should.be.exactly(true);
    });

    it('should not be able to remove a permanent handler without a passcode', function(){
        var domo = mayordomo.new();
        // Add a protected event handler
        domo.on({
            name: 'greet',
            handler: function(){},
            passcode: 'random'
        });

        domo.off('greet');
        domo.off();

        domo.any('greet').should.be.exactly(true);
    });

    it('should not be able to remove a permanent handler if an incorrect passcode is provided', function(){
        var domo = mayordomo.new();
        // Add a protected event handler
        domo.on({
            name: 'greet',
            handler: function(){},
            passcode: 'my-key-to-remove'
        });

        domo.off({
            name: 'greet',
            passcode: 'incorrect-key'
        });

        domo.any('greet').should.be.exactly(true);
    });

    it('should be able to remove a permanent handler if the correct passcode is provided', function(){
        var domo = mayordomo.new();
        // Add a protected event handler
        domo.on({
            name: 'greet',
            handler: function(){},
            passcode: 'my-key-to-remove'
        });

        domo.off({
            name: 'greet',
            passcode: 'my-key-to-remove'
        });

        domo.any('greet').should.be.exactly(false);
    });
});