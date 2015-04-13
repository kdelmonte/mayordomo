(function () {
  'use strict';

  // Wildcard library https://github.com/DamonOehlman/wildcard
  var wildcard = require('wildcard');

  // Set the environment. Expecting window or exports if running on server
  var environment = this;

  // Store previous mayordomo assignment
  var previous_mayordomo = environment.mayordomo;

  // Spawn a new mayordomo to be exported in the module
  var domo = spawn();

  // Export mayordomo to the current environment
  // which is expected to be node.js or the `window` object of a browser
  // Also, setup lodash dependency
  var _;
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = domo;
    }
    exports.mayordomo = domo;
    _ = require('lodash');
  } else {
    environment.mayordomo = domo;
    _ = environment._
  }

  // The spawn function creates a brand new mayordomo.
  // This is useful if the user needs more than one event manager in their application.
  function spawn() {

    // Initialize mayordomo
    var mayordomo = {};

    //This object will hold the value that should be returned to continue chaining
    //This is useful when the user wants to extend their class using mayordomo
    //Defaults to mayordomo but change be changed via `chain()`
    var chain = {
      current: mayordomo
    };

    // Set current version
    mayordomo.version = '1.0.0';

    // The `store` is the object that will contain all event collections
    var store = {};

    // ## Private Methods

    // Gets all event collections from the store
    var getAllEvents = function () {
      var rtn = [];
      for (var p in store) {
        rtn.push({
          name: p,
          handlers: store[p]
        });
      }
      return rtn;
    };

    // Gets a single event collection from the store by
    var getCollection = function (name) {
      return store[name];
    };

    // Gets multiple event collections from the store
    var getCollections = function (name) {
      var rtn = [];
      _.each(store, function(eventCollection, eventName){
        // The event handler collection pointer could be a wildcard
        // so we must test to see if it matches the name passed
        if(wildcard(eventName, name)){
          rtn.push(eventCollection);
        }
      });
      return rtn;
    };

    // Sets an event collection in the store
    // if no value is passed, the event collection is cleared
    var setCollection = function (name, value) {
      store[name] = value || [];
      return store[name];
    };

    // Clears an event collection
    // Alias for setCollection(name);
    var clearCollection = function (name) {
      setCollection(name);
    };

    // Creates and returns an event collection or collections based on list of event names
    // `eventNames` can be either an array of strings or a string with the event names separated by a space
    // The user may optionally choose to setup a shortcut so they may access the event directly from mayordomo like this: `mayordomo.runThis(...)`.
    // The user can choose to have a different shortcut name by passing the name like this `onClick:click`
    var declareCollection = function (eventNames, createShortcut) {
      var eventNameList = decodeEvents(eventNames);

      // If multiple event names were passed, use recursion to finish task
      if (eventNameList.length > 1) {
        var eventCollectionList = [];
        _.each(eventNameList, function (name) {
          eventCollectionList.push(declareCollection(name, createShortcut));
        });

        // Return the array of collections
        return eventCollectionList;
      }

      // If we made it to here, we are only dealing with one event
      var eventIdentifier = eventNameList[0];
      var eventName, customShortcutName;
      var eventIdentifierSplit = eventIdentifier.split(':');

      // Extract event name and optional shortcut name from event identifier
      // example `onClick:click` ==> eventName = 'onClick' and customShortcutName = click
      eventName = _.trim(eventIdentifierSplit[0]);
      if(eventIdentifierSplit.length > 1){
        customShortcutName = _.trim(eventIdentifierSplit[1]);
      }

      // If there is not a current event collection under this name then create it
      var eventCollection = getCollection(eventName);
      if (!eventCollection) {
        eventCollection = setCollection(eventName);
      }
      // Setup shortcut to the `on()` method for this particular event
      // This only happens if the user specified a customShortcut name like this: `onClick:click`
      // or if they pass true in `createShortcut` which will create a shortcut for all events
      // that are being declared
      if (createShortcut || customShortcutName) {
        mayordomo[customShortcutName || eventName] = function () {
          var args = _.toArray(arguments);

          // If first arguments is a function then complete the subscription
          if (args.length && _.isFunction(args[0])) {
            args.unshift(eventName);
            return mayordomo.on.apply(mayordomo, args);
          }
          // Otherwise, trigger the event
          return mayordomo.trigger.apply(mayordomo, [eventName, args]);
        };
      }
      return eventCollection;
    };

    // Decodes the the `events` arguments and always puts the results in an array
    function decodeEvents(events) {
      // If `events` is falsy return empty array
      if(!events){
        return [];
      }
      // If value passed is an array, return it untouched
      if (_.isArray(events)) return events;

      // If value passed is an object, return it wrapped in an array
      if (_.isObject(events)) return [events];

      // Split name string by spaces
      // and remove falsy values
      return _.compact(events.split(' '));
    };

    // Builds a full event object
    function constructEvent(event, handler, data, timesToListen, permanent, passcode) {
      // if event is not an object then we must build one from the individual arguments
      event = event || {};
      if (!_.isObject(event)) {
        if (typeof event === 'string') {
          event = {
            name: event
          };
        }
      }
      // Look for event properties in full event object first
      // If property is not found, fallback to the individual argument
      if (!event.handler) {
        event.handler = handler;
      }
      if (event.permanent == undefined) {
        event.permanent = permanent;
      }
      if (event.data == undefined) {
        event.data = data;
      }
      if (event.passcode == undefined) {
        event.passcode = passcode;
      }
      if (event.timesToListen == undefined) {
        event.timesToListen = timesToListen;
      }

      // Setup/Force booleans
      event.protected = !!event.passcode;
      event.permanent = !!event.permanent;

      return event;
    }

    // ## Public Methods

    //Allow users to create new instances
    mayordomo.new = mayordomo.spawn = spawn;

    // noConflict just puts back the previous value of mayordomo
    // and returns mayordomo to the user so they may place it wherever they like
    mayordomo.noConflict = function () {
      environment.mayordomo = previous_mayordomo;
      return mayordomo;
    };

    // Change the current object that is used for chaining
    // If `newChain` is falsy, set it back to mayordomo
    mayordomo.chain = function (newChain) {
      chain.current = newChain || mayordomo;
      return chain.current;
    };

    // shortcut to `.chain()` which resets the chain to mayordomo
    mayordomo.resetChain = function () {
      return mayordomo.chain();
    };

    // Returns the count of handlers for a given event
    mayordomo.total = function (eventName) {
      var event = getCollection(eventName);
      if (event) {
        return event.length;
      }
      return 0;
    };

    // Returns true if the event has handlers
    mayordomo.any = function (eventName) {
      return mayordomo.total(eventName) > 0;
    };

    // Import handlers from a simple object.
    // Expecting an object whose keys will serve as event names and the values are expected to be
    //  full event handler objects or just the handler functions
    mayordomo.import = function (events) {
      if (!events) return chain.current;
      // Go through all keys in the object that was passed in
      // and see if we can find any events that are already that
      // have a matching name. If found, import the handler under that event.
      for (var handlerName in events) {
        var registeredEvent = getCollection(handlerName);
        if (!registeredEvent) {
          continue;
        }
        var value = events[handlerName];
        if (_.isFunction(value)) {
          // Value is an event handler
          mayordomo.on(handlerName, value);
        } else {
          // Assume that value is full event handler object
          value.name = handlerName;
          mayordomo.on(value);
        }
      }
      return chain.current;
    };

    // Expose `declareCollection` but do not return the collection(s) on this one
    mayordomo.declare = function (eventNames, createShortcut) {
      declareCollection(eventNames, createShortcut);
      return chain.current;
    };

    // Triggers one or more events based on event names
    // The user can pass arguments to the handler via `extraArguments`
    // The user may also specify a context for the handler being called
    // This method expects one of the following:
    // 1. `eventNames` is a string that contains one or more event names separated spaces.
    // 2. `eventNames` is an array of strings that contains the event names
    mayordomo.trigger = function (eventNames, extraArguments, context) {
      var eventNameList = decodeEvents(eventNames);

      // If multiple event names were passed, use recursion to finish task
      if (eventNameList.length > 1) {
        _.each(eventNameList, function (name) {
          mayordomo.trigger(name, extraArguments, context);
        });

        // Exit after recursion
        return chain.current;
      }

      // If we made it to here, we are only dealing with one event
      var eventName = eventNameList[0];

      extraArguments = extraArguments || [];
      var eventCollections = getCollections(eventName);

      // Create bubble object that can be used to communicate data from handler to handler
      var bubble = {};
      _.each(eventCollections, function(eventCollection){
        // Loop through collection and execute all handlers
        // if a false is detected stop execution immediately
        _.detect(eventCollection, function (e) {
          // If this event handler has a specified TTL, then we must monitor
          // how many times it is executed so that we can remove it
          // after it reaches its TTL
          if(e.timesToListen){
            e.executionCount = e.executionCount ? e.executionCount + 1 : 1;

            // Check if handler has reach the end of its life
            if(e.timesToListen === e.executionCount){
              // Remove the handler from the store
              // This will be the last time this guy will run
              // RIP
              mayordomo.off(e);
            }
          }

          // Inject a clone of the event object without the handler
          // because the user should not be able to change the real event in any way.
          // In addition, omit the passcode and insert the bubble
          var clone = _.omit(e, 'handler','passcode');
          _.extend(clone,{bubble: bubble});
          var args = _.flatten([clone, extraArguments]);

          // Execute the handler
          if (e.handler.apply(context || mayordomo, args) === false) {
            return false;
          }
        });
      });
      // Return chaining object
      return chain.current;
    };

    // Set up events and subscriptions. This method expects one of the following:
    // 1. `events` is a full event object
    // 2. `events` is a string that contains one or more event names separated spaces.
    // 3. `events` is an array containing full event objects.
    // 4. `events` is an array of strings that contains the event names.
    mayordomo.on = function (events, handler, data, timesToListen, permanent, passcode) {
      var eventList = decodeEvents(events);

      // If multiple events were passed, use recursion to finish task
      if (eventList.length > 1) {
        _.each(eventList, function (event) {
          mayordomo.on(event, handler, data, timesToListen, permanent, passcode);
        });

        // Exit after recursion
        return chain.current;
      }

      // If we made it to here, we are only dealing with one event
      var event = eventList[0];

      // Build event object
      event = constructEvent(event, handler, data, timesToListen, permanent, passcode);

      // Do some validation
      if (!event.name) throw new Error('You must provide an event name');
      if (!event.handler) throw new Error('You must provide an event handler');

      // If multiple events were passed in the name property, use recursion to finish task
      eventList = decodeEvents(event.name);
      if (eventList.length > 1) {
        _.each(eventList, function (eventName) {
          // Make a clone of the full event object and replace the name with the single value name
          var singleNameEvent = _.extend({
            name: eventName
          }, _.omit(event, 'name'));
          mayordomo.on(singleNameEvent);
        });

        // Exit after recursion
        return chain.current;
      }

      // If we made it to here, we are dealing with one event object with a single target name
      var eventCollection = getCollection(event.name);
      if (!eventCollection) {
        eventCollection = declareCollection(event.name);
      }
      eventCollection.push(event);
      return chain.current;
    };

    // Shortcut that simply calls on() with a hardcoded TTL of 1
    mayordomo.once = function (events, handler, data, permanent, passcode) {
      return mayordomo.on(events, handler,data, 1, permanent, passcode);
    };

    // Removes subscriptions. This method expects one of the following:
    // 1. `events` is a full event object.
    // 2. `events` is a string that contains one or more event names separated by spaces.
    // 3. `events` is an array containing full event objects.
    // 4. `events` is an array of strings that contains the event names.
    mayordomo.off = function (events, handler, data, permanent, passcode) {
      var eventList = decodeEvents(events);

      // If multiple events were passed, use recursion to finish task
      if (eventList.length > 1) {
        _.each(eventList, function (event) {
          mayordomo.off(event, handler, data, permanent, passcode);
        });

        // Exit after recursion
        return chain.current;
      }

      // If we made it to here, we are only dealing with one event
      var event = eventList[0];

      // Build event object
      event = constructEvent(event, handler, data, undefined, permanent, passcode);

      // If we made it to here, we are dealing with one event spec object with a single target name or no target name at all
      var toRemove;
      if (event.name) {
        // If multiple events were passed in the name property, use recursion to finish task
        eventList = decodeEvents(event.name);
        if (eventList.length > 1) {
          _.each(eventList, function (eventName) {
            // Make a clone of the full event object and replace the name with the single value name
            var singleNameEvent = _.extend({
              name: eventName
            }, _.omit(event, 'name'));
            mayordomo.off(singleNameEvent);
          });

          // Exit after recursion
          return chain.current;
        }

        // Get existing event collection
        var existingEvent = getCollection(event.name);
        if (!existingEvent) return chain.current;

        // Select all handlers that are not `permanent`
        toRemove = _.where(existingEvent, {permanent: false});

        if (event.handler) {
          // if a specific handler was provided, then we just need to remove that one
            toRemove = _.where(toRemove, {handler: event.handler});
        } else {
          // Otherwise, we must check the passcode
          if (event.passcode) {
            toRemove = _.where(toRemove, {passcode: event.passcode});

            // If the options do no require the removal of protected records, exlude them from removal list
            if (!event.protected) {
              toRemove = _.where(toRemove, {protected: false});
            }
          } else {
            // You can only remove protected handlers by specifying their passcode
            toRemove = _.where(toRemove, {protected: false});
          }
        }
        // Remove all handlers that we determined in previous steps
        existingEvent = _.reject(existingEvent, function (h) {
          return _.contains(toRemove, h);
        });

        // Overwrite the handler collection on the store now that removal is complete
        setCollection(event.name, existingEvent);
      } else {
        // Since the event do not include a name, we must assume that we need to remove
        // all handlers that match the given event. We do this via recursion.
        var eventCollection = getAllEvents();
        _.each(eventCollection, function (e) {
          // Clone event but this time, specify name
          var cloneOptions = _.extend({
            name: e.name
          }, _.omit(event, 'name'))
          mayordomo.off(cloneOptions);
        });
      }
      return chain.current;
    };

    return mayordomo;
  }
}).call(this);
