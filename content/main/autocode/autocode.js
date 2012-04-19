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
autocode =
{
	settings:
	{
		comments		:false,
		console			:false,
		places			:false,
		snippets		:false,
	},
	
	initialize:function()
	{
		// prefs
			var prefs = new xjsflLib.Prefs();
		
		// auto-size autocomplete box
			autocode.autocomplete.initialize();

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
	},
	
	onLoad:function()
	{
		// places
			document
				.getElementById("placesViewbox")
				.addEventListener('click', autocode.events.onClick);

		// editors
			var container = ko.views.manager ? ko.views.manager.topView : window;
			container
				.addEventListener('keypress', autocode.events.onKeyPress, true);
			
		// initialize
			autocode.initialize();
	},
	
	/**
	 * Set up and handle events
	 * 
	 * - Exec		: CTRL+Enter
	 * - snippets	: Tab in main window
	 * - Comments	: Tab or Return in main window
	 * - Places		: ALT+Click on Places pane
	 */
	events:
	{
		onKeyPress:function(event)
		{
			
			var object, fn, result, names = ['exec', 'snippets', 'comments'];
			for each(var name in names)
			{
				if(autocode.settings[name])
				{
					object	= autocode[name];
					fn		= object['onEvent'];
					/*
					alert('object: ' + object);
					alert('this: ' + this);
					alert(event)
					//inspect(event, 2)
					*/
					
					result	= fn.apply(object);
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
			var result = autocode.places.onEvent.call(autocode.places);
			if(result)
			{
				event.preventDefault();
				event.stopPropagation();
			}
		},
		
		forwardEvent:function(event)
		{
			if(event.type == '')
			{
				
			}
			else if(event.type == '')
			{
				
			}
		}
		
	}

}

window.addEventListener('load',  autocode.onLoad, false);
