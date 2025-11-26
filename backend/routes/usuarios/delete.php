<?php
// backend/routes/usuarios/delete.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS, DELETE");

require_once __DIR__ . "/../../config/conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$id = 0;
if (isset($data["id"])) {
    $id = intval($data["id"]);
} elseif (isset($data["id_usuario"])) {
    $id = intval($data["id_usuario"]);
}

if (!$id) {
    echo json_encode(["success" => false, "error" => "ID não informado"]);
    exit;
}

$sql = "DELETE FROM usuario WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Erro no prepare: " . $conn->error]);
    exit;
}
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Erro ao excluir usuário: " . $stmt->error]);
}
