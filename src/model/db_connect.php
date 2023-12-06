<?php
$host = "localhost";  // Assuming XAMPP is running locally
$dbname = "js_game";
$username = "root";
$password = "";

// Create a PDO instance
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
 
    die("Error: " . $e->getMessage());
}
?>