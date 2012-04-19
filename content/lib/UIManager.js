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
	
		xjsflLib.UIManager = function(window)
		{
			if(window && window.document)
			{
				this.window = window;
				this.document = window.document;
				if(window.parent && window.parent.hPrefWindow)
				{
					this.prefs = new xjsflLib.Prefs(window.parent.hPrefWindow.prefset);
				}
			}
			else
			{
				throw new Error('UIManager cannot initialize as the parameter "window" does not contain a document element ');
			}
		}
		
		xjsflLib.UIManager.prototype =
		{
			// ----------------------------------------------------------------------------------------------------
			// properties
			
				window:null,
				
				document:null,
				
				prefs:null,
				
				groupSettings:null,
				
			
			// ----------------------------------------------------------------------------------------------------
			// set/get
			
				get:function(id)
				{
					var element = this.document.getElementById(id);
					trace(id, element)
					if(element)
					{
						if(element.nodeName === 'checkbox')
						{
							return element.checked;
						}
						else
						{
							return element.value;
						}
					}
					return undefined;
				},
			
				set:function(id, value)
				{
					var element = this.document.getElementById(id);
					if(element && typeof value !== 'undefined')
					{
						if(typeof value === 'boolean')
						{
							//element.checked = value;
							element.setChecked(value);
						}
						else
						{
							element.value = value;
						}
					}
					return this;
				},
				
			
			// ----------------------------------------------------------------------------------------------------
			// load/save
			
				load:function(id, name, defaultValue)
				{
					var value = this.prefs.get(name);
					//alert('load:' + [name, value])
					if(typeof value === 'undefined')
					{
						value = defaultValue || null;
					}
					this.set(id, value);
					return value;
				},
			
				save:function(id, name)
				{
					var value = this.get(id);
					if(typeof value !== 'undefined')
					{
						this.prefs.set(name, value);
					}
					return value;
				},
				
				
			// ----------------------------------------------------------------------------------------------------
			// group settings management
			
				loadGroup:function(settings)
				{
					this.groupSettings = settings;
					for each(var setting in this.groupSettings)
					{
						var id		= setting[0];
						var pref	= setting[1];
						var value	= setting[2];
						this.load(id, pref, value);
					}
				},
				
				saveGroup:function()
				{
					for each(var setting in this.groupSettings)
					{
						var id		= setting[0];
						var pref	= setting[1];
						this.save(id, pref);
					}
				},
			
			// ----------------------------------------------------------------------------------------------------
			// utils
			
				toString:function()
				{
					var uri = this.window ? this.window.location : '';
					return '[object UIManager uri="' +uri+ '"]';
				}
			

		}
		
