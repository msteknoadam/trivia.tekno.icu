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
    mysqli_select_db('trivia_data');
    $retval = mysqli_query( $sql, $conn );
    
    if(! $retval ) {
       die('Could not get data: ' . mysqli_error());
    }
    while($row = mysqli_fetch_array($retval, MYSQL_ASSOC)) {
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
    
     mysqli_close($conn);
    
?>