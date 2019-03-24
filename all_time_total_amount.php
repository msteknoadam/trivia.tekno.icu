<?php
    header('Content-Type: text/plain; charset=UTF-8');
    $servername = "localhost";
    $username = "tekntehf_trivias_user";
    $password = "Fo3A4QZ)*s+d";
    $dbname = "tekntehf_trivias";
    $totalAmount = 0;
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
    $sql = "SELECT total FROM trivia_data";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $totalAmount += intval($row['total']);
        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo $totalAmount;
?>