<?php
    header('Content-Type: text/plain; charset=UTF-8');
    $servername = "localhost";
    $username = "tekntehf_trivias_user";
    $password = "Fo3A4QZ)*s+d";
    $dbname = "tekntehf_trivias";
    $minTimeStamp = (time() * 1000) - (24 * 60 * 60 * 1000);
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
    $sql = "SELECT name, question, answer, time, winners, chat, total FROM trivia_data WHERE time > $minTimeStamp";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $trivia = array ("hoster" => $row['name'], "question" => $row['question'], "answer" => $row['answer'], "timeStamp" => $row['time'], "winners" => $row['winners'], "chatName" => $row['chat'], "totalAmount" => $row['total']);
            echo json_encode($trivia) + "\n";
        }
    } else {
        echo "0 results";
    }
    $conn->close();
?>