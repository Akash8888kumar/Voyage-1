<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


// --------------------------------------------------
// ONLY POST REQUEST
// --------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Invalid request.');
}


// --------------------------------------------------
// GET FORM DATA
// IMPORTANT: These names MUST match HTML name="" values
// --------------------------------------------------

$firstName = trim($_POST['first_name'] ?? '');
$lastName = trim($_POST['last_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');

$destination = trim($_POST['destination'] ?? '');

$travelType = trim($_POST['travel_type'] ?? '');

$pax = trim($_POST['pax'] ?? '');

$travelDates = trim($_POST['travel_dates'] ?? '');

$requirements = trim($_POST['requirements'] ?? '');


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

if ($firstName === '') {
    exit('Please enter your first name.');
}

if ($lastName === '') {
    exit('Please enter your last name.');
}

if ($email === '') {
    exit('Please enter your email address.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('Please enter a valid email address.');
}

if ($phone === '') {
    exit('Please enter your contact number.');
}

if ($requirements === '') {
    exit('Please enter your requirements.');
}


// --------------------------------------------------
// EMAIL SUBJECT
// --------------------------------------------------

$emailSubject = 'New Enquiry — Voyage 1';


// --------------------------------------------------
// PHPMailer
// --------------------------------------------------

$mail = new PHPMailer(true);

try {

    // --------------------------------------------------
    // SMTP
    // --------------------------------------------------

    $mail->isSMTP();

    $mail->Host = 'smtp.gmail.com';

    $mail->SMTPAuth = true;

    $mail->Username = 'sumitkumarstk7055@gmail.com';

    // Use your NEW Gmail App Password
    $mail->Password = 'qekv gtlt hwdk tczx';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->Port = 587;


    // --------------------------------------------------
    // FROM
    // --------------------------------------------------

    $mail->setFrom(
        'sumitkumarstk7055@gmail.com',
        'Voyage 1 Website'
    );


    // --------------------------------------------------
    // TO
    // --------------------------------------------------

    $mail->addAddress(
        'sumitkumarstk7055@gmail.com'
    );


    // --------------------------------------------------
    // REPLY TO
    // --------------------------------------------------

    $mail->addReplyTo(
        $email,
        $firstName . ' ' . $lastName
    );


    // --------------------------------------------------
    // EMAIL SETTINGS
    // --------------------------------------------------

    $mail->isHTML(true);

    $mail->CharSet = 'UTF-8';

    $mail->Subject = $emailSubject;


    // --------------------------------------------------
    // SAFE DATA
    // --------------------------------------------------

    $safeFirstName = htmlspecialchars(
        $firstName,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeLastName = htmlspecialchars(
        $lastName,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeEmail = htmlspecialchars(
        $email,
        ENT_QUOTES,
        'UTF-8'
    );

    $safePhone = htmlspecialchars(
        $phone ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeDestination = htmlspecialchars(
        $destination ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeTravelType = htmlspecialchars(
        $travelType ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safePax = htmlspecialchars(
        $pax ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeTravelDates = htmlspecialchars(
        $travelDates ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeRequirements = nl2br(
        htmlspecialchars(
            $requirements ?: 'Not specified',
            ENT_QUOTES,
            'UTF-8'
        )
    );


    // --------------------------------------------------
    // HTML EMAIL
    // --------------------------------------------------

    $mail->Body = '
<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8">
<title>Voyage 1 Enquiry</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial, Helvetica, sans-serif;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f5f5f5;"
>

<tr>

<td
    align="center"
    style="padding:20px 10px;"
>

<table
    width="700"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width:700px;
        width:100%;
        background:#ffffff;
    "
>


<!-- HEADER -->

<tr>

<td style="
    background:#111111;
    padding:25px 30px;
    color:#ffffff;
">

<div style="
    font-size:26px;
    font-weight:bold;
    margin-bottom:10px;
">
    Voyage 1 DMC
</div>

<div style="
    font-size:14px;
">
    New Website Enquiry
</div>

</td>

</tr>


<!-- CONTENT -->

<tr>

<td style="
    padding:30px;
">

<p style="
    margin:0 0 25px 0;
    font-size:15px;
    line-height:1.6;
">

A new enquiry has been received from the Voyage 1 website.

</p>


<!-- TABLE -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        border-collapse:collapse;
        width:100%;
        font-size:13px;
    "
>


<!-- First Name -->

<tr>

<td style="
    width:38%;
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    First Name
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safeFirstName . '
</td>

</tr>


<!-- Last Name -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Last Name
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safeLastName . '
</td>

</tr>


<!-- Email -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Work Email
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">

<a
    href="mailto:' . $safeEmail . '"
    style="color:#0066cc;"
>
    ' . $safeEmail . '
</a>

</td>

</tr>


<!-- Phone -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Contact Number
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safePhone . '
</td>

</tr>


<!-- Destination -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Destination
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safeDestination . '
</td>

</tr>


<!-- Travel Type -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Travel Type
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safeTravelType . '
</td>

</tr>


<!-- Pax -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Pax
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safePax . '
</td>

</tr>


<!-- Travel Dates -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
">
    Travel Dates
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
">
    ' . $safeTravelDates . '
</td>

</tr>


<!-- Requirements -->

<tr>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    background:#f7f7f7;
    font-weight:bold;
    vertical-align:top;
">
    Requirements
</td>

<td style="
    padding:14px 12px;
    border:1px solid #dddddd;
    vertical-align:top;
">
    ' . $safeRequirements . '
</td>

</tr>


</table>


<p style="
    margin:28px 0 0 0;
    font-size:12px;
    color:#777777;
">

This enquiry was submitted from the Voyage 1 DMC website.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
';


    // --------------------------------------------------
    // PLAIN TEXT
    // --------------------------------------------------

    $mail->AltBody =
        "New Enquiry — Voyage 1\n\n" .
        "First Name: $firstName\n" .
        "Last Name: $lastName\n" .
        "Work Email: $email\n" .
        "Contact Number: $phone\n" .
        "Destination: $destination\n" .
        "Travel Type: $travelType\n" .
        "Pax: $pax\n" .
        "Travel Dates: $travelDates\n\n" .
        "Requirements:\n$requirements";


    // --------------------------------------------------
    // SEND
    // --------------------------------------------------

    $mail->send();


    // IMPORTANT
    // JavaScript expects exactly "success"

    echo 'success';

    exit;


} catch (Exception $e) {

    http_response_code(500);

    echo 'Email could not be sent. Please try again later.';

    exit;
}
?>