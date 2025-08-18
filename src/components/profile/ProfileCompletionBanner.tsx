import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthWrapper';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionData {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
}

export const ProfileCompletionBanner: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [completionData, setCompletionData] = useState<ProfileCompletionData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsVisible(false);
      return;
    }

    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem(`profile-banner-dismissed-${user.id}`);
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    checkProfileCompletion();
  }, [user]);

  const checkProfileCompletion = async () => {
    if (!user) return;

    try {
      // Get profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, dietary_restrictions, nutrition_goals, location_address')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!profile) return;

      // Calculate completion
      const requiredFields = [
        { key: 'first_name', label: 'First Name', value: profile.first_name },
        { key: 'last_name', label: 'Last Name', value: profile.last_name },
        { key: 'dietary_restrictions', label: 'Dietary Preferences', value: profile.dietary_restrictions },
        { key: 'nutrition_goals', label: 'Nutrition Goals', value: profile.nutrition_goals },
        { key: 'location_address', label: 'Location', value: profile.location_address }
      ];

      const completedFields = requiredFields.filter(field => {
        if (Array.isArray(field.value)) {
          return field.value.length > 0;
        }
        return field.value && field.value.trim() !== '';
      });

      const missingFields = requiredFields
        .filter(field => !completedFields.includes(field))
        .map(field => field.label);

      const completionPercentage = (completedFields.length / requiredFields.length) * 100;
      const isComplete = completionPercentage === 100;

      setCompletionData({
        isComplete,
        completionPercentage,
        missingFields
      });

      setIsVisible(!isComplete && !isDismissed);
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
  };

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`profile-banner-dismissed-${user.id}`, 'true');
    }
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  if (!isVisible || !completionData || completionData.isComplete) {
    return null;
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-start gap-3">
        <User className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
        
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
              Complete Your Profile
            </h4>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Get personalized food recommendations by completing your profile.
              {completionData.missingFields.length > 0 && (
                <span className="block mt-1">
                  Missing: {completionData.missingFields.join(', ')}
                </span>
              )}
            </AlertDescription>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 dark:text-amber-300">
                {Math.round(completionData.completionPercentage)}% complete
              </span>
              {completionData.completionPercentage === 100 && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Progress 
              value={completionData.completionPercentage} 
              className="h-2 bg-amber-100 dark:bg-amber-900"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleCompleteProfile}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Complete Profile
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="ghost" 
              size="sm"
              className="text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
            >
              Dismiss
            </Button>
          </div>
        </div>

        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};