
	function setEnabled(node, state, childrenOnly)
	{
		var children = getChildren(node);
		for (var i = 0; i < children.length; i++)
		{
			children[i].disabled = ! state;
		};
		if( ! childrenOnly)
		{
			node.disabled = ! state;
		}
	}

	function getChildren(node)
	{
		var nodes = [];
		if(node.hasChildNodes())
		{
			for (var i = 0; i < node.children.length; i++)
			{
				nodes.push(node.children[i]);
				var children = getChildren(node.children[i]);
				if(children)
				{
					nodes = nodes.concat(children);
				}
			};
		}

		return nodes;
	}

