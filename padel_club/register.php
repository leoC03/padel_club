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
$role = $_POST['role'] ?? 'cliente';

$stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$response = ['success' => false];
if ($result->num_rows == 0) {
    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'Error en la preparación de la inserción: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("sss", $username, $password, $role);
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Usuario creado exitosamente';
    } else {
        $response['error'] = 'Error al insertar: ' . $conn->error;
    }
} else {
    $response['error'] = 'El usuario ya existe';
}
echo json_encode($response);
$stmt->close();
$conn->close();
?>