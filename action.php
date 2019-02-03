<?php
header('Access-Control-Allow-Origin: *');
if(strlen($_GET["name"]) < 1) {
	$name = "undefined";
} else {
	$name = $_GET["name"];
}
if(strlen($_GET["question"]) < 1) {
	$question = "undefined";
} else {
	$question = $_GET["question"];
}
if(strlen($_GET["answer"]) < 1) {
	$answer = "undefined";
} else {
	$answer = $_GET["answer"];
}
if(strlen($_GET["time"]) < 1) {
	$time = date_timestamp_get(date_create());
} else {
	$time = $_GET["time"];
}
if(strlen($_GET["winners"]) < 1) {
	$winners = "undefined";
} else {
	$winners = $_GET["winners"];
}
if(strlen($_GET["chat"]) < 1) {
	$chat = "undefined";
} else {
	$chat = $_GET["chat"];
}
if(strlen($_GET["total"]) < 1) {
	$total = "0";
} else {
	$total = $_GET["total"];
}
$line = "\n" . $name . "-@-" . $question . "-@-" . $answer . "-@-" . $time . "-@-" . $winners . "-@-" . $chat . "-@-" . $total;
file_put_contents("trivias.txt", $line, FILE_APPEND);
echo "https://www.reddit.com/r/dataisbeautiful";
?>