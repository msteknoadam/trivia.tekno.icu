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
fetch('trivia_data_last24.php')
	.then(response => {
		return response.json();
	})
	.then(data => {
		window.last24Trivias = data;
		exportLast24ToScreen(data);
	});

/* Loadtime will be used to determine last 24 hours etc. for last 24 hour stats. */
var loadTime = Number(new Date()),
	todayStatsTime = loadTime - 24 * 60 * 60 * 1000,
	todayTotalCoins = 0,
	allTimeTotalCoins = 0;

function exportLast24ToScreen(data) {
	/* Defining global variables */
	var leaderboard24Data = {},
		sortedLeaderboard24Data = [];

	/* Processing each trivia */
	trivias.forEach(function(trivia) {
		if (Object.keys(trivia).length == 7) {
			/* Calculation of last 24 hour trivias START */
			if (Number(trivia.timeStamp) > todayStatsTime) {
				todayTotalCoins += Number(trivia.totalAmount);
				var winnersArray = trivia.winners.split(',');
				if (!isNaN(trivia.totalAmount)) {
					winnersArray.forEach(winner => {
						/* If the user has already won a trivia, add the current trivia's reward to user's previous amount. Otherwise, create a new object key-value pair for that user. */
						if (leaderboard24Data[winner])
							leaderboard24Data[winner] += Math.floor(trivia.totalAmount / winnersArray.length);
						// Using floor so it will prevent retarded numbers (tho this is not how it should be)
						else {
							leaderboard24Data[winner] = Math.floor(trivia.totalAmount / winnersArray.length); // Using floor so it will prevent retarded numbers (tho this is not how it should be)
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
						if (title.innerText.split('\n')[0] == trivia.hoster) {
							last24exists = true;
							last24thIndex = i;
						}
					}
				}

				if (last24exists == true) {
					var last24button = document.createElement('button');
					last24button.className = 'triviaButton';
					last24button.innerText = new Date(Number(trivia.timeStamp)).toLocaleString();
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
					span.innerText = `Chat: ${trivia.chatName}\nQuestion: ${trivia.question}\nAnswer: ${
						trivia.answer
					}\nWinners: ${trivia.winners}\nTotal coins given out: ${trivia.totalAmount}`;
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
						) + Number(trivia.totalAmount);
				} else {
					var th = document.createElement('th');
					th.innerHTML = `${trivia.hoster}<br /><span class="total">${trivia.totalAmount}</span>`;
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
						if (title.innerText.split('\n')[0] == trivia.hoster) {
							last24exists = true;
							last24thIndex = i;
						}
					}
					var last24button = document.createElement('button');
					last24button.className = 'triviaButton';
					last24button.innerText = new Date(Number(trivia.timeStamp)).toLocaleString();
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
					span.innerText = `Chat: ${trivia.chatName}\nQuestion: ${trivia.question}\nAnswer: ${
						trivia.answer
					}\nWinners: ${trivia.winners}\nTotal coins given out: ${trivia.totalAmount}`;
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
	/* Information updates */
	document.querySelector(
		'#last24TotalCoins'
	).innerHTML = `Today, we have given away a total of <span style="font-weight: bold;">${String(
		todayTotalCoins.toMoney(0, '', ' ')
	)}</span> coins.`;
}
