$( document ).ready(function() {
       var readXml=null;
       $('#xmlForm').submit(function(event) {
           event.preventDefault();
           var selectedFile = document.getElementById('input').files[0];
           //console.log(selectedFile);
           var reader = new FileReader();
           reader.onload = function(e) {
               readXml=e.target.result;
              // console.log(readXml);
               var parser = new DOMParser();
               var doc = parser.parseFromString(readXml, "text/html");
			   console.log(doc.body);
               console.log(parseFloat(doc.querySelector("body > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(7)").innerText.replace(/\s/g, '')));
			   
           }
           reader.readAsText(selectedFile);

       });
});	   