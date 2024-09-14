<?php
session_start();

// Database connection
$pdo = new PDO("mysql:host=localhost;dbname=example", "username", "password");

// Check for form submission
if ($_POST["submit"]) {
    // Check CSRF token
    if ($_POST["token"] === $_SESSION["token"]) {
        // Validate input
        $username = trim($_POST["username"]);
        $password = trim($_POST["password"]);

        // Query database
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(["username" => $username]);
        $user = $stmt->fetch();

        // Check password
        if ($user && password_verify($password, $user["password"])) {
            // Login successful
            $_SESSION["username"] = $username;
            header("Location: dashboard.php");
            exit;
        } else {
            // Login failed
            $error = "Invalid username or password";
        }
    } else {
        // CSRF attack detected
        $error = "Invalid request";
    }
}

// Generate CSRF token
$_SESSION["token"] = bin2hex(random_bytes(32));

?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <?php if ($error): ?>
        <p style="color: red;"><?php echo $error; ?></p>
    <?php endif; ?>
    <form method="post">
        <input type="hidden" name="token" value="<?php echo $_SESSION["token"]; ?>">
        <label>Username:</label>
        <input type="text" name="username"><br><br>
        <label>Password:</label>
        <input type="password" name="password"><br><br>
        <input type="submit" name="submit" value="Login">
    </form>
</body>
</html>