// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████             ████       
//  ██  ██             ██         
//  ██  ██ ████ █████  ██   █████ 
//  ██████ ██   ██ ██ █████ ██    
//  ██     ██   █████  ██   █████ 
//  ██     ██   ██     ██      ██ 
//  ██     ██   █████  ██   █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Prefs

	// ----------------------------------------------------------------------------------------------------
	// setup
	
		if( ! window.xjsflLib ) xjsflLib = {};

	// ----------------------------------------------------------------------------------------------------
	// code
	
		xjsflLib.Prefs = function(prefSet)
		{
			this.prefSet = prefSet || ko.prefs;
		}
		
		xjsflLib.Prefs.prototype =
		{
			// ----------------------------------------------------------------------------------------------------
			// variables
			
				prefSet:null,
			
			// ----------------------------------------------------------------------------------------------------
			// getters
			
				/**
				 * Gets a preference
				 * @param	{String}	name			The preference name
				 * @param	{Object}	defaultValue	The default value, should the preference not be set yet
				 * @returns	{Object}					The preference value, or undefined if it doesn't exist
				 */
				get:function(name, defaultValue)
				{
					var methods =
					[
						this.getString,
						this.getBoolean,
						this.getDouble,
						this.getLong,
					];

					for each(var method in methods)
					{
						var value = method.call(this, name);
						if(typeof value !== 'undefined')
						{
							//alert('GET:' + [name, value])
							return value;
						}
					}
					return defaultValue;
				},
				
				getString:function(name, defaultValue)
				{
					if(this.prefSet.hasStringPref(name))
					{
						return this.prefSet.getStringPref(name);
					}
					return defaultValue;
				},
				
				getBoolean:function(name, defaultValue)
				{
					//trace('Get bool:' + this.prefSet.getBooleanPref(name))
					if(this.prefSet.hasBooleanPref(name))
					{
						//trace('Get bool:' + this.prefSet.getBooleanPref(name) + ' ' + typeof this.prefSet.getBooleanPref(name))
						return this.prefSet.getBooleanPref(name);
					}
					return defaultValue;
				},
			
				getDouble:function(name, defaultValue)
				{
					if(this.prefSet.hasDoublePref(name))
					{
						return this.prefSet.getDoublePref(name);
					}
					return defaultValue;
				},
			
				getLong:function(name, defaultValue)
				{
					if(this.prefSet.hasLongPref(name))
					{
						return this.prefSet.getLongPref(name);
					}
					return defaultValue;
				},
			
			
			// ----------------------------------------------------------------------------------------------------
			// setters
			
				/**
				 * Sets a preference
				 * @param	{String}	name
				 * @param	{Value}	value
				 * @returns	{Prefs}
				 */
				set:function(name, value)
				{
					//trace('set: ' + [name, typeof value, value])
					if(typeof value === 'boolean')
					{
						this.setBoolean(name, value);
						//trace('Set bool:' + this.prefSet.getBooleanPref(name))

					}
					else if(typeof value === 'number')
					{
						this.setDouble(name, value);
					}
					else
					{
						this.setString(name, String(value));
					}
					return this;
				},
			
				setString:function(name, value)
				{
					return this.prefSet.setStringPref(name, value);
				},
				
				setBoolean:function(name, value)
				{
					return this.prefSet.setBooleanPref(name, value);
				},
			
				setDouble:function(name, value)
				{
					return this.prefSet.setDoublePref(name, value);
				},
			
				setLong:function(name, value)
				{
					return this.prefSet.setLongPref(name, value);
				},

			// ----------------------------------------------------------------------------------------------------
			// utils
			
				toString:function()
				{
					var name = window.ko ? (this.prefSet == ko.prefs ? 'ko' : 'window') : 'window';
					return '[object Prefs type="' +name + '"]'
				}
			
		}