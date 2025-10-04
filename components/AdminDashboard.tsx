import React, { useState, useMemo } from 'react';
import { useItems } from '../contexts/ItemsContext';
import { useOrders } from '../contexts/OrderContext';
import { GlossaryItem, Order, User } from '../types';
import ItemFormModal from './ItemFormModal';
import ConfirmationModal from './ConfirmationModal';
import ShippingDetailsModal from './ShippingDetailsModal';
import AnalyticsDashboard from './AnalyticsDashboard';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { CubeIcon } from './icons/CubeIcon';
import { TagIcon } from './icons/TagIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { Bars3Icon } from './icons/Bars3Icon';
import { useToasts } from '../contexts/ToastContext';
import { KeyIcon } from './icons/KeyIcon';
import ChangePasswordModal from './ChangePasswordModal';


type AdminPage = 'items' | 'categories' | 'orders' | 'analytics' | 'admins';

const AdminDashboard: React.FC = () => {
    const { items, categories, addItem, updateItem, deleteItem, addCategory, updateCategory, deleteCategory } = useItems();
    const { orders, updateOrderStatus } = useOrders();
    const { logout, users, addAdmin, updateAdmin, removeAdmin, currentUser } = useAuth();
    
    const [activePage, setActivePage] = useState<AdminPage>('items');
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isShippingModalOpen, setShippingModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GlossaryItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [orderToShow, setOrderToShow] = useState<Order | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleAddItem = () => {
        setSelectedItem(null);
        setItemModalOpen(true);
    };

    const handleEditItem = (item: GlossaryItem) => {
        setSelectedItem(item);
        setItemModalOpen(true);
    };

    const handleSaveItem = (itemData: GlossaryItem | Omit<GlossaryItem, 'id'>) => {
        if ('id' in itemData) {
            updateItem(itemData);
        } else {
            addItem(itemData);
        }
        setItemModalOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        setItemToDelete(id);
        setConfirmModalOpen(true);
    };

    const confirmDeleteItem = () => {
        if (itemToDelete) {
            deleteItem(itemToDelete);
        }
        setConfirmModalOpen(false);
        setItemToDelete(null);
    };
    
    const showShippingDetails = (order: Order) => {
        setOrderToShow(order);
        setShippingModalOpen(true);
    };
    
    const renderContent = () => {
        switch (activePage) {
            case 'items':
                return <ItemManagement items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />;
            case 'categories':
                return <CategoryManagement categories={categories} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />;
            case 'orders':
                return <OrderManagement orders={orders} onStatusChange={updateOrderStatus} onShowShipping={showShippingDetails} />;
            case 'analytics':
                 return <AnalyticsDashboard />;
            case 'admins':
                 return <AdminManagement 
                            admins={users.filter(u => u.role === 'admin')} 
                            onAddAdmin={addAdmin}
                            onUpdateAdmin={updateAdmin}
                            onRemoveAdmin={removeAdmin}
                            currentUser={currentUser}
                        />;
            default:
                return null;
        }
    };

    const navItems: { id: AdminPage; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
        { id: 'items', label: 'Manage Items', icon: CubeIcon },
        { id: 'categories', label: 'Manage Categories', icon: TagIcon },
        { id: 'orders', label: 'View Orders', icon: DocumentTextIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
        { id: 'admins', label: 'Manage Admins', icon: ShieldCheckIcon },
    ];

    const handleNavClick = (page: AdminPage) => {
        setActivePage(page);
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:flex md:flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <span className="text-2xl font-bold">Admin Panel</span>
                    <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-2 space-y-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors ${activePage === item.id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                           <item.icon className="w-5 h-5" /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-2 border-t border-gray-700">
                     <button onClick={() => { setPasswordModalOpen(true); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors hover:bg-gray-700 mb-2">
                        <KeyIcon className="w-5 h-5" /> Change Password
                    </button>
                    <button onClick={logout} className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </aside>

            <div className="md:ml-64 flex flex-col min-h-screen">
                 <header className="md:hidden bg-white shadow-md sticky top-0 z-30 flex items-center justify-between p-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800" aria-label="Open sidebar">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 capitalize">{activePage.replace('-', ' ')}</h1>
                    <div className="w-6 h-6"></div>
                </header>

                <main className="flex-1 p-6 lg:p-10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="hidden md:block text-3xl font-bold text-gray-800 capitalize">{activePage.replace('-', ' ')}</h1>
                        {activePage === 'items' && (
                            <button onClick={handleAddItem} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 ml-auto">
                                <PlusIcon className="w-5 h-5" /> Add Item
                            </button>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {renderContent()}
                    </div>
                </main>
            </div>
            
            <ItemFormModal isOpen={isItemModalOpen} onClose={() => setItemModalOpen(false)} onSave={handleSaveItem} item={selectedItem} categories={categories} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDeleteItem} title="Delete Item" message="Are you sure you want to delete this item? This action cannot be undone." />
            <ShippingDetailsModal isOpen={isShippingModalOpen} onClose={() => setShippingModalOpen(false)} order={orderToShow} />
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} />
        </div>
    );
};

const AdminManagement: React.FC<{
    admins: User[];
    currentUser: User | null;
    onAddAdmin: (username?: string, password?: string) => { success: boolean, message?: string };
    onUpdateAdmin: (id: string, newUsername: string, newPassword?: string) => { success: boolean, message?: string };
    onRemoveAdmin: (id: string) => { success: boolean, message?: string };
}> = ({ admins, currentUser, onAddAdmin, onUpdateAdmin, onRemoveAdmin }) => {
    const { showToast } = useToasts();

    const [addUsername, setAddUsername] = useState('');
    const [addPassword, setAddPassword] = useState('');
    const [addError, setAddError] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editError, setEditError] = useState('');

    const [deletingAdmin, setDeletingAdmin] = useState<User | null>(null);

    const handleAddAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        setAddError('');
        if (!addUsername || !addPassword) {
            setAddError('Username and password are required.');
            return;
        }
        const result = onAddAdmin(addUsername, addPassword);
        if (result.success) {
            setAddUsername('');
            setAddPassword('');
            showToast('Admin added successfully!', 'success');
        } else {
            setAddError(result.message || 'Failed to add admin.');
        }
    };

    const handleEditClick = (admin: User) => {
        setEditingId(admin.id);
        setEditUsername(admin.username);
        setEditPassword('');
        setEditError('');
    };

    const handleCancelEdit = () => setEditingId(null);

    const handleSaveEdit = (id: string) => {
        setEditError('');
        const result = onUpdateAdmin(id, editUsername, editPassword);
        if (result.success) {
            setEditingId(null);
            showToast('Admin updated successfully', 'success');
        } else {
            setEditError(result.message || 'Failed to update admin.');
        }
    };

    const confirmRemove = () => {
        if (deletingAdmin) {
            const result = onRemoveAdmin(deletingAdmin.id);
            if (result.success) {
                showToast(`Admin ${deletingAdmin.username} removed.`, 'success');
            } else {
                showToast(result.message || 'Failed to remove admin.', 'error');
            }
            setDeletingAdmin(null);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-lg bg-gray-50">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">New Admin Username</label>
                    <input type="text" value={addUsername} onChange={e => setAddUsername(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300" />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={addPassword} onChange={e => setAddPassword(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300" />
                </div>
                <div className="md:col-span-1">
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5" /> Add Admin
                    </button>
                </div>
                {addError && <p className="text-red-500 text-xs mt-1 md:col-span-3">{addError}</p>}
            </form>

            <div>
                <h3 className="text-lg font-semibold mb-2">Current Admins</h3>
                <ul className="divide-y divide-gray-200">
                    {admins.map(admin => (
                        <li key={admin.id} className="py-3 px-2">
                            {editingId === admin.id ? (
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-2 items-start">
                                        <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} className="border p-1 rounded-md w-full sm:w-auto flex-1" placeholder="Username" />
                                        <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} className="border p-1 rounded-md w-full sm:w-auto flex-1" placeholder="New Password (optional)" />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSaveEdit(admin.id)} className="text-green-600 p-1 rounded hover:bg-green-100"><CheckIcon className="w-5 h-5"/></button>
                                            <button onClick={handleCancelEdit} className="text-gray-600 p-1 rounded hover:bg-gray-100"><XMarkIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                    {editError && <p className="text-red-500 text-xs mt-1">{editError}</p>}
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">{admin.username} {admin.id === currentUser?.id && '(You)'}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditClick(admin)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => setDeletingAdmin(admin)} disabled={admin.id === currentUser?.id} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <ConfirmationModal isOpen={!!deletingAdmin} onClose={() => setDeletingAdmin(null)} onConfirm={confirmRemove} title="Remove Admin" message={`Are you sure you want to remove ${deletingAdmin?.username}? This action cannot be undone.`} />
        </div>
    );
};

const ItemManagement: React.FC<{ items: GlossaryItem[], onEdit: (item: GlossaryItem) => void, onDelete: (id: string) => void }> = ({ items, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {items.map(item => (
                    <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{item.name}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{item.category}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const CategoryManagement: React.FC<{ 
    categories: string[], 
    addCategory: (c: string) => { success: boolean, message?: string }, 
    updateCategory: (old: string, newName: string) => { success: boolean, message?: string },
    deleteCategory: (c: string) => void 
}> = ({ categories, addCategory, updateCategory, deleteCategory }) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ oldName: string, newName: string } | null>(null);

    const handleAddCategory = () => {
        const result = addCategory(newCategory);
        if (result.success) {
            setNewCategory('');
        } else {
            alert(result.message);
        }
    };
    
    const handleUpdateCategory = () => {
        if(editingCategory) {
            const result = updateCategory(editingCategory.oldName, editingCategory.newName);
            if(result.success) {
                setEditingCategory(null);
            } else {
                alert(result.message);
            }
        }
    };
    
    return (
        <div>
            <div className="flex gap-2 mb-4">
                <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="border p-2 rounded-md flex-1" />
                <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded-md">Add</button>
            </div>
            <ul className="space-y-2">
                {categories.map(cat => (
                    <li key={cat} className="flex justify-between items-center p-2 border rounded-md">
                       {editingCategory?.oldName === cat ? (
                            <input 
                                type="text"
                                value={editingCategory.newName}
                                onChange={e => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                className="border p-1 rounded-md flex-1"
                            />
                       ) : (
                           <span>{cat}</span>
                       )}
                        <div className="flex gap-2">
                            {editingCategory?.oldName === cat ? (
                                <>
                                    <button onClick={handleUpdateCategory} className="text-green-600"><CheckIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setEditingCategory(null)} className="text-gray-600"><XMarkIcon className="w-5 h-5"/></button>
                                </>
                            ) : (
                                <button onClick={() => setEditingCategory({ oldName: cat, newName: cat })} className="text-indigo-600"><PencilIcon className="w-5 h-5"/></button>
                            )}
                            <button onClick={() => deleteCategory(cat)} className="text-red-600"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const OrderManagement: React.FC<{ orders: Order[], onStatusChange: (id: string, status: Order['status']) => void, onShowShipping: (order: Order) => void }> = ({ orders, onStatusChange, onShowShipping }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredOrders = useMemo(() => orders.filter(o => o.id.includes(searchTerm) || o.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())), [orders, searchTerm]);
    
    return (
        <div>
            <div className="relative mb-4">
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by Order ID or Name" className="w-full pl-10 pr-4 py-2 border rounded-md" />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select value={order.status} onChange={e => onStatusChange(order.id, e.target.value as Order['status'])} className="p-1 border rounded-md text-sm">
                                    <option value="Pending">Pending</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onShowShipping(order)} className="text-blue-600 hover:underline">View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

// Dummy icons for placeholders
const CubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25v9.75" />
    </svg>
);
const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);
const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);


export default AdminDashboard;