
	prefs =
	{
		/**
		 * @type {Components.interfaces.koIPrefService}
		 */
		prefs:		Components.classes['@activestate.com/koPrefService;1'].getService(Components.interfaces.koIPrefService).prefs,

		init:function(window)
		{
			this.prefs = window.parent.hPrefWindow.prefset;
		},

		/**
		 * Gets a string preference
		 * @param	{String}	type
		 * @param	{String}	name
		 * @returns	{String|Boolean|Number}
		 */
		get:function(type, name, element)
		{
			var pref;
			switch(type)
			{
				case 'boolean':
					if (this.prefs.hasBooleanPref(name))
					{
						pref = this.prefs.getBooleanPref(name);
						if(element)
						{
							element.checked = pref;
						}
					};
				break;

				case 'string':
					//alert(['string', element.id, element.value])
					if (this.prefs.hasStringPref(name))
					{
						pref = this.prefs.getStringPref(name) || '';
						if(element)
						{
							element.value = pref;
						}
					};
				break;

				case 'number':
					if (this.prefs.hasNumberPref(name))
					{
						pref = this.prefs.getNumberPref(name) || 0;
						alert(pref)
						if(element)
						{
							element.value = pref;
						}
					};
				break;
			}
			return pref;
		},

		/**
		 * Sets a string preference
		 * @param	{String}	type
		 * @param	{String}	name
		 * @param	{String}	value
		 * @returns	{Boolean}
		 */
		set:function(type, name, value)
		{
			switch(type)
			{
				case 'boolean':
					return this.prefs.setBooleanPref(name, value);
				break;

				case 'string':
					return this.prefs.setStringPref(name, value);
				break;

				case 'number':
					return this.prefs.setNumberPref(name, value);
				break;
			}
			return false;
		}
	}
