<?php

// Usuário do tipo comum pode editar seus chamados
header("Access-Control-Allow-Origin: *");

require_once "../../cors.php";
require_once "../../conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["error" => "JSON inválido", "raw" => $raw]);
    exit();
}

$sql = "UPDATE chamado SET titulo=?, descricao=?, prioridade=? WHERE id_chamado=?";

$stmt = $conn->prepare($sql);
$stmt->execute([
    $data["titulo"],
    $data["descricao"],
    $data["prioridade"],
    $data["id_chamado"]
]);

echo json_encode(["success" => true]);
