<?php
$host = "sql3.freesqldatabase.com";  // Assuming XAMPP is running locally
$dbname = "sql3664774";
$username = "sql3664774";
$password = "vmrJbLSbcU";

// Create a PDO instance
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
 
    die("Error: " . $e->getMessage());
}
?>