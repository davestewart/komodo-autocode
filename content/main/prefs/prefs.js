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
			var inspect		= window.inspect || parent.opener.inspect || function(){ };
			var ko			= parent.opener.ko;
			var xjsflLib	= parent.opener.xjsflLib;
		}

	// --------------------------------------------------------------------------------
	// variables

		var win			= parent && parent.opener ? parent.opener : window;
		var ui			= new xjsflLib.UIManager(this);
		var autocode	= win.autocode;

	// --------------------------------------------------------------------------------
	// handlers

		function onLoad()
		{
			// load prefs
				ui.loadGroup();

			// update snippets ignore values with default if they don't exist yet
				var snippetsIgnore = document.getElementById('snippetsIgnore');
				if(snippetsIgnore.value == '')
				{
					snippetsIgnore.value = autocode.snippets.settings.getDefaultIgnore();
				}

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
			ui.saveGroup();
			return true;
		}
		
		function OnPreferencePageClosing(prefset, ok)
		{
			autocode.events.onPrefsUpdated();
		}

		function help()
		{
			ko.open.URI('chrome://autocode/content/main/help/index.html', 'browser');
		}

	// --------------------------------------------------------------------------------
	// methods
