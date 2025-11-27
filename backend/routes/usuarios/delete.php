<?php
require_once "../../cors.php";
require_once __DIR__ . "../../conn.php";

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
