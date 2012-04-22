

/*
var toolbox = document.getElementById('toolbox2viewbox')
var tree	= toolbox.contentDocument.getElementById('toolbox2-hierarchy-treebody')

clear();
inspect(tree, 1)
*/
	
	// ----------------------------------------------------------------------------------------------------
	// globals
	
		// globals
			var JSON		= Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
			
	// ----------------------------------------------------------------------------------------------------
	// instantiation
	
		// get the toobox path
			var snippet		= ko.abbrev.findAbbrevSnippet('AutoCode', 'AutoCode');
			var toolbox		= snippet.path.replace(/Abbreviations.+$/, '').replace(/\\/g, '/');
			
	// ----------------------------------------------------------------------------------------------------
	// preparation
	
		// create the snippet
			var snippet =
			{
				hasAttribute:function(){},
				getStringAttribute:function(){},
				name:'',
				path:'',
				value:'',
				template:''
			}
			
		// get the project name
			var proj		= ko.projects.manager.currentProject;
			var projName	= proj ? proj.name.split('.').shift() : '';
			
		// get the language variables
			var lang		= 'JavaScript';
			var path		= 'path/to/file.js'
			var fileExt		= 'js';
			
	// ----------------------------------------------------------------------------------------------------
	// get the snippets
	
		// build the paths
			var snippetPaths =
			[
				toolbox + 'Places/Projects/' +projName + '/' + lang + '/' + fileExt + '.komodotool',
				toolbox + 'Places/Languages/' + lang + '/' + fileExt + '.komodotool',
				toolbox + 'Places/Default/' + fileExt + '.komodotool',
				toolbox + 'Places/Default/default.komodotool',
			]
			
		// find the first matching file
			var file, value;
			for each(var snippetPath in snippetPaths)
			{
				file = new xjsflLib.File(snippetPath);
				if(file.exists)
				{
					trace(snippetPath);
					var contents	= file.read();
					var json		= JSON.decode(contents);
					value			= json.value.join('\n');
					break;
				}
			}
			
		// update snippet
			if(value)
			{
				snippet.value = value;
			}
			
	// ----------------------------------------------------------------------------------------------------
	// all done and insert
	
		// insert the snippet into the document
			var view		= ko.views.manager.currentView;	
			ko.abbrev.insertAbbrevSnippet(snippet, view)
		
		
