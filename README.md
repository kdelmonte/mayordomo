# mayordomo [![Build Status](https://travis-ci.org/kdelmonte/mayordomo.svg)](https://travis-ci.org/kdelmonte/mayordomo)

mayordomo is a feature-rich JavaScript event manager that supports event handler protection, namespaces and TTL.

## Installation

#### npm
    npm install mayordomo --save

#### bower
    bower install mayordomo --save

After installation, just include it in you file like this:

    var domo = require('mayordomo');

## Tests
Test all methods and features:

    $ npm install -g mocha
    $ mocha

## Event Handler Object

Although you do not have to, you can use the "event handler object" to fully describe an event handler in mayordomo.

Here is a full example:

    {
      name: 'play pause stop', // put one or multiple event names here
      handler: function(eventInfo, argument1, argument2, ..., argumentN){
        // do something when this event is triggered
      },
      data: {favoriteStation: '87.5'}, // this data will be available in the handler inside the eventInfo object,
      timesToListen: 10, // max times that the handler should be executed
      permanent: false, // if true, the handler cannot be removed after initial subscription
      passcode: 'my-passcode' // if specified, the handler will be "protected" and cannot be removed unless the passcode is provided,
      protected: true // protected property is read only
    }

## Event Handler Protection

mayordomo allows you to protect a handler from being removed. There are two levels of protection that you may set:

- protected - the handler may be removed but only with the passcode that was provided at subscription time.

- permanent - the handler cannot be removed after initial subscription.

#### Example of a permanent handler

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

    // Execute a handler once
    domo.once('greet', function(){
        console.log('I will only greet you once');
    });

    domo.trigger('greet');

    // $ I will only greet you once

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

## API

### mayordomo.new()
### mayordomo.spawn()

Create a new instance of mayordomo. An instance of mayordomo is exported on require() (or put in window of the browser) so this method is only necessary if you need multiple instances.

    var domo = require('mayordomo');
    var anotherDomo = domo.new();

### mayordomo.noConflict()

Only applies if in browser. Restores the value of the global mayordomo variable to the one that existed before the script was loaded and returns mayordomo so you may use it wherever they like.

    var domo = mayordomo.noConflict();

### mayordomo.chain(newChain)

Set the object that should be returned by mayordomo on chainable methods. This is useful for when you want to use mayordomo under the hood of your class.

    var myObject = {};
    domo.chain(myObject);
    domo.trigger('someEvent'); // returns myObject

### mayordomo.resetChain()

Set the chainable object back to mayordomo.

    var myObject = {};
    domo.chain(myObject);
    domo.trigger('someEvent'); // returns myObject
    domo.resetChain();
    domo.trigger('someEvent'); // returns domo

### mayordomo.total()

    domo.total('someEvent'); // returns 0
    domo.on('someEvent', function(){
      console.log('someEvent ran');
    });
    domo.total('someEvent'); // returns 1;

### mayordomo.any()

Returns true if the event has handlers.

    domo.any('someEvent'); // returns false
    domo.on('someEvent', function(){
      console.log('someEvent ran');
    });
    domo.any('someEvent'); // returns true;

### mayordomo.declare(eventNames[, createShortcut])

Creates events based on a list of event names. `eventNames` can be either an array of strings or a string with the event names separated by a space. Optionally, you may choose to setup a shortcut to access the event directly from the mayordomo instance like this: `mayordomo.click(...)`. You may also specify shortcut name that differs from the event name by formatting the string like this `onClick:click`.

    // Declare events and create shortcuts
    domo.declare('play stop', true);
    // OR
    domo.declare(['play', 'stop'], true);

    // Subscribe using shortcut
    domo.play(function(){
      console.log('played!');
    });

    // Trigger using shortcut
    domo.play();


    // If you want a simple name for your shortcut
    // but want to keep the regular event name
    domo.declare('onPlay:play onStop:stop', true);

    // The following two statements will work and are equivalent
    domo.on('onPlay',function(){
      console.log('played!');
    });
    domo.play(function(){
      console.log('played!');
    });

    // The following two statements will work and are equivalent
    domo.trigger('play');
    domo.play();

