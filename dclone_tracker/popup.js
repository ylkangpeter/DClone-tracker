// Initialize butotn with users's prefered color
let progress = document.getElementById("dCloneProgress");
let regionDict = {1:"Americas",2:"Europe",3:"Asia"};
let totalDCloneProgress = 6;

function tracking(){

  chrome.action.setBadgeText ( { text: '' } );
  
  console.log("loading..")
  fetch('https://diablo2.io/dclone_api.php').then(result => {
      if(result.status === 200){
        return result.json();
      }
       console.log("[popup] something wrong when connecting. status code: " + result.status);
     }).then(result =>{
        console.log(result);
        var rows = jsonParser(result);

        var renderHtml ="<table class='styled-table'><theadh><td>No.</td><td>Progress</td><td>ladder</td><td>Hardcore</td><td>Region</td><td>Update Time</td></thead>"
        for (var i=0;i<rows.length;i++) {
          renderHtml+="<tr><td>"
          renderHtml+=i+1;
          renderHtml+="</td>"    

          renderHtml+="<td>"
          renderHtml+=genProgressBar(rows[i].progress);
          renderHtml+="</td>"        

          renderHtml+="<td>"
          renderHtml+=(rows[i].ladder==1?"ladder":"non-ladder");
          renderHtml+="</td>"        

          renderHtml+="<td>"
          renderHtml+=(rows[i].hc==1?"Hardcore":"Softcore");
          renderHtml+="</td>"   

          renderHtml+="<td>"
          renderHtml+=regionDict[rows[i].region];
          renderHtml+="</td>"        

          renderHtml+="<td>"
          renderHtml+=getTimestamp(rows[i].timestamped);
          renderHtml+="</td></tr>"            
        }
        renderHtml+="</table>";

        progress.innerHTML=renderHtml;
  }).catch((error) => {
  console.log(error)
  });
}

function genProgressBar(progress){
  var result = "<div class='container'><div class='progress-segment'>";
  var i=0;
  for(;i<progress;i++){
    result += "<div class='item my-common'></div>"
  }

  for(;i<totalDCloneProgress;i++){
    result += "<div class='item'></div>"
  }

  result += "</div></div>";
  return result;
}

tracking();