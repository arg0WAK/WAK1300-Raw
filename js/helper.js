// helper.js - Strict Safe WebKit/601.2+ Version
import { runExploit } from "./jb.js";

const SUPPORTED_FIRMWARES = {
  1300: 1,
  1302: 1,
  1304: 1,
  1350: 1,
  1352: 1,
};

export function checkAndDisplayFirmware() {
  var ua = navigator.userAgent;
  var match = /PlayStation\s+4[\/ ](\d+)\.(\d+)/.exec(ua);

  if (!match) {
    setStatus(
      "Firmware: <b>Unknown</b> &middot; <span style='color: #ef4444;'>Not a PS4 Browser</span>",
    );
    return { detected: false, raw: null, fwnum: null, supported: false };
  }

  var minorHex = parseInt(match[2], 16).toString(16);
  if (minorHex.length < 2) {
    minorHex = "0" + minorHex;
  }

  var major = match[1];
  var rawVersion = major + "." + minorHex;
  var fwnum = parseInt(major, 10) * 100 + parseInt(minorHex, 10);

  var params = new URLSearchParams(window.location.search);
  var forced = params.get("force") === "1";
  var supported = forced || SUPPORTED_FIRMWARES[fwnum] === 1;

  if (supported) {
    setStatus(
      "Firmware: <b>v" +
        rawVersion +
        "</b> &middot; <span style='color: #22c55e;'>Supported ✔</span>",
    );
  } else {
    setStatus(
      "Firmware: <b>v" +
        rawVersion +
        "</b> &middot; <span style='color: #ef4444;'>Unsupported Firmware</span>",
    );
  }

  return {
    detected: true,
    raw: rawVersion,
    fwnum: fwnum,
    supported: supported,
  };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeSetLocalStorage(key, value) {
  try {
    if (window.localStorage) {
      localStorage.setItem(key, value);
      return true;
    }
  } catch (e) {}
  return false;
}

function safeGetLocalStorage(key) {
  try {
    if (window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (e) {}
  return null;
}

window.onerror = function (message, source, lineno) {
  var fileName = source
    ? source.substring(source.lastIndexOf("/") + 1)
    : "inline";
  setTemporaryStatus(
    '<span style="color: #ef4444;">Error [' +
      fileName +
      ":" +
      lineno +
      "]: " +
      message +
      "</span>",
  );
};

var defaultStatus = "Waiting for command...";

export function setStatus(text) {
  var statusElement = document.getElementById("status");
  if (statusElement) {
    statusElement.innerHTML = text;
  }
}

const WS_MODE = false;
const WS_HOST = "ws://192.168.1.88:8080";

let ws = null;

if (WS_MODE) {
  try {
    ws = new WebSocket(WS_HOST);

    ws.onopen = () => {
      console.log("WebSocket connected successfully.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  } catch (error) {
    console.error("Failed to initialize WebSocket:", error);
  }
}

export function appendLog(text) {
  const logBox = document.getElementById("logbox");

  if (logBox) {
    logBox.style.setProperty("display", "block", "important");

    const line = document.createElement("span");
    line.innerHTML = text;

    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  if (ws?.readyState === WebSocket.OPEN) {
    const cleanText = text.replace(/<[^>]*>/gm, "");
    ws.send(cleanText);
  }
}

function e_desc() {
  setStatus(defaultStatus);
}

function setTemporaryStatus(text, delay) {
  setStatus(text);
  setTimeout(function () {
    e_desc();
  }, delay || 3000);
}

function initializeAppCache() {
  try {
    if (!window.applicationCache) return;

    window.applicationCache.onprogress = function (event) {
      var progressPercentage = Math.round(100 * (event.loaded / event.total));
      setStatus("Installing Offline Cache: " + progressPercentage + "%");
    };

    window.applicationCache.oncached = function () {
      setTimeout(function () {
        setStatus("Cache Installed Successfully ✔");
      }, 1500);

      safeSetLocalStorage("cached", "yes");

      setTimeout(function () {
        setStatus("Refreshing the page to apply updates...");
      }, 3000);

      setTimeout(function () {
        location.reload();
      }, 4500);
    };

    window.applicationCache.onnoupdate = function () {
      safeSetLocalStorage("cached", "yes");
    };

    window.applicationCache.onerror = function () {
      safeSetLocalStorage("cached", "yes");
    };
  } catch (err) {}
}

function startExploitChain() {
  setStatus("Starting the exploit chain. Please wait...");

  if (typeof runExploit === "function") {
    setTimeout(function () {
      runExploit().catch((err) => {
        setStatus(
          '<span style="color: #ef4444;">Exploit Error: ' +
            (err.message || err) +
            "</span>",
        );
      });
    }, 50);
  } else {
    setStatus(
      '<span style="color: #ef4444;">Exploit function not found. Modules failed to load.</span>',
    );
  }
}

export function exploitSuccess() {
  setStatus("Exploit Successful.");
}

window.addEventListener("load", function () {
  var fwResult = checkAndDisplayFirmware();

  sleep(500);

  if (fwResult.supported) {
    initializeAppCache();

    if (safeGetLocalStorage("cached") === "yes") {
      startExploitChain();
    }
  }
});
