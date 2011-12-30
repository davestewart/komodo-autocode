
	xjsfl.init(this);
	clear();


	var funcs =
	[
		'protected function test()',
		'protected function test($one, $someVar, $someBiggerVar)',
		'protected function test(A $1)',
		'protected function test(A $1, AB $12)',
		'protected function test(A $1, AB $12, ABC $123)',
		'protected function test(A $1, AB $12, ABC $123, ABCD $1234)',
		'protected function test(A $1, AB $12, ABC $123, ABCD $1234, ABCDE $12345, ABCDEF $123456, ABCDEFG $1234567, ABCDEFGH $12345678)',
		'function test()',
		'test = function (one, someVar, someBiggerVar)',
		'test:function(one, someVar, someBiggerVar)',
		'test = function (one:String, someVar:Number, someBiggerVar:Boolean):String',
		'test:function (one:MenuSeparator, someVar:Number, someBiggerVar:*):String'
		/*
		*/
	];

	var rxClass			= /^\s*?class/i;
	var rxVariable		= /^\s*?(?:var|private|public|protected)/;
	var rxFunction		= /\bfunction\b\s*(?:\w*)\s*\((.*)\):?([\w\*]+)?/
	var rxParam			= /([$\w]+)[\s:]?([$\w\*]+)?/;
	var rxParams		= new RegExp(rxParam.source, 'g');

	function Param(kind, type, name)
	{
		// param values
			this.kind = kind;
			this.type = type;
			this.name = name;

		// update global widths
			widths.type = Math.max(type.length, widths.type);
			widths.name = Math.max(name.length, widths.name);

		// to string
			this.toString = function()
			{
				var output = ' * @';
				output += pad(this.kind, widths.word, tabWidth);
				output += pad(this.type, widths.type, tabWidth);
				output += pad(this.name, widths.name, tabWidth);
				output += 'Description\n';
				return output;
			}

		// utility function to pad columns to the correct widths
			function pad(str, width, tabWidth)
			{
				// set virtual width to the initial string width
					var vwidth	= str.length;

				// pad initial word to the next column
					var mod		= str.length % tabWidth;
					if(mod != 0)
					{
						str += '\t';
						vwidth += (tabWidth- mod);
					}

				// while the column is smaller than the max width, pad to fit
					while(vwidth < width)
					{
						vwidth	+= tabWidth;
						str		+= '\t';
					}

				// ensure that any tabs that butt exactly up to the next tab are given space
					if(width % tabWidth == 0)
					{
						str += '\t'
					}

				// add any extra gutters between columns
					//str += '\t'

				// return
					return str;
			}

	}

	function processParams(strParams)
	{
		// variables
			var params		= [];
			var matches		= strParams.match(rxParams);

		// loop over params
			for each(var match in matches)
			{
				// match parts
					var parts = match.match(rxParam);

				// create Param object
					if(lang == 'JavaScript')
					{
						params.push(new Param('param', '{' + (parts[2] || 'Type') + '}', parts[1]));
					}
					else
					{
						params.push(new Param('param', parts[1], parts[2]));
					}
			}

		// return
			return params;
	}

	function processReturn(type)
	{
		// create param
			if(lang == 'JavaScript')
			{
				var param = new Param('returns', type ? '{' + type + '}' : '{Type}', '');
			}
			else
			{
				var param = new Param('returns', type || 'Object', '');
			}

		// return
			return param
	}

	function processFunction(matches)
	{
		// process
			var params	= processParams(matches[1]);
			var returns	= processReturn(matches[2]);

		// optionally hard-code columns
			if(hardWidths)
			{
				widths = hardWidths;
			}

		// output
			var output = '/**\n';
			output += ' * Description\n';
			if(params && params.length)
			{
				for each(var param in params)
				{
					output += param.toString();
				}
			}
			output += returns.toString();
			output += ' */';

		// trace
			return output;

	}

	var tabWidth		= 4;
	var widths			= {word:0, type:0, name:0};
	var hardWidths//		= {word:7, type:15, name:15};

	for each(var func in funcs)
	{
		// variables
			var lang		= func.indexOf('protected') == 0 ? 'PHP' : 'JavaScript';
			var matches		= func.match(rxFunction);

		// process
			if(matches)
			{
				trace(processFunction(matches))
				trace(func + '\n');
			}
	}


