<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "padel_club");
if ($conn->connect_error) die(json_encode(['success' => false]));

$user = $_POST['user'];
$court = $_POST['cancha'];
$time = $_POST['hora'];

$stmt = $conn->prepare("INSERT INTO reservations (user, court, time) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $user, $court, $time);
$stmt->execute();
echo json_encode(['success' => true]);
$stmt->close();
$conn->close();
?>