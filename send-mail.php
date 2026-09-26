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
// --------------------------------------------------

$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$company = trim($_POST['company'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$country = trim($_POST['country'] ?? '');
$travelDate = trim($_POST['travelDate'] ?? '');
$travelers = trim($_POST['travelers'] ?? '');
$travelType = trim($_POST['travelType'] ?? '');
$destination = trim($_POST['destination'] ?? '');
$requirements = trim($_POST['requirements'] ?? '');

// Fixed values
$destinationCountry = 'Kazakhstan';

// --------------------------------------------------
// DYNAMIC EMAIL SUBJECT
// --------------------------------------------------

$subject = "New " . $destination . " Journey Enquiry – Voyage 1 DMC";

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

    /*
     * IMPORTANT:
     * Enter your NEW Gmail App Password here.
     * Example:
     * $mail->Password = 'xxxx xxxx xxxx xxxx';
     */
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

       $mail->addAddress(
    'akashkumar079045@gmail.com'
);

    // --------------------------------------------------
    // REPLY TO CUSTOMER
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

    // Dynamic subject
    $mail->Subject = $subject;

    // --------------------------------------------------
    // SAFE HTML DATA
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

    $safeCompany = htmlspecialchars(
        $company ?: 'Not specified',
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

    $safeCountry = htmlspecialchars(
        $country ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeTravelDate = htmlspecialchars(
        $travelDate ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeTravelers = htmlspecialchars(
        $travelers ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeTravelType = htmlspecialchars(
        $travelType ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    );

    $safeDestination = htmlspecialchars(
        $destination ?: 'Not specified',
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
    // EMAIL BODY
    // --------------------------------------------------

    $mail->Body = '
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>' . $safeDestination . ' Journey Enquiry</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial, Helvetica, sans-serif;
    color:#222222;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f5f5f5;"
>
<tr>
<td align="center" style="padding:20px 10px;">

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
                    color:#ffffff;
                ">
                    ' . $safeDestination . ' Journey Enquiry
                </div>

            </td>
        </tr>

        <!-- CONTENT -->
        <tr>
            <td style="
                padding:30px;
                background:#ffffff;
            ">

                <p style="
                    margin:0 0 25px 0;
                    font-size:15px;
                    line-height:1.6;
                    color:#333333;
                ">
                    A new ' . $safeDestination . ' journey enquiry has been received
                    from the website.
                </p>

                <!-- DATA TABLE -->
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

                    <!-- Destination Country -->
                    <tr>
                        <td style="
                            width:38%;
                            padding:14px 12px;
                            border:1px solid #dddddd;
                            background:#f7f7f7;
                            font-weight:bold;
                        ">
                            Destination Country
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . htmlspecialchars(
                                $destinationCountry,
                                ENT_QUOTES,
                                'UTF-8'
                            ) . '
                        </td>
                    </tr>

                    <!-- First Name -->
                    <tr>
                        <td style="
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

                    <!-- Company -->
                    <tr>
                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                            background:#f7f7f7;
                            font-weight:bold;
                        ">
                            Company
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . $safeCompany . '
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
                            Email
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
                            Phone / WhatsApp
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . $safePhone . '
                        </td>
                    </tr>

                    <!-- Country -->
                    <tr>
                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                            background:#f7f7f7;
                            font-weight:bold;
                        ">
                            Country
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . $safeCountry . '
                        </td>
                    </tr>

                    <!-- Travel Date -->
                    <tr>
                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                            background:#f7f7f7;
                            font-weight:bold;
                        ">
                            Travel Date
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . $safeTravelDate . '
                        </td>
                    </tr>

                    <!-- Travelers -->
                    <tr>
                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                            background:#f7f7f7;
                            font-weight:bold;
                        ">
                            Number of Travelers
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . $safeTravelers . '
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

                    <!-- Destination -->
                    <tr>
                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                            background:#f7f7f7;
                            font-weight:bold;
                        ">
                            Preferred City / Region
                        </td>

                        <td style="
                            padding:14px 12px;
                            border:1px solid #dddddd;
                        ">
                            ' . $safeDestination . '
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

                <!-- FOOTER -->
                <p style="
                    margin:28px 0 0 0;
                    font-size:12px;
                    line-height:1.5;
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
    // PLAIN TEXT VERSION
    // --------------------------------------------------

    $mail->AltBody =
        "New " . $destination . " Journey Enquiry – Voyage 1 DMC\n\n" .
        "Destination Country: $destinationCountry\n" .
        "First Name: $firstName\n" .
        "Last Name: $lastName\n" .
        "Company: $company\n" .
        "Email: $email\n" .
        "Phone / WhatsApp: $phone\n" .
        "Country: $country\n" .
        "Travel Date: $travelDate\n" .
        "Number of Travelers: $travelers\n" .
        "Travel Type: $travelType\n" .
        "Preferred City / Region: $destination\n\n" .
        "Requirements:\n$requirements";

    // --------------------------------------------------
    // SEND
    // --------------------------------------------------

    $mail->send();

    // IMPORTANT:
    // JavaScript checks exactly "success"

    echo 'success';
    exit;

} catch (Exception $e) {

    http_response_code(500);

    echo 'Email could not be sent. Please try again later.';

    exit;
}
?>