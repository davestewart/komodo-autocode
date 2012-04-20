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
			comments		:false,
			console			:false,
			places			:false,
			snippets		:false,
		},

		onLoad:function()
		{
			// proxies
				function onClick(event)
				{
					autocode.events.onClick.call(autocode, event);
				}

				function onKeyPress(event)
				{
					autocode.events.onKeyPress.call(autocode, event);
				}

			// places
				document
					.getElementById("placesViewbox")
					.addEventListener('click', onClick);

			// editors
				var container = ko.views.manager ? ko.views.manager.topView : window;
				container
					.addEventListener('keypress', onKeyPress, true);

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
		this.settings.comments		= prefs.get('autocode.comments', true);
		this.settings.console		= prefs.get('autocode.console', true);
		this.settings.places		= prefs.get('autocode.places', true);
		this.settings.snippets		= prefs.get('autocode.snippets', true);

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
 * - snippets	: Tab in main window
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
			if(autocode.settings[name])
			{
				object	= autocode[name];
				fn		= object['onEvent'];
				result	= fn.call(object, event);
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
		//var result = autocode.places.onEvent.call(autocode.places, event);
		autocode.places.onEvent(event);
		if(result)
		{
			event.preventDefault();
			event.stopPropagation();
		}
	},

}
