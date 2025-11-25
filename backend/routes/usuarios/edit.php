<?php
header("Content-Type: application/json");
require_once "../../conn.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "Nenhum dado enviado"]);
    exit;
}

$id       = intval($data["id"]);
$username = $data["username"];
$email    = $data["email"];
$phone    = $data["phone"];
$sector   = intval($data["sector"]);
$type     = $data["type"];

$sql = "
    UPDATE usuarios 
    SET nome = ?, email = ?, telefone = ?, id_setor = ?, tipo = ?
    WHERE id_usuario = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $username, $email, $phone, $sector, $type, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Erro ao atualizar usuário"]);
}
