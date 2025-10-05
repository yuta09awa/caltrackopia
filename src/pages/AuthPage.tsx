
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import UserTypeSelection from "@/components/auth/UserTypeSelection";
import CustomerRegisterForm from "@/components/auth/CustomerRegisterForm";
import RestaurantRegisterForm from "@/components/auth/RestaurantRegisterForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppStore } from "@/app/store";
import { toast } from "@/hooks/use-toast";

type UserType = 'customer' | 'restaurant_owner';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAppStore();

  useEffect(() => {
    // Redirect authenticated users
    if (user) {
      navigate("/");
      return;
    }

    // Check for email verification
    if (searchParams.get("verified") === "true") {
      toast({
        title: "Email verified!",
        description: "Your account has been verified. You can now log in.",
      });
    }

    // Check for password reset
    if (searchParams.get("reset_password") === "true") {
      toast({
        title: "Password reset",
        description: "Please enter your new password.",
      });
    }
  }, [user, navigate, searchParams]);

  const handleUserTypeSelection = (type: UserType) => {
    setSelectedUserType(type);
    setActiveTab("register");
  };

  const handleRegistrationSuccess = () => {
    setActiveTab("login");
    setSelectedUserType(null);
  };

  const handleBackToUserTypeSelection = () => {
    setSelectedUserType(null);
    setActiveTab("register");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm" className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-block hover:opacity-80 transition-opacity"
            aria-label="Go to home page"
          >
            <img 
              src="/lovable-uploads/0b3bf1b1-20e6-4b84-a220-f978cdf6b783.png" 
              alt="Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
          </Link>
          {activeTab === "login" && (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your account
              </p>
            </>
          )}
        </div>

        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                {!selectedUserType ? (
                  <UserTypeSelection onSelectType={handleUserTypeSelection} />
                ) : selectedUserType === 'customer' ? (
                  <CustomerRegisterForm 
                    onSuccess={handleRegistrationSuccess}
                    onBack={handleBackToUserTypeSelection}
                  />
                ) : (
                  <RestaurantRegisterForm 
                    onSuccess={handleRegistrationSuccess}
                    onBack={handleBackToUserTypeSelection}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AuthPage;
