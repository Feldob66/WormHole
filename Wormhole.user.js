// ==UserScript==
// @name Wormhole
// @namespace https://www.bondageprojects.com/
// @version 0.0.1
// @description Various teleportation functions
// @author Felix,Sin
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match https://bondageprojects.com/*
// @match https://www.bondageprojects.com/*
// @icon  https://wce.netlify.app/icon.png
// @grant none
// @run-at document-end
// ==/UserScript==
setTimeout(
	function () {
			let n = document.createElement("script");
			n.setAttribute("language", "JavaScript");
			n.setAttribute("crossorigin", "anonymous");
			n.setAttribute("src", "https://github.com/Feldob66/WormHole/Wormhole.js?_=" + Date.now());
			n.onload = () => n.remove();
			document.head.appendChild(n);
	}, 
        10000
);