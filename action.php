<?php
	header('Access-Control-Allow-Origin: *; Content-Type: text/html; charset=UTF-8;');
	if($_GET["chat"] !== "MOD" && strlen($_GET["name"]) && strlen($_GET["question"]) && strlen($_GET["answer"]) && strlen($_GET["winners"]) && strlen($_GET["chat"]) && strlen($_GET["total"])) {
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
		$name = $_GET["name"];
		$question = $_GET["question"];
		$answer = $_GET["answer"];
		$winners = $_GET["winners"];
		$chat = $_GET["chat"];
		$total = $_GET["total"];
		if(strlen($_GET["time"]) < 1) {
			$time = date_timestamp_get(date_create());
		} else {
			$time = $_GET["time"];
		}
		$line = $name . "-@-" . $question . "-@-" . $answer . "-@-" . $time . "-@-" . $winners . "-@-" . $chat . "-@-" . $total;
		$lang_change = "SET NAMES utf8";
		if (mysqli_query($conn, $lang_change)) {
			//echo "Successful: Language change.";
		} else {
			echo "Error. Please send this data to TEKNO: " . $sql . "<br>" . mysqli_error($conn);
		}
		$sql = "INSERT INTO trivia_data (name, question, answer, time, winners, chat, total) VALUES ('$name', '$question', '$answer', $time, '$winners', '$chat', '$total')";
		if (mysqli_query($conn, $sql)) {
			echo "https://www.reddit.com/r/dataisbeautiful";
		} else {
			echo "Error. Please send this data to TEKNO: " . $sql . "<br>" . mysqli_error($conn);
		}
		mysqli_close($conn);
	} else {
		echo "Trivia data is not sent to server. You made either a mod chat trivia or cancelled/inappropriate trivia.";
	}
?>