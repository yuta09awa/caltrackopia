
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface IndexingStrategy {
  table: string;
  columns: string[];
  type: 'btree' | 'gin' | 'gist' | 'hash';
  condition?: string;
}

export interface QueryOptimization {
  operation: string;
  table: string;
  estimatedRows: number;
  executionTime: number;
  indexUsed: boolean;
  suggestions: string[];
}

export class DatabaseOptimizationService {
  private indexingStrategies: IndexingStrategy[] = [
    // Location-based queries optimization
    {
      table: 'cached_places',
      columns: ['latitude', 'longitude'],
      type: 'gist',
      condition: undefined
    },
    // Search queries optimization
    {
      table: 'cached_places',
      columns: ['name'],
      type: 'gin',
      condition: undefined
    },
    // Type-based filtering
    {
      table: 'cached_places',
      columns: ['primary_type', 'freshness_status'],
      type: 'btree',
      condition: undefined
    },
    // Nutrition data optimization
    {
      table: 'nutrition_data',
      columns: ['food_name'],
      type: 'gin',
      condition: undefined
    }
  ];

  async analyzeQueryPerformance(
    query: string,
    params?: any[]
  ): Promise<QueryOptimization | null> {
    try {
      // Execute EXPLAIN ANALYZE for the query
      const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
      
      const { data, error } = await supabase.rpc('execute_query_analysis', {
        query_text: explainQuery,
        query_params: params || []
      });

      if (error) {
        console.warn('Query analysis failed:', error);
        return null;
      }

      // Parse the execution plan
      const plan = data?.[0]?.['QUERY PLAN']?.[0];
      if (!plan) return null;

      return {
        operation: plan['Node Type'] || 'Unknown',
        table: this.extractTableName(query),
        estimatedRows: plan['Plan Rows'] || 0,
        executionTime: plan['Actual Total Time'] || 0,
        indexUsed: this.hasIndexScan(plan),
        suggestions: this.generateOptimizationSuggestions(plan, query)
      };
    } catch (error) {
      console.warn('Query performance analysis failed:', error);
      return null;
    }
  }

  private extractTableName(query: string): string {
    const fromMatch = query.match(/FROM\s+(\w+)/i);
    return fromMatch?.[1] || 'unknown';
  }

  private hasIndexScan(plan: any): boolean {
    const nodeType = plan['Node Type'];
    return nodeType?.includes('Index') || 
           nodeType?.includes('Bitmap') ||
           plan['Plans']?.some((subPlan: any) => this.hasIndexScan(subPlan));
  }

  private generateOptimizationSuggestions(plan: any, query: string): string[] {
    const suggestions: string[] = [];

    // Check for sequential scans on large tables
    if (plan['Node Type'] === 'Seq Scan' && plan['Plan Rows'] > 1000) {
      suggestions.push('Consider adding an index for this query pattern');
    }

    // Check for expensive operations
    if (plan['Actual Total Time'] > 100) {
      suggestions.push('Query execution time is high, consider optimization');
    }

    // Check for location-based queries without spatial index
    if (query.includes('latitude') || query.includes('longitude')) {
      suggestions.push('Consider using spatial indexing for location queries');
    }

    // Check for text search without full-text index
    if (query.includes('ILIKE') || query.includes('LIKE')) {
      suggestions.push('Consider using full-text search with GIN index');
    }

    return suggestions;
  }

  async optimizeLocationQueries(): Promise<void> {
    try {
      // Create spatial index for location-based queries
      const { error } = await supabase.rpc('create_spatial_index', {
        table_name: 'cached_places',
        column_names: ['latitude', 'longitude']
      });

      if (error) {
        console.warn('Failed to create spatial index:', error);
      } else {
        console.log('Spatial index created successfully');
        toast.success('Location query optimization applied');
      }
    } catch (error) {
      console.error('Location query optimization failed:', error);
    }
  }

  async optimizeTextSearchQueries(): Promise<void> {
    try {
      // Create full-text search index
      const { error } = await supabase.rpc('create_fulltext_index', {
        table_name: 'cached_places',
        column_name: 'name'
      });

      if (error) {
        console.warn('Failed to create full-text index:', error);
      } else {
        console.log('Full-text search index created successfully');
        toast.success('Text search optimization applied');
      }
    } catch (error) {
      console.error('Text search optimization failed:', error);
    }
  }

  async getTableStatistics(tableName: string): Promise<{
    rowCount: number;
    indexCount: number;
    avgRowSize: number;
    lastAnalyzed: string | null;
  } | null> {
    try {
      const { data, error } = await supabase.rpc('get_table_statistics', {
        table_name: tableName
      });

      if (error) {
        console.warn('Failed to get table statistics:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Table statistics query failed:', error);
      return null;
    }
  }

  async runMaintenanceTasks(): Promise<void> {
    try {
      console.log('Running database maintenance tasks...');

      // Update table statistics
      await supabase.rpc('analyze_tables', {
        table_names: ['cached_places', 'nutrition_data', 'user_preferences']
      });

      // Vacuum analyze for better query planning
      await supabase.rpc('vacuum_analyze_tables', {
        table_names: ['cached_places']
      });

      console.log('Database maintenance completed');
      toast.success('Database optimization completed');
    } catch (error) {
      console.error('Database maintenance failed:', error);
      toast.error('Database maintenance failed');
    }
  }

  getOptimizationRecommendations(): string[] {
    return [
      'Add spatial indexing for location-based queries',
      'Use full-text search for name searches',
      'Implement query result caching for expensive operations',
      'Consider partitioning large tables by date or region',
      'Monitor and optimize slow queries regularly'
    ];
  }
}

export const databaseOptimizationService = new DatabaseOptimizationService();
