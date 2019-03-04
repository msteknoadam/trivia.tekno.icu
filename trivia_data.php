<?php
    //if($_SERVER['HTTP_ORIGIN'] === "https://tekno.icu") {
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
        $lang_change = "SET NAMES utf8mb4";
        if (mysqli_query($conn, $lang_change)) {
            //echo "Successful: Language change. ";
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
        $sql = "SELECT name, question, answer, time, winners, chat, total FROM trivia_data";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                echo 
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
                    $row['total'].
                    "\n";
            }
        } else {
            echo "0 results";
        }
        $conn->close();
    /*} else {
        echo "This page can only be accessed from trivia.tekno.icu"
    }*/
    echo $_SERVER['HTTP_ORIGIN'];
?>