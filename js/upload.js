async function parseReport(doc){
	var data={
			"user":{
				"identity":sessionStorage.identity
				,"uidHash":CryptoJS.MD5(sessionStorage.uid+sessionStorage.identity).toString()			
			}
			,"portfolio":{}
			,"deals":[]
			,"positions":[]		
		};
	console.log(doc.body);
	var dateReg=/(\d{2})\.(\d{2})\.(\d{4})/;
	var dt=doc.querySelector("body > table:nth-child(1) > tbody > tr:nth-child(1) > td").innerText.match(dateReg);
	if (!dt) {
		$('#log').append("Date not found<br>");
		return;
	}
	else{
		data.portfolio.date=new Date(dt[0].replace( dateReg, "$2/$1/$3"));		
	}
	var fl=doc.querySelector("body > table:nth-child(1) > tbody > tr:nth-child(3) > td").innerText.match(/:\s+(\S+)$/);
	if (!fl) {
		$('#log').append("Folder not found<br>");
		return;
	}
	else{
		data.portfolio.folder=fl[1];		
	}
	var tr=doc.querySelectorAll("body > table:nth-child(2) > tbody > tr");
	tr.forEach((e)=>{			
		if (e.querySelector("td:nth-child(3)").innerText=="T365"){
			if (e.querySelector("td:nth-child(4)").innerText!=e.querySelector("td:nth-child(6)").innerText){
				data.deals.push({
					"Ticker": e.querySelector("td:nth-child(1)").innerText
					,"Name": e.querySelector("td:nth-child(2)").innerText
					,"deltaQty": parseFloat(e.querySelector("td:nth-child(6)").innerText.replace(/\s/g, '')) - parseFloat(e.querySelector("td:nth-child(4)").innerText.replace(/\s/g, ''))					
					,"deltaValue:":parseFloat(e.querySelector("td:nth-child(7)").innerText.replace(/\s/g, '')) - parseFloat(e.querySelector("td:nth-child(5)").innerText.replace(/\s/g, ''))					
				});
			}
			data.positions.push({
				"Ticker": e.querySelector("td:nth-child(1)").innerText
				,"Name": e.querySelector("td:nth-child(2)").innerText
				,"beginQty": parseFloat(e.querySelector("td:nth-child(4)").innerText.replace(/\s/g, ''))
				,"endQty": parseFloat(e.querySelector("td:nth-child(6)").innerText.replace(/\s/g, ''))
				,"beginValue:":parseFloat(e.querySelector("td:nth-child(5)").innerText.replace(/\s/g, ''))
				,"endValue":parseFloat(e.querySelector("td:nth-child(7)").innerText.replace(/\s/g, ''))
			});
		}		
	});
	console.log(data);
	upload(data);
	$('#log').append(dt[0]+" | "+fl[1]+" | "+data.positions.length+" positions parsed<br>");
}


function upload(data){
	$.post( "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/quik-rizhs/service/upload/incoming_webhook/upload", data,function(resp) {
	  $('#log').append( resp.toString() );
	},"json")
	  //.done(function() {
		//$('#log').append( "second success" );
	  //})
	  .fail(function() {
		$('#log').append("error uploading to DB<br>");
	  })
	  //.always(function() {
		//$('#log').append( "finished" );
	 // });
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
		$('#xmlForm').submit(async function(event) {
			event.preventDefault();
			await processFiles(document.getElementById('input').files);
			document.getElementById('input').value="";
		});
});	   