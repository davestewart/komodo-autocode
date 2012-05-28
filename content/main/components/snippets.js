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
 * Based on original code from TAB trigger for Abbreviations by Stan Angeloff
 *
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	23rd September 2011
 */
autocode.snippets =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		onEvent:function(event)
		{
			// Only trap when TAB pressed with no modifiers
			if (event.keyCode === 9 &&  ( ! event.ctrlKey && ! event.altKey && ! event.shiftKey ) )
			{
				if(this.processInput())
				{
					return true;
				}
			}
			return false;
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

			// grab word
				var word				= ko.interpolate.getWordUnderCursor(scimoz);

			// check that word is a word
				if (word.match(/\w+/))
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