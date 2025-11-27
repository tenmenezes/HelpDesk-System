<?php
require_once "../../cors.php";
require_once __DIR__ . "../../conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Nenhum dado recebido"]);
    exit;
}

$id       = isset($data["id"]) ? intval($data["id"]) : (isset($data["id_usuario"]) ? intval($data["id_usuario"]) : 0);
$username = $data["username"] ?? $data["nome"] ?? null;
$email    = $data["email"] ?? null;
$phone    = $data["phone"] ?? $data["telefone"] ?? null;
$sector   = isset($data["sector"]) ? intval($data["sector"]) : (isset($data["id_setor"]) ? intval($data["id_setor"]) : null);
$type     = $data["type"] ?? $data["tipo"] ?? null;

if (!$id || !$username || !$email || $sector === null || !$type) {
    echo json_encode(["success" => false, "error" => "Dados incompletos", "received" => $data]);
    exit;
}

$sql = "UPDATE usuario SET nome = ?, email = ?, telefone = ?, id_setor = ?, tipo = ? WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Erro no prepare: " . $conn->error]);
    exit;
}
$stmt->bind_param("sssssi", $username, $email, $phone, (string)$sector, $type, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Erro ao executar: " . $stmt->error]);
}
