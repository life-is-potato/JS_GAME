<?php
include('../model/db_connect.php');
$stmt = $pdo->prepare("SELECT id, title, image_data FROM paintings");
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
            justify-content: center; /* Center the content horizontally */
            align-items: center; /* Center the content vertically */
            height: 106px; /* Set a fixed height with a small margin for all rows */
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
    
    <!-- Display list of paintings with images and delete option -->
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
                        // Display the image if available
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

    <br>


    <script>
        // Adjust the size of upscaled images to fit within the fixed row height with a small margin
        document.addEventListener('DOMContentLoaded', function () {
            var rows = document.querySelectorAll('.image-cell');

            rows.forEach(function (row) {
                var image = row.querySelector('.upscaled-image');
                var rowHeight = row.clientHeight;
                var margin = 10; // Set the desired margin

                if (image.clientHeight + margin > rowHeight) {
                    image.style.maxHeight = rowHeight - margin + 'px';
                }
            });
        });
    </script>
</body>
</html>