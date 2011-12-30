/**
 * AutoCode
 *
 * Adds autocompleting features for abbreviations and doc comments
 *
 * @author	Dave Stewart
 * @version	0.3
 * @date	September 22nd 2011
 */
autocode =
{

	onLoad:function()
	{
		// auto-size autocomplete box
			window.addEventListener('current_view_changed', autocode.autocomplete.onViewChange, false);

		// comments
			if(prefs.get('boolean', 'AutoCodeComments'))
			{
				autocode.events.add(autocode.comments.onKeyPress);
			}

		// abbreviations / snippets
			if(prefs.get('boolean', 'AutoCodeAbbreviations'))
			{
				autocode.events.add(autocode.snippets.onKeyPress);
			}

		// console
			if(prefs.get('boolean', 'AutoCodeConsole'))
			{
				autocode.console.panel.init();
				autocode.events.add(autocode.console.onKeyPress);
			}

		// execute local files
			if(true)
			{
				autocode.events.add(autocode.exec.onKeyPress);
			}
			
	},
	
	/**
	 * Handles keyboard events only
	 */
	events:
	{
		add:function(handler)
		{
			this.remove(handler);
			var container = ko.views.manager ? ko.views.manager.topView : window;
			container.addEventListener('keypress', handler, true);
		},

		remove:function(handler)
		{
			try
			{
				var container = ko.views.manager ? ko.views.manager.topView : window;
				container.removeEventListener('keypress', handler, true);
			}
			catch(err)
			{
				// do nothing
			}
		},
		
	}

}

window.addEventListener('load',  autocode.onLoad, false);