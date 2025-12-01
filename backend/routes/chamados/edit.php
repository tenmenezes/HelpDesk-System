<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "JSON inválido"]);
    exit();
}

$id_chamado = $data["id_chamado"] ?? 0;
$status = $data["status"] ?? null;
$prioridade = $data["prioridade"] ?? null;
$titulo = $data["titulo"] ?? null;
$descricao = $data["descricao"] ?? null;

if ($id_chamado <= 0) {
    echo json_encode(["success" => false, "message" => "ID de chamado inválido"]);
    exit();
}

$updates = [];
$params = [];
$types = "";

if ($status !== null) {
    $updates[] = "status = ?";
    $params[] = $status;
    $types .= "s";
}

if ($prioridade !== null) {
    $updates[] = "prioridade = ?";
    $params[] = $prioridade;
    $types .= "s";
}

if ($titulo !== null) {
    $updates[] = "titulo = ?";
    $params[] = $titulo;
    $types .= "s";
}

if ($descricao !== null) {
    $updates[] = "descricao = ?";
    $params[] = $descricao;
    $types .= "s";
}

if (empty($updates)) {
    echo json_encode(["success" => false, "message" => "Nenhum campo para atualizar"]);
    exit();
}

$sql = "UPDATE chamado SET " . implode(", ", $updates) . " WHERE id_chamado = ?";
$types .= "i";
$params[] = $id_chamado;

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Chamado atualizado com sucesso"]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao atualizar chamado"]);
}
