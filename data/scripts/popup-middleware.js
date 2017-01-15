var textArea = document.getElementById("edit-box");

self.port.on("show", function onShow() {
	textArea.focus();
});

self.port.on("text-received", function onShow(text) {
	if(text)
		addText(text);
});

//Buttons
document.querySelectorAll('#bottom-panel > button')
	.forEach(element => {
		element
			.className = ' w3-btn w3-small w3-black w3-border w3-hover-border-white';
		element
			.addEventListener('click', function() {
				executeCommandButton(this.id);
			});
	});

function executeCommandButton(buttonId) {
	switch(buttonId) {
		case "Clear":
			clearText();
			self.port.emit("clear");
			break;
		case "Copy":
			text = getTextWithTags().toString();
			toast("Code copied to clipboard!");
			self.port.emit("CopyMessage", text);
			break;
		case "NPM":
			window.open('https://www.npmjs.com/package/guide-automator', '_blank');
			break;
		default:

	}
}


//Function Panel left
document.querySelectorAll('#left-panel > ul > li')
	.forEach(element => {
		element
			.addEventListener('click', function() {
				executeCommandGD(this.id);
			});
		if(element.id)
			element.style.cursor = 'pointer';
	});

function executeCommandGD(commandId) {
	switch(commandId) {
		case "GDget":
			addText("get('http://example.com');");
			break;
		case "GDclick":
			addText("click('CssSelector');");
			break;
		case "GDtakeScreenshot":
			addText("takeScreenshot('60%');");
			break;
		case "GDtakeScreenshotOf":
			addText("takeScreenshotOf('CssSelector',crop,outline,'60%');");
			break;
		case "GDfillIn":
			addText("fillIn('CssSelector','Text');");
			break;
		case "GDsubmit":
			addText("submit('CssSelector');");
			break;
		case "GDwait":
			addText("wait('CssSelector',timeLimit);");
			break;
		case "GDsleep":
			addText("sleep(time);");
			break;
		case "GDprint":
			addText("console.print('Text');");
			break;
		case "GDpageContext":
			addText("pageContext('Iframe-CssSelector');");
			break;
		default:
			break;

	}

}

//Function Auxiliar
function clearText() {
	textArea.value = "";
}

function addText(text) {
	textArea.value += text + '\n';
}

function getTextWithTags() {
	return `\`\`\`javascript\n\n` + textArea.value + `\n\`\`\``;
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
