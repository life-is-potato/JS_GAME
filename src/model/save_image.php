<?php
include('db_connect.php');
$imageData = $_POST['imageData'];

// Decode the data URL to get the binary image data
$binaryImageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

// Save the binary image data to the database
try {
    $user_id = $_POST['username'];
    $title = $_POST['description'];
    $stmt = $pdo->prepare("INSERT INTO paintings (user_id, title, image_data) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $title, $binaryImageData]);

    echo "Drawing saved successfully!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>