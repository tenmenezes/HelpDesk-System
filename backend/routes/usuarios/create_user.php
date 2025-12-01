
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
$telefone = $data["phone"];

// Verificar se email ou telefone já existem

$check = $conn->prepare("SELECT id_usuario FROM usuario WHERE email = ? OR telefone = ?");

$check->bind_param("ss", $email, $telefone);

$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {

    $existing = $result->fetch_assoc();

    $checkUser = $conn->prepare("SELECT email, telefone FROM usuario WHERE id_usuario = ?");

    $checkUser->bind_param("i", $existing["id_usuario"]);

    $checkUser->execute();

    $userData = $checkUser->get_result()->fetch_assoc();

    $errors = [];

    if ($userData["email"] === $email) {
        $errors[] = "Email já cadastrado";
    }
    if ($userData["telefone"] === $telefone) {
        $errors[] = "Telefone já cadastrado";
    }

    echo json_encode(["success" => false, "message" => implode(" e ", $errors)]);
    exit();
}
$senha = password_hash($data["password"], PASSWORD_DEFAULT);
$setor = $data["sector"];
$tipo = $data["type"] ?? "comum";

// Usa o tipo enviado pelo formulário

$foto = "default-user.png";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$stmt = $conn->prepare("    INSERT INTO usuario (id_setor, nome, email, senha, telefone, tipo, foto_perfil)    VALUES (?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("issssss", $setor, $nome, $email, $senha, $telefone, $tipo, $foto);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario criado com sucesso."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao criar usuario."]);
}
