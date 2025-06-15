
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, User } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectType: (type: 'customer' | 'restaurant_owner') => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectType }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Join CalTrackopia</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose how you'd like to use our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">I'm looking for food</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Find restaurants, track nutrition, and discover healthy options near you.
            </p>
            <Button 
              onClick={() => onSelectType('customer')} 
              className="w-full"
              size="lg"
            >
              Continue as Customer
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">I own a restaurant</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              List your restaurant, manage menus, and connect with health-conscious customers.
            </p>
            <Button 
              onClick={() => onSelectType('restaurant_owner')} 
              className="w-full"
              size="lg"
              variant="outline"
            >
              Continue as Restaurant Owner
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserTypeSelection;
