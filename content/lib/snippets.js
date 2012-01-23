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
			// Only trap when TAB pressed with no modifiers
			if (event.keyCode === 9 &&  ( ! event.ctrlKey && ! event.altKey && ! event.shiftKey ) )
			{
				if(autocode.snippets.processInput())
				{
					//alert('snippet complete')
					event.preventDefault();
					event.stopPropagation();
					//ko.views
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
				var autoCActive			= scimoz.autoCActive(); // doesn't seem to work in KO7rc1
				//alert(autoCActive)
				if(autoCActive)
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

			// check that word is a word
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
				doc

		*/


};

//autocode.snippets.processInput()