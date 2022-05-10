function jsonParser(results){
	// console.log(results);
    for (let result of results) {
		result.formatedTime = getTimestamp(result.timestamped);
		// console.log(result);
	}
	return results;
}

function getTimestamp(time) {
  const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
  const d = new Date();
  d.setTime(time*1000)
  
  return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}