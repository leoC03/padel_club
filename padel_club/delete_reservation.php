<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "padel_club");
if ($conn->connect_error) die(json_encode(['success' => false]));

$id = $_GET['id'];
$stmt = $conn->prepare("DELETE FROM reservations WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
echo json_encode(['success' => true]);
$stmt->close();
$conn->close();
?>