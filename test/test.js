var should = require('should');
var mayordomo = require('../mayordomo.js');

describe('methods', function(){
    require('./methods/new');
    require('./methods/chain');
    require('./methods/resetChain');
    require('./methods/total');
    require('./methods/any');
    require('./methods/declare');
    require('./methods/import');
    require('./methods/trigger');
    require('./methods/on');
    require('./methods/off');
});

describe('features', function(){
    require('./features/ttl');
    require('./features/handlerProtection');
    require('./features/wildcards');
    require('./features/shortcuts');
});