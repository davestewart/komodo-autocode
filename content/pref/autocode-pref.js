/* Copyright (c) 2011 ActiveState Software Inc.
   See the file LICENSE.txt for licensing information. */

// --------------------------------------------------------------------------------
// globals

	var chkAbbreviations;
	var chkComments;
	var chkColumns;
	var boxColumns;

// --------------------------------------------------------------------------------
// functions

	function PrefAutoCode_OnLoad(event)
	{
		// variables
			chkConsole			= document.getElementById('chkConsole');
			chkAbbreviations	= document.getElementById('chkAbbreviations');
			chkComments			= document.getElementById('chkComments');
			chkColumns			= document.getElementById('chkColumns');
			boxColumns			= document.getElementById('boxColumns');

		// checkboxes
			prefs.init(this);
			prefs.get('boolean', 'AutoCodeConsole', chkConsole);
			prefs.get('boolean', 'AutoCodeAbbreviations', chkAbbreviations);
			prefs.get('boolean', 'AutoCodeComments', chkComments);
			prefs.get('boolean', 'AutoCodeColumns', chkColumns);
			
			chkConsole.addEventListener('click', onConsoleClick, false);
			chkAbbreviations.addEventListener('click', onAbbreviationsClick, false);
			chkComments.addEventListener('click', onCommentsClick, false);
			chkColumns.addEventListener('click', onColumnsClick, false);
			
		// textboxes
			columnTags			= document.getElementById('columnTags');
			columnTypes			= document.getElementById('columnTypes');
			columnNames			= document.getElementById('columnNames');
			columnPadding		= document.getElementById('columnPadding');

			prefs.get('string', 'AutoCodeColumnTags', columnTags);
			prefs.get('string', 'AutoCodeColumnTypes', columnTypes);
			prefs.get('string', 'AutoCodeColumnNames', columnNames);
			prefs.get('string', 'AutoCodeColumnPadding', columnPadding);
			
			columnTags.addEventListener('change', onColumnValueChanged, false);
			columnTypes.addEventListener('change', onColumnValueChanged, false);
			columnNames.addEventListener('change', onColumnValueChanged, false);
			columnPadding.addEventListener('change', onColumnValueChanged, false);
			
		// parent pageload handler
			parent.hPrefWindow.onpageload();
	}

	function onConsoleClick(event)
	{
		prefs.set('boolean', 'AutoCodeConsole', event.target.checked);
		event.target.checked ? autocode.console.events.add() : autocode.console.events.remove();
	}

	function onAbbreviationsClick(event)
	{
		prefs.set('boolean', 'AutoCodeAbbreviations', event.target.checked);
		event.target.checked ? autocode.snippets.events.add() : autocode.snippets.events.remove();
	}

	function onCommentsClick(event)
	{
		prefs.set('boolean', 'AutoCodeComments', event.target.checked);
		event.target.checked ? autocode.comments.events.add() : autocode.comments.events.remove();
	}

	function onColumnsClick(event)
	{
		prefs.set('boolean', 'AutoCodeColumns', event.target.checked);
	}
	
	function onColumnValueChanged(event)
	{
		var names =
		{
			columnTags:		'AutoCodeColumnTags',
			columnTypes:	'AutoCodeColumnTypes',
			columnNames:	'AutoCodeColumnNames',
			columnPadding:	'AutoCodeColumnPadding'
		};
		var name	= names[event.target.id];
		var value	= event.target.value;
		
		prefs.set('string', name, value);
		
		//alert(value)
	}

