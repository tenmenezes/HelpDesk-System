<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$sql = "
    SELECT 
        u.id_usuario AS id,
        u.nome,
        u.email,
        u.telefone,
        u.id_setor,
        s.nome AS setor,
        u.tipo,
        u.foto_perfil AS foto
    FROM usuario u
    LEFT JOIN setor s ON s.id_setor = u.id_setor
";

$result = $conn->query($sql);

$usuarios = [];

while ($row = $result->fetch_assoc()) {

    // monta a URL da foto
    $row["foto_url"] = ($row["foto"] && $row["foto"] !== "default-user.png")
        ? "http://localhost:8000/HelpDeskHub/backend/uploads/" . $row["foto"]
        : null;

    $usuarios[] = $row;
}

echo json_encode($usuarios);
