function getULogin(token){
    $.getJSON("//ulogin.ru/token.php?host=" +
        encodeURIComponent(location.toString()) + "&token=" + token + "&callback=?",
    function(data){
        data=$.parseJSON(data.toString());
        if(!data.error){
            console.log(data);
			sessionStorage.identity = data.identity;
			sessionStorage.first_name = data.first_name;
			sessionStorage.last_name = data.last_name;
			sessionStorage.profile = data.profile;
			sessionStorage.uid = data.uid;
			setLogin();
       	 }
    });
}

function setLogin(){
	if (!!sessionStorage.identity){
		$('#uLogin').hide();
		$('#userPanel').show();		
		$('#userName').text(sessionStorage.first_name+" "+sessionStorage.last_name);
	}
	else{
		$('#uLogin').show();
		$('#userPanel').hide();
	}
}

function dropLogin(){
	sessionStorage.identity = "";
	sessionStorage.first_name = "";
	sessionStorage.last_name = "";
	sessionStorage.profile = "";
	sessionStorage.uid = "";
	setLogin();
}


$( document ).ready(function() {
	setLogin();
});