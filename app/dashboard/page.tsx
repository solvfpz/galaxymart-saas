'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();
    
    // Polling every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 h-80 bg-muted rounded-xl" />
            <div className="col-span-3 h-80 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const { stats, charts, latestOrders, topProducts } = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your store's performance metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.revenueGrowth >= 0 ? '+' : ''}{stats?.revenueGrowth?.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.totalOrders || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.ordersGrowth >= 0 ? '+' : ''}{stats?.ordersGrowth?.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products Count</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || '0'}</div>
            <p className="text-xs text-muted-foreground">{stats?.activeProducts || '0'} active products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.last7Days || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#18181b" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Orders Activity</CardTitle>
            <CardDescription>Order volume over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.last7Days || []}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
            <CardDescription>Recent transactions from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestOrders?.length > 0 ? latestOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.customerEmail}</p>
                      <p className="text-xs text-muted-foreground">Order #{order.paymentId}</p>
                    </div>
                  </div>
                  <div className="font-medium">+${order.usdAmount?.toFixed(2)}</div>
                </div>
              )) : (
                <div className="py-4 text-center text-sm text-muted-foreground">No orders found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts?.length > 0 ? topProducts.map((product: any) => (
                <div key={product._id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.salesCount} sales</p>
                  </div>
                  <div className="font-medium">${product.totalRevenue?.toFixed(2)}</div>
                </div>
              )) : (
                <div className="py-4 text-center text-sm text-muted-foreground">No data available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
