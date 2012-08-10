// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██         ██████          ██
//  ██  ██        ██         ██              ██
//  ██  ██ ██ ██ █████ █████ ██     █████ █████ █████
//  ██████ ██ ██  ██   ██ ██ ██     ██ ██ ██ ██ ██ ██
//  ██  ██ ██ ██  ██   ██ ██ ██     ██ ██ ██ ██ █████
//  ██  ██ ██ ██  ██   ██ ██ ██     ██ ██ ██ ██ ██
//  ██  ██ █████  ████ █████ ██████ █████ █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// AutoCode

/**
 * AutoCode
 *
 * Adds autocompleting features for abbreviations and doc comments
 *
 * @author	Dave Stewart
 * @version	0.6
 * @date	December 30th 2011
 */
if( ! window.autocode )
{
	autocode =
	{
		settings:
		{
			enabled:
			{
				comments		:false,
				console			:false,
				places			:false,
				snippets		:false,
			},

			toolboxPath:'',
			
		},

		onLoad:function()
		{
			// handler proxies
				function onClick(event) { autocode.events.onClick.call(autocode, event); }
				function onKeyPress(event) { autocode.events.onKeyPress.call(autocode, event); }

			// event handlers
				var container			= (ko.views.manager ? ko.views.manager.topView : window)
				container.addEventListener('keypress', onKeyPress, true);
				document.getElementById('placesViewbox').addEventListener('click', onClick);
				
			// set up toolbox path
				function getToolboxPath()
				{
					var devPath			= 'E:/05 - Commercial Projects/Komodo Extensions/AutoCode/tools/';
					var toolbox			= ko.toolbox2.getExtensionToolbox("autocode@xjsfl.com");
					toolboxPath			= toolbox ? (toolbox.path + '/').replace(/\\/g, '/') + '/' : devPath;
					autocode.settings.toolboxPath = toolboxPath;
					//alert(toolboxPath)
				}
				window.setTimeout(getToolboxPath, 2000);

			// initialize
				autocode.initialize();
		},

		toString:function()
		{
			return '[object AutoCode]';
		}

	}

	window.addEventListener('load',  autocode.onLoad, false);
}

autocode.checkPrefs = function()
{
	if( ! ko.prefs.hasBooleanPref('autocode.prefs.set') )
	{
		if(confirm('The AutoCode extension needs configuring before it can be used.\n\nOpen Preferences > Editor > AutoCode now?'))
		{
			ko.commands.doCommand('cmd_editPrefs');
		}
		return ko.prefs.hasBooleanPref('autocode.prefs.set');
	}
	return true;
}

autocode.initialize = function()
{
	// prefs
		//trace('init:1');
		var prefs = new xjsflLib.Prefs();
		
	// settings
		//trace('init:2');
		this.settings.enabled.comments		= prefs.get('autocode.comments', true);
		this.settings.enabled.console		= prefs.get('autocode.console', true);
		this.settings.enabled.places		= prefs.get('autocode.places', true);
		this.settings.enabled.snippets		= prefs.get('autocode.snippets', true);

	// snippets
		if(this.settings.enabled.snippets)
		{
			autocode.snippets.initialize();
		}

	// console
		//trace('init:3');
		if(this.settings.enabled.console)
		{
			autocode.console.initialize();
		}

	// places
		//trace('init:4');
		if(this.settings.enabled.places)
		{
			autocode.places.initialize();
		}

	// auto-size autocomplete box
		//trace('init:5');
		autocode.autocomplete.initialize();
}

/**
 * Set up and handle events
 *
 * - Exec		: CTRL+Enter
 * - Snippets	: Tab in main window
 * - Comments	: Tab or Return in main window
 * - Places		: ALT+Click on Places pane
 */
autocode.events =
{
	onPrefsUpdated:function()
	{
		autocode.initialize();
	},
	
	onKeyPress:function(event)
	{
		var object, fn, result, names = ['console', 'snippets', 'comments'];
		for each(var name in names)
		{
			if(autocode.settings.enabled[name])
			{
				object	= autocode[name];
				result	= object.onKeyboardEvent.call(object, event);
				if(result)
				{
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			}
		}
		return true;
	},

	onClick:function(event)
	{
		if(autocode.settings.enabled.places)
		{
			autocode.places.onMouseEvent(event);
		}
	},

}
