/**
 * AutoComplete
 *
 * Sets the AutoComplete box height to something more reasonable than the default 5 lines
 *
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	30th December 2011
 */
autocode.autocomplete =
{
	
	size:20,
	
	/**
	 * Sets the size of the code completion items box to 20
	 */
	onViewChange:function(event)
	{
		var view = event.originalTarget;
		if (view && view.scimoz)
		{
			view.scimoz.autoCMaxHeight = this.size;
		}
	},

	/**
	 * Right now, this whole section is unimplemented, and needs a good looking at!
	 */
	setSizePref:function(value)
	{
		// variables
			value		= value || 20;
			this.size 	= value;
			
		// store preference
		
		/**
		 * HACK: Added in try block so it v6 ignores it. Too busy to work out the code for both right now, sorry!
		 * Should really use the prefs object
		 */
		try
		{
			//prefs.set('number', 'autocomplete.maxHeight', 20);
			
			// variables
				var autocomplete;
				var prefs = Components.classes['@activestate.com/koPrefService;1'].getService(Components.interfaces.koIPrefService).prefs;
	
			// grab / create autocmplete main preference
				if (prefs.hasPref("autocomplete"))
				{
					autocomplete = prefs.getPref("autocomplete");
				}
				else
				{
					autocomplete = Components.classes["@activestate.com/koPreferenceSet;1"].createInstance(Ci.koIPreferenceSet);
					prefs.setPref("autocomplete", autocomplete);
				}
	
			// set max height preference
				autocomplete.setLongPref('maxHeight', value);

		}
		catch(err)
		{
			
		}

	},
		
	toString:function()
	{
		return '[object autocode.autocomplete]';
	}

}
