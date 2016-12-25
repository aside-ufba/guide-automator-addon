var outlineElements = [];
var pageContext = '';

self.on("click", function(node, data) {
	setReturn(parserCommand(node, data));
});

//GD = Guide-Automator Functions
function parserCommand(node, data) {
	data = JSON.parse(data);
	var result = "";
	switch(data.command) {
		case "GetCssSelector":
			result = getCssSelector(node);
			break;
		case "GetUrl":
			result = getGDUrl();
			break;
		case "Click":
			result = checkPageContext(node);
			result += getGDClick(node);
			break;
		case "TakeScreenshot":
			result = getGDTakeScreenshot();
			break;
		case "TakeScreenshotOf":
			result = checkPageContext(node);
			result += getGDTakeScreenshotOf(node);
			break;
		case "FillIn":
			result = checkPageContext(node);
			result += getGDFillIn(node);
			break;
		case "Submit":
			result = checkPageContext(node);
			result += getGDSubmit(node);
			break;
		case "Wait":
			result = checkPageContext(node);
			result += getGDWait(node);
			break;
		case "Sleep":
			result = getGDSleep();
			break;
		case "Print":
			result = getGDPrint();
			break;
		case "Outline":
			result = getGDOutline(node);
			break;
		default:
			result = "";
	}
	if(result !== "")
		toast("Code copied to clipboard!");
	return result;
}

function getCssSelector(node) {
	return findCssSelector(node);
}

function getGDUrl() {
	return `get('` + window.location.href + `');`;
}

function getGDClick(node) {
	//Simulação da ação
	node.click();

	return `click('` + getCssSelector(node) + `');`;
}

function getGDTakeScreenshot() {
	var width = customPrompt("Size of screenshot? (Default: 60%)", "60%");
	if(outlineElements.length === 0) {
		if(!isNullOrEmpty(width))
			return `takeScreenshot('` + width + `');`;

		return "takeScreenshot();";
	} else {
		if(isNullOrEmpty(width))
			width = "60%";
		var selectors = removeAllOutlines();
		return `takeScreenshotOf([` + selectors + `],` +
			'false' + `,` +
			'true' + `,'` +
			width +
			`');`;
	}
}

function getGDTakeScreenshotOf(node) {
	var width, cssSelector;
	if(outlineElements.length === 0) {
		cssSelector = getCssSelector(node);
		var crop = customYesNoQuestion("Want to crop the image based on the element?");
		var outline = customYesNoQuestion("Want to outline the element?");
		width = customPrompt("Size of screenshot? (Default: 60%)", "60%");
		if(isNullOrEmpty(width))
			width = "60%";

		return `takeScreenshotOf('` + cssSelector + `',` +
			crop.toString() + `,` +
			outline.toString() + `,'` +
			width +
			`');`;

	} else {

		width = customPrompt("Size of screenshot? (Default: 60%)", "60%");
		if(isNullOrEmpty(width))
			width = "60%";
		outlineElements.push(node);

		var selectors = removeAllOutlines();
		return `takeScreenshotOf([` + selectors + `],` +
			'false' + `,` +
			'true' + `,'` +
			width +
			`');`;
	}
}

function getGDFillIn(node) {
	var cssSelector = getCssSelector(node);
	var message = customPrompt('Fill in with: ');
	if(!message) message = "";

	//Simulação da ação
	node.value = message;

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
	//Simulação da ação
	try {
		node.submit();
	} catch(e) {}

	return `submit('` + cssSelector + `');`;
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

	return `wait('` + cssSelector + `',` + timeOut + `);`;
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

	return `sleep('` + time.toString().trim() + `');`;
}

function getGDPrint() {
	var message = customPrompt("Write your message");
	return `console.print('` + message.toString() + `');`;
}

function getGDOutline(node) {
	node.style.outline = 'solid red 3px';
	outlineElements.push(node);
	return "";
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
	var selectors = [];
	var nodeOutline = outlineElements.pop();
	while(nodeOutline) {
		selectors.push(`'` + getCssSelector(nodeOutline) + `'`);
		nodeOutline.style.outline = '';
		nodeOutline = outlineElements.pop();
	}
	return selectors;
}

function setReturn(message) {
	self.postMessage(message);
}

function checkPageContext(node) {
	if(isInsideIframe(node)) {
		pageContext = getCssSelector(node.ownerDocument.defaultView.frameElement);
		return `pageContext(` + pageContext + `);\n`;
	} else {
		if(pageContext !== '') {
			pageContext = '';
			return 'pageContext();\n';
		}
	}
	pageContext = '';
	return "";
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
