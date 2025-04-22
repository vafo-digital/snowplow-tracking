<?php

function uuid() {
    
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

        // 32 bits for "time_low"
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),

        // 16 bits for "time_mid"
        mt_rand(0, 0xffff),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand(0, 0x0fff) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand(0, 0x3fff) | 0x8000,

        // 48 bits for "node"
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)

    );
}

$sp = $_COOKIE['sp'] ?? null;
$spIdService = $_COOKIE['spIdService'] ?? null;

/* bumpExpiry is a placeholder method that returns the expiration time you require the network_userid to persist. */
$expiration = time() + 60 * 60 * 24 * 365; // 1 year
$networkUserId = $sp ?? $spIdService ?? uuid();

/* In this example the domain will be the eTLD+1 of the website. */
$domain = 'localhost';

/* 
* The cookie header attributes should have exactly the same values as the ones set on the collector configuration.
*/
$cookie_options = array(
    'expires' => $expiration,
    'path' => '/',
    'domain' => $domain,
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None',
);
setcookie('sp', $networkUserId, $cookie_options);
setcookie('spIdService', $networkUserId, $cookie_options);

/* The response needs to return a 200 (OK) status code but any response payload is not necessary. */
echo json_encode([
    'Ok' => 200,
    'CookieId' => $networkUserId,
    'Expiration' => $expiration
]);