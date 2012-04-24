// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██                ██                ██
//  ██     ██                ██                ██
//  ██     █████ █████ ████ █████ █████ ██ ██ █████ █████
//  ██████ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██   ██
//      ██ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██   █████
//      ██ ██ ██ ██ ██ ██    ██   ██    ██ ██  ██      ██
//  ██████ ██ ██ █████ ██    ████ █████ █████  ████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Shortcuts

(function()
{
	// ----------------------------------------------------------------------------------------------------
	// Key codes

		var keyNames =
		{
			'backspace':8, 'tab':9, 'enter':13, 'shift':16, 'escape':27, 'page_up':33, 'page_down':34, 'end':35, 'home':36, 'left':37, 'up':38, 'right':39, 'down':40, 'insert':45, 'delete':46,
			'0':48, '1':49, '2':50, '3':51, '4':52, '5':53, '6':54, '7':55, '8':56, '9':57,
			'a':65, 'b':66, 'c':67, 'd':68, 'e':69, 'f':70, 'g':71, 'h':72, 'i':73, 'j':74, 'k':75, 'l':76, 'm':77, 'n':78, 'o':79, 'p':80, 'q':81, 'r':82, 's':83, 't':84, 'u':85, 'v':86, 'w':87, 'x':88, 'y':89, 'z':90,
			'numpad_0':96, 'numpad_1':97, 'numpad_2':98, 'numpad_3':99, 'numpad_4':100, 'numpad_5':101, 'numpad_6':102, 'numpad_7':103, 'numpad_8':104, 'numpad_9':105,
			'*':106, '+':107, 'numpad_-':109, 'numpad_.':110, 'numpad_/':111,
			'f1':112, 'f2':113, 'f3':114, 'f4':115, 'f5':116, 'f6':117, 'f7':118, 'f8':119, 'f9':120, 'f10':121, 'f11':122, 'f12':123,
			';':186, '=':187, ',':188, '-':189, '.':190, '/':191, '`':192, '[':219, '\\':220, ']':221, '\'':222
		};

	// ----------------------------------------------------------------------------------------------------
	// Shortcut instance class

		function Shortcut(callback, keyCode, ctrlKey, shiftKey, altKey, scope)
		{
			this.keyCode	= keyCode;
			this.ctrlKey 	= !!ctrlKey;
			this.shiftKey	= !!shiftKey;
			this.altKey		= !!altKey;

			this.assert = function(event)
			{
				return event.ctrlKey === ctrlKey && event.shiftKey === shiftKey && event.altKey === altKey;
			}

			this.execute = function()
			{
				return callback.call(scope || callback || window);
			}

			this.toString = function()
			{
				return '[object Shortcut keyCode="' +keyCode+ '" ctrlKey="' +ctrlKey+ '" shiftKey="' +shiftKey+ '" altKey="' +altKey+ '"]';
			}
		}

	// ----------------------------------------------------------------------------------------------------
	// Shortcuts manager class

		function Shortcuts(_window)
		{
			this.getWindow = function()
			{
				return _window || window;
			}
		}

		Shortcuts.prototype =
		{
			// ----------------------------------------------------------------------------------------------------
			// variables

				handlers:null,

			// ----------------------------------------------------------------------------------------------------
			// public methods

				add:function(id, callback, keyCode, ctrlKey, shiftKey, altKey, scope)
				{
					// check that incoming variables are of the right type
						var errorMessage = 'Shortcuts.add() - ';
						if(typeof id !== 'string')				throw new TypeError(errorMessage + 'id must be of type string');
						if(typeof callback !== 'function')		throw new TypeError(errorMessage + 'callback must be of type function');
						if(typeof keyCode !== 'number')			throw new TypeError(errorMessage + 'keyCode must be of type number');

					// setup shortcut
						var shortcut = new Shortcut(callback, keyCode, !!ctrlKey, !!shiftKey, !!altKey, scope || this.window);

					// add handler to handlers object
						this.checkHandlers();
						//trace('adding "' +id+ '" handler to:' + this);
						if( ! this.handlers[keyCode] )
						{
							this.handlers[keyCode] = {};
						}

					// add handler function
						this.handlers[keyCode][id] = shortcut;

					// return the instance for chaining
						return this;
				},

				addByString:function(id, callback, keySequence, scope)
				{
					// variables
						keySequence		= keySequence.toLowerCase().replace(/[- ]/, '_');
						var keyName		= keySequence.split('+').pop();
						var keyCode		= keyNames[keyName];
						if(keyCode === undefined)
						{
							var message = 'The key "' +keyName+ '" was not recognised';
							alert(message);
							throw new Error(message);
						}

						var modifiers	= keySequence.match(/(ctrl|alt|shift)/g);
						var ctrlKey		= /\bctrl\b/.test(keySequence);
						var shiftKey	= /\bshift\b/.test(keySequence);
						var altKey		= /\balt\b/.test(keySequence);

					// add
						this.add.apply(this, [id, callback, keyCode, ctrlKey, shiftKey, altKey, scope]);

					// return
						return keyCode !== undefined;
				},

				remove:function(id)
				{
					for(var keyCode in this.handlers)
					{
						var group = this.handlers[keyCode];
						for(var groupId in group)
						{
							if(id === groupId)
							{
								delete group[id];
								return true;
							}
						}
					}
					return false;
				},

				removeAll:function()
				{
					for(var keyCode in this.handlers)
					{
						var group = this.handlers[keyCode];
						for(var groupId in group)
						{
							delete group[groupId];
						}
						delete this.handlers[group];
					}
					delete this.handlers;
				},

				destroy:function()
				{
					// dummy listener, gets replaced on first add
				},

			// ----------------------------------------------------------------------------------------------------
			// internal

				/**
				 * if not yet initialized, instantiate handlers object and add event listener
				 */
				checkHandlers:function()
				{
					if( ! this.handlers )
					{
						// variables
							var window = this.getWindow();
							this.handlers = {};
							//trace('adding listener to:' + this);

						// set up event listener and forward scope to this
							var manager = this;
							function handler(event)
							{
								manager.onKeyPress(event);
							}

						// add destroy() method in same scope so that listener can be removed
							this.destroy = function()
							{
								//trace('removing listener from:' + this);
								window.removeEventListener('keypress', handler, true);
								this.removeAll();
							}

						// add the event handler
							window.addEventListener('keypress', handler, true);
					}
				},

				/**
				 * Handles key press events
				 * @param	{Event}	event		A DOM Event
				 * @returns	{Boolean}			True of false if a shortcut was called
				 */
				onKeyPress:function(event)
				{
					/** @type {Shortcut} A Shortcut handler */
					var handler;
					var handlers = this.handlers[event.keyCode];
					for(name in handlers)
					{
						var handler = handlers[name];
						if(handler.assert(event))
						{
							//trace('Running handler: ' + name);
							var state = handler.execute();
							if(state)
							{
								event.preventDefault();
								event.stopPropagation();
								return false;
							}
						}
					}
					//return true;
				},

				toString:function()
				{
					return '[object Shortcuts]';
				}
		}

	// ----------------------------------------------------------------------------------------------------
	// Assign to ko.extensions object

		if( ! window.xjsflLib ) xjsflLib = {};

		xjsflLib.Shortcuts = Shortcuts;
		xjsflLib.Shortcut = Shortcut;

})()

/*
function callback(event)
{
	alert(event)
}

var shortcuts = new xjsflLib.Shortcuts();

shortcuts.add('test', callback, keyCode, ctrlKey, shiftKey, altKey, scope)
*/