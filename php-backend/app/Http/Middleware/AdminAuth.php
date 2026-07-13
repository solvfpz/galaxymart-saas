<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Simple HTTP Basic Authentication for the admin dashboard.
     *
     * Credentials are read from .env: ADMIN_USERNAME, ADMIN_PASSWORD
     * This avoids needing a full user database for a single admin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $username = config('app.admin_username');
        $password = config('app.admin_password');

        if ($request->getUser() !== $username || $request->getPassword() !== $password) {
            return response('Unauthorized', 401, [
                'WWW-Authenticate' => 'Basic realm="GalaxyMart Admin"',
            ]);
        }

        return $next($request);
    }
}
