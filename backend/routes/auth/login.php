<?php
// backend/routes/auth/login.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require_once "../../config/conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$email = $data['email'] ?? '';
$senha = $data['senha'] ?? '';

if (!$email || !$senha) {
    echo json_encode(["success" => false, "message" => "Informe email e senha"]);
    exit;
}

$query = $conn->prepare("SELECT * FROM usuario WHERE email = ?");
if (!$query) {
    echo json_encode(["success" => false, "message" => "Erro no DB: " . $conn->error]);
    exit;
}
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Usuário não encontrado"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($senha, $user["senha"])) {
    echo json_encode(["success" => false, "message" => "Senha incorreta"]);
    exit;
}

// remove senha antes de enviar
unset($user["senha"]);

echo json_encode([
    "success" => true,
    "user" => $user
]);
