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
   
    $sql = "SELECT * FROM `trivia_data`";
    mysql_select_db('trivia_data');
    $retval = mysql_query( $sql, $conn );
    
    if(! $retval ) {
       die('Could not get data: ' . mysql_error());
    }
     . $name . "-@-" . $question . "-@-" . $answer . "-@-" . $time . "-@-" . $winners . "-@-" . $chat . "-@-" . $total;
     while($row = mysql_fetch_array($retval, MYSQL_ASSOC)) {
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
    
     mysql_close($conn);
    
?>