/* TAKEN FROM https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript */
/* 
decimal_sep: character used as deciaml separtor, it defaults to '.' when omitted
thousands_sep: char used as thousands separator, it defaults to ',' when omitted
*/
Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep)
{ 
   var n = this,
   c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
   d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

   /*
   according to [https://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
   the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
   rather than doing value === undefined.
   */   
   t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

   sign = (n < 0) ? '-' : '',

   //extracting the absolute value of the integer part of the number and converting to string
   i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

   j = ((j = i.length) > 3) ? j % 3 : 0; 
   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
}

fetch("trivias.txt?dummy="+String(Number(new Date())))
    .then((response) => {
        response.text().then((data) => {
        	//console.log(data);
            window.trivias = data;
			//document.querySelector("#latestTrivias").innerText = data;
			exportToScreen(data);
        });
    })
	.catch((err) => { console.log("Couldn't read the file. Please try again later.") });

var loadTime = Number(new Date()),
	todayStatsTime = loadTime - 86400000,
	todayTotalCoins = 0,
	allTimeTotalCoins = 0;

function exportToScreen(data) {

	var trivias = data.split("\n"),
		leaderboard24Data = {},
		sortedLeaderboard24Data = [],
		leaderboardAllTimeData = {},
		sortedLeaderboardAllTimeData = [];

	trivias.forEach(function(trivia) {
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
				//console.log(triviaObj);

				if(Number(timeStamp) > todayStatsTime) {
					todayTotalCoins += Number(totalAmount);
					if(!isNaN(totalAmount)) {
						winnersArray.forEach(winner => {
							if(leaderboard24Data[winner]) leaderboard24Data[winner] += totalAmount / winnersArray.length;
							else {
								leaderboard24Data[winner] = totalAmount / winnersArray.length;
							}
						});
						var sortable = [];
						for(var user in leaderboard24Data) {
							sortable.push([user, leaderboard24Data[user]]);
						}
						sortable.sort((a,b) => {
							return b[1] - a[1];
						});
						if(trivia === trivias[trivias.length - 1]) sortedLeaderboard24Data = sortable;
					}
					var last24exists = false,
						last24thIndex = 0;

					if(document.querySelector("#last24Trivias").querySelectorAll("th").length > 0) {
						for(var i = 0; i < document.querySelector("#last24Trivias").querySelectorAll("th").length; i++) {
							title = document.querySelector("#last24Trivias").querySelectorAll("th")[i];
							if(title.innerText ==  hoster) {
								last24exists = true;
								last24thIndex = i;
							}
						}
					}

					if(last24exists == true) {
						var last24button = document.createElement("button");
						last24button.className = "triviaButton";
						last24button.innerText = new Date(Number(timeStamp)).toLocaleString();
						last24button.addEventListener("click", function() {
							//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
							if(last24button.parentNode.querySelector("div").className.includes("hidden")) {
								last24button.parentNode.querySelector("div").className = last24button.parentNode.querySelector("div").className.replace("hidden", "visible");
								if(last24button.parentNode.querySelector("div").getBoundingClientRect().left > document.body.offsetWidth - 500) last24button.parentNode.querySelector("div").className += " overWidthRight";
							}
							else last24button.parentNode.querySelector("div").className = last24button.parentNode.querySelector("div").className.replace("visible", "hidden");
						});
						var div = document.createElement("div");
						div.className = "triviaDetail hidden";
						var span = document.createElement("span");
						span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
						div.append(span);
						var li = document.createElement("li");
						li.appendChild(last24button);
						li.appendChild(div);
						document.querySelector("#last24Trivias").querySelectorAll("ul")[last24thIndex].appendChild(li);
					} else {
						var th = document.createElement("th");
						th.innerText = hoster;
						document.querySelector("#last24Trivias").querySelector("#last24modList").appendChild(th);
						var td = document.createElement("td"),
							ul = document.createElement("ul");
						td.appendChild(ul);
						document.querySelector("#last24Trivias").querySelector("#last24triviaList").appendChild(td);
						for(var i = 0; i < document.querySelector("#last24Trivias").querySelectorAll("th").length; i++) {
							title = document.querySelector("#last24Trivias").querySelectorAll("th")[i];
							if(title.innerText ==  hoster) {
								last24exists = true;
								last24thIndex = i;
							}
						}
						var last24button = document.createElement("button");
						last24button.className = "triviaButton";
						last24button.innerText = new Date(Number(timeStamp)).toLocaleString();
						last24button.addEventListener("click", () => {
							//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
							if(last24button.parentNode.querySelector("div").className.includes("hidden")) {
								last24button.parentNode.querySelector("div").className = last24button.parentNode.querySelector("div").className.replace("hidden", "visible");
								if(last24button.parentNode.querySelector("div").getBoundingClientRect().left > document.body.offsetWidth - 500) last24button.parentNode.querySelector("div").className += " overWidthRight";
							}
							else last24button.parentNode.querySelector("div").className = last24button.parentNode.querySelector("div").className.replace("visible", "hidden");
						});
						var div = document.createElement("div");
						div.className = "triviaDetail hidden";
						var span = document.createElement("span");
						span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
						div.append(span);
						var li = document.createElement("li");
						li.appendChild(last24button);
						li.appendChild(div);
						document.querySelector("#last24Trivias").querySelectorAll("ul")[last24thIndex].appendChild(li);
					}
				}

				if(!isNaN(totalAmount)) {
					winnersArray.forEach(winner => {
						if(leaderboardAllTimeData[winner]) leaderboardAllTimeData[winner] += totalAmount / winnersArray.length;
						else {
							leaderboardAllTimeData[winner] = totalAmount / winnersArray.length;
						}
					});
					var sortable = [];
					for(var user in leaderboardAllTimeData) {
						sortable.push([user, leaderboardAllTimeData[user]]);
					}
					sortable.sort((a,b) => {
						return b[1] - a[1];
					});
					if(trivia === trivias[trivias.length - 1]) sortedLeaderboardAllTimeData = sortable;
					allTimeTotalCoins += Number(totalAmount);
				}

				var exists = false,
					thIndex = 0;

				if(document.querySelector("#latestTrivias").querySelectorAll("th").length > 0) {
					for(var i = 0; i < document.querySelector("#latestTrivias").querySelectorAll("th").length; i++) {
						title = document.querySelector("#latestTrivias").querySelectorAll("th")[i];
						if(title.innerText ==  hoster) {
							exists = true;
							thIndex = i;
						}
					}
				}

				if(exists == true) {
					var button = document.createElement("button");
					button.className = "triviaButton";
					button.innerText = new Date(Number(timeStamp)).toLocaleString();
					button.addEventListener("click", function() {
						//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
						if(button.parentNode.querySelector("div").className.includes("hidden")) {
							button.parentNode.querySelector("div").className = button.parentNode.querySelector("div").className.replace("hidden", "visible");
							if(button.parentNode.querySelector("div").getBoundingClientRect().left > document.body.offsetWidth - 500) button.parentNode.querySelector("div").className += " overWidthRight";
						}
						else button.parentNode.querySelector("div").className = button.parentNode.querySelector("div").className.replace("visible", "hidden");
					});
					var div = document.createElement("div");
					div.className = "triviaDetail hidden";
					var span = document.createElement("span");
					span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
					div.append(span);
					var li = document.createElement("li");
					li.appendChild(button);
					li.appendChild(div);
					document.querySelector("#latestTrivias").querySelectorAll("ul")[thIndex].appendChild(li);
				} 
				else {
					var th = document.createElement("th");
					th.innerText = hoster;
					document.querySelector("#latestTrivias").querySelector("#modList").appendChild(th);
					var td = document.createElement("td"),
						ul = document.createElement("ul");
					td.appendChild(ul);
					document.querySelector("#latestTrivias").querySelector("#triviaList").appendChild(td);
					for(var i = 0; i < document.querySelector("#latestTrivias").querySelectorAll("th").length; i++) {
						title = document.querySelector("#latestTrivias").querySelectorAll("th")[i];
						if(title.innerText ==  hoster) {
							exists = true;
							thIndex = i;
						}
					}
					var button = document.createElement("button");
					button.className = "triviaButton";
					button.innerText = new Date(Number(timeStamp)).toLocaleString();
					button.addEventListener("click", function() {
						//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
						if(button.parentNode.querySelector("div").className.includes("hidden")) {
							button.parentNode.querySelector("div").className = button.parentNode.querySelector("div").className.replace("hidden", "visible");
							if(button.parentNode.querySelector("div").getBoundingClientRect().left > document.body.offsetWidth - 500) button.parentNode.querySelector("div").className += " overWidthRight";
						}
						else button.parentNode.querySelector("div").className = button.parentNode.querySelector("div").className.replace("visible", "hidden");
					});
					var div = document.createElement("div");
					div.className = "triviaDetail hidden";
					var span = document.createElement("span");
					span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
					div.append(span);
					var li = document.createElement("li");
					li.appendChild(button);
					li.appendChild(div);
					document.querySelector("#latestTrivias").querySelectorAll("ul")[thIndex].appendChild(li);
				}
			}
	});
	//console.log(sortedLeaderboard24Data);

	sortedLeaderboard24Data.forEach(userData => {
		var tr = document.createElement("tr"),
			tdUsername = document.createElement("td"),
			tdCoinsWon = document.createElement("td");
		
		tdUsername.innerText = userData[0];
		tdCoinsWon.innerText = String(userData[1]);
		tr.append(tdCoinsWon);
		tr.prepend(tdUsername);
		document.querySelector("#leaderboard24").append(tr);
	});
	sortedLeaderboardAllTimeData.forEach(userData => {
		if(userData[0] && userData[1] && userData[0] !== "cancelled") {
			var tr = document.createElement("tr"),
				tdUsername = document.createElement("td"),
				tdCoinsWon = document.createElement("td");
			
			tdUsername.innerText = userData[0];
			tdCoinsWon.innerText = String(userData[1]);
			tr.append(tdCoinsWon);
			tr.prepend(tdUsername);
			document.querySelector("#leaderboardAllTime").append(tr);
		}
	});
	document.querySelector("#last24TotalCoins").innerHTML = `Today, we have given away a total of <span style="font-weight: bold;">${String(todayTotalCoins.toMoney(0, "", " "))}</span> coins.`;
	document.querySelector("#allTimeTotalCoins").innerHTML = `We have given away a total of <span style="font-weight: bold;">${String(allTimeTotalCoins.toMoney(0, "", " "))}</span> coins since the start of this site.`;
	
	// This is the client-side script.

	// Initialize the HTTP request.
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'trivia_data_from_db_test.php');

	// Track the state changes of the request.
	xhr.onreadystatechange = function () {
		var DONE = 4; // readyState 4 means the request is done.
		var OK = 200; // status 200 is a successful return.
		if (xhr.readyState === DONE) {
			if (xhr.status === OK) {
				console.log(xhr.responseText); // 'This is the output.'
				document.write(xhr.responseXML);
			} else {
				console.log('Error: ' + xhr.status); // An error occurred during the request.
			}
		}
	};

	// Send the request to send-ajax-data.php
	xhr.send(null);
}