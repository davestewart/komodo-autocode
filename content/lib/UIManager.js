// ------------------------------------------------------------------------------------------------------------------------
//
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██  ██ ██
//  ██████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// UI

	// ----------------------------------------------------------------------------------------------------
	// setup

		if( ! window.xjsflLib ) xjsflLib = {};

	// ----------------------------------------------------------------------------------------------------
	// code

		xjsflLib.UIManager = function(window)
		{
			if(window && window.document)
			{
				this.getWindow		= function(){ return window; };
				this.getDocument	= function(){ return window.document; };
				if(window.parent && window.parent.hPrefWindow)
				{
					this.prefs = new xjsflLib.Prefs(window.parent.hPrefWindow.prefset);
				}
			}
			else
			{
				this.throwError('UIManager cannot initialize as the parameter "window" does not contain a document element');
			}
		}

		xjsflLib.UIManager.prototype =
		{
			// ----------------------------------------------------------------------------------------------------
			// properties

				prefs:null,

				ids:[],


			// ----------------------------------------------------------------------------------------------------
			// set/get

				get:function(id)
				{
					var element = this.getDocument().getElementById(id);
					if(element)
					{
						// determine type based on preftype (if it exists)
							var preftype = element.getAttribute('preftype').toLowerCase();
							if(preftype)
							{
								switch(preftype)
								{
									case 'boolean':
									case 'bool':
										return element.checked;
									break;
									case 'number':
									case 'long':
									case 'int':
										return parseInt(element.value);
									break;
									case 'double':
									case 'float':
										return parseFloat(element.value);
									break;
									case 'string':
									default:
										return element.value;
								}
							}

						// otherwise, examine the element itself
							else if(element.nodeName === 'checkbox')
							{
								return element.checked;
							}
							else
							{
								if(element.type == 'number')
								{
									return Number(element.value);
								}
								else
								{
									return element.value;
								}
							}
					}
					else
					{
						this.throwError('Cannot get value for element "' +id+ '" as it does not exist in the document');
					}
					return undefined;
				},

				set:function(id, value)
				{
					var element = this.getDocument().getElementById(id);
					if(element)
					{
						if(typeof value !== 'undefined')
						{
							// set value based on preftype (if it exists)
								var preftype = element.getAttribute('preftype').toLowerCase();
								if(preftype)
								{
									switch(preftype)
									{
										case 'boolean':
										case 'bool':
											element.checked = value;
										break;
										default:
											element.value = value;
									}
								}

							// otherwise, examine the element itself
								else if(element.nodeName === 'checkbox')
								{
									return element.checked;
								}
								else
								{
									if(element.type == 'number')
									{
										return Number(element.value);
									}
									else
									{
										return element.value;
									}
								}
						}
					}
					else
					{
						this.throwError('Cannot set value for element "' +id+ '" as it does not exist in the document');
					}
					return this;
				},


			// ----------------------------------------------------------------------------------------------------
			// load/save

				load:function(id, defaultValue)
				{
					// elements
						var element = this.getDocument().getElementById(id);

					// do something with element
						if(element)
						{
							// variables
								var prefid		= element.getAttribute('prefid');
								var preftype	= element.getAttribute('preftype').toLowerCase();
								var value;

							// get value based on preftype (if it exists)
								if(prefid && preftype)
								{
									switch(preftype)
									{
										case 'boolean':
										case 'bool':
											value = this.prefs.getBoolean(prefid);
											if(typeof value !== 'undefined')
											{
												element.checked = value;
											}
											return value;
										break;
										case 'number':
										case 'long':
										case 'int':
											value = this.prefs.getLong(prefid);
										break;
										case 'double':
										case 'float':
											value = this.prefs.getDouble(prefid);
										break;
										case 'string':
											value = this.prefs.getString(prefid);
										break;
										default:
											value = this.prefs.get(prefid);
									}

									if(typeof value !== 'undefined')
									{
										element.value = value;
									}
								}
								else
								{
									this.throwError('Cannot load element "' +id+ '" as it does possibly does not have a prefname or prefid attribute');
								}
						}
						else
						{
							this.throwError('Cannot load preferences for element "' +id+ '" as it does not exist in the document');
						}
						return value;
				},

				save:function(id)
				{
					var element	= this.getDocument().getElementById(id);
					if(element)
					{
						// variables
							var prefid		= element.getAttribute('prefid');
							var preftype	= element.getAttribute('preftype').toLowerCase();

						// determine type based on preftype (if it exists)
							if(prefid && preftype)
							{
								switch(preftype)
								{
									case 'boolean':
									case 'bool':
										this.prefs.setBoolean(prefid, element.checked);
									break;
									case 'number':
									case 'long':
									case 'int':
										this.prefs.setLong(prefid, parseInt(element.value));
									break;
									case 'double':
									case 'float':
										this.prefs.setDouble(prefid, parseFloat(element.value));
									break;
									case 'string':
									default:
										this.prefs.setString(prefid, element.value);
								}
								return this;
							}
							else
							{
								this.throwError('Cannot save element "' +id+ '" as it does possibly does not have a prefname or prefid attribute');
							}
					}
					else
					{
						this.throwError('Cannot save preferences for element "' +id+ '" as it does not exist in the document');
					}
					return this;
				},


			// ----------------------------------------------------------------------------------------------------
			// group settings management

				/**
				 * Load multiple values from the saved preferences into UI controls. Controls should contain a prefid and a preftype attribute
				 * @param	{Array}		ids			An Array of document ids, or nothing to grab all elements with a prefid from the document
				 */
				loadGroup:function(ids)
				{
					// grab all elements if an array of ids isn't supplied
						if(typeof ids === 'undefined')
						{
							var elements = this.getDocument().getElementsByAttribute('prefid', '*');
							ids = [];
							for (var i = 0; i < elements.length; i++)
							{
								ids.push(elements[i].id);
							}
						}

					// assign ids
						this.ids = ids;
						for each(var id in ids)
						{
							this.load(id);
						}
				},

				saveGroup:function()
				{
					for each(var id in this.ids)
					{
						this.save(id);
					}
				},

			// ----------------------------------------------------------------------------------------------------
			// utils

				throwError:function(message)
				{
					alert(message);
					throw new Error(message);
				},

				toString:function()
				{
					var window	= this.getWindow();
					var uri		= window ? window.location : '';
					return '[object UIManager ids="' +this.ids.length+ '" uri="' +uri+ '"]';
				}


		}
