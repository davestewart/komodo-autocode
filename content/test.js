


	function Test()
	{
		var _name;
		
		/**
		 * Setter for 
		 * @type {String}
		 */ 
		this.__defineSetter__('name', function(value)
		{
			_name = value;
		})
		
		/**
		 * Getter for
		 * @type {String}
		 */ 
		this.__defineGetter__('name', function(value)
		{
			return _name;
		})
		

	}
	
	
	Test.prototype =
	{
		set prop(value)
		{
			
		}
	}
	
	var Person = function(name)
	{
		var _name = name;
		
		var instance = 
		({
			set name(value)
			{
				_name = value;
			},
			
			get name()
			{
				return _name.toUpperCase();
			},
			
			getName:function()
			{
				return _name;
			}
		})
		
		//return instance;
	}
	

	var test = new Test()
	{
		
	}

	var person = new Person('Dave');
	alert(person instanceof Person);

	//person.name = 'Dave Stewart'

	
	/**
	 * Hello
	 * @param arg1
	 */
	
	
	
