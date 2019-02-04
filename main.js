Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep) {
  var n = this,
    c = isNaN(decimals) ? 2 : Math.abs(decimals),
    d = decimal_sep || ".",
    t = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    sign = n < 0 ? "-" : "",
    i = parseInt((n = Math.abs(n).toFixed(c))) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    sign +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "")
  );
};

var xhr = new XMLHttpRequest();
xhr.open("GET", "trivia_data.php");
xhr.onreadystatechange = function() {
  var DONE = 4;
  var OK = 200;
  if (xhr.readyState === DONE) {
    if (xhr.status === OK) {
      window.trivias = xhr.responseText;
      exportToScreen(xhr.responseText);
    } else {
      console.log("Error: " + xhr.status);
    }
  }
};
xhr.send(null);

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
    if (trivia.split("-@-").length == 7) {
      var triviaData = trivia.split("-@-"),
        hoster = triviaData[0],
        question = triviaData[1],
        answer = triviaData[2],
        timeStamp = triviaData[3],
        winners = triviaData[4],
        chatName = triviaData[5],
        totalAmount = triviaData[6],
        triviaObj = {
          hoster: hoster,
          question: question,
          answer: answer,
          timeStamp: timeStamp,
          winners: winners,
          totalAmount: totalAmount
        },
        winnersArray = winners.split(",");
      //console.log(triviaObj);

      if (Number(timeStamp) > todayStatsTime) {
        todayTotalCoins += Number(totalAmount);
        if (!isNaN(totalAmount)) {
          winnersArray.forEach(winner => {
            if (leaderboard24Data[winner])
              leaderboard24Data[winner] += totalAmount / winnersArray.length;
            else {
              leaderboard24Data[winner] = totalAmount / winnersArray.length;
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

        if (
          document.querySelector("#last24Trivias").querySelectorAll("th")
            .length > 0
        ) {
          for (
            var i = 0;
            i <
            document.querySelector("#last24Trivias").querySelectorAll("th")
              .length;
            i++
          ) {
            title = document
              .querySelector("#last24Trivias")
              .querySelectorAll("th")[i];
            if (title.innerText.split("\n")[0] == hoster) {
              last24exists = true;
              last24thIndex = i;
            }
          }
        }

        if (last24exists == true) {
          var last24button = document.createElement("button");
          last24button.className = "triviaButton";
          last24button.innerText = new Date(Number(timeStamp)).toLocaleString();
          last24button.addEventListener("click", function() {
            //alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
            if (
              last24button.parentNode
                .querySelector("div")
                .className.includes("hidden")
            ) {
              last24button.parentNode.querySelector(
                "div"
              ).className = last24button.parentNode
                .querySelector("div")
                .className.replace("hidden", "visible");
              if (
                last24button.parentNode
                  .querySelector("div")
                  .getBoundingClientRect().left >
                document.body.offsetWidth - 500
              )
                last24button.parentNode.querySelector("div").className +=
                  " overWidthRight";
            } else last24button.parentNode.querySelector("div").className = last24button.parentNode.querySelector("div").className.replace("visible", "hidden");
          });
          var div = document.createElement("div");
          div.className = "triviaDetail hidden";
          var span = document.createElement("span");
          span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
          div.append(span);
          var li = document.createElement("li");
          li.appendChild(last24button);
          li.appendChild(div);
          document
            .querySelector("#last24Trivias")
            .querySelectorAll("ul")
            [last24thIndex].appendChild(li);
          document
            .querySelector("#last24modList")
            .querySelectorAll("th")
            [last24thIndex].innerText.split("\n")[1] = String(
            Number(
              document
                .querySelector("#last24modList")
                .querySelectorAll("th")
                [last24thIndex].innerText.split("\n")[1]
            ) + totalAmount
          );
        } else {
          var th = document.createElement("th");
          th.innerText = hoster + "\n" + String(totalAmount);
          document
            .querySelector("#last24Trivias")
            .querySelector("#last24modList")
            .appendChild(th);
          var td = document.createElement("td"),
            ul = document.createElement("ul");
          td.appendChild(ul);
          document
            .querySelector("#last24Trivias")
            .querySelector("#last24triviaList")
            .appendChild(td);
          for (
            var i = 0;
            i <
            document.querySelector("#last24Trivias").querySelectorAll("th")
              .length;
            i++
          ) {
            title = document
              .querySelector("#last24Trivias")
              .querySelectorAll("th")[i];
            if (title.innerText.split("\n")[0] == hoster) {
              last24exists = true;
              last24thIndex = i;
            }
          }
          var last24button = document.createElement("button");
          last24button.className = "triviaButton";
          last24button.innerText = new Date(Number(timeStamp)).toLocaleString();
          last24button.addEventListener("click", () => {
            //alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
            if (
              last24button.parentNode
                .querySelector("div")
                .className.includes("hidden")
            ) {
              last24button.parentNode.querySelector(
                "div"
              ).className = last24button.parentNode
                .querySelector("div")
                .className.replace("hidden", "visible");
              if (
                last24button.parentNode
                  .querySelector("div")
                  .getBoundingClientRect().left >
                document.body.offsetWidth - 500
              )
                last24button.parentNode.querySelector("div").className +=
                  " overWidthRight";
            } else
              last24button.parentNode.querySelector(
                "div"
              ).className = last24button.parentNode
                .querySelector("div")
                .className.replace("visible", "hidden");
          });
          var div = document.createElement("div");
          div.className = "triviaDetail hidden";
          var span = document.createElement("span");
          span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
          div.append(span);
          var li = document.createElement("li");
          li.appendChild(last24button);
          li.appendChild(div);
          document
            .querySelector("#last24Trivias")
            .querySelectorAll("ul")
            [last24thIndex].appendChild(li);
          document
            .querySelector("#last24modList")
            .querySelectorAll("th")
            [last24thIndex].innerText.split("\n")[1] = String(
            Number(
              document
                .querySelector("#last24modList")
                .querySelectorAll("th")
                [last24thIndex].innerText.split("\n")[1]
            ) + totalAmount
          );
        }
      }

      if (!isNaN(totalAmount)) {
        winnersArray.forEach(winner => {
          if (leaderboardAllTimeData[winner])
            leaderboardAllTimeData[winner] += totalAmount / winnersArray.length;
          else {
            leaderboardAllTimeData[winner] = totalAmount / winnersArray.length;
          }
        });
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

      var exists = false,
        thIndex = 0;

      if (
        document.querySelector("#latestTrivias").querySelectorAll("th").length >
        0
      ) {
        for (
          var i = 0;
          i <
          document.querySelector("#latestTrivias").querySelectorAll("th")
            .length;
          i++
        ) {
          title = document
            .querySelector("#latestTrivias")
            .querySelectorAll("th")[i];
          if (title.innerText.split("\n")[0] == hoster) {
            exists = true;
            thIndex = i;
          }
        }
      }

      if (exists == true) {
        var button = document.createElement("button");
        button.className = "triviaButton";
        button.innerText = new Date(Number(timeStamp)).toLocaleString();
        button.addEventListener("click", function() {
          //alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
          if (
            button.parentNode.querySelector("div").className.includes("hidden")
          ) {
            button.parentNode.querySelector(
              "div"
            ).className = button.parentNode
              .querySelector("div")
              .className.replace("hidden", "visible");
            if (
              button.parentNode.querySelector("div").getBoundingClientRect()
                .left >
              document.body.offsetWidth - 500
            )
              button.parentNode.querySelector("div").className +=
                " overWidthRight";
          } else button.parentNode.querySelector("div").className = button.parentNode.querySelector("div").className.replace("visible", "hidden");
        });
        var div = document.createElement("div");
        div.className = "triviaDetail hidden";
        var span = document.createElement("span");
        span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
        div.append(span);
        var li = document.createElement("li");
        li.appendChild(button);
        li.appendChild(div);
        document
          .querySelector("#latestTrivias")
          .querySelectorAll("ul")
          [thIndex].appendChild(li);
        document
          .querySelector("#modList")
          .querySelectorAll("th")
          [thIndex].innerText.split("\n")[1] = String(
          Number(
            document
              .querySelector("#modList")
              .querySelectorAll("th")
              [thIndex].innerText.split("\n")[1]
          ) + totalAmount
        );
      } else {
        var th = document.createElement("th");
        th.innerText = hoster + "\n" + String(totalAmount);
        document
          .querySelector("#latestTrivias")
          .querySelector("#modList")
          .appendChild(th);
        var td = document.createElement("td"),
          ul = document.createElement("ul");
        td.appendChild(ul);
        document
          .querySelector("#latestTrivias")
          .querySelector("#triviaList")
          .appendChild(td);
        for (
          var i = 0;
          i <
          document.querySelector("#latestTrivias").querySelectorAll("th")
            .length;
          i++
        ) {
          title = document
            .querySelector("#latestTrivias")
            .querySelectorAll("th")[i];
          if (title.innerText.split("\n")[0] == hoster) {
            exists = true;
            thIndex = i;
          }
        }
        var button = document.createElement("button");
        button.className = "triviaButton";
        button.innerText = new Date(Number(timeStamp)).toLocaleString();
        button.addEventListener("click", function() {
          //alert(`Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`);
          if (
            button.parentNode.querySelector("div").className.includes("hidden")
          ) {
            button.parentNode.querySelector(
              "div"
            ).className = button.parentNode
              .querySelector("div")
              .className.replace("hidden", "visible");
            if (
              button.parentNode.querySelector("div").getBoundingClientRect()
                .left >
              document.body.offsetWidth - 500
            )
              button.parentNode.querySelector("div").className +=
                " overWidthRight";
          } else button.parentNode.querySelector("div").className = button.parentNode.querySelector("div").className.replace("visible", "hidden");
        });
        var div = document.createElement("div");
        div.className = "triviaDetail hidden";
        var span = document.createElement("span");
        span.innerText = `Chat: ${chatName}\nQuestion: ${question}\nAnswer: ${answer}\nWinners: ${winners}\nTotal coins given out: ${totalAmount}`;
        div.append(span);
        var li = document.createElement("li");
        li.appendChild(button);
        li.appendChild(div);
        document
          .querySelector("#latestTrivias")
          .querySelectorAll("ul")
          [thIndex].appendChild(li);
        document
          .querySelector("#modList")
          .querySelectorAll("th")
          [thIndex].innerText.split("\n")[1] = String(
          Number(
            document
              .querySelector("#modList")
              .querySelectorAll("th")
              [thIndex].innerText.split("\n")[1]
          ) + totalAmount
        );
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
    if (userData[0] && userData[1] && userData[0] !== "cancelled") {
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
  document.querySelector(
    "#last24TotalCoins"
  ).innerHTML = `Today, we have given away a total of <span style="font-weight: bold;">${String(
    todayTotalCoins.toMoney(0, "", " ")
  )}</span> coins.`;
  document.querySelector(
    "#allTimeTotalCoins"
  ).innerHTML = `We have given away a total of <span style="font-weight: bold;">${String(
    allTimeTotalCoins.toMoney(0, "", " ")
  )}</span> coins since the start of this site.`;
}
