var textArea = document.getElementById("edit-box");
var textCode = document.getElementById("box-code");
var btnClear = document.getElementById("Clear");

textCode.value = "";
textArea.addEventListener('keyup', function onkeyup(event) {
	if(event.keyCode == 13) {
		text = textArea.value;
		self.port.emit("hideMessage", text);
	}
}, false);

btnClear.addEventListener('click', function() {
	textCode.value = "";
	textArea.value = `\`\`\`javascript\n\n` + textCode.value + `\n\`\`\``;
	self.port.emit("clear");
});

self.port.on("show", function onShow() {
	textArea.value = `\`\`\`javascript\n\n` + textCode.value + `\n\`\`\``;
	textArea.focus();
});

self.port.on("text-received", function onShow(text) {
	if(text)
		textCode.value += text;
});
