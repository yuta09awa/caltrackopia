// ============= STANDARD LIST COMPONENTS =============

import React from 'react';
import { cn } from '@/lib/utils';
import { ListComponentProps, StandardComponentProps } from '@/types';
import { BaseComponent, LoadingWrapper } from './BaseComponent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Standard list component with virtualization support
 */
export interface StandardListProps<T = any> extends ListComponentProps<T> {
  variant?: 'default' | 'cards' | 'compact';
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadMoreText?: string;
  virtualized?: boolean;
  itemHeight?: number;
  containerHeight?: number;
}

export function StandardList<T = any>({
  items,
  keyExtractor = (_, index) => index.toString(),
  renderItem,
  emptyState,
  loadingState,
  onItemClick,
  variant = 'default',
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  showLoadMore = false,
  onLoadMore,
  hasMore = false,
  loadMoreText = 'Load More',
  virtualized = false,
  itemHeight = 60,
  containerHeight = 400,
  loading,
  error,
  disabled,
  className,
  testId,
}: StandardListProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredItems, setFilteredItems] = React.useState(items);

  React.useEffect(() => {
    if (searchQuery.trim()) {
      // Basic filtering - can be enhanced with more sophisticated search
      const filtered = items.filter((item, index) => {
        const key = keyExtractor(item, index);
        return key.toLowerCase().includes(searchQuery.toLowerCase()) ||
               JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery, keyExtractor]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const renderListItem = (item: T, index: number) => {
    const key = keyExtractor(item, index);
    const content = renderItem(item, index);

    const itemContent = (
      <div
        key={key}
        className={cn(
          'transition-colors',
          onItemClick && 'cursor-pointer hover:bg-accent/50',
          variant === 'compact' && 'py-1 px-2',
          variant === 'default' && 'py-2 px-3',
          variant === 'cards' && 'p-0'
        )}
        onClick={() => onItemClick?.(item, index)}
        data-testid={`${testId}-item-${key}`}
      >
        {content}
      </div>
    );

    if (variant === 'cards') {
      return (
        <Card key={key} className="mb-2">
          {itemContent}
        </Card>
      );
    }

    return itemContent;
  };

  const renderVirtualizedList = () => {
    // Simple virtualization - could be enhanced with react-window
    const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: Math.ceil(containerHeight / itemHeight) });
    const scrollElementRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = React.useCallback(() => {
      if (!scrollElementRef.current) return;

      const scrollTop = scrollElementRef.current.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const end = start + Math.ceil(containerHeight / itemHeight) + 1;

      setVisibleRange({ start: Math.max(0, start), end: Math.min(filteredItems.length, end) });
    }, [itemHeight, containerHeight, filteredItems.length]);

    const visibleItems = filteredItems.slice(visibleRange.start, visibleRange.end);
    const totalHeight = filteredItems.length * itemHeight;
    const offsetY = visibleRange.start * itemHeight;

    return (
      <div
        ref={scrollElementRef}
        style={{ height: containerHeight, overflowY: 'auto' }}
        onScroll={handleScroll}
        className="relative"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) => renderListItem(item, visibleRange.start + index))}
          </div>
        </div>
      </div>
    );
  };

  const renderRegularList = () => (
    <div className={cn('space-y-1', variant === 'cards' && 'space-y-2')}>
      {filteredItems.map((item, index) => renderListItem(item, index))}
    </div>
  );

  return (
    <BaseComponent
      className={className}
      loading={loading}
      error={error}
      disabled={disabled}
      testId={testId}
    >
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            disabled={disabled}
          />
        </div>
      )}

      <LoadingWrapper loading={loading} fallback={loadingState}>
        {filteredItems.length === 0 ? (
          emptyState || (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items found</p>
            </div>
          )
        ) : (
          <>
            {virtualized ? renderVirtualizedList() : renderRegularList()}
            
            {showLoadMore && hasMore && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={loading || disabled}
                >
                  <LoadingWrapper loading={loading} size="sm">
                    {loadMoreText}
                  </LoadingWrapper>
                </Button>
              </div>
            )}
          </>
        )}
      </LoadingWrapper>
    </BaseComponent>
  );
}

/**
 * Standard data table component
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface StandardTableProps<T = any> extends StandardComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  showHeader?: boolean;
  striped?: boolean;
  hover?: boolean;
}

export function StandardTable<T = any>({
  data,
  columns,
  keyExtractor = (_, index) => index.toString(),
  onRowClick,
  sortBy,
  sortDirection = 'asc',
  onSort,
  showHeader = true,
  striped = false,
  hover = true,
  loading,
  error,
  disabled,
  className,
  testId,
}: StandardTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    const newDirection = sortBy === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const getCellValue = (item: T, column: TableColumn<T>, index: number) => {
    const value = (item as any)[column.key];
    return column.render ? column.render(value, item, index) : value;
  };

  return (
    <BaseComponent
      className={className}
      loading={loading}
      error={error}
      disabled={disabled}
      testId={testId}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {showHeader && (
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{ width: column.width }}
                    className={cn(
                      'py-2 px-3 text-left font-medium text-muted-foreground',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:text-foreground select-none'
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.title}
                      {column.sortable && sortBy === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className={cn(
                  'border-b',
                  striped && index % 2 === 1 && 'bg-accent/20',
                  hover && 'hover:bg-accent/40',
                  onRowClick && 'cursor-pointer',
                  disabled && 'opacity-50'
                )}
                onClick={() => onRowClick?.(item, index)}
                data-testid={`${testId}-row-${index}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'py-2 px-3',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {getCellValue(item, column, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </div>
    </BaseComponent>
  );
}