// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████                         ██
//  ██                             ██
//  ██     █████ █████ █████ █████ ██ █████
//  ██     ██ ██ ██ ██ ██    ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ █████ ██ ██ ██ █████
//  ██     ██ ██ ██ ██    ██ ██ ██ ██ ██
//  ██████ █████ ██ ██ █████ █████ ██ █████
//
// ------------------------------------------------------------------------------------------------------------------------
// Console

/**
 * Console
 *
 * Adds some global functions which provide extra functionality to output to the command output
 *
 * Allows the user to run JavaScript directly in the Komodo Editor, or run the current
 * batch file, by pressing CTL+Enter
 *
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	23rd September 2011
 */
autocode.console =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		onEvent:function(event)
		{
			if (event.keyCode === 13 && event.ctrlKey)
			{
				if(this.exec())
				{
					return true;
				}
			}
			return false;
		},

	// ----------------------------------------------------------------------------------------------------
	// objects
	// ----------------------------------------------------------------------------------------------------

		initialize:function()
		{
			this.panel.initialize();
		},

		exec:function()
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

		panel:
		{
			/** @type {Components.interfaces.ISciMoz} */
			scimoz:null,
			newline:'\n',
			initialize:function()
			{
				// get the panel (v7 & previous)
					var tabpanel					= document.getElementById("runoutput-desc-tabpanel");
					var container					= tabpanel && tabpanel.contentDocument ? tabpanel.contentDocument : document;
					autocode.console.panel.scimoz	= container.getElementById("runoutput-scintilla").scimoz;

				// panel properties
					autocode.console.panel.newline = ["\r\n", "\n", "\r"][autocode.console.panel.scimoz.eOLMode];
					autocode.console.panel.scimoz.tabWidth = 4;

				// return
					return autocode.console.panel.scimoz;
			}
		},

	// ----------------------------------------------------------------------------------------------------
	// utils
	// ----------------------------------------------------------------------------------------------------

		utils:
		{
			saveFile:function(data)
			{
				// temp path
					var path = Components.classes['@mozilla.org/file/directory_service;1']
						.getService(Components.interfaces.nsIProperties)
						.get("TmpD", Components.interfaces.nsIFile)
						.path + '/' + 'autocode.txt';

				// write file
					var file	= Components.classes["@activestate.com/koFileEx;1"].createInstance(Components.interfaces.koIFileEx);
					file.path	= path;
					file.open('w');
					file.puts(data);
					file.close();

				// open file
					ko.open.URI(ko.uriparse.pathToURI(path));
			},

			copyString:function(str)
			{
				Components
					.classes["@mozilla.org/widget/clipboardhelper;1"]
					.getService(Components.interfaces.nsIClipboardHelper)
					.copyString(str);
			}
		},

	// ----------------------------------------------------------------------------------------------------
	// Output
	// ----------------------------------------------------------------------------------------------------

		trace:function(strIn)
		{
			try {

				// First make sure the command output window is visible
					//ko.run.output.show(window, false);

				// scimoz
					var scimoz		= autocode.console.panel.scimoz;
					if(!scimoz)
					{
						scimoz = autocode.console.panel.initialize();
					}

				// scimoz variables
					var newline		= autocode.console.panel.newline;
					var ro			= scimoz.readOnly;

				// text variables
					var strOut			= strIn + newline;
					var strOutLength	= ko.stringutils.bytelength(strOut);

				// add the text
					try
					{
						scimoz.readOnly = false;
						scimoz.appendText(strOutLength, strOut);
					}
					finally
					{
						scimoz.readOnly = ro;
					}

				// Bring the new text into view.
					scimoz.gotoPos(scimoz.length + 1);

				// unfocus
					//scimoz.isFocused = false

			}
			catch(err)
			{
				alert("Problems tracing [" + strIn + "]: " + err);
			}
		},

		clear:function()
		{
			// scimoz
				var scimoz		= autocode.console.panel.scimoz;
				if(!scimoz)
				{
					scimoz = autocode.console.panel.initialize();
				}

			// clear
				scimoz.readOnly		= false;
				scimoz.selectAll();
				scimoz.deleteBack();
				scimoz.readOnly		= true;
		},

		/**
		 * Lists the properties of an object in a human-readable format
		 * @param		{Object}	arr				An object whose properties you wish to list
		 * @param		{Array}		arr				An Array of objects with selected properties you wish to list
		 * @param		{String}	properties		An optional property to list, defaults to 'name'
		 * @param		{Array}		properties		An optional Array of properties
		 * @param		{String}	label			An optional String label, defaults to "List"
		 * @param		{Boolean}	output			An optional boolean to indicate output type: true=debug, false=return, undefined=output
		 * @returns		{String}					A String list of the object's properties
		 */
		list:function(arr, properties, label, output)
		{
			// catch null values
				if( ! arr)
				{
					throw new ReferenceError('ReferenceError: console.list(): parameter "arr" is undefined');
				}

			// defaults
				label			= label || 'List';
				properties		= properties || 'name';

			// variables
				var strOutput	= '';

			// if arr is an array, grab selected properties
				if(arr instanceof Array)
				{
					// collect object to string only
						if(properties == null)
						{
							arr			= arr.map(function(e){return String(e)});
						}
					// collect children's properties
						else
						{
							arr			= xjsfl.utils.getValues(arr, properties);
						}

					// trace
						strOutput = this.inspect(arr, label, properties instanceof Array ? 2 : 1, output);
				}

			// if arr is an object, just output the top-level key/values
				else
				{
					 strOutput = this.inspect(arr, label, 1, output, {'function':false});
				}

			// output
				return strOutput;
		},

		/**
		 * Output object in hierarchical format
		 * @param		{Object}		obj		Any Object or value
		 * @param		{String}		arg		An optional String label (defaults to "Inspect")
		 * @param		{Number}		arg		An optional max depth to recurse to (defaults to 3)
		 * @param		{Boolean}		arg		An optional boolean to indicate output type: true=debug, false=return, undefined=output
		 * @param		{Object}		arg		An optional filter object to tell the outputter what to print, ie {'function':false, 'xml':false}. Allowed types: ['object', 'string', 'array', 'number', 'xml', 'object', 'boolean', 'function', 'undefined', 'null']
		 * @param		{Function}		arg		An optional output function in case you want to do any custom processing of the data
		 * @returns		{String}				A String hierarchy of the object's properties
		 */
		inspect:function(obj, arg2, arg3, arg4, arg5)
		{
			//TODO Add option to skip underscore properties. If signature gets complex, use an {options} object
			//TODO Maybe just have an include object, which could be like {underscores:false, functions:false,strings:false}
			//TODO Refactor all iteration to the Data class
			//TODO For callback / debug, output to file in two separate passes - 1:key, 2:value, that way you get to see the actual key name who's value breaks the iteration
			//TODO Refactor {filter} argument to an {options} object so many parameters can be passed in

			// ---------------------------------------------------------------------------------------------------------------------
			// methods

				// -------------------------------------------------------------------------------------------------------
				// traversal functions

					function processValue(value)
					{
						// get type
							var type = getType(value);

						// compound
							if (type === 'object')
							{
								processObject(value);
							}
							else if (type === 'array')
							{
								processArray(value);
							}

						// simple
							else
							{
								output(getValue(value));
							}
					}


					function processObject(obj)
					{
						down(obj);
						for (var key in obj)
						{
							//fl.trace('~' + key)
							if( ! key.match(rxIllegal))// && obj.hasOwnProperty(i)
							{
								processLeaf(obj, key);
							}
							else
							{
								output(' ' + key + ": [ SKIPPING! ]");
							}
						}
						up();
					}

					function processArray(arr)
					{
						down(arr);
						for (var i = 0; i < arr.length; i++)
						{
							processLeaf(arr, i);
						}
						up();
					}

					function processLeaf(value, key)
					{
						// --------------------------------------------------------------------------------
						// update stack

							// keys stack
								keys[keys.length - 1] = key;

							// debug
								//trace(keys.join('.') + ' ' + type);

						// --------------------------------------------------------------------------------
						// checks

							// quit if max depth reached
								if (indent.length > maxDepth)
								{
									return false;
								}

							// quit if max objects reached
								if(stats.values > maxValues)
								{
									return false;
								}

							// skip prototypes (seems to cause silent errors. Not sure if this is an issue with prototypes, or just some classes)
								// trace(key);
								if(key === 'prototype')
								{
									//return false;
								}

						// --------------------------------------------------------------------------------
						// pre-process

							// variables
								key = key !== undefined ? key :  null;

							// check value is gettable
								try
								{
									value[key];
								}
								catch(err)
								{
									output(' ' + key + ": [ UNABLE TO GET VALUE ]");
									return false;
								}

							// get type
								var type		= getType(value[key]);

							// skip if filter is set to false
								//trace(value + ':' + type)
								if(filter[type] === false)
								{
									return false;
								}

						// --------------------------------------------------------------------------------
						// process

							// if compound, recurse
								if (type === 'object' || type === 'array')
								{
									// TODO Check if we need the compound recursion check, and if a stack.indexOf(value[key]) would suffice
									if(checkRecursion())
									{
										stats.objects++;
										var className = getType(value[key], true);
										output("[" + key + "] => " +className);
										type == 'object' ? processObject(value[key]) : processArray(value[key]);
									}
									else
									{
										output(' ' + key + ": [ RECURSION! ]");
									}
								}

							// if simple, output
								else
								{
									stats.values++;
									output(' ' + key + ": " + getValue(value[key]));
								}

							// return
								return true;
					}

				// -------------------------------------------------------------------------------------------------------
				// output functions

					function output(str)
					{
						// get output
							var output = indent.join('') + str
							strOutput += output + '\n';

						// if callback, call it
							if(callback)
							{
								callback(output);
							}

						// if debugging, output immediately
							if(debug)
							{
								this.trace('	' + output);
							}
					}

					function down(obj)
					{
						stack.push(obj);
						keys.push('<value>')
						indent.push('\t');
						//fl.trace('\n>>>>>' + stack.length + '\n')
					}

					function up()
					{
						stack.pop();
						keys.pop();
						indent.pop();
						//fl.trace('\n>>>>>' + stack.length + '\n')
					}


				// -------------------------------------------------------------------------------------------------------
				// utility functions

					function checkRecursion()
					{
						for (var i = 0; i < stack.length - 1; i++)
						{
							for (var j = i + 1; j < stack.length; j++)
							{
								if(stack[i] === stack[j])
								{
									return false;
								}
							}
						}
						return true;
					}

				// -------------------------------------------------------------------------------------------------------
				// inspector functions

					/**
					 * Get the type of an object
					 * @param	value			mixed		Any value or object
					 * @param	getClassName	boolean		return the class name rather than the type if possible
					 * @returns	The type of classname of a value
					 */
					function getType(value, getClassName)
					{
						var type		= typeof value;
						var className	= type.substr(0,1).toUpperCase() + type.substr(1);

						//fl.trace('type:' + type)
						//fl.trace('value:' + value)

						switch(type)
						{

							case 'object':
								if(value == null)
								{
									type		= 'null';
									className	= '';
								}
								else if (value instanceof Array && value.constructor == Array)
								{
									type		= 'array';
									className	= 'Array';
								}
								else if (value instanceof Date)
								{
									type		= 'date';
									className	= 'Date';
								}
								else if (value instanceof RegExp)
								{
									type		= 'regexp';
									className	= 'RegExp';
								}
								/*
								else if(value.constructor)
								{
									fl.trace(value.toSource())
									type		= 'class';
									className	= String(value.constructor).match(/function (\w+)/)[1];
								}
								*/
								else
								{
									var matches = String(value).match(/^\[(object|class) ([_\w]+)/);
									//type		= matches[1];
									className	= matches ? matches[2] : 'Unknown';
								}
							break;

							case 'undefined':
								className = '';
							break;

							case 'xml':
								className = 'XML';
							break;

							case 'function': // loop through properties to see if it's a class
								if (value instanceof RegExp)
								{
									type		= 'regexp';
									className	= 'RegExp';
								}
								else
								{
									for(var i in value)
									{
										if(i != 'prototype')
										{
											type = 'object';
											className = 'Class';
											break;
										}
									}
								}
							break;

							case 'string':
							case 'boolean':
							case 'number':
							default:
							//fl.trace('--' + value)
						}
						return getClassName ? className : type;
					}

					function getValue(obj)
					{
						var value;
						var type	 = getType(obj);

						switch(type)
						{
							case 'array':
							case 'object':
								value = obj;
							break;

							case 'string':
								value = '"' + obj.replace(/"/g, '\"') + '"';
							break;

							case 'xml':
								var ind = indent.join('\t').replace('\t', '')
								value = obj.toXMLString();
								value = value.replace(/ {2}/g, '\t').replace(/^/gm, ind).replace(/^\s*/, '');
							break;
							/*
							*/
							case 'function':
								obj = obj.toString();
								value = obj.substr(0, obj.indexOf('{'));
							break;

							case 'regexp':
							case 'boolean':
							case 'undefined':
							case 'number':
							case 'null':
							case 'undefined':
							default:
								value = String(obj);
						}
						return value;
					}


			// ---------------------------------------------------------------------------------------------------------------------
			// setup

				/**
				 * Output object in hierarchical format
				 * @param {Object}	obj				Any Object
				 * @param {String}	label			An optional String labal, which will result in the output being immediately be printed to the Output panel
				 * @param {uint}	maxDepth		An optional uint specifying a max depth to recurse to (needed to limit recursive objects)
				 */

				// defaults
					var label			= 'Inspect';
					var maxDepth		= 4;
					var maxValues		= 20000;
					var print			= null;
					var debug			= false;
					var print			= true;
					var callback		= null;
					var filter			= {};

				// parameter shifting
					for each(var arg in [arg2, arg3, arg4])
					{
						if(typeof arg === 'number')
							maxDepth = arg;
						else if(typeof arg === 'string')
							label = arg;
						else if(typeof arg === 'boolean')
						{
							if(arg === true)
								debug = true;
							else
								print = false;
						}
						else if(typeof arg === 'object')
							filter = arg;
						else if(typeof arg === 'function')
							callback = arg;
					}

				// recursion detection
					var keys			= ['root'];
					var stack			= [];

				// uncallable properties
					var illegal			= [
											'constructor', // class
											'currentView|domConfig|parentNode|parentView|currentLine', // window
											]

				// init
					var rxIllegal		= new RegExp('^' + illegal.join('|') + '$');
					var indent			= [];
					var strOutput		= '';
					var type			= getType(obj);
					var className		= getType(obj, true);

				// reset stats
					var stats			= {objects:0, values:0, time:new Date};

			// ---------------------------------------------------------------------------------------------------------------------
			// output

				// if debug, start tracing now, as subsequent output will be traced directly to the listener
					if(debug === true)
					{
						if(label == 'Inspect')
						{
							label = 'Debug';
						}
						this.trace(autocode.console._print('', label + ': ' + className, false).replace(/\s*$/, ''))
					}

				// initial outout
					if(type == 'object' || type == 'array')
					{
						output( type + ' => ' + className);
					}

				// process
					var success = true;
					try
					{
						processValue(obj);
					}
					catch(err)
					{
						success = false;
					}

				// get final stats
					stats.time			= (((new Date) - stats.time) / 1000).toFixed(1) + ' seconds';
					stats				= ' (depth:' +maxDepth+ ', objects:' +stats.objects+ ', values:' +stats.values+ ', time:' +stats.time+')';

				// output
					if(debug === true)
					{
						this.trace('\n' + stats + '\n');
					}
					else if(print === true)
					{
						autocode.console._print(strOutput, label + ': ' + className + stats);
						//autocode.console.utils.saveFile(strOutput);
					}

				// results
					autocode.console.utils.copyString('\n' + stats + '\n' + strOutput);
					if(!success)
					{
						alert('Processing failed at: ' + keys.join('.') + ' (' + type + ')');
					}

				// return
					return strOutput;

		},

		/**
		 * Print the content to the listener as a formatted list. Normally this is only called by the other Output functions!
		 * @param	{String}	content		The content to be output
		 * @param	{String}	title		The title of the print
		 * @param	{Boolean}	output		An optional Boolean specifying whether to print to the Output Panel, defualts to true
		 * @return	{String}				The String result of the print
		 */
		_print:function(content, title, output)
		{
			// variables
				output		= output !== false;
				var result	= '';
				var border	= new Array(Math.max(title.length, 80) + 1).join('-');
				result		+= '\n' +title + '\n' +border+ '\n';
				result		+= '' + String(content);
				//result		= result.replace(/\n/g, '\n\t');

			// trace
				if (output)
				{
					this.trace(result);
				}

			// return
				return result;
		},

		toString:function()
		{
			return '[object autocode.console]';
		}

}

trace	= autocode.console.trace;
clear	= autocode.console.clear;
inspect	= autocode.console.inspect;
