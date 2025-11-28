<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["error" => "JSON inválido", "raw" => $raw]);
    exit();
}

$nome = $data["username"];
$email = $data["email"];
$senha = password_hash($data["password"], PASSWORD_DEFAULT);
$telefone = $data["phone"];
$setor = $data["sector"];
$tipo = $data["type"];
$foto = "default-user.png";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$stmt = $conn->prepare("
    INSERT INTO usuario (id_setor, nome, email, senha, telefone, tipo, foto_perfil)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("issssss", $setor, $nome, $email, $senha, $telefone, $tipo, $foto);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario criado com sucesso."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao criar usuario."]);
}
