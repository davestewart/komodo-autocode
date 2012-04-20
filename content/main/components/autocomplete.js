// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████        ██         ██████                      ██        ██
//  ██  ██        ██         ██                          ██        ██
//  ██  ██ ██ ██ █████ █████ ██     █████ ████████ █████ ██ █████ █████ █████
//  ██████ ██ ██  ██   ██ ██ ██     ██ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██   ██ ██
//  ██  ██ ██ ██  ██   ██ ██ ██     ██ ██ ██ ██ ██ ██ ██ ██ █████  ██   █████
//  ██  ██ ██ ██  ██   ██ ██ ██     ██ ██ ██ ██ ██ ██ ██ ██ ██     ██   ██
//  ██  ██ █████  ████ █████ ██████ █████ ██ ██ ██ █████ ██ █████  ████ █████
//                                                 ██
//                                                 ██
//
// ------------------------------------------------------------------------------------------------------------------------
// AutoComplete

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
	prefName:'codeintel_autocomplete_max_rows',
	
	initialize:function()
	{
		var value;
		try { value = ko.prefs.getLongPref(this.prefName); }
		catch(err) { value = 10; }
		this.setSize(value);
	},

	setSize:function(value)
	{
		value = value || 10;
		ko.prefs.setLongPref(this.prefName, value);
	},

	toString:function()
	{
		return '[object autocode.autocomplete]';
	}

}
