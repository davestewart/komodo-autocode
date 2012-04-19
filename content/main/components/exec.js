// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                   
//  ██                       
//  ██     ██ ██ █████ █████ 
//  █████  ██ ██ ██ ██ ██    
//  ██      ███  █████ ██    
//  ██     ██ ██ ██    ██    
//  ██████ ██ ██ █████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Exec

/**
 * Allows the user to run JavaScript directly in the Komodo Editor, or run the current
 * batch file, by pressing CTL+Enter
 * 
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	6th October 2011
 */
autocode.exec =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		onEvent:function(event)
		{
			if (event.keyCode === 13 && event.ctrlKey)
			{
				if(this.view())
				{
					return true;
				}
			}
			return false;
		},
		
		view:function()
		{
			var view = ko.views.manager.currentView;
			if(view)
			{
				var doc = view.document || view.koDoc;
				if(doc)
				{
					var url	= view.item.url;
					
					if(/\.js$/.test(url))
					{
							/**
							 * @type {Components.interfaces.ISciMoz}
							 */
							var scimoz		= view.scimoz;

						// get selection
							var selection	= scimoz.getTextRange(view.scimoz.selectionStart, view.scimoz.selectionEnd);

						// run
							ko.statusBar.AddMessage('Evaluating JavaScript...', 'AutoCode', 500, false);
							try
							{
								eval(selection || view.scimoz.text);
							}
							catch(err)
							{
								scimoz.gotoLine(err.lineNumber - 53); // magic number for komodo edit 6
								alert(err);
							}

						// cancel
							event.preventDefault();
							event.stopPropagation();
							return true;
					}
					
					else if(/\.bat$/.test(url))
					{
						var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
						file.initWithPath(ko.uriparse.URIToPath(url));
						file.launch();
						return true;
					}
					

				}
			}
			return false;
		},
		
		toString:function()
		{
			return '[object autocode.exec]';
		}

}

