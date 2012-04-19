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
		var settings	=
		[
			['txtAutoCompleteHeight',	'autocode.autocomplete.height',		15],
			['chkSnippets',				'autocode.snippets',				true],
			['chkConsole',				'autocode.console',					true],
			['chkPlaces',				'autocode.places',					true],
			['menuPathType',			'autocode.places.pathType',			'relative'],
			['txtFileTypes',			'autocode.places.fileTypes'],
			['chkComments',				'autocode.comments',				true],
			['chkColumns',				'autocode.comments.columns',		true],
			['chkFixedWidths',			'autocode.comments.fixedWidths',	false],
			['columnTags',				'autocode.comments.columnTags'],
			['columnTypes',				'autocode.comments.columnTypes'],
			['columnNames',				'autocode.comments.columnNames'],
			['columnPadding',			'autocode.comments.columnPadding'],
		];
	
	// --------------------------------------------------------------------------------
	// handlers
	
		function onLoad()
		{
			// load prefs
				ui.loadGroup(settings);
				
			// update filetypes with default if they don't exist yet
				var fileTypes = document.getElementById('txtFileTypes');
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
				var values =
				{
					abbreviations	:ui.get('chkSnippets'),
					console			:ui.get('chkConsole'),
					comments		:ui.get('chkComments'),
					autocomplete	:ui.get('txtAutoCompleteHeight')
				};
				//autocode.updateFromPrefs(values);
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
	
