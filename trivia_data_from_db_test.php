<?php

    header('Content-Type: text/plain');
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

    $sql = "SELECT name, question, answer, time, winners, chat, total FROM trivia_data";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo "\n".
            $row['name'].
            "-@-".
            $row['question'].
            "-@-".
            $row['answer'].
            "-@-".
            $row['time'].
            "-@-".
            $row['winners'].
            "-@-".
            $row['chat'].
            "-@-".
            $row['total'];
        }
    } else {
        echo "0 results";
    }
    $conn->close();
    
?>