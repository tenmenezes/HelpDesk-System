<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$sql = "
    SELECT 
        c.id_chamado,
        c.titulo,
        c.descricao,
        c.status,
        c.prioridade,
        c.criado_em,
        c.atualizado_em,
        c.id_setor,
        s.nome AS setor_nome,
        u.id_usuario,
        u.nome AS usuario_nome,
        u.foto_perfil AS usuario_foto
    FROM chamado c
    LEFT JOIN setor s ON s.id_setor = c.id_setor
    LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
    ORDER BY c.criado_em DESC
";

$result = $conn->query($sql);
$chamados = [];

while ($row = $result->fetch_assoc()) {
    $row["usuario_foto_url"] = ($row["usuario_foto"] && $row["usuario_foto"] !== "default-user.png")
        ? "http://localhost:8000/HelpDeskHub/backend/uploads/usuarios/" . $row["usuario_foto"]
        : null;
    $chamados[] = $row;
}

echo json_encode($chamados);
