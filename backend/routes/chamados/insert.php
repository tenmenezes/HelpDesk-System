<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "JSON inválido"]);
    exit();
}

$id_usuario = $data["id_usuario"] ?? 0;
$id_setor = $data["id_setor"] ?? 0;
$titulo = $data["titulo"] ?? "";
$descricao = $data["descricao"] ?? "";
$status = $data["status"] ?? "aberto";
$prioridade = $data["prioridade"] ?? "media";

if (empty($titulo) || empty($descricao) || $id_usuario <= 0 || $id_setor <= 0) {
    echo json_encode(["success" => false, "message" => "Dados incompletos"]);
    exit();
}

$stmt = $conn->prepare("
    INSERT INTO chamado (id_usuario, id_setor, titulo, descricao, status, prioridade)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("iissss", $id_usuario, $id_setor, $titulo, $descricao, $status, $prioridade);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Chamado criado com sucesso", "id" => $conn->insert_id]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao criar chamado"]);
}
