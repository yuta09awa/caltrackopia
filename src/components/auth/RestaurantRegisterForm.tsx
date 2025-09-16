
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

const restaurantSchema = z.object({
  // Personal info
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  
  // Business info
  businessName: z.string().min(1, 'Business name is required'),
  businessEmail: z.string().email('Invalid business email').optional().or(z.literal('')),
  businessPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits'),
  cuisineType: z.string().min(1, 'Cuisine type is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

interface RestaurantRegisterFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const RestaurantRegisterForm: React.FC<RestaurantRegisterFormProps> = ({ onSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  });

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await AuthService.signUp(data.email, data.password, {
        userType: 'restaurant_owner',
        firstName: data.firstName,
        lastName: data.lastName,
        restaurant: {
          businessName: data.businessName,
          businessEmail: data.businessEmail || undefined,
          businessPhone: data.businessPhone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          cuisineType: [data.cuisineType],
          description: data.description || undefined,
          website: data.website || undefined,
        },
      });

      toast({
        title: "Registration successful!",
        description: "Your restaurant is pending verification. Please check your email.",
      });

      onSuccess();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Register Your Restaurant</h2>
        <p className="mt-2 text-sm text-gray-600">
          Join our platform and connect with health-conscious customers
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
          
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              {...register('businessName')}
              disabled={isLoading}
            />
            {errors.businessName && (
              <p className="text-sm text-red-600 mt-1">{errors.businessName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessEmail">Business Email (optional)</Label>
              <Input
                id="businessEmail"
                type="email"
                {...register('businessEmail')}
                disabled={isLoading}
              />
              {errors.businessEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.businessEmail.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                {...register('businessPhone')}
                disabled={isLoading}
              />
              {errors.businessPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.businessPhone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state')}
                disabled={isLoading}
              />
              {errors.state && (
                <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                disabled={isLoading}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cuisineType">Cuisine Type</Label>
              <Input
                id="cuisineType"
                placeholder="e.g., Italian, Chinese, American"
                {...register('cuisineType')}
                disabled={isLoading}
              />
              {errors.cuisineType && (
                <p className="text-sm text-red-600 mt-1">{errors.cuisineType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                placeholder="https://yourrestaurant.com"
                {...register('website')}
                disabled={isLoading}
              />
              {errors.website && (
                <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell customers about your restaurant..."
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Creating Account...' : 'Create Restaurant Account'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantRegisterForm;
