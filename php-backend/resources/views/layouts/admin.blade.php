<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Panel') - GalaxyMart</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f1f5f9; color: #1e293b; line-height: 1.6;
        }
        .navbar {
            background: #0f172a; color: #fff; padding: 1rem 2rem;
            display: flex; align-items: center; justify-content: space-between;
        }
        .navbar h1 { font-size: 1.25rem; font-weight: 600; }
        .navbar a { color: #94a3b8; text-decoration: none; font-size: 0.875rem; }
        .navbar a:hover { color: #fff; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem; }
        .card {
            background: #fff; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 1.5rem; margin-bottom: 1.5rem;
        }
        .card h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #0f172a; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th, td { text-align: left; padding: 0.75rem 0.5rem; border-bottom: 1px solid #e2e8f0; }
        th { font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
        .badge {
            display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px;
            font-size: 0.75rem; font-weight: 600;
        }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        .badge-danger { background: #fce4ec; color: #b71c1c; }
        .stat {
            text-align: center; padding: 1.5rem;
        }
        .stat-value { font-size: 2rem; font-weight: 700; color: #0f172a; }
        .stat-label { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }
        .address { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8rem; word-break: break-all; color: #475569; }
        .error-box {
            background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem;
            padding: 1rem; color: #991b1b; margin-bottom: 1.5rem;
        }
        .amount-positive { color: #16a34a; }
        .amount-negative { color: #dc2626; }
        .loading { text-align: center; padding: 2rem; color: #64748b; }
    </style>
</head>
<body>
    <nav class="navbar">
        <h1>GalaxyMart Admin</h1>
        <div>
            <a href="/admin/wallet">Wallet</a>
        </div>
    </nav>
    <div class="container">
        @yield('content')
    </div>
</body>
</html>
