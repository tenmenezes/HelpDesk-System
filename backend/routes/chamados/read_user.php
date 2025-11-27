<?php
header("Access-Control-Allow-Origin: *");

require_once "../../cors.php";
require_once "../../conn.php";

$id_usuario = $_GET["id_usuario"] ?? null;

if (!$id_usuario) {
    echo json_encode(["error" => "id_usuario não informado"]);
    exit();
}

$sql = "SELECT c.id_chamado, c.titulo, c.descricao, c.status, c.prioridade, 
               c.criado_em, c.atualizado_em,
               s.nome AS setor
        FROM chamado c
        LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
        LEFT JOIN setor s ON s.id_setor = u.id_setor
        WHERE c.id_usuario = ?
        ORDER BY c.criado_em DESC";

$stmt = $conn->prepare($sql);
$stmt->execute([$id_usuario]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
