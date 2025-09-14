// ==UserScript==
// @name Wormhole
// @namespace https://www.bondageprojects.com/
// @version 0.0.8
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

(function () {
    'use strict';
    const ending = 'wormhole.js';
    const prodPath = 'https://ddeeplb.github.io/Themed-BC/';
    const devPath = `${prodPath}dev/`;
    const localPath = 'http://localhost:45001/';

    const isDev = window.location.search.includes('WMHL=dev');
    const isLocal = window.location.search.includes('WMHL=local');
    const isPublic = isDev || !isLocal;

    let modLink = prodPath;
    if (isDev) modLink = devPath;
    else if (isLocal) modLink = localPath;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute('crossorigin', 'anonymous');
    script.src = `${modLink}${ending}${isPublic ? '?' + Date.now() : ''}`;
    document.head.appendChild(script);
})();