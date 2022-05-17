// Initialize butotn with users's prefered color
let progress = document.getElementById("dCloneProgress");
let jsp = document.getElementById("toggleJsp");
let alertLevel = document.getElementById("alertLevel");

let ALERT_LEVEL_KEY = "alert";
let JSP_TOGGLE_KEY = "jsp";


let regionDict = {
  1: "Americas",
  2: "Europe",
  3: "Asia"
};
let totalDCloneProgress = 6;
let LOCAL_KEY = "key";

function changeAlert(inx) {
  console.log(inx);
}

async function tracking() {

  chrome.action.setBadgeText({
    text: ''
  });
  // await new Promise(r => setTimeout(r, 4000));
  console.log("loading..")
  var result = await fetch('https://diablo2.io/dclone_api.php')
  console.log(result)

  if (result.status === 200) {

    // console.log(result);
    var text = await result.json();
    var rows = jsonParser(text);

    var renderHtml = "<table class='styled-table'><theadh><td>No.</td><td>Toggle alert</td><td>Progress</td><td>ladder</td><td>Hardcore</td><td>Region</td><td>Update Time</td></thead>"
    for (var i = 0; i < rows.length; i++) {
      var key = rows[i].ladder + "_" + rows[i].hc + "_" + rows[i].region;
      var checked = await getStatus(key);

      renderHtml += "<tr><td>"
      renderHtml += i + 1;
      renderHtml += "</td>"
      console.log("checked: " + checked);

      var checkV = checked ? "checked" : "";
      console.log("checkV: " + checkV);
      renderHtml += "<td>"
      renderHtml += "<section class='model-1'><div class='checkbox'><input type='checkbox' id='" + i + "' data-inner-attr='" + key + "' " + checkV + "/><label></label></div></section>";
      renderHtml += "</td>"

      renderHtml += "<td>"
      renderHtml += genProgressBar(rows[i].progress);
      renderHtml += "</td>"

      renderHtml += "<td>"
      renderHtml += (rows[i].ladder == 1 ? "ladder" : "non-ladder");
      renderHtml += "</td>"

      renderHtml += "<td>"
      renderHtml += (rows[i].hc == 1 ? "Hardcore" : "Softcore");
      renderHtml += "</td>"

      renderHtml += "<td>"
      renderHtml += regionDict[rows[i].region];
      renderHtml += "</td>"

      renderHtml += "<td>"
      renderHtml += getTimestamp(rows[i].timestamped);
      renderHtml += "</td></tr>"
    }
    renderHtml += "</table>";

    progress.innerHTML = renderHtml;

    addListener();
  } else {
    console.log(result);
  }
}

function genProgressBar(progress) {
  var result = "<div class='container'><div class='progress-segment'>";
  var i = 0;
  for (; i < progress; i++) {
    result += "<div class='item my-common'></div>"
  }

  for (; i < totalDCloneProgress; i++) {
    result += "<div class='item'></div>"
  }

  result += "</div></div>";
  return result;
}

async function initConfig(){
  // jsp
  var jspConfig = await chrome.storage.local.get(JSP_TOGGLE_KEY);
  var cur = jspConfig[JSP_TOGGLE_KEY]||true
  jsp.checked=cur;

  // alert level
  var lv = await chrome.storage.local.get(ALERT_LEVEL_KEY);
  var cur = lv[ALERT_LEVEL_KEY]||4
  alertLevel.value=cur;
}

function addListener() {
  progress.addEventListener('click', async (e) => {
    console.log(e);
    if (e.target.tagName == 'INPUT') {
      var newStat = e.target.checked;
      var stats = await chrome.storage.local.get(LOCAL_KEY);
      if(!stats[LOCAL_KEY]){
      	stats[LOCAL_KEY]={}
      }
      stats[LOCAL_KEY][e.target.dataset.innerAttr] = newStat;
      chrome.storage.local.set(stats);
    }
  }, false)

  alertLevel.addEventListener('click', async (e) => {
    console.log(e);
    var newLevel = e.target.value;
    var lv = await chrome.storage.local.get(ALERT_LEVEL_KEY);
    var cur = lv[ALERT_LEVEL_KEY]||4
    console.log(`alert level changed from ${cur} to ${newLevel}`)
    lv[ALERT_LEVEL_KEY]=newLevel;
    chrome.storage.local.set(lv);
  }, false)

  jsp.addEventListener('click', async (e) => {
    console.log(e);    
    var checked = e.target.checked;
    var jspConfig = await chrome.storage.local.get(JSP_TOGGLE_KEY);
    var cur = jspConfig[JSP_TOGGLE_KEY]||true
    console.log(`jspConfig changed from ${cur} to ${checked}`)
    jspConfig[JSP_TOGGLE_KEY]=checked;
    chrome.storage.local.set(jspConfig);
  }, false)
}

async function getStatus(key) {
  var stats = await chrome.storage.local.get(LOCAL_KEY);
  if(stats && stats[LOCAL_KEY]){
  	console.log(stats[key])
  	return stats[LOCAL_KEY][key];
  }else{
  	return false;
  }
}

initConfig();
tracking();