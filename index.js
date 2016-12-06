function onCreated(n) {
	if(browser.runtime.lastError) {
		console.log(`Error: ${browser.runtime.lastError}`);
	}
}

browser.contextMenus.create({
	id: "get-cssSelector",
	title: "Get CssSelector",
	contexts: ["page"]
}, onCreated);

browser.contextMenus.onClicked.addListener(function(info, tab) {
	switch(info.menuItemId) {
		case "get-cssSelector":
			console.log(info.selectionText);
			break;
	}
});
