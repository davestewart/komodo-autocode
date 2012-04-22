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
			
		}

		xjsflLib.EnvVars.prototype =
		{
			// ----------------------------------------------------------------------------------------------------
			// properties

				global:null,

				project:null,

			// ----------------------------------------------------------------------------------------------------
			// set/get

				/**
				 * Get a single global environment variable
				 * @param	{String}	name	The name of the variable to return
				 * @returns	{String}			The value of the variable
				 */
				getGlobal:function(name)
				{
					if( ! this.global ) this.updateGlobal();
					name = String(name).toUpperCase();
					return this.global[name];
				},
				
				/**
				 * Get a single project environment variable
				 * @param	{String}	name	The name of the variable to return
				 * @returns	{String}			The value of the variable
				 */
				getProject:function(name)
				{
					if( ! this.project ) this.updateProject();
					name = String(name).toUpperCase();
					return this.project[name];
				},
				
				/**
				 * Get both global and project environment variables as one combined object
				 * @returns	{Object}		An Object of properties
				 */
				getAll:function()
				{
					if( ! this.global ) this.updateGlobal();
					if( ! this.project ) this.updateProject();
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
				
				/**
				 * Update project variables
				 * @returns	{EnvVars}		The current instance
				 */
				updateProject:function()
				{
					var proj	= ko.projects.manager.currentProject;
					var prefs	= proj ? proj.prefset.getStringPref('userEnvironmentStartupOverride') : '';
					this.project = this.parsePrefs(prefs);
					return this;
				},
				
				/**
				 * Update global variables
				 * @returns	{EnvVars}		The current instance
				 */
				updateGlobal:function()
				{
					var prefs	= Components.classes["@activestate.com/koUserEnviron;1"].getService(Components.interfaces.koIUserEnviron).GetEncodedStartupEnvironment();
					this.global	= this.parsePrefs(prefs);
					return this;
				},
				
				/**
				 * Update global and project variables
				 * @returns	{EnvVars}		The current instance
				 */
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
					var rx			= /^(.+)=(.+)$/gm;
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
		
		//var vars = new xjsflLib.EnvVars();
		//trace(vars.getGlobal('username'))