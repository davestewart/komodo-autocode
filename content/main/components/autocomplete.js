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
	initialize:function()
	{
		var prefs	= new xjsflLib.Prefs();
		var value	= prefs.getLongPref('codeintel_autocomplete_max_rows');
		this.setSize(value);
	},
	
	setSize:function(value)
	{
		alert('Setting size to ' + value)
		value		= value || 10;
		/*
		var prefs	= new xjsflLib.Prefs();
		prefs.setLong('codeintel_autocomplete_max_rows', value);
		*/
		var prefs = Components.classes['@activestate.com/koPrefService;1'].getService(Components.interfaces.koIPrefService).prefs;
		prefs.setLongPref('codeintel_autocomplete_max_rows', value);
	},
	
	toString:function()
	{
		return '[object autocode.autocomplete]';
	}

}
