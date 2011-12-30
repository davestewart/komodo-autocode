
 var str = '';
for(var i in autocode)
{
	str += i + ':' + autocode[i] + '\n';
}

alert(str)


autocode.events.onLoad()
