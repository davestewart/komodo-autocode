// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████             ████       
//  ██  ██             ██         
//  ██  ██ ████ █████  ██   █████ 
//  ██████ ██   ██ ██ █████ ██    
//  ██     ██   █████  ██   █████ 
//  ██     ██   ██     ██      ██ 
//  ██     ██   █████  ██   █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// Prefs

	// --------------------------------------------------------------------------------
	// debug
	
		//var log		= ko.logging.getLogger("pref-jsfl");
		//log.setLevel(ko.logging.LOG_DEBUG);
		//log.setLevel(ko.logging.LOG_INFO);
	
	// --------------------------------------------------------------------------------
	// globals
	
		if(parent && parent.opener)
		{
			var clear		= window.clear || parent.opener.clear || function(){ };
			var trace		= window.trace || parent.opener.trace || function(){ };
			var ko			= parent.opener.ko;
			var xjsfl		= parent.opener.xjsfl;
			var xjsflLib	= parent.opener.xjsflLib;
		}
	
	// --------------------------------------------------------------------------------
	// variables
	
		var win			= parent && parent.opener ? parent.opener : window;
		var ui			= new xjsflLib.UIManager(this);
		var autocode	= win.autocode;
		var elements	=
		[
			'autocompleteHeight',
			'snippets',
			'console',
			'comments',
			'commentsColumns',
			'commentsFixedWidths',
			'commentsColumnTags',
			'commentsColumnTypes',
			'commentsColumnNames',
			'commentsColumnPadding',
			'places',
			'placesPathType',
			'placesFileTypes',
		];
		
	// --------------------------------------------------------------------------------
	// handlers
	
		function onLoad()
		{
			// load prefs
				ui.loadGroup(elements);
				
			// update filetypes with default if they don't exist yet
				var fileTypes = document.getElementById('placesFileTypes');
				if(fileTypes.value == '')
				{
					fileTypes.value = autocode.places.settings.getDefaultPrefFileTypes();
				}
				
			// tell parent we've loaded
				parent.hPrefWindow.onpageload();
		}
		
		function OnPreferencePageOK()
		{
			// save prefs
				ui.saveGroup();
			
			// update
				window.setTimeout(function(){autocode.initialize.call(autocode); }, 250);
				
			// return
				return true;
		}
		
		function help()
		{
			ko.open.URI('chrome://autocode/content/main/help/index.html', 'browser');
		}
		
	// --------------------------------------------------------------------------------
	// methods
	
