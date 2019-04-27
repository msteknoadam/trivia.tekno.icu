<?php
    header('Content-Type: text/plain; charset=UTF-8');
    if($_GET["secret"] === ",yD:n]kDu7Z?zjn<") {
        $servername = "localhost";
        $username = "tekntehf_trivias_user";
        $password = "Fo3A4QZ)*s+d";
        $dbname = "tekntehf_trivias";
        $minTimeStamp = (time() * 1000) - (24 * 60 * 60 * 1000);
        $trivias = array();
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
        $sql = "SELECT total FROM trivia_data WHERE time > $minTimeStamp";
        $total = 0;
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $total = $total + $row['total'];
            }
        } else {
            echo "0";
        }
        $conn->close();
        echo $total;
    } else {
        echo "The provided secret key is wrong or you didn't even provide a secret key.";
    }
?>