<?php
header('Content-Type: text/plain; charset=UTF-8');
$test = $_GET["test"];
$test_replace = str_replace(" ", "-", $test);
echo $test . "\n" . $test_replace;
?>