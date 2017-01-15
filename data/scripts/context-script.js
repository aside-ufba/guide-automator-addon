var outlineElements = [];
var pageContext = '';
var dontToast = ['Outline'];

self.on("click", function(node, data) {
	setReturn(parserCommand(node, data));
});

//GD = Guide-Automator Functions
function parserCommand(node, data) {
	data = JSON.parse(data);
	var result = "";
	pageContext = null;
	switch(data.command) {
		case "GetCssSelector":
			result = getCssSelector(node);
			break;
		case "GetUrl":
			result = getGDUrl(node);
			break;
		case "Click":
			pageContext = getPageContext(node);
			result = getGDClick(node);
			break;
		case "TakeScreenshot":
			result = getGDTakeScreenshot();
			break;
		case "TakeScreenshotOf":
			pageContext = getPageContext(node);
			result = getGDTakeScreenshotOf(node);
			break;
		case "FillIn":
			pageContext = getPageContext(node);
			result = getGDFillIn(node);
			break;
		case "Submit":
			pageContext = getPageContext(node);
			result = getGDSubmit(node);
			break;
		case "Wait":
			pageContext = getPageContext(node);
			result = getGDWait(node);
			break;
		case "Sleep":
			result = getGDSleep();
			break;
		case "Print":
			result = getGDPrint();
			break;
		case "Outline":
			pageContext = getPageContext(node);
			result = getGDOutline(node);
			break;
		default:
			result = "";
	}
	if(result !== "" && dontToast.indexOf(data.command) === -1)
		toast("Code copied to clipboard!");
	return JSON.stringify({
		command: data.command,
		result: result,
		pageContext: pageContext
	});
}

function getCssSelector(node) {
	return findCssSelector(node);
}

function getGDUrl(node) {
	if(!isInsideIframe(node))
		return [`'` + window.location.href + `'`];
	else
		return [`'` + parent.window.location.href + `'`];
}

function getGDClick(node) {
	//Simulação da ação
	node.click();

	return [`'` + getCssSelector(node) + `'`];
}

function getGDTakeScreenshot() {
	var width = customPrompt("Size of screenshot? (Default: 60%)", "60%");

	if(outlineElements.length > 0)
		removeAllOutlines();
	if(isNullOrEmpty(width))
		width = "60%";
	return [`'` + width + `'`];
}

function getGDTakeScreenshotOf(node) {
	var width, cssSelector, crop, outline;

	cssSelector = getCssSelector(node);

	//Only works if elements are on same context
	if(outlineElements.length === 0) {
		crop = customYesNoQuestion("Want to crop the image based on the element?").toString();
		outline = customYesNoQuestion("Want to outline the element?").toString();
	} else {
		crop = 'false';
		outline = 'true';
	}
	width = customPrompt("Size of screenshot? (Default: 60%)", "60%");
	if(isNullOrEmpty(width))
		width = "60%";

	if(outlineElements.length > 0)
		removeAllOutlines();

	return [`'` + cssSelector + `'`,
					crop,
					outline,
					`'` + width + `'`
					];
}

function getGDFillIn(node) {
	var cssSelector = getCssSelector(node);
	var message = customPrompt('Fill in with: ');
	if(!message) message = "";

	//Simulação da ação
	node.value = message;

	return [`'` + cssSelector + `'`, `'` + message.toString() + `'`];
}

function getGDSubmit(node) {
	var tmpNode = node;
	while(tmpNode.localName !== "form" && tmpNode.localName !== "body") {
		tmpNode = tmpNode.parentElement;
	}
	if(tmpNode.localName === "form")
		node = tmpNode;

	var cssSelector = getCssSelector(node);
	//Simulação da ação
	try {
		node.submit();
	} catch(e) {}

	return [`'` + cssSelector + `'`];
}

function getGDWait(node) {
	var cursor = document.body.style.cursor;
	document.body.style.cursor = 'progress';

	var cssSelector = getCssSelector(node);
	var timeOut = customPrompt("Time limit for wait of element.[ms] (Default: 5000)");
	if(isNullOrEmpty(timeOut))
		timeOut = '5000';

	setTimeout(function() {
		document.body.style.cursor = cursor;
	}, 1000);

	return [`'` + cssSelector + `'`, timeOut];
}

function getGDSleep() {
	var cursor = document.body.style.cursor;
	document.body.style.cursor = 'progress';

	var time = customPrompt("Time to sleep.[ms]");
	if(isNullOrEmpty(time))
		time = '1000';

	setTimeout(function() {
		document.body.style.cursor = cursor;
	}, 1000);

	return [sleep];
}

function getGDPrint() {
	var message = customPrompt("Write your message");
	return [`'` + message.toString() + `'`];
}

function getGDOutline(node) {
	node.style.outline = 'solid red 3px';
	outlineElements.push(node);
	return [`'` + getCssSelector(node) + `'`];
}


//AUX FUNCTIONS
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
	if(variable === null || variable.toString().trim() === "")
		return true;
	return false;
}

function removeAllOutlines() {
	var nodeOutline = outlineElements.pop();
	while(nodeOutline) {
		nodeOutline.style.outline = '';
		nodeOutline = outlineElements.pop();
	}
}

function setReturn(message) {
	self.postMessage(message);
}

function getPageContext(node) {
	if(isInsideIframe(node)) {
		return "'" + getCssSelector(node.ownerDocument.defaultView.frameElement) + "'";
	}
	return null;
}

function isInsideIframe(node) {
	if(node.ownerDocument.defaultView.frameElement)
		return true;
	else
		return false;
}

function toast(message) {
	var toast = new iqwerty.toast.Toast(message, {
		settings: {
			duration: 2000
		},
		style: {
			main: {
				width: '25%'
			}
		}
	});
}
