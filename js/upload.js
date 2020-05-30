async function parseReport(doc){
	var data={"portfolio":[]};
	console.log(doc.body);
	//console.log(parseFloat(doc.querySelector("body > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(7)").innerText.replace(/\s/g, '')));	
	var tr=doc.querySelectorAll("body > table:nth-child(2) > tbody > tr");
	tr.forEach((e)=>{
		if (e.querySelector("td:nth-child(3)").innerText=="T365"){
			data.portfolio.push({
				"Ticker": e.querySelector("td:nth-child(1)").innerText
				,"Name": e.querySelector("td:nth-child(2)").innerText
				,"beginQty": e.querySelector("td:nth-child(4)").innerText
				,"endQty": e.querySelector("td:nth-child(6)").innerText
				,"beginValue:":e.querySelector("td:nth-child(5)").innerText
				,"endValue":e.querySelector("td:nth-child(7)").innerText
				});
			//console.log(e.querySelector("td:nth-child(1)").innerText+" "+parseFloat(e.querySelector("td:nth-child(7)").innerText.replace(/\s/g, '')));
		}
	});
	console.log(data);
	//return await Promise.resolve(1);	
}

async function readFile(item,reader) {
  reader.readAsText(item);
  return await Promise.resolve(1);
}

async function processFiles(array) {
  for (const item of array) {
    await readFileAsync(item);
  }
  console.log('Done!');
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (file) => {
		readXml=file.target.result;
        var parser = new DOMParser();
        var doc = parser.parseFromString(readXml, "text/html");
		parseReport(doc);		
		resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  })
}

$( document ).ready(function() {
		if (!!sessionStorage.identity){
			$('#uploader').show();
			$('#warning').hide();
		}
		else{
			$('#uploader').hide();
			$('#warning').show();
			$('#warning').text("Need login");
		}
			
		var readXml=null;
		$('#xmlForm').submit(function(event) {
			event.preventDefault();
			processFiles(document.getElementById('input').files);
		});
});	   