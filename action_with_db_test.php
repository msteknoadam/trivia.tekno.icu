<?php
	if($_GET["chat"] !== "MOD") {
		$servername = "localhost";
		$username = "tekntehf_trivias_user";
		$password = "Fo3A4QZ)*s+d";
		$dbname = "tekntehf_trivias";
		// Create connection
		$conn = mysqli_connect($servername, $username, $password, $dbname);
		// Check connection
		if (!$conn) {
			die("Connection failed: " . mysqli_connect_error());
		}
		header('Access-Control-Allow-Origin: *');
		if(strlen($_GET["name"]) < 1) {
			$name = "undefined";
		} else {
			$name = $_GET["name"];
		}
		if(strlen($_GET["question"]) < 1) {
			$question = "undefined";
		} else {
			$question = $_GET["question"];
		}
		if(strlen($_GET["answer"]) < 1) {
			$answer = "undefined";
		} else {
			$answer = $_GET["answer"];
		}
		if(strlen($_GET["time"]) < 1) {
			$time = date_timestamp_get(date_create());
		} else {
			$time = $_GET["time"];
		}
		if(strlen($_GET["winners"]) < 1) {
			$winners = "undefined";
		} else {
			$winners = $_GET["winners"];
		}
		if(strlen($_GET["chat"]) < 1) {
			$chat = "undefined";
		} else {
			$chat = $_GET["chat"];
		}
		if(strlen($_GET["total"]) < 1) {
			$total = "0";
		} else {
			$total = $_GET["total"];
		}
		$line = "\n" . $name . "-@-" . $question . "-@-" . $answer . "-@-" . $time . "-@-" . $winners . "-@-" . $chat . "-@-" . $total;
		$sql = "INSERT INTO trivia_data (name, question, answer, time, winners, chat, total)
		VALUES ('$name', '$question', '$answer', $time, '$winners', '$chat', '$total')";
		if (mysqli_query($conn, $sql)) {
			echo "https://www.reddit.com/r/dataisbeautiful";
		} else {
			echo "Error: " . $sql . "<br>" . mysqli_error($conn);
		}
		mysqli_close($conn);
	} else {
		echo "https://www.reddit.com/r/dataisbeautiful (This trivia didn't get logged because it was a mod chat trivia.)";
	}
?>