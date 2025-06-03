
import React from 'react';
import { Clock } from 'lucide-react';

interface SearchHistoryItem {
  id: string;
  name: string;
  category?: string;
  timestamp: number;
}

interface SearchHistoryProps {
  searchHistory: SearchHistoryItem[];
  onSelectItem: (item: SearchHistoryItem) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = React.memo(({ searchHistory, onSelectItem }) => {
  if (searchHistory.length === 0) return null;

  return (
    <div className="p-2">
      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Recent Searches</div>
      {searchHistory.slice(0, 5).map((item) => (
        <button
          key={`${item.id}-${item.timestamp}`}
          className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors flex items-center gap-3"
          onClick={() => onSelectItem(item)}
        >
          <div className="flex-shrink-0 text-muted-foreground">
            <Clock className="h-3 w-3" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{item.name}</div>
            {item.category && (
              <div className="text-xs text-muted-foreground capitalize">
                {item.category}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
});

SearchHistory.displayName = 'SearchHistory';

export default SearchHistory;
