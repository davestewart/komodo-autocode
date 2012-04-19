// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██                      
//  ██  ██                         
//  ██  ██ ██ █████ ██ ██ ██ █████ 
//  ██  ██ ██ ██ ██ ██ ██ ██ ██    
//  ██  ██ ██ █████ ██ ██ ██ █████ 
//   ████  ██ ██    ██ ██ ██    ██ 
//    ██   ██ █████ ████████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Views

	// ----------------------------------------------------------------------------------------------------
	// setup
	
		if( ! window.xjsflLib ) xjsflLib = {};

	// ----------------------------------------------------------------------------------------------------
	// setup
	
		xjsflLib.views = 
		{
			/**
			 * Get the current view;
			 * @returns		{View}
			 */
			getCurrent:function(returnDocument)
			{
				var view = ko.views.manager.currentView
				return returnDocument ? view.document || view.koDoc : view;
			},
		
			/**
			 * Get all the views in the correct order, so the first tab can be run
			 * @returns {Array}	An array of all open Komodo views
			 */
			getAll:function()
			{
				// get tabbox, tabs and panels
		
					// view
						var view = ko.views.manager.currentView;
		
					// tabbox
						var tabbox = view.parentNode;
						while (tabbox && tabbox.nodeName != "tabbox" && tabbox.nodeName != "xul:tabbox")
						{
							tabbox = tabbox.parentNode;
						}
		
					// tabs and panels
						var tabs		= tabbox._tabs.childNodes
						var tabpanels	= tabbox._tabpanels.childNodes
		
		
				// get views and tabs in the correct order
		
					// views
						var views = {};
						for (var i = 0;  i < tabpanels.length; i++)
						{
							var panel = tabpanels[i];
							views[panel.id] = panel.firstChild;
						}
		
					// tabs
						var tab, view;
						var orderedViews = [];
						for(var i = 0; i < tabs.length; i++)
						{
							tab = tabs[i];
							view = views[tab.linkedPanel];
							if(view && (view.document || view.koDoc) )
							{
								orderedViews.push(view);
							}
						}
		
				// return
					return orderedViews;
			},
		
			/**
			 * Saves the view, and prompts for a new filename if not yet saved
			 * @param	{View}	view		A Komodo view
			 * @returns	{Boolean}			A boolean indicating if the file was successfully saved or not
			 */
			save:function(view)
			{
				// parameters
					view		= view || this.getCurrent();
					
				// variables
					var doc		= view.document || view.koDoc;
					var file	= doc.file;
					var saved	= false;
		
				// save a new document if unsaved or new
					if(file == null || doc.isUntitled)
					{
						if(view.saveAs())
						{
							saved = true;
						}
					}
		
				// otherwise, attempt to save existing document
					else
					{
						if(doc.isDirty)
						{
							try{doc.save(true);saved = true;}
							catch(err){saved = false;}
						}
						else
						{
							saved = true;
						}
					}
		
				// return
					return saved;
			}
		}