
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';
import { User } from '@/models/User';

interface ProfileCompletionProgressProps {
  user: User;
}

const ProfileCompletionProgress: React.FC<ProfileCompletionProgressProps> = ({ user }) => {
  const steps = [
    {
      id: 'basic_info',
      label: 'Basic Information',
      completed: !!(user.profile.firstName && user.profile.lastName),
    },
    {
      id: 'contact',
      label: 'Contact Details',
      completed: !!(user.profile.phone),
    },
    {
      id: 'dietary',
      label: 'Dietary Preferences',
      completed: !!(user.preferences.dietaryRestrictions?.length),
    },
    {
      id: 'nutrition',
      label: 'Nutrition Goals',
      completed: !!(user.preferences.nutritionGoals?.length),
    },
    {
      id: 'location',
      label: 'Location Setup',
      completed: !!(user.preferences.location),
    },
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (progressPercentage === 100) {
    return null; // Don't show progress card when profile is complete
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-green-800">
                Complete Your Profile
              </h3>
              <span className="text-xs text-green-600">
                {completedSteps}/{steps.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-sm ${
                  step.completed ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-green-700">
            Complete your profile to get personalized restaurant recommendations and a better app experience!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionProgress;