### mayordomo.import(eventsToImport)

Import handlers from a simple object. Very useful to extract handlers passed in an object and automatically register them in mayordomo.

    function Car(options){

      // Using underscore, extend the instance with the options passed in
      _.extend(this, options);

      // going to use mayoromo under the hood
      var domo = mayordomo.new();

      // declare my events to prepare for handler import
      // and create shortcut methods. This will overwrite the actual functions
      // that are in the instance after the underscore _.extend();
      domo.declare('accelerate brake', true);

      // import the handlers that may have been passed
      // in the options.
      domo.import(options);

      // Class methods...
      this.accelerate = function(){
        domo.trigger('accelerate');
      };
      this.break = function(){
        domo.trigger('break');
      };
    }
    var myCarOptions = {
        color: 'black',
        make: 'volkswagen',
        model: 'passat',
        accelerate: function(){
            console.log('accelerated');
        },
        brake: function(){
            console.log('braked');
        }
    };

    var car = new Car(myCarOptions);
    car.accelerate(); // accelerated

### mayordomo.trigger(eventNames[, extraArguments, context])

Triggers one or more events based on a list of event names. You may pass extra arguments to the handler via `extraArguments`. Also, you may specify a context which will define what `this` will be when the handler is executed. `eventNames` is a string that contains one or more event names separated spaces or an array of strings that contains the event names.

    domo.on('lunch', function(event, food, drink){
      console.log('Had a ' + food + ' and washed it down with a ' + drink);
    });

    domo.trigger('lunch', ['burger', 'coke']);

### mayordomo.on(eventNames, handler[, data, timesToListen, permanent, passcode])
### mayordomo.on(eventHandlerObjects)

Creates event subscriptions. There are many ways that you can call the on() method:

    // using space delimited string
    domo.on('play stop', function(event){
      console.log(event.data); // {someInfo: 'my info'}
    }, {someInfo: 'my info'});

    // using an event handler object
    domo.on({
        name: 'play stop',
        handler: function(){
          console.log(event.data); // {someInfo: 'my info'}
        },
        data: {someInfo: 'my info'},
        timesToListen: 5,
        passcode: 'myR4ndomC0d3'
    });

    // using an array of strings
    domo.on(['pause', 'stop'], function(event){
      console.log('stopped!');
    });

    // using an array of event handler objects
    domo.on([
        {
          name: 'play',
          handler: function(){
            console.log('played!')
          }
        },
        {
          name: 'stop pause',
          handler: function(){
            console.log('stopped!');
          }
        }
    ]);

### mayordomo.once(eventNames, handler[, data, permanent, passcode])
### mayordomo.once(eventHandlerObjects)

Same as on but handler will only run once. You may call once in all they diferent ways you can call on().

    // Execute a handler once
    domo.once('greet', function(){
        console.log('I will only greet you once');
    });

### mayordomo.off()
### mayordomo.off(eventNames[, handler, data, passcode])
### mayordomo.off(eventHandlerObjects)

Removes event subscriptions. There are many ways that you can call the off() method:

    // remove all handlers (that are not protected or permanent)
    domo.off();

    // using space delimited string
    domo.off('play stop');

    // using a specific handler
    var myHandler = function(){
      // do something...
    }

    // Subscribe to the play event
    domo.on('play', myHandler)

    // Remove that handler only
    domo.off('play', myHandler);

    // using an event handler object
    domo.off({
        name: 'play stop',
        handler: myHandler
    });

    // using an array of strings
    domo.off(['pause', 'stop']);

    // using an array of event handler objects
    domo.off([
        {
          name: 'play',
          handler: myHandler
        },
        {
          name: 'stop pause',
          handler: myHandler
        }
    ]);

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
