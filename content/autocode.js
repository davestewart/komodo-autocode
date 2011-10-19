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
            window.addEventListener('current_view_changed', autocode.tools.resizeAutocomplete, false);

		// autocomplete max height
			//prefs.set('number', 'autocomplete.maxHeight', 20);

		// comments
			if(prefs.get('boolean', 'AutoCodeComments'))
			{
				autocode.events.add(autocode.comments.onKeyPress);
			}

		// snippets
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

	events:
	{
		add:function(handler)
		{
			this.remove(handler);
			ko.views.manager.topView.addEventListener('keypress', handler, true);
		},

		remove:function(handler)
		{
			if (autocode && this.onKeyPress)
			{
				ko.views.manager.topView.removeEventListener('keypress', handler, true);
			}
		}
	},

	//TODO Add all event binding code to this

    tools:
    {
        /**
         * Sets the size of the code completion items box to 20
         */
        resizeAutocomplete:function(event)
        {
            var view = event.originalTarget;
            if (view && view.scimoz)
            {
                view.scimoz.autoCMaxHeight = 20;
            }
        }
    }

}

window.addEventListener('load', autocode.onLoad, false);