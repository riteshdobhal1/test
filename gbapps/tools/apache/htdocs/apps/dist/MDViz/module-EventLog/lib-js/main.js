
/*
ApplicationMain = Start Page + Menubar
	update(logdata.new)
		TabMeas.update
		TabFW.update
		...
	showTab
	showMessageMenuBar
TabLoad
	onLoadEnd: calls ApplicationMain.update(logdata.new)
TabMeas
	update(logdata.new)
		update plots basic.events, meas.data
		update parameter selection
Parser
	in:  file.as.string
	out: logdata.per.file
Logdata
	plot.data = ( basic.events, meas.data ) --> TabMeas
	sys.info
	fw.info

Workflow:
load -> main.update(logdata.new)
*/

var main = new ApplicationMain();
main.run();
