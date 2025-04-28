<?php

header("Access-Control-Allow-Origin: *");

$anon_id = hash('sha256', date('Ymd') . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);

echo json_encode([
    'anon_id' => $anon_id
]);