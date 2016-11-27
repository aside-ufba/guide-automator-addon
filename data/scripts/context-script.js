//var cssLogic = require('../lib/css-logic');

self.on("click", function(node, data) {
	self.postMessage(findCssSelector(node));
});
