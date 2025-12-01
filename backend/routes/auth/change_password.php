<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Nenhum dado recebido"]);
    exit;
}

$email = $data["email"] ?? null;
$senhaAtual = $data["senhaAtual"] ?? null;
$novaSenha = $data["novaSenha"] ?? null;

if (!$email || !$senhaAtual || !$novaSenha) {
    echo json_encode(["success" => false, "error" => "Dados incompletos"]);
    exit;
}

// Verificar se o usuário existe
$stmt = $conn->prepare("SELECT id_usuario, senha FROM usuario WHERE email = ?");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Usuário não encontrado"]);
    exit;
}

$user = $result->fetch_assoc();

// Verificar senha atual
if (!password_verify($senhaAtual, $user["senha"])) {
    echo json_encode(["success" => false, "error" => "Senha atual incorreta"]);
    exit;
}

// Atualizar senha
$novaSenhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);

$updateStmt = $conn->prepare("UPDATE usuario SET senha = ? WHERE id_usuario = ?");

$updateStmt->bind_param("si", $novaSenhaHash, $user["id_usuario"]);

if ($updateStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Senha alterada com sucesso"]);
} else {
    echo json_encode(["success" => false, "error" => "Erro ao alterar senha"]);
}

$updateStmt->close();
$stmt->close();
$conn->close();
