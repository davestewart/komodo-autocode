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
			prefs.get('boolean', 'autocode.console', chkConsole);
			prefs.get('boolean', 'autocode.abbreviations', chkAbbreviations);
			prefs.get('boolean', 'autocode.comments', chkComments);
			prefs.get('boolean', 'autocode.columns', chkColumns);
			
			chkConsole.addEventListener('click', onConsoleClick, false);
			chkAbbreviations.addEventListener('click', onAbbreviationsClick, false);
			chkComments.addEventListener('click', onCommentsClick, false);
			chkColumns.addEventListener('click', onColumnsClick, false);
			
		// textboxes
			columnTags			= document.getElementById('columnTags');
			columnTypes			= document.getElementById('columnTypes');
			columnNames			= document.getElementById('columnNames');
			columnPadding		= document.getElementById('columnPadding');

			prefs.get('string', 'autocode.columnTags', columnTags);
			prefs.get('string', 'autocode.columnTypes', columnTypes);
			prefs.get('string', 'autocode.columnNames', columnNames);
			prefs.get('string', 'autocode.columnPadding', columnPadding);
			
			columnTags.addEventListener('change', onColumnValueChanged, false);
			columnTypes.addEventListener('change', onColumnValueChanged, false);
			columnNames.addEventListener('change', onColumnValueChanged, false);
			columnPadding.addEventListener('change', onColumnValueChanged, false);
			
		// parent pageload handler
			parent.hPrefWindow.onpageload();
	}

	function onConsoleClick(event)
	{
		prefs.set('boolean', 'autocode.console', event.target.checked);
		event.target.checked ? autocode.events.add(autocode.console.onKeyPress) : autocode.events.remove(autocode.console.onKeyPress);
	}

	function onAbbreviationsClick(event)
	{
		prefs.set('boolean', 'autocode.abbreviations', event.target.checked);
		event.target.checked ? autocode.events.add(autocode.snippets.onKeyPress) : autocode.events.remove(autocode.snippets.onKeyPress);
	}

	function onCommentsClick(event)
	{
		prefs.set('boolean', 'autocode.comments', event.target.checked);
		event.target.checked ? autocode.events.add(autocode.comments.onKeyPress) : autocode.events.remove(autocode.comments.onKeyPress);
	}

	function onColumnsClick(event)
	{
		prefs.set('boolean', 'autocode.columns', event.target.checked);
	}
	
	function onColumnValueChanged(event)
	{
		var names =
		{
			columnTags:		'autocode.columnTags',
			columnTypes:	'autocode.columnTypes',
			columnNames:	'autocode.columnNames',
			columnPadding:	'autocode.columnPadding'
		};
		var name	= names[event.target.id];
		var value	= event.target.value;
		
		prefs.set('string', name, value);
		
		//alert(value)
	}

