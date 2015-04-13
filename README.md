# mayordomo

mayordomo is a feature-rich JavaScript event manager that supports event handler protection, namespaces and TTL.

## Installation

#### npm
    npm install mayordomo --save

#### bower
    bower install mayordomo --save

## Tests
Test all methods and features:

    $ npm install -g mocha
    $ mocha

## Event Handler Protection

mayordomo allows you to protect a handler from being removed. There are two levels of protection that you may set:

- protected - the handler may be removed but only with the passcode that was provided at subscription time.

- permanent - the handler cannot be removed after initial subscription.

#### Example of a permanent handler

    var domo = require('mayordomo');

    // Add a permanent event handler
    domo.on({
      name: 'goodbye',
      handler: function(){
        console.log('Bye');
      },
      permanent: true
    });

    // This will NOT remove your event handler
    // Nothing can remove this event handler
    domo.off('greet');
    domo.off();

#### Example of a protected handler

    var domo = require('mayordomo');

    // Add a protected event handler
    domo.on({
      name: 'greet',
      handler: function(){
        console.log('Hello');
      },
      passcode: 'my-key-to-remove'
    });

    // This will NOT remove your event handler
    domo.off('greet');
    domo.off();

    // This will remove it
    domo.off({
        name: 'greet',
        passcode: 'my-key-to-remove'
    });

## TTL

You can specify how many times a handler should run. mayordomo will discard of the handler automatically after it runs the amount of times specified in the `timesToListen` property. You may also use `once()` to only allow a handler to run one time.

    var domo = require('mayordomo');

    // Execute a handler once
    domo.once('greet', function(){
        console.log('I will only greet you once');
    });

    domo.on({
        name: 'greet',
        timesToListen: 5,
        handler: function(e){
          console.log('I will only run', e.timesToListen, 'times');
          console.log('I have ran', e.executionCount, 'times already');
        }
    });

    domo.trigger('greet');

    // $ I will only run 5 times
    // $ I have ran n times already

## Namespaces and wildcards

You can use mayordomo to subscribe to events using namespaces and wildcards.

    var domo = require('mayordomo');

    // Subscribe to an event using namespaces
    // Always say hello on an encounter
    domo.on('encounter*', function(){
      console.log('Hello...');
    });

    // Only say this on an encounter with a friend
    domo.on('encounter.friend', function(){
      console.log('Long time no see! How are you?');
    });

    // Only say this on an encounter with a stranger
    domo.on('encounter.stranger', function(){
      console.log('Nice to meet you. How can I help you?');
    });

    domo.trigger('encounter.stranger');

    // $ Hello...
    // $ Nice to meet you. How can I help you?

## Event shortcuts

Event shortcuts allow you to subscribe and trigger an event through a shortcut method that is exposed directly on the mayordomo object instead of doing it through `on()` or `trigger()`.

    var domo = require('mayordomo');

    // Declare your events using named shortcuts
    // The `true` tells mayordomo to create the shortcut method
    domo.declare('goodbye', true);

    // Use it through on()
    domo.on('goodbye', function(){
      console.log('BYE!');
    });

    // Or use it directly from the object
    domo.goodbye(function(){
      console.log('BYE!');
    });

    // Also applies to triggering the event
    domo.goodbye(); //instead of domo.trigger('goodbye');


## License

The MIT License (MIT)

Copyright (c) 2015 Kelvin Del Monte

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
