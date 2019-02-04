<?php

header('Content-Type: text/plain; charset=UTF-8');
$currentTime = time() * 1000;
$timeLimit = $currentTime - 1 * 24 * 60 * 60 * 1000;
$last24Total = 0;
$servername = "localhost";
$username = "tekntehf_trivias_user";
$password = "Fo3A4QZ)*s+d";
$dbname = "tekntehf_trivias";
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}
$lang_change = "SET NAMES utf8mb4";
if (!mysqli_query($conn, $lang_change)) {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
$sql = "SELECT name, question, answer, time, winners, chat, total FROM trivia_data";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		if(!is_nan(floatval($row['time'])) && !is_nan(floatval($row['total'])) && intval($row['total']) && intval($row['time']) > $timeLimit) {
			if(intval($row['time'])) {
				//echo intval($row['time']) . "|" . $currentTime . "\n";
				$last24Total += intval($row['total']);
			}
		}
    }
} else {
   echo "Found 0 last trivias.";
}
$insertData = "INSERT INTO `trivia_stats` (`id`, `last24Total`) VALUES (NULL, \'$last24Total\')";
if (mysqli_query($conn, $insertData)) {
	echo "Successfully inserted data: $last24Total";
} else {
	echo "Error. Please send this data to TEKNO: " . $sql . "<br>" . mysqli_error($conn);
}
$conn->close();
	
?>