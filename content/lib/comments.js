/**
 * Auto-Comment
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	23rd September 2011
 * 
 * Comments PHP, JavaScript and ActionScript code by typing /** above classes, functions and variables
 *
 * Features:
 * 
 *  - Supports PHP, JavaScript and ActionScript
 *  - Guesses parameter types
 *  - Supports fixed and auto-sizing columns
 *  - Preferences panel
 *
 * Based on original code by Nathan Rijksen (http://naatan.com/)
 *  
 */
autocode.comments =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		events:
		{
			add:function()
			{
				this.remove();
				ko.views.manager.topView.addEventListener('keypress', this.onKeyPress, true);
			},

			remove:function()
			{
				if (autocode && autocode.comments.onKeyPress)
				{
					ko.views.manager.topView.removeEventListener('keypress', this.onKeyPress, true);
				}
			},

			onKeyPress:function(event)
			{
				// Only trap when ENTER pressed with no modifiers
				if (event.keyCode === 13 &&  ( ! event.ctrlKey && ! event.altKey && ! event.shiftKey ) )
				{
					if(autocode.comments.processInput())
					{
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		},

	// ----------------------------------------------------------------------------------------------------
	// Prefs
	// ----------------------------------------------------------------------------------------------------

		prefs:
		{
			tabWidth:		4,
			padding:		1,
			fixedWidths:	{tag:7, type:15, name:15},
			useFixedWidths:	false
		},

		styles:
		{
			exts:
			{
				php:	[/^php\d?$/i],
				js:		[/^(js\w*|as)$/i]
			},
			pref:		'php',
			associate:function(rx, style)
			{
				if(/^(php|js)$/i.test(style))
				{
					this.exts[style].push(rx);
				}
			}
		},

	// ----------------------------------------------------------------------------------------------------
	// Input
	// ----------------------------------------------------------------------------------------------------


		processInput:function()
		{
			// variables
				var view			= ko.views.manager.currentView;

				/**
				 * @type {Components.interfaces.ISciMoz}
				 */
				var scimoz			= view.scimoz;

			// Don't do anything if there is a selection within the document
				if (scimoz.anchor != scimoz.currentPos)
				{
					return false;
				}

			// grab last 3 characters so we can test for /**
				var currentPos		= scimoz.currentPos;
				var text			= scimoz.getTextRange(currentPos - 3, currentPos);

			// test for opening block comment
				if (text !== null && text == '/**')
				{
					// get the contents of the next line
						var lineIndex			= scimoz.lineFromPosition(currentPos);
						var nextLineStart		= scimoz.positionFromLine(lineIndex + 1);
						var nextLineEnd			= scimoz.getLineEndPosition(lineIndex + 1);
						var nextLine			= scimoz.getTextRange(nextLineStart, nextLineEnd);

					// return early if the next line already starts with whitespace + a star character
						if (/^[\t ]*\*/.test(nextLine))
						{
							return false;
						}

					// get doc style-type
						var ext = view.item.url.split('.').pop();
						for(var style in this.styles.exts)
						{
							for each(var rx in this.styles.exts[style])
							{
								if (rx.test(ext))
								{
									return this.processOutput(scimoz, nextLine, style);
								}
							}
						}

					// fall back to default style
						return this.processOutput(scimoz, nextLine, this.styles.pref);
				}

			// return false
				return false;
		},

	// ----------------------------------------------------------------------------------------------------
	// Output
	// ----------------------------------------------------------------------------------------------------

		processOutput:function(scimoz, line, style)
		{
			// --------------------------------------------------------------------------------
			// utilities

				function createTabstop(text)
				{
					return '[[%tabstop:' +text+ ']]';
				}
				
				function pad(str, strWidth, width, tabWidth, padding)
				{
					// set virtual width to the initial string width
						var output	= '';

					// pad initial word to the next column
						var mod		= strWidth % tabWidth;
						if(mod != 0)
						{
							output		+= '\t';
							strWidth	+= (tabWidth - mod);
						}

					// while the column is smaller than the max width, pad to fit
						while(strWidth <= width + (padding * tabWidth))
						{
							strWidth	+= tabWidth;
							output		+= '\t';
						}

					// add any extra gutters between columns
						//output += new Array(padding).join('\t')

					// return
						return str + output;
				}

			// --------------------------------------------------------------------------------
			// Objects

				function Tag(tag, value)
				{
					// values
						this.tag		= tag;
						this.value		= value;
					
					// update global column widths (declared in createOutput()) to the widest widths
						widths.tag		= Math.max(this.tag.length, widths.tag);
					
					// to string
						this.toString = function()
						{
							var output = ' * @';
							output += pad(this.tag, this.tag.length, widths.tag, tabWidth, autocode.comments.prefs.padding);
							output += this.value + '\n';
							return output;
						}
				}
				
				function Line(value)
				{
					this.value	= value;
					this.toString = function()
					{
						return ' * ' + this.value + '\n';
					}
				}


				/**
				 * The Param class is an object-oriented wrapper to create rows and columns of param types
				 * @param		{String}		tag			The tag of param, i.e. @param, @returm
				 * @param		{String}		type		The datatype of the param (if relevant)
				 * @param		{String}		name		The name of the param
				 * @returns		{String}					A description of the param or return type
				 */
				function Param(tag, type, name)
				{
					// param values
						this.tag		= tag;
						this.type		= type || '';
						this.name		= name || '';
						
					// grab the text without any [[%tabstop:]] code
						this.tagWidth	= this.tag.replace(/\[\[%tabstop:|\]\]/g, '').length;
						this.typeWidth	= this.type.replace(/\[\[%tabstop:|\]\]/g, '').length;
						this.nameWidth	= this.name.replace(/\[\[%tabstop:|\]]/g, '').length;

					// update global column widths (declared in createOutput()) to the widest widths
						widths.tag		= Math.max(this.tagWidth, widths.tag);
						widths.type		= Math.max(this.typeWidth, widths.type);
						widths.name		= Math.max(this.nameWidth, widths.name);
						
					// ensure no width is a multiple of a tab width, because there will be no gutter
						for (var width in widths)
						{
							if(widths[width] % tabWidth == 0)
							{
								widths[width]++;
							}
						}

					// to string
						/**
						 * Converts the Param class to a String
						 * @param			{Number}		padding		The number of extra tabs to add
						 * @returns			{String}					A @param or @returns row
						 */
						this.toString = function(padding)
						{
							var output = ' * @';
							output += pad(this.tag, this.tagWidth, widths.tag, tabWidth, autocode.comments.prefs.padding);
							output += pad(this.type, this.typeWidth, widths.type, tabWidth, autocode.comments.prefs.padding);
							output += pad(this.name, this.nameWidth, widths.name, tabWidth, autocode.comments.prefs.padding);
							output += tabstopDesc + '\n';
							return output;
						}
				}

			// --------------------------------------------------------------------------------
			// processing functions

				function processFunction(matches)
				{
					// --------------------------------------------------------------------------------
					// function components

						function getType(value)
						{
							value = String(value).toLowerCase();
							if(value == undefined)
							{
								return 'Object';
							}
							if(/^true|false$/.test(value))
							{
								return 'Boolean';
							}
							if( ! isNaN(parseInt(value)))
							{
								return 'Number';
							}
							if(/["']/.test(value))
							{
								return 'String';
							}
							return 'Object';
						}

						function processParams(strParams)
						{
							// rx
								var rxParam		= /([$\w]+)[\s:]?([$\w\*]+)?([^,\)]*)/;
								var rxParams	= new RegExp(rxParam.source, 'g');

							// variables
								var params		= [];
								var matches		= strParams.match(rxParams);

							// loop over params
								for each(var match in matches)
								{
									// match parts
										var name;
										var type	= 'Object';
										var parts	= match.match(rxParam);
										
									// attempt to determine data type of optional parameters
										if(parts[3])
										{
											type = getType(parts[3].replace(/^[\s=]*/, ''));
										}
										
									// create Param object
										if(style == 'js')
										{
											type		= createTabstop(parts[2] || type);
											name		= parts[1];
											params.push(new Param('param', '{' + type + '}', name));
										}
										else
										{
											type		= parts[2] == null ? type : parts[1];
											name		= parts[2] == null ? parts[1] : parts[2];
											params.push(new Param('param', createTabstop(type), name));
										}
								}

							// return
								return params;
						}

						/**
						 * Processes the return type of a match and returns a Param object
						 * @param		{String}	type	The String type of an object
						 * @returns		{Param}				A Param instance
						 */
						function processReturn(type)
						{
							var tabstop = style == 'js' ? '{' + createTabstop(type || 'Object') + '}' : createTabstop(type || 'Object')
							return new Param('returns', tabstop, '');
						}

					// --------------------------------------------------------------------------------
					// process

						// create components
						// (params & returns need to be processed first as they all contribute towards setting the global column widths)
							var params	= processParams(matches[1]);
							var returns	= processReturn(matches[2]);
							
						// process user components
							var common	= processSnippet('common');
							var user	= processSnippet('function');
							
						// add all components to a single array
							var lines	= [].concat(common, user, params, returns);

						// output
							var output = '\n';
							output += ' * [[%tabstop:Summary]]\n';
							if(lines && lines.length)
							{
								for each(var line in lines)
								{
									output += line.toString(this.prefs.padding);
								}
							}
							output += ' */';

						// trace
							return output;
				}

				function processClass()
				{
					// process user components
						var common	= processSnippet('common');
						var user	= processSnippet('class');
						
					// pre-process output
						var lines	= [].concat(common, user);
						
					// create
						var output = '\n';
						output += ' * [[%tabstop:Summary]]\n';
						if(lines && lines.length)
						{
							for each(var line in lines)
							{
								output += line.toString(this.prefs.padding);
							}
						}
						output += ' */';
						
						return output;
				}

				function processVariable()
				{
					if (style == 'php')
					{
						return '\n * @var ' + tabstopType + ' ' + tabstopDesc + '\n */';
					}
					else if (style == 'js')
					{
						return ' @type {' + tabstopType + '} ' + tabstopDesc + ' */';
					}
					return '';
				}
				
				function processSnippet(type)
				{
					// grab snippet value
						var snippet			= ko.abbrev.findAbbrevSnippet('autocomment ' + type, 'Auto Comment');
						var value			= snippet ? snippet.value.replace(/!@#\w+/g, '') : '';
						
					// if we get a snippet, break the snippet into lines and process
						if(value)
						{
							var lines	= value.split(/\r\n|\r|\n/g);
							var params	= [];
							for each(var line in lines)
							{
								line = line.replace(/^\s+\*\s*/, '');
								var matches = line.match(/@(\w+)\s+(.+)/);
								if(matches)
								{
									var param = new Tag(matches[1], matches[2]);
								}
								else
								{
									var param = new Line(line);
								}
								params.push(param);
							/*
						*/
							}
							return params;
						}
						
					// return
						return [];//value != '' ?  value + '\n' : '';
				}

				
			// --------------------------------------------------------------------------------
			// variables

				// matching parameters
					var rxClass			= /^\s*?class/i;
					var rxVariable		= /^\s*?(?:var|private|public|protected)/;
					var rxFunction		= /\bfunction\b\s*(?:\w*)\s*\((.*)\):?([\w\*]+)?/
					
				// grab prefs
					autocode.comments.prefs.padding = parseInt(prefs.get('string', 'AutoCodeColumnPadding') || 0);
					var fixedWidths =
					{
						tag:	parseInt(prefs.get('string', 'AutoCodeColumnTags')) || 7,
						type:	parseInt(prefs.get('string', 'AutoCodeColumnTypes')) || 15,
						name:	parseInt(prefs.get('string', 'AutoCodeColumnNames')) || 15,
					};
					var useFixedWidths	= prefs.get('boolean', 'AutoCodeColumns');
					
				// variables
					var tabWidth		= this.prefs.tabWidth;
					var widths			= useFixedWidths ? fixedWidths : {tag:0, type:0, name:0};
					var matches			= null;
					var snippet			= '';

				// tabstops
					var tabstopType		= '[[%tabstop:Object]]';
					var tabstopDesc		= '[[%tabstop:Description]]';


			// --------------------------------------------------------------------------------
			// process

				// process the next line

					if(rxClass.test(line))
					{
						snippet		= processClass();
					}
					else if(rxFunction.test(line))
					{
						snippet		= processFunction.call(this, line.match(rxFunction));
					}
					else if(rxVariable.test(line))
					{
						snippet		= processVariable();
					}
					else
					{
						return false;
					}

				// create the snippet

					var snippetObj =
					{
						value: snippet,
						name: 'autodoc snippet',
						indent_relative: 'true',
						hasAttribute: function (name)
						{
							return name in this;
						},
						getStringAttribute: function (name)
						{
							return this[name];
						}
					};

				// insert snippet
					scimoz.beginUndoAction();
					ko.projects.snippetInsert(snippetObj);
					scimoz.endUndoAction();

				// return
					return true;
		}
		
		/*
		
		function test(a, b, c)
		{
				
		}
		
		*/

};