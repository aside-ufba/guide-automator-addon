self.on("click", function(node, data) {
	self.postMessage(findCssSelector(node));
});

findCssSelector = function(ele) {
	ele = getRootBindingParent(ele);
	let document = ele.ownerDocument;
	if (!document || !document.contains(ele)) {
		throw new Error("findCssSelector received element not inside document");
	}

	// document.querySelectorAll("#id") returns multiple if elements share an ID
	if (ele.id &&
		document.querySelectorAll("#" + CSS.escape(ele.id)).length === 1) {
		return "#" + CSS.escape(ele.id);
	}

	// Inherently unique by tag name
	let tagName = ele.localName;
	if (tagName === "html") {
		return "html";
	}
	if (tagName === "head") {
		return "head";
	}
	if (tagName === "body") {
		return "body";
	}

	// We might be able to find a unique class name
	let selector, index, matches;
	if (ele.classList.length > 0) {
		for (let i = 0; i < ele.classList.length; i++) {
			// Is this className unique by itself?
			selector = "." + CSS.escape(ele.classList.item(i));
			matches = document.querySelectorAll(selector);
			if (matches.length === 1) {
				return selector;
			}
			// Maybe it's unique with a tag name?
			selector = tagName + selector;
			matches = document.querySelectorAll(selector);
			if (matches.length === 1) {
				return selector;
			}
			// Maybe it's unique using a tag name and nth-child
			index = positionInNodeList(ele, ele.parentNode.children) + 1;
			selector = selector + ":nth-child(" + index + ")";
			matches = document.querySelectorAll(selector);
			if (matches.length === 1) {
				return selector;
			}
		}
	}

	// Not unique enough yet.  As long as it's not a child of the document,
	// continue recursing up until it is unique enough.
	if (ele.parentNode !== document) {
		index = positionInNodeList(ele, ele.parentNode.children) + 1;
		selector = findCssSelector(ele.parentNode) + " > " +
			tagName + ":nth-child(" + index + ")";
	}

	return selector;
};

function positionInNodeList(element, nodeList) {
	for (let i = 0; i < nodeList.length; i++) {
		if (element === nodeList[i]) {
			return i;
		}
	}
	return -1;
}

function getRootBindingParent(node) {
	let parent;
	let doc = node.ownerDocument;
	if (!doc) {
		return node;
	}
	//while ((parent = doc.getBindingParent(node))) {
	//	node = parent;
	//}
	return node;
}
