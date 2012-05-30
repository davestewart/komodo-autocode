// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██                    ██
//  ██                                 ██
//  ██     █████ ██ █████ █████ █████ █████ █████
//  ██████ ██ ██ ██ ██ ██ ██ ██ ██ ██  ██   ██
//      ██ ██ ██ ██ ██ ██ ██ ██ █████  ██   █████
//      ██ ██ ██ ██ ██ ██ ██ ██ ██     ██      ██
//  ██████ ██ ██ ██ █████ █████ █████  ████ █████
//                  ██    ██
//                  ██    ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Snippets

/**
 * Auto-Snippet
 *
 * Allows the user to auto-complete abbreviations by pressing tab
 *
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	23rd September 2011
 */
autocode.snippets =
{
	// ----------------------------------------------------------------------------------------------------
	// Settings
	// ----------------------------------------------------------------------------------------------------

		settings:
		{
			ignore:[],
			
			/**
			 * Grab the settings from Preferences and turn them into something meaningful for this componant
			 */
			initialize:function()
			{
				var prefs		= new xjsflLib.Prefs();
				this.ignore 	= prefs.getBoolean('autocode.snippets.ignore', this.getDefaultIgnore()).split(/\s+/g);
			},

			getDefaultIgnore:function()
			{
				return 'var function return delete in instanceof new typeof';
			}
		},

	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		onKeyboardEvent:function(event)
		{
			// Only trap when TAB pressed with no modifiers
			if (event.keyCode === 9 &&  ( ! event.ctrlKey && ! event.altKey && ! event.shiftKey ) )
			{
				if(this.processInput())
				{
					return true;
					event.preventDefault();
				}
			}
			return false;
		},
		
		initialize:function()
		{
			autocode.snippets.settings.initialize();
		},

	// ----------------------------------------------------------------------------------------------------
	// Input
	// ----------------------------------------------------------------------------------------------------

		processInput:function()
		{
			// variables
				var view				= ko.views.manager.currentView;

				/** @type {Components.interfaces.ISciMoz} */
				var scimoz				= view.scimoz;

			// Exit if the autocomplete box is already showing
				if(view.scintilla.autocomplete.active)
				{
					//view.scintilla.autocomplete.close();
					return false;
				}

			// Don't do anything if there is a selection within the document
				if (scimoz.anchor != scimoz.currentPos)
				{
					return false;
				}

			// get the current line
				var lineIndex			= scimoz.lineFromPosition(scimoz.currentPos);
				var lineStart			= scimoz.positionFromLine(lineIndex);
				var line				= scimoz.getTextRange(lineStart, scimoz.currentPos);

			// grab word
				//var sel					= scimoz.getStyledText(scimoz.currentPos - word.length, scimoz.currentPos);
				var word				= ko.interpolate.getWordUnderCursor(scimoz);
				var words				= line.match(/(\w+)\s+\w+$/);
				var previousWord		= words ? words[1] : null;
				
			// prefs
				var ignore				= autocode.snippets.settings.ignore;
				
			// only complete if...
				if
				(
					word.match(/\w+/)							// check that word is a word
					&& ! /^\s*(\/\/|\*\s+|#)/.test(line)		// we're currently not within a comment
					&& ignore.indexOf(previousWord) === -1		// we're not following an ignored word
				)
				{
					var snippet = ko.abbrev.findAbbrevSnippet(word);
					if (snippet)
					{
						scimoz.beginUndoAction();
						scimoz.selectionStart = scimoz.currentPos - word.length;
						scimoz.deleteBack();
						ko.projects.snippetInsert(snippet);
						scimoz.endUndoAction();
						return true;
					}
				}

			// return false
				return false;
		},

		toString:function()
		{
			return '[object autocode.snippets]';
		}

};