
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

interface CartConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  currentLocationName: string;
  newLocationName: string;
  itemName: string;
}

const CartConflictDialog = ({
  isOpen,
  onClose,
  onReplace,
  currentLocationName,
  newLocationName,
  itemName,
}: CartConflictDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cart Conflict Detected</AlertDialogTitle>
          <AlertDialogDescription>
            Your cart currently contains items from <strong>{currentLocationName}</strong>.
            Adding "<strong>{itemName}</strong>" from <strong>{newLocationName}</strong> will 
            clear your current cart. Do you wish to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onReplace}>
            Clear Cart & Add Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CartConflictDialog;
