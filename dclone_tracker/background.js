try {
    importScripts("util.js");
} catch (e) {
    console.log(e);
}

let intervalInSeconds = 60;
// set current alert level to 5. So 5 or 6 will trigger alert.
let alertLevel = 5;

function looping() {

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

console.log("start fetching data every "+ intervalInSeconds + " seconds.")
setInterval(looping, intervalInSeconds*1000);

optionChecker()