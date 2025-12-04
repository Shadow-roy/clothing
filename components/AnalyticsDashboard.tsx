import React, { useMemo } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { useItems } from '../contexts/ItemsContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { CurrencyRupeeIcon } from './icons/CurrencyRupeeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';

// Sub-components for AnalyticsDashboard

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center space-x-4 border border-gray-200 dark:border-gray-700">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const SalesChart: React.FC<{ data: { date: string, sales: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.sales));
    const chartHeight = 200; // in px

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Sales in Last 7 Days</h3>
            <div className="flex justify-around items-end h-52 border-l border-b border-gray-200 dark:border-gray-700 pl-4 pb-4">
                {data.map(({ date, sales }) => (
                    <div key={date} className="flex flex-col items-center w-1/8 h-full justify-end">
                        <div 
                            className="bg-blue-500 w-8 hover:bg-blue-600 transition-colors rounded-t-sm"
                            style={{ height: `${maxValue > 0 ? (sales / maxValue) * chartHeight : 0}px` }}
                            title={`₹${sales.toFixed(2)}`}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface TopProduct {
    id: string;
    name: string;
    imageURL: string;
    unitsSold: number;
    revenue: number;
}

const TopProducts: React.FC<{ products: TopProduct[] }> = ({ products }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Top Selling Products</h3>
        <ul className="space-y-4">
            {products.map((product, index) => (
                <li key={product.id} className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-6">{index + 1}</span>
                    <img src={product.imageURL} alt={product.name} className="w-12 h-12 rounded-md object-cover"/>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.unitsSold} units sold</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">₹{product.revenue.toFixed(2)}</p>
                </li>
            ))}
        </ul>
    </div>
);

interface CategorySales {
    name: string;
    revenue: number;
}

const TopCategories: React.FC<{ categories: CategorySales[] }> = ({ categories }) => {
    const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Revenue by Category</h3>
            <ul className="space-y-3">
                {categories.map(cat => (
                    <li key={cat.name}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">₹{cat.revenue.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0}%` }}></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AnalyticsDashboard: React.FC = () => {
    const { orders } = useOrders();
    const { items } = useItems();
    
    const analyticsData = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalCustomers = new Set(orders.map(o => o.customer.phone)).size;
        
        // Sales over last 7 days
        const salesByDate: { [date: string]: number } = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            salesByDate[d.toISOString().split('T')[0]] = 0;
        }

        orders.forEach(order => {
            const orderDate = new Date(order.date).toISOString().split('T')[0];
            if (salesByDate.hasOwnProperty(orderDate)) {
                salesByDate[orderDate] += order.total;
            }
        });
        
        const salesChartData = Object.entries(salesByDate).map(([date, sales]) => ({ date, sales }));
        
        // Top Products
        const productSales: { [id: string]: { unitsSold: number; revenue: number } } = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.id]) {
                    productSales[item.id] = { unitsSold: 0, revenue: 0 };
                }
                productSales[item.id].unitsSold += item.quantity;
                productSales[item.id].revenue += item.quantity * item.price;
            });
        });
        
        const topProductsData: TopProduct[] = Object.entries(productSales)
            .map(([id, data]) => {
                const productInfo = items.find(p => p.id === id);
                return {
                    id,
                    name: productInfo?.name || 'Unknown Product',
                    imageURL: productInfo?.imageURL || '',
                    ...data,
                };
            })
            .sort((a, b) => b.unitsSold - a.unitsSold)
            .slice(0, 5);

        // Top Categories
        const categorySales: { [name: string]: number } = {};
         orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.category;
                if (!categorySales[category]) {
                    categorySales[category] = 0;
                }
                categorySales[category] += item.quantity * item.price;
            });
        });

        const topCategoriesData = Object.entries(categorySales)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
            
        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            salesChartData,
            topProductsData,
            topCategoriesData
        };

    }, [orders, items]);

    if (orders.length === 0) {
        return (
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Analytics Dashboard</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">No order data available to display analytics.</p>
            </div>
        );
    }
      
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${analyticsData.totalRevenue.toFixed(2)}`} icon={<CurrencyRupeeIcon className="w-6 h-6"/>} />
                <StatCard title="Total Orders" value={analyticsData.totalOrders.toString()} icon={<ShoppingCartIcon className="w-6 h-6"/>} />
                <StatCard title="Total Customers" value={analyticsData.totalCustomers.toString()} icon={<UsersIcon className="w-6 h-6"/>} />
                <StatCard title="Avg. Order Value" value={analyticsData.totalOrders > 0 ? `₹${(analyticsData.totalRevenue / analyticsData.totalOrders).toFixed(2)}` : `₹0.00`} icon={<ArrowTrendingUpIcon className="w-6 h-6"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <SalesChart data={analyticsData.salesChartData} />
                </div>
                <div className="lg:col-span-2">
                    <TopProducts products={analyticsData.topProductsData} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                 <TopCategories categories={analyticsData.topCategoriesData} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;