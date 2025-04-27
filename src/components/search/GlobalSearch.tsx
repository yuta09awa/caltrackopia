
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngredientSearch } from '@/hooks/useIngredientSearch';

interface GlobalSearchProps {
  className?: string;
  onSelectIngredient?: (ingredient: any) => void;
  compact?: boolean;
}

const GlobalSearch = ({ className, onSelectIngredient, compact = false }: GlobalSearchProps) => {
  const { searchIngredients, loading } = useIngredientSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.length >= 2) {
      searchIngredients(query);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search ingredients, restaurants, dishes..."
          className={cn(
            "w-full pl-9 pr-4",
            compact ? "h-9 text-sm" : "h-10"
          )}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
