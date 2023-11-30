<?php
include('db_connect.php');
$imageData = $_POST['imageData'];

// Decode the data URL to get the binary image data
$binaryImageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

// Save the binary image data to the database
try {
    $user_id = 1;  // Replace with the actual user ID
    $title = "something";  // Replace with the actual title

    $stmt = $pdo->prepare("INSERT INTO paintings (user_id, title, image_data) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $title, $binaryImageData]);

    echo "Drawing saved successfully!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>