
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/app/store";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from "@/features/profile/components/ProfileInfo";
import OrderHistory from "@/features/profile/components/OrderHistory";
import PaymentMethods from "@/features/profile/components/PaymentMethods";

const ProfilePage: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAppStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  return (
    <Container className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>john.doe@example.com</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Member since: May 14, 2025
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="profile">
                <TabsContent value="profile">
                  <ProfileInfo />
                </TabsContent>
                <TabsContent value="orders">
                  <OrderHistory />
                </TabsContent>
                <TabsContent value="payment">
                  <PaymentMethods />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
