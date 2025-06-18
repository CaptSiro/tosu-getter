<?php

require_once __DIR__ . "/paths.php";
require_once __DIR__ . "/lib.php";



class Background implements GetEventHandler {
    public function couldNotCreateTemporaryFile(): void {
        exit(json_encode(["error" => "Could not create temporary file"]));
    }

    public function locationOccupied(string $location, $data): void {
        exit(json_encode(["error" => "Background '$location' already exists"]));
    }

    public function created(string $location): void {
        exit(json_encode(["message" => "Saved '$location' background file"]));
    }
}



get(DIRECTORY_BACKGROUND, new Background());