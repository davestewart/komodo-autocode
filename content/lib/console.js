autocode.console =
{
	// ----------------------------------------------------------------------------------------------------
	// Events
	// ----------------------------------------------------------------------------------------------------

		events:
		{
			add:function()
			{
				this.remove();
				ko.views.manager.topView.addEventListener('keypress', this.onKeyPress, true);
			},

			remove:function()
			{
				if (autocode && autocode.comments.onKeyPress)
				{
					ko.views.manager.topView.removeEventListener('keypress', this.onKeyPress, true);
				}
			},

			onKeyPress:function(event)
			{
				if (event.keyCode === 13 && event.ctrlKey)
				{
					var view = ko.views.manager.currentView;
					if(view && view.koDoc)
					{
						if(/\.(js)$/.test(view.item.url))
						{
							// get selection
								var selection = view.scimoz.getTextRange(view.scimoz.selectionStart, view.scimoz.selectionEnd);
								
							// run
								eval(selection || view.scimoz.text);
								
							// cancel
								event.preventDefault();
								event.stopPropagation();
								return true;
						}
					}
					
				}
			}
		}

}