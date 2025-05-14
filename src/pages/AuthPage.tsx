
import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm" className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/0b3bf1b1-20e6-4b84-a220-f978cdf6b783.png" 
            alt="Logo" 
            className="h-16 w-auto mx-auto mb-4" 
          />
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
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
            <TabsContent value="login" className="mt-0">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-0">
              <RegisterForm />
            </TabsContent>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AuthPage;
