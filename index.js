//-- EVENT OF ADDON ELEMENT

function onbuttonGuideAutomatorClicked(state) {
	tabs.open("https://www.npmjs.com/package/guide-automator");
	//popupGuideAutomator.show();
}

function onContextMessage(cssSelector) {
	clipboard.set(cssSelector);
	popupGuideAutomator.port.emit("text-received", cssSelector);
}

//-- END EVENT OF ADDON ELEMENT

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

//-- END IMPORT SDK's

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

var menuItem = contextMenu.Item({
	label: "Get Css Selector",
	image: data.url("icon-16.png"),
	context: contextMenu.SelectorContext("*"),
	onMessage: onContextMessage,
	contentScriptFile: data.url("scripts/context-script.js")
});

//-- END ADDON ELEMENT

//-- popupGuideAutomator Comunication
popupGuideAutomator.on("show", function() {
	popupGuideAutomator.port.emit("text-received", "teste");
	popupGuideAutomator.port.emit("show");
});

popupGuideAutomator.port.on("text-entered", function(text) {
	console.log("Index-Port: " + text);
	popupGuideAutomator.hide();
});
//-- END popupGuideAutomator Comunication
//
//-- AUXILIAR FUNCTIONS

//-- END AUXILIAR FUNCTIONS
