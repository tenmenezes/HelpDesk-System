<?php
require_once "../../config/cors.php";
require_once "../../config/conn.php";

$id_chamado = isset($_GET['id_chamado']) ? (int)$_GET['id_chamado'] : 0;

if ($id_chamado <= 0) {
    echo json_encode(["success" => false, "message" => "ID de chamado inválido"]);
    exit();
}

// Primeiro deleta o histórico relacionado
$stmt1 = $conn->prepare("DELETE FROM historico_chamado WHERE id_chamado = ?");
$stmt1->bind_param("i", $id_chamado);
$stmt1->execute();

// Depois deleta o chamado
$stmt2 = $conn->prepare("DELETE FROM chamado WHERE id_chamado = ?");
$stmt2->bind_param("i", $id_chamado);

if ($stmt2->execute()) {
    echo json_encode(["success" => true, "message" => "Chamado deletado com sucesso"]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao deletar chamado"]);
}
