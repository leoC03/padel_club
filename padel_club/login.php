<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "padel_club");
if ($conn->connect_error) {
    $error = ['success' => false, 'error' => 'Conexión fallida: ' . $conn->connect_error];
    echo json_encode($error);
    exit;
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $conn->prepare("SELECT username, password, role FROM users WHERE username = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$response = ['success' => false];
if ($user) {
    if ($user['password'] === $password) {
        $response['success'] = true;
        $response['role'] = $user['role'];
    } else {
        $response['error'] = 'Contraseña incorrecta';
    }
} else {
    $response['error'] = 'Usuario no encontrado';
}
echo json_encode($response);
$stmt->close();
$conn->close();
?>