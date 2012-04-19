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
	
		function Shortcuts()
		{
			
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

					// if not yet initialized, instantiate handlers object and add event listener
						if( ! this.handlers )
						{
							// variables
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
						
					// add handler to handlers object
						//trace('adding "' +id+ '" handler to:' + this);
						if( ! this.handlers[keyCode] )
						{
							this.handlers[keyCode] = {};
						}
						
					// setup shortcut and add handler function
						var shortcut = new Shortcut(callback, keyCode, ctrlKey, shiftKey, altKey, scope);
						this.handlers[keyCode][id] = shortcut;
						
					// return the instance for chaining
						return this;
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
							if(state === false)
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