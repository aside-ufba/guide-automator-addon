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

function onContextGetCssSelector(message) {
	clipboard.set(message);
}

function onContextGDFunction(message) {
	clipboard.set(message);
	popupGuideAutomator.port.emit("text-received", '\t' + message + "\n");
}

//-- END EVENT OF ADDON ELEMENT

//-- ADDON ELEMENT
var button = buttons.ActionButton({
	id: "guide-automator-link",
	label: "Visit Guide-Automator npm",
	icon: {
		"16": data.url("icon-16.png"),
		"32": data.url("icon-32.png"),
		"64": data.url("icon-64.png")
	},
	onClick: onbuttonGuideAutomatorClicked
});


var MenuItemCssSelector = contextMenu.Item({
	label: "Get CssSelector (C)",
	data: JSON.stringify({
		command: "GetCssSelector"
	}),
	image: data.url("icon-16.png"),
	context: contextMenu.SelectorContext("*"),
	onMessage: onContextGetCssSelector,
	accesskey: "C",
	contentScriptFile: [data.url("lib/toast.min.js"), data.url("lib/css-logic.js"), data.url("scripts/context-script.js")]
});

var menuLabelBefore = "> ";
var menuItemMain = contextMenu.Menu({
	label: "Guide-Automator (G)",
	image: data.url("icon-16.png"),
	context: contextMenu.SelectorContext("*"),
	onMessage: onContextGDFunction,
	accesskey: "G",
	contentScriptFile: [data.url("lib/toast.min.js"), data.url("lib/css-logic.js"), data.url("scripts/context-script.js")],
	items: [
    contextMenu.Item({
			label: menuLabelBefore + "Get Url (U)",
			accesskey: "U",
			data: JSON.stringify({
				command: "GetUrl"
			})
		}),
    contextMenu.Item({
			label: menuLabelBefore + "Click (L)",
			accesskey: "L",
			data: JSON.stringify({
				command: "Click"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "TakeScreenshot (T)",
			accesskey: "T",
			data: JSON.stringify({
				command: "TakeScreenshot"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "TakeScreenshotOf (S)",
			accesskey: "S",
			data: JSON.stringify({
				command: "TakeScreenshotOf"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "FillIn (F)",
			accesskey: "F",
			data: JSON.stringify({
				command: "FillIn"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Submit (B)",
			accesskey: "U",
			data: JSON.stringify({
				command: "Submit"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Wait (W)",
			accesskey: "W",
			data: JSON.stringify({
				command: "Wait"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Sleep (E)",
			accesskey: "E",
			data: JSON.stringify({
				command: "Sleep"
			})
		}),
		contextMenu.Item({
			label: menuLabelBefore + "Print (P)",
			accesskey: "P",
			data: JSON.stringify({
				command: "Print"
			})
		})
  ]
});


//-- END ADDON ELEMENT

//-- Context Menu Comunication

//-- END Context Menu Comunication

//-- popupGuideAutomator Comunication
popupGuideAutomator.on("show", function() {
	popupGuideAutomator.port.emit("show");
});

popupGuideAutomator.port.on("hide", function(text) {
	popupGuideAutomator.hide();
});

popupGuideAutomator.port.on("clear", function() {

});
//-- END popupGuideAutomator Comunication
//
//-- AUXILIAR FUNCTIONS

//-- END AUXILIAR FUNCTIONS
