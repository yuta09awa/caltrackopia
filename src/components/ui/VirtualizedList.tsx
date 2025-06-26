
import React, { memo, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Card, CardContent } from '@/components/ui/card';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, isHighlighted?: boolean) => React.ReactNode;
  selectedItemId?: string | null;
  getItemId: (item: T) => string;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  selectedItemId,
  getItemId,
  className = '',
  onScroll
}: VirtualizedListProps<T>) {
  const Row = memo(({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    const isHighlighted = selectedItemId === getItemId(item);
    
    return (
      <div style={style} className={isHighlighted ? 'bg-primary/10 border-primary/20' : ''}>
        {renderItem(item, index, isHighlighted)}
      </div>
    );
  });

  Row.displayName = 'VirtualizedRow';

  const handleScroll = useMemo(() => {
    if (!onScroll) return undefined;
    return ({ scrollTop }: { scrollTop: number }) => onScroll(scrollTop);
  }, [onScroll]);

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No items to display</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      className={className}
      onScroll={handleScroll}
    >
      {Row}
    </List>
  );
}

export default memo(VirtualizedList) as typeof VirtualizedList;
