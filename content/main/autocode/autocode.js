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
		},

		onLoad:function()
		{
			// handler proxies
				function onClick(event) { autocode.events.onClick.call(autocode, event); }
				function onKeyPress(event) { autocode.events.onKeyPress.call(autocode, event); }

			// event handlers
				var container = (ko.views.manager ? ko.views.manager.topView : window)
				container.addEventListener('keypress', onKeyPress, true);
				document.getElementById("placesViewbox").addEventListener('click', onClick);
					
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

autocode.initialize = function()
{
	// prefs
		var prefs = new xjsflLib.Prefs();

	// settings
		this.settings.enabled.comments		= prefs.get('autocode.comments', true);
		this.settings.enabled.console		= prefs.get('autocode.console', true);
		this.settings.enabled.places		= prefs.get('autocode.places', true);
		this.settings.enabled.snippets		= prefs.get('autocode.snippets', true);

	// console
		if(this.settings.console)
		{
			autocode.console.initialize();
		}

	// places
		if(this.settings.places)
		{
			autocode.places.initialize();
		}
		
	// auto-size autocomplete box
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
	onKeyPress:function(event)
	{
		var object, fn, result, names = ['console', 'snippets', 'comments'];
		for each(var name in names)
		{
			if(autocode.settings.enabled[name])
			{
				object	= autocode[name];
				result	= object.onEvent.call(object, event);
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
			//var result = autocode.places.onEvent.call(autocode.places, event);
			autocode.places.onEvent(event);
			/*
			if(result)
			{
				event.preventDefault();
				event.stopPropagation();
			}
			*/
		}
	},

}
