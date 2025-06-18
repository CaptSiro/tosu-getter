<?php

require_once __DIR__ . "/paths.php";
require_once __DIR__ . "/lib.php";



class Audio implements GetEventHandler {
    public function couldNotCreateTemporaryFile(): void {
        exit(json_encode(["error" => "Could not create temporary file"]));
    }

    public function locationOccupied(string $location, $data): void {
        exit(json_encode(["error" => "Audio '$location' already exists"]));
    }

    public function created(string $location): void {
        exit(json_encode(["message" => "Saved '$location' audio file"]));
    }
}



get(DIRECTORY_AUDIO, new Audio());