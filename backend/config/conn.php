<?php

$host = "127.0.0.1";
$user = "root";
$pass = "";
$db = "helpdesk";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$conn->set_charset("utf8");
