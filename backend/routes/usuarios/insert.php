<?php

require "../../config/conn.php";


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // método não permitido - GET
    echo json_encode(["error" => "Método inválido"]);
    exit();
}

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
    echo json_encode(["success" => true, "message" => "Usuário criado com sucesso."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao criar usuário."]);
}
