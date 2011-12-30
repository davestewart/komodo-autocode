/**
 * Auto-Snippet
 *
 * Allows the user to auto-complete abbreviations by pressing tab
 *
 * Based on TAB trigger for Abbreviations by Stan Angeloff
 *
 * @author	Dave Stewart (www.davestewart.co.uk)
 * @date	23rd September 2011
 */
autocode.snippets =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		onKeyPress:function(event)
		{
			// Only trap when ENTER pressed with no modifiers
			if (event.keyCode === 9 &&  ( ! event.ctrlKey && ! event.altKey && ! event.shiftKey ) )
			{
				if(autocode.snippets.processInput())
				{
					event.preventDefault();
					event.stopPropagation();
				}
			}
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

			// Don't do anything if there is a selection within the document
				if (scimoz.anchor != scimoz.currentPos)
				{
					return false;
				}

			// Exit if the autocomplete box is already showing
				if(scimoz.autoCActive())
				{
					//scimoz.autoCCancel();
					return false;
				}

			// get the current line
				var lineIndex			= scimoz.lineFromPosition(scimoz.currentPos);
				var lineStart			= scimoz.positionFromLine(lineIndex);
				var lineEnd				= scimoz.getLineEndPosition(lineIndex);
				var line				= scimoz.getTextRange(lineStart, lineEnd);

			// don't add abbreviation if there are any other words on the line
				if( ! /^\s*\w+$/.test(line))
				{
					return false;
				}

			// grab word
				var word				= ko.interpolate.getWordUnderCursor(scimoz);

			// test for opening block comment
				if (word.match(/\w+/))
				{
					var snippet = ko.abbrev.findAbbrevSnippet(word);
					if (snippet)
					{
						scimoz.beginUndoAction();
						scimoz.selectionStart = scimoz.currentPos - word.length;
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

		/*
				class

		*/
		

};

//autocode.snippets.processInput()