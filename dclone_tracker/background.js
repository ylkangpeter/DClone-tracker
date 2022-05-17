try {
  importScripts("util.js");
} catch (e) {
  console.log(e);
}

let intervalInSeconds = 10;
// set current alert level to 5. So 5 or 6 will trigger alert.
// let alertLevel = 2;


let jspIntervalInSeconds = 30;
let keyword = 'dclone';
let LOCAL_KEY = "key";
let ALERT_LEVEL_KEY = "alert";
let JSP_TOGGLE_KEY = "jsp";

async function looping() {

  console.log("[background] d2 start fetching data every " + intervalInSeconds + " seconds.")
  var result = await fetch('https://diablo2.io/dclone_api.php')

  // console.log("[background] " + result);

  if (result.status === 200) {
    var text = await result.json();
    var results = jsonParser(text);
    var msg = "";

    var alertConfig = await chrome.storage.local.get(ALERT_LEVEL_KEY);
    var alertLevel = alertConfig[ALERT_LEVEL_KEY] || 4;

    console.log(`[background]-alert config- level: ${alertLevel}`);

    for (let result of results) {
      if (result.progress >= alertLevel) {
        var key = result.ladder + "_" + result.hc + "_" + result.region;
        console.log(`[background]-${key}`)

        var data = await chrome.storage.local.get(LOCAL_KEY);
        var stats = data[LOCAL_KEY] || "{}";
        console.log(`[background]-${stats}`)
        if (stats[key] != true) {
          console.log("-----" + key + "------triggered, but not toggled!")
        } else {
          chrome.action.setBadgeText({
            text: 'NEW'
          });
          chrome.action.setBadgeBackgroundColor({
            color: [255, 0, 0, 255]
          });

          msg = "Prime evil is coming!";
          // may add some details in msg later.
          toPopup(msg);
          return;
        }
      }
    }
  } else {
    console.log(`[background]-error-${result}`);
  }
}

function toPopup(msg) {
  var options = {
    type: "basic",
    title: "Dclone tracker alert",
    message: msg,
    iconUrl: "images/icon.png"
  };


  chrome.notifications.create(options, callback);
}

function callback() {
  console.log("[background] send notifications.");

}

function optionChecker() {
  // reset state according to option parameters.
}

async function d2jspTracker() {
  console.log("[background] jsp start fetching data every " + jspIntervalInSeconds + " seconds.")
  var jspConfig = await chrome.storage.local.get(JSP_TOGGLE_KEY);
  var jspToggle = jspConfig[JSP_TOGGLE_KEY] || true;
  console.log("[background]-jsp config- toggle jsp:${jspToggle}");
  if (jspToggle) {
    var result = await fetch('https://forums.d2jsp.org/forum.php?f=271&t=5')
    console.log("[background] " + result);
    var v = await result.text()
    if (v.toLowerCase().indexOf(keyword) >= 0) {
      console.log("d2jsp talking about dclone");
      chrome.action.setBadgeText({
        text: 'jsp'
      });
      chrome.action.setBadgeBackgroundColor({
        color: [255, 0, 0, 255]
      });

      msg = "jsp dclone topics.";
      // may add some details in msg later.
      toPopup(msg);
    }
  }
}

setInterval(looping, intervalInSeconds * 1000);
setInterval(d2jspTracker, jspIntervalInSeconds * 1000);

optionChecker()