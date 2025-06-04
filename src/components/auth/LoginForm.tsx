
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthService } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { setUser, setAuthLoading, setAuthError } = useAppStore();
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (authData.user) {
        const profileData = await AuthService.fetchUserProfile(authData.user.id);
        const user = await AuthService.transformSupabaseUserToUser(authData.user, profileData);
        setUser(user);
        
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setAuthError(err.message || "An unexpected error occurred.");
      toast({
        title: "Login failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to reset password.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset_password=true`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsResetEmailSent(true);
      toast({
        title: "Password reset email sent!",
        description: "Check your inbox for reset instructions.",
      });
    } catch (err: any) {
      console.error("Password reset error:", err);
      toast({
        title: "Reset failed",
        description: err.message || "Failed to send reset email.",
        variant: "destructive",
      });
    }
  };

  if (isResetEmailSent) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We've sent you a password reset link. Please check your email and follow the instructions.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsResetEmailSent(false)}
          className="w-full"
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="px-0 h-auto"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
