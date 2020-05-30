function parseReport(doc){
	console.log(doc.body);
	console.log(parseFloat(doc.querySelector("body > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(7)").innerText.replace(/\s/g, '')));
			   
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
           //var selectedFile = document.getElementById('input').files[0];
           //console.log(selectedFile);
           var reader = new FileReader();
           reader.onload = function(e) {
               readXml=e.target.result;
              // console.log(readXml);
               var parser = new DOMParser();
               var doc = parser.parseFromString(readXml, "text/html");
			   parseReport(doc);			   
			}
			//reader.readAsText(selectedFile);
			Array.prototype.forEach.call(document.getElementById('input').files,async function(f){
				reader.readAsText(f);
			});
		});
});	   