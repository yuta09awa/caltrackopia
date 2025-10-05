
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCartConflictResolution } from "@/hooks/useCartConflictResolution";
import { ConflictMode } from "@/types/cartConflict";

interface EnhancedCartConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string;
  newLocationName: string;
  itemName: string;
}

const EnhancedCartConflictDialog = ({
  isOpen,
  onClose,
  currentLocationName,
  newLocationName,
  itemName,
}: EnhancedCartConflictDialogProps) => {
  const { handleConflictAction, setUserConflictPreference } = useCartConflictResolution();
  const [selectedMode, setSelectedMode] = useState<ConflictMode>('replace');
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleConfirm = () => {
    if (rememberChoice) {
      setUserConflictPreference(selectedMode, true);
    }
    
    handleConflictAction({ type: selectedMode });
    onClose();
  };

  const handleCancel = () => {
    handleConflictAction({ type: 'cancel' });
    onClose();
  };

  const handleRememberChoiceChange = (checked: boolean | "indeterminate") => {
    setRememberChoice(checked === true);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Cart Conflict Detected</AlertDialogTitle>
          <AlertDialogDescription>
            Your cart contains items from <strong>{currentLocationName}</strong>.
            How would you like to handle adding "<strong>{itemName}</strong>" from <strong>{newLocationName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedMode} onValueChange={(value) => setSelectedMode(value as ConflictMode)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="replace" id="replace" />
              <Label htmlFor="replace" className="flex-1">
                <div className="font-medium">Replace Cart</div>
                <div className="text-sm text-muted-foreground">
                  Clear current items and start fresh with the new location
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="separate" id="separate" />
              <Label htmlFor="separate" className="flex-1">
                <div className="font-medium">Keep Separate</div>
                <div className="text-sm text-muted-foreground">
                  Add items from both locations in separate groups
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="merge" id="merge" />
              <Label htmlFor="merge" className="flex-1">
                <div className="font-medium">Merge Locations</div>
                <div className="text-sm text-muted-foreground">
                  Move all items to the new location and combine them
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex items-center space-x-2 pt-2 border-t">
            <Checkbox 
              id="remember" 
              checked={rememberChoice}
              onCheckedChange={handleRememberChoiceChange}
            />
            <Label htmlFor="remember" className="text-sm">
              Remember my choice for future conflicts
            </Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {selectedMode === 'replace' && 'Replace Cart'}
            {selectedMode === 'separate' && 'Keep Separate'}
            {selectedMode === 'merge' && 'Merge Items'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EnhancedCartConflictDialog;
