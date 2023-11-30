<?php
include('db_connect.php');
if (isset($_GET['id'])) {
    $painting_id = $_GET['id'];

    // Delete the painting from the database
    $stmt = $pdo->prepare("DELETE FROM paintings WHERE id = :id");
    $stmt->bindParam(':id', $painting_id, PDO::PARAM_INT);
    $stmt->execute();
}

// Redirect back to the admin page
echo '<script>window.location.href = "../view/admin.php";</script>';
?>