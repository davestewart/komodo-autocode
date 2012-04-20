// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// UI

	// ----------------------------------------------------------------------------------------------------
	// setup

		if( ! window.xjsflLib ) xjsflLib = {};

	// ----------------------------------------------------------------------------------------------------
	// code

		xjsflLib.EnvVars = function()
		{
			this.update();
		}

		xjsflLib.EnvVars.prototype =
		{
			// ----------------------------------------------------------------------------------------------------
			// properties

				global:{},

				project:{},

			// ----------------------------------------------------------------------------------------------------
			// set/get

				getGlobal:function(name)
				{
					return this.global[name];
				},
				
				getProject:function(name)
				{
					return this.project[name];
				},
				
				getAll:function()
				{
					var obj = {};
					for(var name in this.global)
					{
						obj[name] = this.global[name];
					}
					for(var name in this.project)
					{
						obj[name] = this.project[name];
					}
					return obj;
				},
				
				updateProject:function()
				{
					var proj	= ko.projects.manager.currentProject;
					var prefs	= proj ? proj.prefset.getStringPref('userEnvironmentStartupOverride') : '';
					this.project = this.parsePrefs(prefs);
					return this;
				},
				
				updateGlobal:function()
				{
					var prefs	= Components.classes["@activestate.com/koUserEnviron;1"].getService(Components.interfaces.koIUserEnviron).GetEncodedStartupEnvironment();
					this.global	= this.parsePrefs(prefs);
					return this;
				},
				
				update:function()
				{
					this.updateGlobal();
					this.updateProject();
					return this;
				},

			// ----------------------------------------------------------------------------------------------------
			// utils
			
				/**
				 * Parses a string of KEY=value pairs into an Object
				 */
				parsePrefs:function(prefs)
				{
					var rx			= /^(\w+)=(.+)$/gm;
					var matches		= prefs.match(rx);
					var data		= {};
					if(matches)
					{
						rx = new RegExp(rx.source);
						for each(var match in matches)
						{
							var pair = match.match(rx);
							data[pair[1]] = pair[2];
						}
					}
					return data;
				},
		
				toString:function()
				{
					var uri = this.window ? this.window.location : '';
					return '[object EnvVars]';
				}
				
		}