// TODO: Refactor whole system(with classes preferred).
// TODO: Move to React.js
// TODO: Maybe make live data? :)

Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep) {
	var n = this,
		c = isNaN(decimals) ? 2 : Math.abs(decimals),
		d = decimal_sep || '.',
		t = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
		sign = n < 0 ? '-' : '',
		i = parseInt((n = Math.abs(n).toFixed(c))) + '',
		j = (j = i.length) > 3 ? j % 3 : 0;
	return (
		sign +
		(j ? i.substr(0, j) + t : '') +
		i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
		(c
			? d +
			  Math.abs(n - i)
					.toFixed(c)
					.slice(2)
			: '')
	);
};

/* Getting trivia datas from the database */
var xhr = new XMLHttpRequest();
xhr.open('GET', 'trivia_data.php');
xhr.onreadystatechange = function() {
	var DONE = 4;
	var OK = 200;
	if (xhr.readyState === DONE) {
		if (xhr.status === OK) {
			window.trivias = xhr.responseText;
			exportToScreen(xhr.responseText);
		} else {
			console.log('Error: ' + xhr.status);
		}
	}
};
xhr.send(null);

/* Loadtime will be used to determine last 24 hours etc. for last 24 hour stats. */
var loadTime = Number(new Date()),
	todayStatsTime = loadTime - 24 * 60 * 60 * 1000,
	todayTotalCoins = 0,
	allTimeTotalCoins = 0;

