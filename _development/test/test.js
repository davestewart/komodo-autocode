
	var obj =
	{
		number:1,
		string:'hello',
		bool:true,
		obj:
		{
			rx:/.*/,
			date:new Date(),
			xml:<xml><a href="http://www.google.com" /></xml>,
			child:{a:1, b:2, c:3}
		},
		array:
		[
			1,
			2,
			3,
		]
	}
	clear();
	inspect(obj);