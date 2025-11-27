<?php
require_once "../../cors.php";
require_once "../../conn.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Limites básicos
$MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
$ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

if (!isset($_POST['userId'])) {
    echo json_encode(['success' => false, 'error' => 'userId não informado']);
    exit;
}
$userId = intval($_POST['userId']);

if (!isset($_FILES['avatar'])) {
    echo json_encode(['success' => false, 'error' => 'Arquivo não enviado']);
    exit;
}

$file = $_FILES['avatar'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'Erro no upload: ' . $file['error']]);
    exit;
}

if ($file['size'] > $MAX_FILE_SIZE) {
    echo json_encode(['success' => false, 'error' => 'Arquivo muito grande']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $ALLOWED_MIMES)) {
    echo json_encode(['success' => false, 'error' => 'Tipo de arquivo não permitido']);
    exit;
}

// Criar pasta uploads (se não existir)
$uploadDir = __DIR__ . '/../../public/uploads/usuarios/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Gerar nome único
$ext = '';
switch ($mime) {
    case 'image/jpeg':
        $ext = '.jpg';
        break;
    case 'image/png':
        $ext = '.png';
        break;
    case 'image/webp':
        $ext = '.webp';
        break;
}
$filename = 'user_' . $userId . '_' . time() . $ext;
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode(['success' => false, 'error' => 'Falha ao mover arquivo']);
    exit;
}

// Aqui definimos a URL pública (ajuste se tua public path for diferente)
$publicUrl = "/uploads/usuarios/" . $filename;

// Atualiza no banco
$stmt = $conn->prepare("UPDATE usuarios SET foto_url = ? WHERE id = ?");
$stmt->bind_param("si", $publicUrl, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'url' => $publicUrl]);
} else {
    // Se falhar no DB, remove o arquivo
    @unlink($targetPath);
    echo json_encode(['success' => false, 'error' => 'Erro ao atualizar DB']);
}