function exportToScreen(data) {
	/* Defining global variables */
	var trivias = data.split('\n'),
		leaderboard24Data = {},
		sortedLeaderboard24Data = [],
		leaderboardAllTimeData = {},
		sortedLeaderboardAllTimeData = [];

	/* Processing each trivia */
	trivias.forEach(function(trivia) {
		if (trivia.split('-@-').length == 7) {
			/* General trivia data structure coming from database -> 
      hoster-@-question-@-answer-@-timestamp-@-winners(seperated with ,)-@-chatname-@-totalamount
      */
			var triviaData = trivia.split('-@-'),
				hoster = triviaData[0],
				question = triviaData[1],
				answer = triviaData[2],
				timeStamp = triviaData[3],
				winners = triviaData[4],
				chatName = triviaData[5],
				totalAmount = triviaData[6],
				/* Making this data inside a trivia object so it will be more readable in the future */
				triviaObj = {
					hoster: hoster,
					question: question,
					answer: answer,
					timeStamp: timeStamp,
					winners: winners,
					totalAmount: totalAmount,
				},
				winnersArray = winners.split(',');
			//console.log(triviaObj);

			/* Calculation of last 24 hour trivias START */
			if (Number(timeStamp) > todayStatsTime) {
				todayTotalCoins += Number(totalAmount);
				if (!isNaN(totalAmount)) {
					winnersArray.forEach(winner => {
						/* If the user has already won a trivia, add the current trivia's reward to user's previous amount. Otherwise, create a new object key-value pair for that user. */
						if (leaderboard24Data[winner])
							leaderboard24Data[winner] += Math.floor(totalAmount / winnersArray.length);
						// Using floor so it will prevent retarded numbers (tho this is not how it should be)
						else {
							leaderboard24Data[winner] = Math.floor(totalAmount / winnersArray.length); // Using floor so it will prevent retarded numbers (tho this is not how it should be)
						}
					});
					var sortable = [];
					for (var user in leaderboard24Data) {
						sortable.push([user, leaderboard24Data[user]]);
					}
					sortable.sort((a, b) => {
						return b[1] - a[1];
					});
					sortedLeaderboard24Data = sortable;
				}
				var last24exists = false,
					last24thIndex = 0;

				if (document.querySelector('#last24Trivias').querySelectorAll('th').length > 0) {
					for (var i = 0; i < document.querySelector('#last24Trivias').querySelectorAll('th').length; i++) {
						title = document.querySelector('#last24Trivias').querySelectorAll('th')[i];
						if (title.innerText.split('\n')[0] == hoster) {
							last24exists = true;
							last24thIndex = i;
						}
					}
				}

				if (last24exists == true) {
					var last24button = document.createElement('button');
					last24button.className = 'triviaButton';
					last24button.innerText = new Date(Number(timeStamp)).toLocaleString();
					last24button.addEventListener('click', function() {
						//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
						if (last24button.parentNode.querySelector('div').className.includes('hidden')) {
							last24button.parentNode.querySelector(
								'div'
							).className = last24button.parentNode
								.querySelector('div')
								.className.replace('hidden', 'visible');
							if (
								last24button.parentNode.querySelector('div').getBoundingClientRect().left >
								document.body.offsetWidth - 500
							)
								last24button.parentNode.querySelector('div').className += ' overWidthRight';
						} else last24button.parentNode.querySelector('div').className = last24button.parentNode.querySelector('div').className.replace('visible', 'hidden');
					});
					var div = document.createElement('div');
					div.className = 'triviaDetail hidden';
					var span = document.createElement('span');
					span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
					div.append(span);
					var triviaButtonDiv = document.createElement('div');
					triviaButtonDiv.className = 'triviaButtonDiv';
					triviaButtonDiv.appendChild(last24button);
					triviaButtonDiv.appendChild(div);
					document
						.querySelector('#last24Trivias')
						.querySelectorAll('td')
						[last24thIndex].appendChild(triviaButtonDiv);
					document
						.querySelector('#last24modList')
						.querySelectorAll('th')
						[last24thIndex].querySelector('.total').innerText =
						Number(
							document
								.querySelector('#last24modList')
								.querySelectorAll('th')
								[last24thIndex].querySelector('.total').innerText
						) + Number(totalAmount);
				} else {
					var th = document.createElement('th');
					th.innerHTML = `${hoster}<br /><span class="total">${totalAmount}</span>`;
					document
						.querySelector('#last24Trivias')
						.querySelector('#last24modList')
						.appendChild(th);
					var td = document.createElement('td');
					document
						.querySelector('#last24Trivias')
						.querySelector('#last24triviaList')
						.appendChild(td);
					for (var i = 0; i < document.querySelector('#last24Trivias').querySelectorAll('th').length; i++) {
						title = document.querySelector('#last24Trivias').querySelectorAll('th')[i];
						if (title.innerText.split('\n')[0] == hoster) {
							last24exists = true;
							last24thIndex = i;
						}
					}
					var last24button = document.createElement('button');
					last24button.className = 'triviaButton';
					last24button.innerText = new Date(Number(timeStamp)).toLocaleString();
					last24button.addEventListener('click', () => {
						//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
						if (last24button.parentNode.querySelector('div').className.includes('hidden')) {
							last24button.parentNode.querySelector(
								'div'
							).className = last24button.parentNode
								.querySelector('div')
								.className.replace('hidden', 'visible');
							if (
								last24button.parentNode.querySelector('div').getBoundingClientRect().left >
								document.body.offsetWidth - 500
							)
								last24button.parentNode.querySelector('div').className += ' overWidthRight';
						} else
							last24button.parentNode.querySelector(
								'div'
							).className = last24button.parentNode
								.querySelector('div')
								.className.replace('visible', 'hidden');
					});
					var div = document.createElement('div');
					div.className = 'triviaDetail hidden';
					var span = document.createElement('span');
					span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
					div.append(span);
					var triviaButtonDiv = document.createElement('div');
					triviaButtonDiv.className = 'triviaButtonDiv';
					triviaButtonDiv.appendChild(last24button);
					triviaButtonDiv.appendChild(div);
					document
						.querySelector('#last24Trivias')
						.querySelectorAll('td')
						[last24thIndex].appendChild(triviaButtonDiv);
				}
			}
			/* Calculation of last 24 hour trivias END */

			/* Sometimes Cancelled trivias get into the server too so we need to filter them out and query all the correct ones */
			if (!isNaN(totalAmount)) {
				winnersArray.forEach(winner => {
					/* Adding user to the all time leaderboard data with username so we can access with username directly */
					/* If the user has already won a trivia, add the current trivia's reward to user's previous amount. Otherwise, create a new object key-value pair for that user. */
					if (leaderboardAllTimeData[winner])
						leaderboardAllTimeData[winner] += Math.floor(totalAmount / winnersArray.length);
					// Using floor so it will prevent retarded numbers (tho this is not how it should be)
					else {
						leaderboardAllTimeData[winner] = Math.floor(totalAmount / winnersArray.length); // Using floor so it will prevent retarded numbers (tho this is not how it should be)
					}
				});
				/* Sorting leaderboard data */
				var sortable = [];
				for (var user in leaderboardAllTimeData) {
					sortable.push([user, leaderboardAllTimeData[user]]);
				}
				sortable.sort((a, b) => {
					return b[1] - a[1];
				});
				sortedLeaderboardAllTimeData = sortable;
				allTimeTotalCoins += Number(totalAmount);
			}

			/* Check if the user already exists in table */
			var exists = false,
				thIndex = 0;

			if (document.querySelector('#latestTrivias').querySelectorAll('th').length > 0) {
				for (var i = 0; i < document.querySelector('#latestTrivias').querySelectorAll('th').length; i++) {
					title = document.querySelector('#latestTrivias').querySelectorAll('th')[i];
					if (title.innerText.split('\n')[0] == hoster) {
						exists = true;
						thIndex = i;
					}
				}
			}

			/* If the user exists, just add the trivia data to that user's own trivia table */
			if (exists == true) {
				var button = document.createElement('button');
				button.className = 'triviaButton';
				button.innerText = new Date(Number(timeStamp)).toLocaleString();
				button.addEventListener('click', function() {
					//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
					if (button.parentNode.querySelector('div').className.includes('hidden')) {
						button.parentNode.querySelector('div').className = button.parentNode
							.querySelector('div')
							.className.replace('hidden', 'visible');
						if (
							button.parentNode.querySelector('div').getBoundingClientRect().left >
							document.body.offsetWidth - 500
						)
							button.parentNode.querySelector('div').className += ' overWidthRight';
					} else button.parentNode.querySelector('div').className = button.parentNode.querySelector('div').className.replace('visible', 'hidden');
				});
				var div = document.createElement('div');
				div.className = 'triviaDetail hidden';
				var span = document.createElement('span');
				span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
				div.append(span);
				var triviaButtonDiv = document.createElement('div');
				triviaButtonDiv.className = 'triviaButtonDiv';
				triviaButtonDiv.appendChild(button);
				triviaButtonDiv.appendChild(div);
				document
					.querySelector('#latestTrivias')
					.querySelectorAll('td')
					[thIndex].appendChild(triviaButtonDiv);
				document
					.querySelector('#modList')
					.querySelectorAll('th')
					[thIndex].querySelector('.total').innerText =
					Number(
						document
							.querySelector('#modList')
							.querySelectorAll('th')
							[thIndex].querySelector('.total').innerText
					) + Number(totalAmount);
			} else {
				/* If the user doesn't exist, create that user's table and add the trivia data. */
				var th = document.createElement('th');
				th.innerHTML = `${hoster}<br /><span class="total">${totalAmount}</span>`;
				document
					.querySelector('#latestTrivias')
					.querySelector('#modList')
					.appendChild(th);
				var td = document.createElement('td');
				document
					.querySelector('#latestTrivias')
					.querySelector('#triviaList')
					.appendChild(td);
				for (var i = 0; i < document.querySelector('#latestTrivias').querySelectorAll('th').length; i++) {
					title = document.querySelector('#latestTrivias').querySelectorAll('th')[i];
					if (title.innerText.split('\n')[0] == hoster) {
						exists = true;
						thIndex = i;
					}
				}
				var button = document.createElement('button');
				button.className = 'triviaButton';
				button.innerText = new Date(Number(timeStamp)).toLocaleString();
				button.addEventListener('click', function() {
					//alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
					if (button.parentNode.querySelector('div').className.includes('hidden')) {
						button.parentNode.querySelector('div').className = button.parentNode
							.querySelector('div')
							.className.replace('hidden', 'visible');
						if (
							button.parentNode.querySelector('div').getBoundingClientRect().left >
							document.body.offsetWidth - 500
						)
							button.parentNode.querySelector('div').className += ' overWidthRight';
					} else button.parentNode.querySelector('div').className = button.parentNode.querySelector('div').className.replace('visible', 'hidden');
				});
				var div = document.createElement('div');
				div.className = 'triviaDetail hidden';
				var span = document.createElement('span');
				span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
				div.append(span);
				var triviaButtonDiv = document.createElement('div');
				triviaButtonDiv.className = 'triviaButtonDiv';
				triviaButtonDiv.appendChild(button);
				triviaButtonDiv.appendChild(div);
				document
					.querySelector('#latestTrivias')
					.querySelectorAll('td')
					[thIndex].appendChild(triviaButtonDiv);
			}
		}
	});
	//console.log(sortedLeaderboard24Data);

	/* Add the sorted datas into the actual HTML page */
	sortedLeaderboard24Data.forEach(userData => {
		var tr = document.createElement('tr'),
			tdUsername = document.createElement('td'),
			tdCoinsWon = document.createElement('td');

		tdUsername.innerText = userData[0];
		tdCoinsWon.innerText = String(userData[1]);
		tr.append(tdCoinsWon);
		tr.prepend(tdUsername);
		document.querySelector('#leaderboard24').append(tr);
	});
	sortedLeaderboardAllTimeData.forEach(userData => {
		if (userData[0] && userData[1] && userData[0] !== 'cancelled') {
			var tr = document.createElement('tr'),
				tdUsername = document.createElement('td'),
				tdCoinsWon = document.createElement('td');

			tdUsername.innerText = userData[0];
			tdCoinsWon.innerText = String(userData[1]);
			tr.append(tdCoinsWon);
			tr.prepend(tdUsername);
			document.querySelector('#leaderboardAllTime').append(tr);
		}
	});
	/* Information updates */
	document.querySelector(
		'#last24TotalCoins'
	).innerHTML = `Today, we have given away a total of <span style="font-weight: bold;">${String(
		todayTotalCoins.toMoney(0, '', ' ')
	)}</span> coins.`;
	document.querySelector(
		'#allTimeTotalCoins'
	).innerHTML = `We have given away a total of <span style="font-weight: bold;">${String(
		allTimeTotalCoins.toMoney(0, '', ' ')
	)}</span> coins since the start of this site.`;
}
