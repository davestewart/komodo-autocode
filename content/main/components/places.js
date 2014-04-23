// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████ ██
//  ██  ██ ██
//  ██  ██ ██ █████ █████ █████ █████
//  ██████ ██    ██ ██    ██ ██ ██
//  ██     ██ █████ ██    █████ █████
//  ██     ██ ██ ██ ██    ██       ██
//  ██     ██ █████ █████ █████ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Places

autocode.places =
{
	settings:
	{
		pathType			:'relative',
		fileTypes			:{},
		dirtyFlags			:
		{
			environment		:false,
			snippets		:false
		},

		/**
		 * Grab the settings from Preferences and turn them into something meaningful for this componant
		 */
		initialize:function()
		{
			// preferences
				//trace('places init:1');
				var prefs			= new xjsflLib.Prefs();

			// preferences
				//trace('places init:2');
				this.pathType		= prefs.getString('autocode.places.pathType', 'relative');

			// file types
				//trace('places init:3');
				var strFileTypes	= prefs.getString('autocode.places.fileTypes', this.getDefaultPrefFileTypes());
				var matches			= strFileTypes.match(/(\w+)\s*:(.+)./mg);
				if(matches)
				{
					this.fileTypes = {};
					for each(var match in matches)
					{
						var parts	= match.split(/\W+/g);
						var group	= parts.shift();
						for each(var part in parts)
						{
							this.fileTypes[part] = group;
						}
					}
				}
		},

		/**
		 * Supplies a list of default group types for the preferences panel
		 */
		getDefaultPrefFileTypes:function()
		{
			var lines = []
			var defaultFileTypes =
			{
				document	:'html htm php asp xml txt',
				link		:'css ico',
				script		:'js vb',
				font		:'ttf otf',
				image		:'png jpg gif bmp',
				embed		:'swf mov',
				video		:'mp4 avi',
				audio		:'ogg mp3'
			};

			for(var name in defaultFileTypes)
			{
				lines.push(name + ': ' + defaultFileTypes[name]);
			}

			return lines.join('\n');
		}
	},

	utils:
	{
		/**
		 * Repeat a string a specified number of times
		 * @param	{String}	str			The string to repeat
		 * @param	{Number}	num			The number of times to repeat the string
		 * @returns {String}
		 */
		repeat:function(value, num)
		{
			return Array(num + 1).join(value);
		},

		/**
		 * Resolves the common (branch) path between 2 paths or URIs
		 * @param	{String}	src		A source path or URI
		 * @param	{String}	trg		A target path or URI
		 * @returns	{String}			The common ancestor path or URI
		 */
		getBranch:function (src, trg)
		{
			// variables
				var branch		= '';
				var srcParts	= src.split('/');
				var trgParts	= trg.split('/');

			// loop over folders and grab common ancestors
				while(srcParts.length > 1 && srcParts[0] == trgParts[0])
				{
					srcParts.shift();
					branch += trgParts.shift() + '/';
				}

			// return
				return branch;
		},

		/**
		 * Resolves a path from the source URI to a target URI, returning a relative path-formatted path
		 * @param	{String}	src			The source path or URI
		 * @param	{String}	trg			The target path or URI
		 * @returns	{String}				The new relative path between the two, or the absolute URI if there's no relationship
		 */
		getPath:function (src, trg)
		{
			// variables
				var trgPath;
				var branch = this.getBranch(src, trg);

			// no relationship, so just return the trgURI
				if(branch === '')
				{
					trgPath = trg;
				}

			// otherwise, determine relationship between srcURI and trgURI
				else
				{
					// grab the remaining segments
						var srcParts	= src.substr(branch.length).split('/');
						var trgParts	= trg.substr(branch.length).split('/');

					// src is same level, so path will be 'trg.txt'
						if(srcParts.length == 1 && trgParts.length == 1)
						{
							trgPath = trgParts.pop();
						}
					// src is below, so path will be '../../trg.txt'
						else if(srcParts.length > 1)
						{
							trgPath = this.repeat('../', srcParts.length - 1) + trgParts.join('/');
						}
					// src is above, so path will be 'path/to/trg.txt'
						else if(srcParts.length < trgParts.length)
						{
							trgPath = trgParts.join('/');
						}
				}

			// return
				return trgPath.replace(/\\/g, '/').replace(/%20/g, ' ');
		},

	},

	/**
	 * Attempts to insert the path of, or generated code relating to, the currently selected file in the Places panel
	 * @returns	{Boolean}		true or false depening on a successful insertion
	 */
	insertPath:function()
	{
		var view = ko.views.manager.currentView;
		if(view)
		{
			// ----------------------------------------------------------------------------------------------------
			// variables

				// debug
					//clear();

				// exit if the file is not saved yet
					var viewDoc	= (view.koDoc || view.document);
				// elements
					var scimoz			= view.scimoz;
					var tree			= document.getElementById("placesViewbox").contentDocument.getElementById('places-files-tree');

				// work out the URI
					var baseURI			= tree.view.currentPlace;
					var itemURI			= tree.view.getURIForRow(tree.currentIndex);
					var viewURI			= viewDoc.file ? viewDoc.file.URI : view.koDoc.baseName;

				// get the paths
					var basePath		= ko.uriparse.URIToPath(baseURI).replace(/\\/g, '/');
					var itemPath		= ko.uriparse.URIToPath(itemURI).replace(/\\/g, '/');
					var viewPath		= ko.uriparse.URIToPath(viewURI).replace(/\\/g, '/');
					var viewExt			= ko.uriparse.ext(viewPath).toLowerCase().substr(1);

				// path variables
					var absPath			= itemPath.substr(basePath.length);
					var relPath			= this.utils.getPath(viewPath, itemPath);
					var path			= this.settings.pathType == 'relative' ? relPath : absPath;
					var file			= ko.uriparse.baseName(path);
					var fileName		= file.split('.').shift();
					var fileExt;
					if(file.indexOf('.') === -1)
					{
						path			= path.replace(/\/*$/, '/');
					}
					else
					{
						fileExt			= file.split('.').pop().toLowerCase();
					}

				// selection variables
					var selStart		= scimoz.selectionStart > 1 ? scimoz.selectionStart - 1 : 0;
					var selEnd			= scimoz.selectionEnd + 1;
					var text			= scimoz.getTextRange(selStart, selEnd);
					
					var hasQuotes		= /^(["']).*\1$/.test(text);
					var hasBrackets		= /^\(.*\)$/.test(text) || /^\[.*\]$/.test(text);
					var hasSelection	= scimoz.anchor != scimoz.currentPos;

				// defaults
					var message			= '';
					var Snippet			= autocode.classes.Snippet;
					var snippet			= new Snippet();

			// ----------------------------------------------------------------------------------------------------
			// find / create the insertion template

				/*
					Here is the order we use to create the path / look for snippets

						> UNMODIFIED

							Add the unmodified path if:

								1a - there's a document selection
								1b - the caret is between 2 matching quotes

						> DOCUMENT DEFAULT

							Use the settings from the Places/Defaults/<ext> files if:

								2 - The view's file extension matches a file name

						> PROJECT VARIABLE OVERRIDE

							Use custom setting from Places/Custom folder if:

								3a - The project environment variable "AUTOCODE PLACE" matches a Places/Custom/<folder>

						> PROJECT NAME OVERRIDE

							Use custom setting from Places/Project folder if:

								3b - The project environment variable "AUTOCODE PROJECT" matches a Places/Projects/<folder>
								3c - The project name matches a Places/Projects/<folder>
								3d - The view's current language and the places file extension matches a Places/<language>/<ext>

						> VIEW LANGUAGE + FILE-TYPE COMBINATION

							Use the settings from the <language>/<file> if:

								4 - The view's current language and file group matches a <folder>/<language>/<group>
								5 - The view's current language and file extension matches a <folder>/<language>/<ext>
								6 - The view's current language and file extension matches a <folder>/<language>/default

						> GLOBAL DEFAULTS

							Final defaults

								7 - Fall back to Places/Defaults/default if it exists
								8 - Enter the path as-is if it doesn't
				*/


				// ----------------------------------------------------------------------------------------------------
				// if there are quotes either side, or there is an existing selection, just add the snippet (just the path) as-is

					if(hasQuotes)
					{
						message			= 'Adding unmodified path for "' +file+ '" (as the caret/selection is between quotes)';
						snippet.value	= path;
					}
					
					else if(hasBrackets)
					{
						message			= 'Adding snippet "Places/default" for "' +file+ '" (as the caret/seletion is between brackets)';
						snippet			= new Snippet('Places/default');
						if( ! snippet.exists )
						{
							message			= 'Adding quoted path \'' +file+ '\' (as the caret/seletion is between brackets)';
							snippet		= new Snippet();
							snippet.value = "'" + path + "'";
						}
					}

					else if(hasSelection)
					{
						message			= 'Adding unmodified path for "' +file+ '" (as the document has a selection)';
						snippet.value	= path;
					}

				// ----------------------------------------------------------------------------------------------------
				// otherwise, we're going to look for snippets

					else
					{
						// ----------------------------------------------------------------------------------------------------
						// variables

							// check if a project folder exists that matches the current project
								var project			= ko.projects.manager.currentProject;
								var projectName		= project ? project.name.split('.').shift() : null;

							// get the project's variables
								var vars			= new xjsflLib.EnvVars();
								var varPlace		= vars.getProject('autocode place');
								var varProject		= vars.getProject('autocode project');

							// get the language & group
								var group			= fileExt ? this.settings.fileTypes[fileExt] : null;
								var lang			= view.koDoc.languageForPosition(scimoz.currentPos);
								var isHTML5			= false;

							// massage languages into better-known types
								if(lang == 'HTML5')
								{
									lang = 'HTML';
									isHTML5 = true;
								}
								if(lang == 'XML' && viewExt == 'xul')
								{
									lang = 'XUL';
								}

							// variables
								var snippetPaths = [ ];

						// ----------------------------------------------------------------------------------------------------
						// build the snippets search path array

							// function
								function addSnippetPaths(path)
								{
									var arr =
									[
										path + '/' + fileExt,
										path + '/default',
									];
									if(group) // insert after ext but before default
									{
										arr.splice(1, 0, path + '/' + group);
									}
									snippetPaths = snippetPaths.concat(arr);
								}

							// Document overrides
								snippetPaths.push('Places/Documents/' + viewExt);

							// Custom place
								if(varPlace)
								{
									addSnippetPaths('Places/Custom/' + varPlace + '/' + lang);
								}

							// Custom Project
								if(varProject)
								{
									addSnippetPaths('Places/Custom/' + varProject + '/' + lang);
								}

							// Project name
								if(projectName)
								{
									addSnippetPaths('Places/Projects/' + projectName + '/' + lang);
								}

							// Language combo
								addSnippetPaths('Places/Languages/' + lang);

							// global default fallback
								snippetPaths.push('Places/default');

						// ----------------------------------------------------------------------------------------------------'../../../_development/test/file types/image.jpg'
						// look for snippets

							// debug
								//clear();
								//inspect(snippetPaths);

							// find the first matching file
								for each(var snippetPath in snippetPaths)
								{
									//trace('snippet path:' + snippetPath)
									snippet = new Snippet(snippetPath);
									if(snippet.exists)
									{
										message	= 'Adding snippet "' +snippetPath+ '" for file "' +file+ '"';
										break;
									}
								}

						// ----------------------------------------------------------------------------------------------------
						// populate the text

							// if we finally have a snippet, now we swap out all the variables
								if(snippet.exists)
								{
									// set up any project variables
										var vars			= new xjsflLib.EnvVars();
										var envData			= vars.getAll();
										var pathData		=
										{
											file			:file,
											filename		:fileName,
											fileext			:fileExt,

											path			:path,
											relpath			:relPath,
											abspath			:absPath,

											folderpath		:path.substr(0, path.length - file.length),
											relfolderpath	:relPath.substr(0, relPath.length - file.length),
											absfolderpath	:absPath.substr(0, absPath.length - file.length),

											uri				:itemURI,
											folderuri		:itemURI.substr(0, absPath.length - file.length),
										}
											
									// if the snippet is HTML5, update any self-closing tags
										if(isHTML5)
										{
											snippet.value = snippet.value.replace(/\s*\/>/g, '>');
										}

									// replace variables
										snippet
											.populate(envData)
											.populate(pathData);
								}

							// if there's still no snippet, just add the path in
								else
								{
									message			= 'Adding path only "' +file+ '" (no snippets found)';
									snippet			= new Snippet();
									snippet.value	= path;
								}

							// debug
								if(false)
								{
									//clear();
									//inspect(this.settings.fileTypes);
									inspect
									(
										{
											group		:group,
											lang		:lang,
											fileExt		:fileExt,
											viewExt		:viewExt,
											snippet		:snippet
										}, 2
									);
								}
					}

			// ----------------------------------------------------------------------------------------------------
			// insert the text

				// update user
					ko.statusBar.AddMessage(message, 'autocode.places', 5000);

				// insert the text
					function insert()
					{
						scimoz.beginUndoAction();
						snippet.insert(view);
						scimoz.gotoPos(scimoz.currentPos);
						scimoz.endUndoAction();
					}
					
				// depending on whether an image or normal file, insert now, or when loaded
					if(/(png|jpg|jpeg|gif)/.test(fileExt))
					{
						var image = new Image();
						image.src = itemURI;
						image.onload = function()
						{
							snippet.populate( {width:image.width, height:image.height} );
							insert();
						}
					}
					else
					{
						insert();
					}

			// ----------------------------------------------------------------------------------------------------
			// done

				return true;
		}
		return false;
	},

	onMouseEvent:function(event)
	{
		if(event.altKey || event.button == 1)
		{
			//if(autocode.checkPrefs())
			return this.insertPath();
		}
		return false;
	},

	initialize:function()
	{
		this.settings.initialize();
	},

	toString:function()
	{
		return '[object autocode.places]';
	}
}

//autocode.places.initialize();
