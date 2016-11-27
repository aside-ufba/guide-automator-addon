// When the user hits return, send the "text-entered"
// message to main.js.
// The message payload is the contents of the edit box.
var textArea = document.getElementById("edit-box");
var textCode = document.getElementById("box-code");
textCode.value = "";

textArea.addEventListener('keyup', function onkeyup(event) {
	if(event.keyCode == 13) {
		// Remove the newline.
		text = textArea.value;
		self.port.emit("hide", text);
	}
}, false);
// Listen for the "show" event being sent from the
// main add-on code. It means that the panel's about
// to be shown.
//
// Set the focus to the text area so the user can
// just start typing.
self.port.on("show", function onShow() {
	textArea.value = `\`\`\`javascript\n\n` + textCode.value + `\n\`\`\``;
	textArea.focus();
});

self.port.on("text-received", function onShow(text) {
	if(text)
		textCode.value += text;
});
