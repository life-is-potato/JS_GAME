<?php
include('../model/db_connect.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['upload_image'])) {
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (in_array($_FILES['upload_image']['type'], $allowed_types)) {
    $uploaded_image_data = file_get_contents($_FILES['upload_image']['tmp_name']);
    $stmt = $pdo->prepare("SELECT id, title, image_data FROM paintings WHERE image_data = :image_data");
        $stmt->bindParam(':image_data', $uploaded_image_data, PDO::PARAM_LOB);
    $stmt->execute();
     $found_paintings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $upload_error = "Invalid file type. Please upload a valid image.";
    }
}
if (isset($_GET['search'])) {
        $search = $_GET['search'];
        $stmt = $pdo->prepare("SELECT id, title, image_data FROM paintings WHERE id LIKE :search OR title LIKE :search");
        $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
} else {
    $stmt = $pdo->prepare("SELECT id, title, image_data FROM paintings");
}

$stmt->execute();
$paintings = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
        <html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Administrator Control Panel</title>
    <style>
    body {
        font-family: Arial, sans-serif;
             }

    h1 {
            margin-bottom: 20px;
         }

                table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .image-cell {
            display: flex;
            justify-content: center;
            align-items: center;
        height: 106px;
        }
        .upscaled-image {
            max-width: 100%;
            max-height: 100%;
            transform: scale(4);
            image-rendering: pixelated;
        }
    </style>
</head>
<body>
    <h1>Administrator Control Panel</h1>
    <form method="GET" action="admin.php" style="margin-bottom: 20px;">
            <label for="search">Search:</label>
                 <input type="text" name="search" id="search">
              <button type="submit">Search</button>
    </form>
       <form method="POST" action="admin.php" enctype="multipart/form-data" style="margin-bottom: 20px;">
        <label for="upload_image">Upload Image:</label>
         <input type="file" name="upload_image" id="upload_image">
        <button type="submit">Search by Image</button>
    </form>
    <table>
        <thead>
                  <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Image</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($paintings as $painting): ?>
                <tr>
                    <td><?= $painting['id'] ?></td>
                    <td><?= $painting['title'] ?></td>
                                <td class="image-cell">
                        <?php
                        if ($painting['image_data']) {
                            echo '<img src="data:image/png;base64,' . base64_encode($painting['image_data']) . '" alt="Painting" class="upscaled-image">';
                        } else {
                            echo 'No Image';
                        }
                        ?>
                    </td>
                    <td>
                        <a href="../model/delete_painting_process.php?id=<?= $painting['id'] ?>">Delete</a>
                    </td>
                </tr>
                   <?php endforeach; ?>
        </tbody>
    </table>    
    <?php if (isset($upload_error)): ?>
        <p style="color: red;"><?= $upload_error ?></p>
    <?php endif; ?>

        <?php if (isset($found_paintings) && !empty($found_paintings)): ?>
        <h2>Found Paintings:</h2>
        <table>
            <thead>
                <tr>
                          <th>ID</th>
                    <th>Title</th>
                        <th>Image</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($found_paintings as $found_painting): ?>
                    <tr>
                        <td><?= $found_painting['id'] ?></td>
                        <td><?= $found_painting['title'] ?></td>
                        <td class="image-cell">
                            <?php
                            if ($found_painting['image_data']) {
                                echo '<img src="data:image/png;base64,' . base64_encode($found_painting['image_data']) . '" alt="Painting" class="upscaled-image">';
                            } else {
                                echo 'No Image';
                            }
                            ?>
                        </td>
                        <td>
                            <a href="delete_painting_process.php?id=<?= $found_painting['id'] ?>">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>

    <br>
</body>
</html>