<?php
include('db_connect.php');
$imageData = $_POST['imageData'];
$user_id = $_POST['username'];
$title = $_POST['description'];
// Decode the data URL to get the binary image data
$binaryImageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

// Save the binary image data to the database
try {
    $stmt = $pdo->prepare("SELECT * FROM paintings WHERE user_id LIKE ?");
    $stmt->execute([$user_id]);
    $painting = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($painting)) {
        echo "No user with id " . $user_id;
    }
    else{
    $stmt = $pdo->prepare("INSERT INTO paintings (user_id, title, image_data) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $title, $binaryImageData]);
    echo "Drawing saved successfully!";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>