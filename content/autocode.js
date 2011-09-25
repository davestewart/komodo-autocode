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
		// comments
			if(prefs.get('boolean', 'AutoCodeComments'))
			{
				autocode.comments.events.add();
			}
			
		// snippets
			if(prefs.get('boolean', 'AutoCodeAbbreviations'))
			{
				autocode.snippets.events.add();
			}
			
		// console
			if(prefs.get('boolean', 'AutoCodeConsole'))
			{
				autocode.console.panel.init();
				autocode.console.events.add();
			}
	},

}

window.addEventListener('load', autocode.onLoad, false);