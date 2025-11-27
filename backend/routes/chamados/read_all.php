<?php

// Pega todos os chamados pra tabela de Issues do suporte
header("Access-Control-Allow-Origin: *");

require_once "../../cors.php";
require_once "../../conn.php";

$sql = "SELECT c.*, u.nome AS usuario_nome 
        FROM chamado c
        JOIN usuario u ON c.id_usuario = u.id_usuario";
$stmt = $conn->query($sql);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
