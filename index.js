//-- IMPORT SDK's
var data = require("sdk/self").data;
var {
	ToggleButton
} = require('sdk/ui/button/toggle');
var contextMenu = require("sdk/context-menu");
var clipboard = require("sdk/clipboard");
var popupGuideAutomator = require("sdk/panel").Panel({
	width: 620,
	height: 450,
	contentURL: data.url("html/popup-button.html"),
	contentScriptFile: [data.url("lib/toast.min.js"), data.url("scripts/popup-middleware.js")],
	contentStyleFile: [data.url("lib/w3.css"),
	 										data.url("css/popup-button.css")],
	onHide: onPopupGuideAutomatorHide
});
//var CssLogic = require("resource:///devtools/server/css-logic.js");

//-- END IMPORT SDK's

//-- EVENT OF ADDON ELEMENT

function onbuttonGuideAutomatorClicked(state) {
	if(state.checked) {
		popupGuideAutomator.show({
			position: button
		});
	}
}

function onContextGetCssSelector(message) {
	clipboard.set(message);
}

function onContextGDFunction(message) {
	if(message !== "") {
		clipboard.set(message);
		popupGuideAutomator.port.emit("text-received", message);
	}
}

//-- END EVENT OF ADDON ELEMENT

//-- ADDON ELEMENT
var button = ToggleButton({
	id: "guide-automator-link",
	label: "Visit Guide-Automator npm",
	icon: {
		"16": data.url("icon-16.png"),
		"32": data.url("icon-32.png"),
		"64": data.url("icon-64.png")
	},
	onChange: onbuttonGuideAutomatorClicked
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

//Shortcut used
//C-G-U-L-T-S-F-B-W-E-P-O
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
			label: menuLabelBefore + "Outline Element (O)",
			accesskey: "O",
			data: JSON.stringify({
				command: "Outline"
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
			accesskey: "B",
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

popupGuideAutomator.port.on("hideMessage", function(text) {
	popupGuideAutomator.hide();
});

popupGuideAutomator.port.on("CopyMessage", function(text) {
	if(text !== "") {
		clipboard.set(text);
	}
});

function onPopupGuideAutomatorHide() {
	button.state('window', {
		checked: false
	});
}

popupGuideAutomator.port.on("clear", function() {

});
//-- END popupGuideAutomator Comunication
//
//-- AUXILIAR FUNCTIONS

//-- END AUXILIAR FUNCTIONS
