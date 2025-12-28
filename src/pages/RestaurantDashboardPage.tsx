import { useState } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Upload, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/store/useAuth';
import { AuthService } from '@/features/auth/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useRestaurantData,
  useRestaurantMenu,
  DashboardOverview,
  MenuItemsList,
  MenuItemEditor,
} from '@/features/restaurant-dashboard';
import type { MenuItem, MenuItemFormData } from '@/features/restaurant-dashboard';

// Placeholder components for Phase 3
const MenuUpload = () => (
  <div className="p-6 border rounded-lg bg-muted/10">
    <p className="text-muted-foreground">Menu Upload Content (Coming Soon)</p>
  </div>
);
const SettingsPanel = () => (
  <div className="p-6 border rounded-lg bg-muted/10">
    <p className="text-muted-foreground">Settings Content (Coming Soon)</p>
  </div>
);

export default function RestaurantDashboardPage() {
  const { setUser, setIsAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { restaurant, isLoading: restaurantLoading } = useRestaurantData();
  const { 
    menuItems, 
    stats, 
    isLoading: menuLoading,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    isCreating,
    isUpdating,
  } = useRestaurantMenu(restaurant?.id);

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(id);
    }
  };

  const handleSaveItem = async (data: MenuItemFormData) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, data);
    } else {
      await createMenuItem(data);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'upload', label: 'Upload Menu', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">Restaurant Portal</h1>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {restaurant?.business_name || 'Manage your business'}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="md:hidden p-4 border-b flex justify-between items-center bg-card">
          <h1 className="font-bold">Restaurant Portal</h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="overview" className="space-y-4 mt-0">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
              <DashboardOverview
                stats={stats}
                isLoading={restaurantLoading || menuLoading}
                onAddItem={handleAddItem}
                onUploadMenu={() => setActiveTab('upload')}
              />
            </TabsContent>
            
            <TabsContent value="menu" className="space-y-4 mt-0">
              <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
              <MenuItemsList
                menuItems={menuItems}
                isLoading={restaurantLoading || menuLoading}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onToggleAvailability={toggleAvailability}
                onAddNew={handleAddItem}
              />
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 mt-0">
              <h2 className="text-3xl font-bold tracking-tight">Upload Menu</h2>
              <MenuUpload />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-0">
              <h2 className="text-3xl font-bold tracking-tight">Restaurant Settings</h2>
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Menu Item Editor Dialog */}
      <MenuItemEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        item={editingItem}
        onSave={handleSaveItem}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
}
