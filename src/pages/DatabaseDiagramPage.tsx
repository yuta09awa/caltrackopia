import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/Container';
import DatabaseDiagram from '@/components/DatabaseDiagram';

const DatabaseDiagramPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Database Schema</h1>
              <p className="text-muted-foreground mt-1">
                FoodToMe database relationships and structure
              </p>
            </div>
          </div>

          {/* Diagram */}
          <div className="w-full">
            <DatabaseDiagram />
          </div>

          {/* Legend */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Schema Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-primary mb-2">User Management</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>profiles</strong> - User accounts and preferences</li>
                  <li>• <strong>restaurants</strong> - Restaurant owner accounts</li>
                  <li>• <strong>audit_logs</strong> - User activity tracking</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-2">Location & Places</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>cached_places</strong> - Google Places API cache</li>
                  <li>• <strong>search_areas</strong> - Predefined search regions</li>
                  <li>• <strong>cache_statistics</strong> - Cache performance metrics</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-primary mb-2">Nutrition & Diet</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>master_ingredients</strong> - Ingredient database</li>
                  <li>• <strong>allergen_types</strong> - Allergen definitions</li>
                  <li>• <strong>dietary_restriction_types</strong> - Diet restrictions</li>
                  <li>• <strong>dietary_tag_types</strong> - Diet tags (vegan, etc.)</li>
                  <li>• <strong>nutrition_goal_types</strong> - Health goals</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This diagram shows the current database structure. 
                Gray arrows indicate foreign key relationships between tables.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DatabaseDiagramPage;