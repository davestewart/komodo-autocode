/**
 * AutoCode
 *
 * Adds autocompleting features for abbreviations and doc comments
 *
 * @author	Dave Stewart
 * @date	September 22nd 2011
 */
autocode =
{
	onLoad:function()
	{
		if(prefs.get('boolean', 'AutoCodeComments'))
		{
			autocode.comments.events.add();
		}
		
		if(prefs.get('boolean', 'AutoCodeAbbreviations'))
		{
			autocode.snippets.events.add();
		}
		
		if(prefs.get('boolean', 'AutoCodeConsole'))
		{
			autocode.console.events.add();
		}
	},

}

window.addEventListener("load", autocode.onLoad, false);
