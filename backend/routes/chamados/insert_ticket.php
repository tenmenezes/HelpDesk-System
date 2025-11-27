<?php

// Usuário do tipo comum pode inserir novos chamados
header("Access-Control-Allow-Origin: *");

require_once "../../cors.php";
require_once "../../conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["error" => "JSON inválido", "raw" => $raw]);
    exit();
}

$sql = "INSERT INTO chamado (id_usuario, titulo, descricao, prioridade)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->execute([
    $data["id_usuario"],
    $data["titulo"],
    $data["descricao"],
    $data["prioridade"]
]); 

echo json_encode(["success" => true]);
