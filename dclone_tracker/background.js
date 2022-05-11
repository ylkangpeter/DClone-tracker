try {
    importScripts("util.js");
} catch (e) {
    console.log(e);
}

let intervalInSeconds = 60;
// set current alert level to 5. So 5 or 6 will trigger alert.
let alertLevel = 5;


let jspIntervalInSeconds = 30;
let keyword='dclone';


function looping() {

  console.log("[background] d2 start fetching data every "+ intervalInSeconds + " seconds.")
  fetch('https://diablo2.io/dclone_api.php')
    .then(result => {
      if(result.status === 200){
        return result.json();
      }
        console.log("[background] something wrong when connecting. status code: " + result.status);
      })
    .then(result => {
        console.log("[background] " + result);
        var results = jsonParser(result);
        var msg = ""; 
        for (let result of results) {
          if(result.progress>=alertLevel){

            chrome.action.setBadgeText ( { text: 'NEW' } );
            chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
            
            msg = "Prime evil is coming!";
            // may add some details in msg later.
            toPopup(msg);
            break;
          }
        }
      })
    .catch((error) => {
      console.log(error)
      });
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

function callback(){
  console.log("[background] send notifications.");

}
function optionChecker() {
  // reset state according to option parameters.
}

function d2jspTracker(){
  console.log("[background] jsp start fetching data every "+ jspIntervalInSeconds + " seconds.")
  fetch('https://forums.d2jsp.org/forum.php?f=271&t=5')
    .then(result => {
      if(result.status === 200){
        return result.text();
      }
        console.log("[background] something wrong when connecting. status code: " + result.status);
      })
    .then(result => {
        console.log("[background] " + result);
        
        if(result.toLowerCase().indexOf(keyword)>=0){
          console.log("d2jsp talking about dclone");
          chrome.action.setBadgeText ( { text: 'jsp' } );
          chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
            
          msg = "jsp dclone topics.";
          // may add some details in msg later.
          toPopup(msg);
        }
      })
    .catch((error) => {
      console.log(error)
      });
}

setInterval(looping, intervalInSeconds*1000);
setInterval(d2jspTracker, jspIntervalInSeconds*1000);

optionChecker()