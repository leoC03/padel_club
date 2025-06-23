<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "padel_club");
if ($conn->connect_error) die(json_encode(['reservations' => []]));

$cancha = $_GET['cancha'];
$user = $_GET['user'] ?? null;
$query = $user ? "WHERE court = ? AND user = ?" : "WHERE court = ?";
$stmt = $conn->prepare($query);
$params = [$cancha];
if ($user) $params[] = $user;
$stmt->bind_param(str_repeat("s", count($params)), ...$params);
$stmt->execute();
$result = $stmt->get_result();
$reservations = array_column($result->fetch_all(MYSQLI_ASSOC), 'time');
echo json_encode(['reservations' => $reservations]);
$stmt->close();
$conn->close();
?>