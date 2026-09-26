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
// FORM DATA
// --------------------------------------------------

$firstName       = trim($_POST['first_name'] ?? '');
$lastName        = trim($_POST['last_name'] ?? '');
$email           = trim($_POST['email'] ?? '');
$phone           = trim($_POST['phone'] ?? '');
$country         = trim($_POST['country'] ?? '');
$areaOfInterest  = trim($_POST['area_of_interest'] ?? '');
$message         = trim($_POST['message'] ?? '');
$privacyConsent  = isset($_POST['privacy_consent']);


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

if ($country === '') {
    exit('Please enter your country.');
}

if ($areaOfInterest === '') {
    exit('Please select an area of interest.');
}

if (!$privacyConsent) {
    exit('Please accept the privacy consent.');
}


// --------------------------------------------------
// RESUME VALIDATION
// --------------------------------------------------

if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    exit('Please upload your resume.');
}

$resume = $_FILES['resume'];


// Maximum 10 MB

$maxFileSize = 10 * 1024 * 1024;

if ($resume['size'] > $maxFileSize) {
    exit('Resume file size must be less than 10 MB.');
}


// --------------------------------------------------
// ALLOWED FILE TYPES
// --------------------------------------------------

$allowedExtensions = [
    'pdf',
    'doc',
    'docx'
];

$fileExtension = strtolower(
    pathinfo($resume['name'], PATHINFO_EXTENSION)
);

if (!in_array($fileExtension, $allowedExtensions, true)) {
    exit('Only PDF, DOC or DOCX files are allowed.');
}


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

$safeCountry = htmlspecialchars(
    $country,
    ENT_QUOTES,
    'UTF-8'
);

$safeArea = htmlspecialchars(
    $areaOfInterest,
    ENT_QUOTES,
    'UTF-8'
);

$safeMessage = nl2br(
    htmlspecialchars(
        $message ?: 'Not specified',
        ENT_QUOTES,
        'UTF-8'
    )
);

$safeFileName = htmlspecialchars(
    $resume['name'],
    ENT_QUOTES,
    'UTF-8'
);


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
     * Use your NEW Gmail App Password here.
     */
    $mail->Password = 'qekv gtlt hwdk tczx';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->Port = 587;


    // --------------------------------------------------
    // FROM
    // --------------------------------------------------

    $mail->setFrom(
        'sumitkumarstk7055@gmail.com',
        'Voyage 1 Careers'
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
    // REPLY TO
    // --------------------------------------------------

    $mail->addReplyTo(
        $email,
        $firstName . ' ' . $lastName
    );


    // --------------------------------------------------
    // EMAIL
    // --------------------------------------------------

    $mail->isHTML(true);

    $mail->CharSet = 'UTF-8';

    $mail->Subject =
        'New Career Application — Voyage 1';


    // --------------------------------------------------
    // EMAIL BODY
    // --------------------------------------------------

    $mail->Body = '

    <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 750px;
        margin: 0 auto;
        background: #ffffff;
        color: #222222;
        border: 1px solid #dddddd;
    ">

        <div style="
            background: #111111;
            color: #ffffff;
            padding: 25px;
        ">

            <h2 style="
                margin: 0 0 8px 0;
                font-size: 24px;
            ">
                Voyage 1 DMC
            </h2>

            <div style="
                font-size: 14px;
            ">
                New Career Application
            </div>

        </div>


        <div style="padding: 30px;">

            <p style="
                font-size: 16px;
                margin-top: 0;
            ">
                A new career application has been received
                from the Voyage 1 website.
            </p>


            <table
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="
                    border-collapse: collapse;
                    margin-top: 25px;
                    font-size: 14px;
                "
            >

                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                        width: 35%;
                    ">
                        First Name
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safeFirstName . '
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Last Name
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safeLastName . '
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Email
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        <a href="mailto:' . $safeEmail . '">
                            ' . $safeEmail . '
                        </a>
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Phone / WhatsApp
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safePhone . '
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Country
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safeCountry . '
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Area of Interest
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safeArea . '
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Resume
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safeFileName . '
                    </td>
                </tr>


                <tr>
                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                        background: #f7f7f7;
                        font-weight: bold;
                    ">
                        Short Note
                    </td>

                    <td style="
                        border: 1px solid #dddddd;
                        padding: 12px;
                    ">
                        ' . $safeMessage . '
                    </td>
                </tr>

            </table>


            <p style="
                margin-top: 30px;
                font-size: 12px;
                color: #777777;
            ">
                This application was submitted from the
                Voyage 1 DMC Careers page.
            </p>

        </div>

    </div>

    ';


    // --------------------------------------------------
    // PLAIN TEXT
    // --------------------------------------------------

    $mail->AltBody =
        "New Career Application — Voyage 1\n\n" .
        "First Name: $firstName\n" .
        "Last Name: $lastName\n" .
        "Email: $email\n" .
        "Phone / WhatsApp: $phone\n" .
        "Country: $country\n" .
        "Area of Interest: $areaOfInterest\n" .
        "Resume: " . $resume['name'] . "\n\n" .
        "Short Note:\n$message";


    // --------------------------------------------------
    // ATTACH RESUME
    // --------------------------------------------------

    $mail->addAttachment(
        $resume['tmp_name'],
        $resume['name']
    );


    // --------------------------------------------------
    // SEND
    // --------------------------------------------------

    $mail->send();


    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    echo 'success';
    exit;


} catch (Exception $e) {

    http_response_code(500);

    echo 'Email could not be sent. Please try again later.';

    exit;
}
?>