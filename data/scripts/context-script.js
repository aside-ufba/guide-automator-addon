self.on("click", function(node, data) {
	setReturn(parserCommand(node, data));
});

//GD = Guide-Automator Functions
function parserCommand(node, data) {
	data = JSON.parse(data);
	var result = null;
	switch(data.command) {
		case "GetCssSelector":
			result = getCssSelector(node);
			break;
		case "GetUrl":
			result = getGDUrl();
			break;
		case "Click":
			result = getGDClick(node);
			break;
		case "TakeScreenshot":
			result = getGDTakeScreenshot();
			break;
		case "TakeScreenshotOf":
			result = getGDTakeScreenshotOf(node);
			break;
		case "FillIn":
			result = getGDFillIn(node);
			break;
		case "Submit":
			result = getGDSubmit(node);
			break;
		case "Wait":
			result = getGDWait(node);
			break;
		case "Sleep":
			result = getGDSleep();
			break;
		case "Print":
			result = getGDPrint();
			break;
		default:
			result = null;
	}

	return result;
}

function getCssSelector(node) {
	return findCssSelector(node);
}

function getGDUrl() {
	return `get('` + window.location.href + `');`;
}

function getGDClick(node) {
	return `click('` + getCssSelector(node) + `');`;
}

function getGDTakeScreenshot() {
	var width = customPrompt("Size of screenshot? (Default: 60%)", "60%");
	if(!isNullOrEmpty(width))
		return `takeScreenshot('` + width + `');`;
	return "takeScreenshot();";
}

function getGDTakeScreenshotOf(node) {
	var cssSelector = getCssSelector(node);
	var crop = customYesNoQuestion("Want to crop the image based on the element?");
	var outline = customYesNoQuestion("Want to outline the element?");
	var width = customPrompt("Size of screenshot? (Default: 60%)", "60%");
	if(isNullOrEmpty(width))
		width = "60%";

	return `takeScreenshotOf('` + cssSelector + `',` +
		crop.toString() + `,` +
		outline.toString() + `,'` +
		width +
		`');`;
}

function getGDFillIn(node) {
	var cssSelector = getCssSelector(node);
	var message = customPrompt('Fill in with: ');
	if(!message) message = "";
	return `fillIn('` + cssSelector + `','` + message.toString() + `');`;
}

function getGDSubmit(node) {
	var tmpNode = node;
	while(tmpNode.localName !== "form" && tmpNode.localName !== "body") {
		tmpNode = tmpNode.parentElement;
	}
	if(tmpNode.localName === "form")
		node = tmpNode;

	var cssSelector = getCssSelector(node);
	return `submit('` + cssSelector + `');`
}

function getGDWait(node) {
	var cssSelector = getCssSelector(node);
	var timeOut = customPrompt("Time limit for wait of element.[ms] (Default: 5000)");
	if(isNullOrEmpty(timeOut))
		timeOut = '5000';
	return `wait('` + cssSelector + `',` + timeOut + `);`;
}

function getGDSleep() {
	var time = customPrompt("Time to sleep.[ms]");
	if(isNullOrEmpty(time))
		time = '1000';
	return `sleep('` + time.toString().trim() + `');`;
}

function getGDPrint() {
	var message = customPrompt("Write your message");
	return `console.print('` + message.toString() + `');`;
}

function customPrompt(message, defaultValue) {
	return prompt(message, defaultValue);
}

function customYesNoQuestion(message) {
	if(confirm(message + ' Cancel for no')) {
		return true;
	} else {
		return false;
	}
}

function isNullOrEmpty(variable) {
	if(variable == null || variable.toString().trim() === "")
		return true;
	return false;
}

function setReturn(message) {
	self.postMessage(message);
}
