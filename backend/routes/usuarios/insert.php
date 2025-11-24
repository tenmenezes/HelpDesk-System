<?php
require "../../config/conn.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$nome = $data["username"];
$email = $data["email"];
$senha = password_hash($data["password"], PASSWORD_DEFAULT);
$telefone = $data["phone"];
$setor = $data["sector"];
$tipo = $data["type"];
$foto = "default-user.png";

$stmt = $conn->prepare("
    INSERT INTO usuarios (id_setor, nome, email, senha, telefone, tipo, foto_perfil)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("issssss", $setor, $nome, $email, $senha, $telefone, $tipo, $foto);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuário criado com sucesso."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao criar usuário."]);
}
