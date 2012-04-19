








function onKeyPress(event)
{
	ko.statusBar.AddMessage(event.keyCode)
	if(event.keyCode == 13 && event.ctrlKey)
	{
		ko.statusBar.AddMessage('YAY!');
		event.stopPropagation();
		event.preventDefault();
		return false;
	}
}



var container = ko.views.manager ? ko.views.manager.topView : window;

container.removeEventListener('keypress', onKeyPress, true)


container.addEventListener('keypress', onKeyPress, true)









