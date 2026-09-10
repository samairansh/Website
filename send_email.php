<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize input fields
    $name    = filter_var(trim($_POST["name"] ?? ''), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email   = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $subject = filter_var(trim($_POST["subject"] ?? ''), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message = filter_var(trim($_POST["message"] ?? ''), FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(["status" => "error", "message" => "Please fill out all required fields."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Please provide a valid email address."]);
        exit;
    }

    // Recipient & Email Headers
    $to = "info@samairansh.com";
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $body = "Name: $name\n";
    $body .= "Email: $email\n\n";
    $body .= "Message:\n$message\n";

    // Attempt to send email
    if (mail($to, "Contact Form: " . $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been successfully sent."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Unable to send message due to a server error. Please try again later."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
