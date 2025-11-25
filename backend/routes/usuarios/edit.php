<?php
require "../../config/conn.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS, DELETE, PUT");

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
    UPDATE usuario 
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
