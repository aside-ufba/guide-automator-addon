//-- IMPORT SDK's
var data = require("sdk/self").data;
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");
var clipboard = require("sdk/clipboard");
var popupGuideAutomator = require("sdk/panel").Panel({
	contentURL: data.url("main.html"),
	contentScriptFile: data.url("scripts/popup-middleware.js")
});
//var CssLogic = require("resource:///devtools/server/css-logic.js");

//-- END IMPORT SDK's

//-- EVENT OF ADDON ELEMENT

function onbuttonGuideAutomatorClicked(state) {
	//tabs.open("https://www.npmjs.com/package/guide-automator");
	popupGuideAutomator.show();
}

function onContextMessage(message) {
	clipboard.set(message);
	popupGuideAutomator.port.emit("text-received", '\t' + message + "\n");
}

//-- END EVENT OF ADDON ELEMENT

//-- ADDON ELEMENT
var button = buttons.ActionButton({
	id: "guide-automator-link",
	label: "Visit Guide-Automator npm",
	icon: {
		"16": data.url("./icon-16.png"),
		"32": data.url("./icon-32.png"),
		"64": data.url("./icon-64.png")
	},
	onClick: onbuttonGuideAutomatorClicked
});

var menuLabelBefore = "> ";
var menuItem = contextMenu.Menu({
	label: "Guide-Automator (G)",
	image: data.url("icon-16.png"),
	context: contextMenu.SelectorContext("*"),
	onMessage: onContextMessage,
	accesskey: "G",
	contentScriptFile: [data.url("lib/css-logic.js"), data.url("scripts/context-script.js")],
	items: [
    contextMenu.Item({
			label: menuLabelBefore + "Get CssSelector",
			data: "commandGetCssSelector"
		}),
    contextMenu.Item({
			label: menuLabelBefore + "Get Url",
			data: "commandGetUrl"
		}),
    contextMenu.Item({
			label: menuLabelBefore + "Click",
			data: "commandClick"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "TakeScreenshot",
			data: "commandTakeScreenshot"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "TakeScreenshotOf",
			data: "commandTakeScreenshotOf"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "FillIn",
			data: "commandFillIn"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Submit",
			data: "commandSubmit"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Wait",
			data: "commandWait"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Sleep",
			data: "commandSleep"
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Print",
			data: "commandPrint"
		})
  ]
});

//-- END ADDON ELEMENT

//-- popupGuideAutomator Comunication
popupGuideAutomator.on("show", function() {
	popupGuideAutomator.port.emit("show");
});

popupGuideAutomator.port.on("hide", function(text) {
	popupGuideAutomator.hide();
});
//-- END popupGuideAutomator Comunication
//
//-- AUXILIAR FUNCTIONS

//-- END AUXILIAR FUNCTIONS
