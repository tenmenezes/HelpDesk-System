<?php

// Usuário do tipo comum pode deletar seus chamados
header("Access-Control-Allow-Origin: *");

require_once "../../cors.php";
require_once "../../conn.php";

$id = $_GET["id_chamado"];

$sql = "DELETE FROM chamado WHERE id_chamado = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$id]);

echo json_encode(["success" => true]);
