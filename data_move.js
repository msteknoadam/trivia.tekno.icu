function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

fetch("https://trivia.tekno.icu/trivias.txt")
    .then((response) => {
        response.text().then((data) => {
        	//console.log(data);
            window.trivias = data;
			window.triviasSplit = data.split("\n");
			document.body.innerText = data;
			//send_to_server(data);
        });
    })
	.catch((err) => { console.log("Couldn't read the file. Please try again later.") });

function send_to_server(data) {
	for(var i = 0; i < window.triviasSplit.length; i++) {
		send(i);
	}
}

function send(index) {
	setTimeout(() => {
			var trivia = window.triviasSplit[index];
			if(trivia.split("-@-").length == 7) {
				var triviaData = trivia.split("-@-"),
						hoster = triviaData[0],
						question = triviaData[1],
						answer = triviaData[2],
						timeStamp = triviaData[3],
						winners = triviaData[4],
						chatName = triviaData[5],
						totalAmount = triviaData[6],
						triviaObj = {"hoster": hoster, "question": question, "answer": answer, "timeStamp": timeStamp, "winners": winners, "totalAmount": totalAmount},
						winnersArray = winners.split(",");
				//httpGetAsync(`https://trivia.tekno.icu/action_with_db_test.php?name=${hoster}&question=${question}&answer=${answer}&time=${timeStamp}&winners=${winners}&chat=${chatName}&total=${totalAmount}`, function(response) { document.body.innerText += `Response: ${response}\nTrivia: ${trivia}\nLink: https://trivia.tekno.icu/action_with_db_test.php?name=${hoster}&question=${question}&answer=${answer}&time=${timeStamp}&winners=${winners}&chat=${chatName}&total=${totalAmount}\n`; });
				$.get(
					`https://trivia.tekno.icu/action_with_db_test.php?name=${hoster}&question=${question}&answer=${answer}&time=${timeStamp}&winners=${winners}&chat=${chatName}&total=${totalAmount}`,
					(success) => { document.body.innerText += `Response: ${success}\n` }
				);
			}
		}, index * 100);
}