<?php

use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables;

$app = new Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

$app->singleton(
    ConsoleKernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    ExceptionHandler::class,
    App\Exceptions\Handler::class
);

return $app;
