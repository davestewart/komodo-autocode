/**
 * Console
 *
 * Allows the user to execute a file directly by pressing CTRL+Enter
 *
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	6th October 2011
 */
autocode.exec =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		onKeyPress:function(event)
		{
			if (event && event.keyCode === 13 && event.ctrlKey)
			{
				var view	= ko.views.manager.currentView;
				if(view && view.koDoc)
				{
					var url	= view.item.url;
					if(/\.(bat)$/.test(url))
					{
						// run file
							var file	= Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							file.initWithPath(ko.uriparse.URIToPath(url));
							file.launch();

						// cancel
							event.preventDefault();
							event.stopPropagation();
							return true;
					}
				}
			}
			return false;
		}

}
