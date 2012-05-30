// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██                    ██
//  ██                                 ██
//  ██     █████ ██ █████ █████ █████ █████
//  ██████ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██
//      ██ ██ ██ ██ ██ ██ ██ ██ █████  ██
//      ██ ██ ██ ██ ██ ██ ██ ██ ██     ██
//  ██████ ██ ██ ██ █████ █████ █████  ████
//                  ██    ██
//                  ██    ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Snippet

if( ! autocode.classes )autocode.classes = { };

/**
 * Snippet class
 */
autocode.classes.Snippet = function(path)
{
	if(path)
	{
		this.load(path);
	}
}

autocode.classes.Snippet.prototype =
{

	// ----------------------------------------------------------------------------------------------------
	// variables
	// ----------------------------------------------------------------------------------------------------

		name		:'',

		path		:'',

		template	:'',

		value		:'',

		exists		:false,
		
		attributes:
		{
			
		},

	// ----------------------------------------------------------------------------------------------------
	// methods
	// ----------------------------------------------------------------------------------------------------

		/**
		 * Attempts to load a Komodo Snippet file from disk, and return a fake Snippet with its value
		 * @param	{String}	path	The path to a Snippet file on the hard drive
		 * @returns	{Boolean}			true or false if the Snippet file exists
		 */
		load:function(path)
		{
			// snippet path
				var fullPath	= autocode.settings.toolboxPath + 'Places/' + path + '.komodotool';
				var file		= new xjsflLib.File(fullPath);

			// populate snippet
				if(file.exists)
				{
					// read the snippet info
						var contents	= file.read();
						var json		= xjsflLib.JSON.decode(contents);

					// grab attributes
						for each(var attr in ['indent_relative', 'set_selection'])
						{
							this.attributes[attr] = json[attr];
						}
						
					// update class properties
						this.exists		= true;
						this.path		= path;
						this.name		= path.split('/').pop();
						this.value		= json.value.join('\n');
						
					// update cursor position
						this.value		= this.value.replace(/!@#\w+/g, '') + '!@#_currentPos!@#_anchor';

					// return
						return true;
				}

			// return
				return false;
		},

		/**
		 * Populates the snippet value with data
		 * @param	{Object}	data	An object of properties
		 * @returns	{Snippet}			The original instance
		 */
		populate:function(data)
		{
			for(var name in data)
			{
				var rx		= new RegExp('\\[\\[%tabstop\\d*:' +name+ '\\]\\]', 'g');
				this.value	= this.value.replace(rx, data[name]);
			}
			return this;
		},

	// ----------------------------------------------------------------------------------------------------
	// utilities
	// ----------------------------------------------------------------------------------------------------

		hasAttribute:function(name)
		{
			return name in this.attributes;
		},

		getStringAttribute:function(name)
		{
			return this.attributes[name];
		},

		toString:function()
		{
			return '[object Snippet path="' +this.path+ '" exists="' +this.exists+ '"]';
		}

};

/*
var snippet = new autocode.classes.Snippet('Languages/JavaScript/js');
trace(snippet.exists)
*/
