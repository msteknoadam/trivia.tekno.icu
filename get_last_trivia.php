<?php

header('Content-Type: text/plain; charset=UTF-8');
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
    //echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    echo "There was an error. Please try again later.";
}
$sql = "SELECT name, time, chat, total FROM trivia_data ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		echo "{$row['chat']}\n{$row['name']}\n{$row['time']}\n{$row['total']}";
    }
} else {
   //echo "Found 0 last trivias.";
   echo "There was an error. Please try again later.";
}
$conn->close();

?>