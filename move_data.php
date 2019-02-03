<?php
	header('Content-Type: text/plain; charset=UTF-8');
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
	$file = fopen("trivias.txt","r");
	$triviasArr = array();

	while(! feof($file))
	{
		//echo fgets($file). "<br />";
		array_push($triviasArr, fgets($file));
	}

	fclose($file);
	//echo join("@@@@@@@", $triviasArr);
	foreach($triviasArr as $key => $value) {
		$triviaRawData = $value;
		$triviaRawData = str_replace("'", "\'", $triviaRawData);
		echo $triviaRawData;
		$triviaSplit = explode("-@-", $triviaRawData);
		//echo count($triviaSplit);
		if($triviaSplit[4] !== "cancelled" && $triviaSplit[5] !== "undefined" && $triviaSplit[0] !== "undefined") {
			$lang_change = "SET NAMES utf8mb4";
			if (mysqli_query($conn, $lang_change)) {
				//echo "Successful: Language change. ";
			} else {
				echo "Error: " . $sql . "<br>" . mysqli_error($conn);
			}
			$sql = "INSERT INTO trivia_data (name, question, answer, time, winners, chat, total)
			VALUES ('$triviaSplit[0]', '$triviaSplit[1]', '$triviaSplit[2]', $triviaSplit[3], '$triviaSplit[4]', '$triviaSplit[5]', '$triviaSplit[6]')";
			if (mysqli_query($conn, $sql)) {
				//echo "Successful.\n";
			} else {
				echo "Error: " . $sql . "<br>" . mysqli_error($conn);
			}
		}
		sleep(0.1);
	}
?>