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
		newline		:true,
		pathType	:'relative',
		fileTypes	:{},
		initialize:function()
		{
			// preferences
				var prefs			= new xjsflLib.Prefs();

			// preferences
				this.newline		= true;
				this.pathType		= prefs.getString('autocode.places.pathType', 'relative');

			// global abbreviations
				var strFileTypes	= prefs.getString('autocode.places.fileTypes', '');
				var matches			= strFileTypes.match(/(\w+):(.+)./mg);
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
		}
	},

	insertPath:function()
	{
		var view = ko.views.manager.currentView;
		if(view)
		{
			// ----------------------------------------------------------------------------------------------------
			// variables

				// exit if the file is not saved yet
					var viewDoc	= (view.koDoc || view.document);
					if( ! viewDoc.file )
					{
						alert('You need to save the file before a path can be added');
						return false;
					}

				// elements
					var scimoz			= view.scimoz;
					var tree			= document.getElementById("placesViewbox").contentDocument.getElementById('places-files-tree');

				// work out the URI
					var baseURI			= tree.view.currentPlace;
					var itemURI			= tree.view.getURIForRow(tree.currentIndex);
					var viewURI			= viewDoc.file.URI;

				// path variables
					var relPath			= this.utils.getPath(viewURI, itemURI);
					var absPath			= itemURI.substr(baseURI.length);
					var path			= this.settings.pathType == 'relative' ? relPath : absPath;
					var file			= path.split('/').pop();
					var fileName		= file.split('.').shift();
					var fileExt;
					if(file.indexOf('.') === -1)
					{
						path	= path.replace(/\/*$/, '/');
					}
					else
					{
						fileExt		= file.split('.').pop();
					}

				// create a default snippet
					var snippet =
					{
						hasAttribute:function(){},
						getStringAttribute:function(){},
						name:'',
						path:'',
						value:path,
						template:''
					}

			// ----------------------------------------------------------------------------------------------------
			// build the text

				// test if position / selection has quotes around it
					var selStart		= scimoz.selectionStart - 1;
					var selEnd			= scimoz.selectionEnd + 1;
					if(selStart < 0)	selStart = 0;
					var text			= scimoz.getTextRange(selStart, selEnd);
					var hasQuotes		= /^(["']).*\1$/.test(text);
					var hasSelection	= scimoz.anchor != scimoz.currentPos;
					
				// if there are quotes either side of the selection, just add the text
					if(hasQuotes || hasSelection)
					{
						ko.statusBar.AddMessage('Adding path for "' +file+ '"', 'autocode.places', 1500);
					}

				// otherwise, we're going to look for an abbreviation
					else
					{
						// get the language & group
							var group		= fileExt ? this.settings.fileTypes[fileExt] : null;
							var lang		= view.koDoc.languageForPosition(scimoz.currentPos);
							var viewExt		= (view.document || view.koDoc).baseName.split('.').pop().toLowerCase();

						// massage languages into better-known types
							if(lang == 'HTML5')
							{
								lang = 'HTML';
							}
							if(lang == 'XML' && viewExt == 'xul')
							{
								lang = 'XUL';
							}

						// attempt to get a group snippet, then if not found, the file snippet
							var _snippet	= ko.abbrev.findAbbrevSnippet(fileExt, 'AutoCode/Places', lang)				// extension
											|| ko.abbrev.findAbbrevSnippet(group, 'AutoCode/Places', lang)			// group
											|| ko.abbrev.findAbbrevSnippet('default', 'AutoCode/Places', lang)		// language default
											|| ko.abbrev.findAbbrevSnippet('default', 'AutoCode/Places');			// global default default
							if(_snippet)
							{
								// update snippet
									snippet.template= _snippet.value;
									snippet.value	= _snippet.value.replace(/!@#\w+/g, '');
									snippet.name	= _snippet.name;
									snippet.path	= _snippet.path.replace(/\\/g, '/').replace(new RegExp('^.+AutoCode/Places/'), '').replace('.komodotool', '');

								// user feedback
									ko.statusBar.AddMessage('Adding "' +snippet.path+ '" snippet for "' +file+ '"', 'autocode.places', 2000);

								// set up any project variables
									var vars		= new xjsflLib.EnvVars();
									var data		= vars.getAll();
									data.file		= file;
									data.filename	= fileName;
									data.fileext	= fileExt;
									data.path		= path;
									data.relpath	= relPath;
									data.abspath	= absPath;
									data.uri		= itemURI;

								// replace variables
									for(var name in data)
									{
										var rx = new RegExp('\\[\\[%tabstop:' +name+ '\\]\\]', 'g');
										snippet.value = snippet.value.replace(rx, data[name]);
									}
							}
							else
							{
								ko.statusBar.AddMessage('Adding default path for "' +file+ '"', 'autocode.places', 2000);
							}

						// debug
							/*
							clear();
							inspect(this.settings.fileTypes);
							inspect
							(
								{
									group:group,
									lang:lang,
									ext:viewExt,
									snippet:snippet
								}, 2
							);
							*/

						// grab current line and test if there's an indent
							var lineIndex		= scimoz.lineFromPosition(scimoz.currentPos);
							var lineStart		= scimoz.positionFromLine(lineIndex);
							var lineEnd			= scimoz.getLineEndPosition(lineIndex);
							var line			= scimoz.getTextRange(lineStart, lineEnd);
							var matches			= line.match(/^(\s*)(.+)?/);

						// if there's no text on the line, add a cariage return
							if( ! matches[2] && this.settings.newline)
							{
								snippet.value += ["\r\n", "\n", "\r"][scimoz.eOLMode] + matches[1];
							}
					}


			// ----------------------------------------------------------------------------------------------------
			// insert the text

				scimoz.beginUndoAction();
				ko.abbrev.insertAbbrevSnippet(snippet, view);
				scimoz.endUndoAction();
				//scimoz.gotoPos(scimoz.currentPos);
				//view.setFocus();

			// ----------------------------------------------------------------------------------------------------
			// done

				return true;
		}
		return false;
	},

	onEvent:function(event)
	{
		if(event.altKey)
		{
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
//autocode.places.settings.initialize();
//autocode.places.insertPath();
