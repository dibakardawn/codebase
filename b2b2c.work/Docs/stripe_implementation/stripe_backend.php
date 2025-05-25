<?php
require 'vendor/autoload.php'; // Include the Stripe PHP SDK

\Stripe\Stripe::setApiKey('sk_test_your_secret_key'); // Replace with your Stripe Secret Key

// Handle the frontend request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'create_connection_token') {
        // Create a connection token for the card reader
        $connectionToken = \Stripe\Terminal\ConnectionToken::create();
        echo json_encode(['secret' => $connectionToken->secret]);
        exit;
    }

    if ($action === 'create_payment_intent') {
        $amount = intval($_POST['amount']);
        $currency = $_POST['currency'];

        // Create a PaymentIntent
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => $currency,
            'payment_method_types' => ['card_present'],
            'capture_method' => 'manual',
        ]);

        echo json_encode(['client_secret' => $paymentIntent->client_secret]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['error' => 'Invalid request']);
?>
