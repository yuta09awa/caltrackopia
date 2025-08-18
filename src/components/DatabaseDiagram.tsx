import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define the nodes representing our database tables
const initialNodes: Node[] = [
  // Core user management
  {
    id: 'profiles',
    type: 'default',
    position: { x: 400, y: 50 },
    data: { label: 'profiles' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  // Restaurant management
  {
    id: 'restaurants',
    type: 'default',
    position: { x: 100, y: 200 },
    data: { label: 'restaurants' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  // Places and caching
  {
    id: 'cached_places',
    type: 'default',
    position: { x: 700, y: 200 },
    data: { label: 'cached_places' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'search_areas',
    type: 'default',
    position: { x: 700, y: 350 },
    data: { label: 'search_areas' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  // Nutrition and ingredients
  {
    id: 'master_ingredients',
    type: 'default',
    position: { x: 100, y: 500 },
    data: { label: 'master_ingredients' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'allergen_types',
    type: 'default',
    position: { x: 400, y: 500 },
    data: { label: 'allergen_types' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'dietary_restriction_types',
    type: 'default',
    position: { x: 100, y: 650 },
    data: { label: 'dietary_restriction_types' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'dietary_tag_types',
    type: 'default',
    position: { x: 400, y: 650 },
    data: { label: 'dietary_tag_types' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'nutrition_goal_types',
    type: 'default',
    position: { x: 700, y: 650 },
    data: { label: 'nutrition_goal_types' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  // System and monitoring
  {
    id: 'audit_logs',
    type: 'default',
    position: { x: 400, y: 350 },
    data: { label: 'audit_logs' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'api_quota_tracking',
    type: 'default',
    position: { x: 1000, y: 200 },
    data: { label: 'api_quota_tracking' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  
  {
    id: 'cache_statistics',
    type: 'default',
    position: { x: 1000, y: 350 },
    data: { label: 'cache_statistics' },
    style: {
      background: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 180,
      height: 60,
      fontSize: '14px',
      fontWeight: '500',
    },
  },
];

// Define edges showing relationships between tables
const initialEdges: Edge[] = [
  // Profile relationships
  {
    id: 'e1',
    source: 'profiles',
    target: 'restaurants',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'owner_id',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
  
  {
    id: 'e2',
    source: 'profiles',
    target: 'audit_logs',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'user_id',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
  
  // Ingredient relationships
  {
    id: 'e3',
    source: 'master_ingredients',
    target: 'allergen_types',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'allergen_ids',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
  
  // Profile dietary preferences
  {
    id: 'e4',
    source: 'profiles',
    target: 'dietary_restriction_types',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'dietary_restrictions',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
  
  {
    id: 'e5',
    source: 'profiles',
    target: 'nutrition_goal_types',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'nutrition_goals',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
  
  // Cache relationships
  {
    id: 'e6',
    source: 'search_areas',
    target: 'cached_places',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'location',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
  
  {
    id: 'e7',
    source: 'cached_places',
    target: 'cache_statistics',
    type: 'smoothstep',
    style: { stroke: '#9CA3AF', strokeWidth: 2 },
    label: 'cache_metrics',
    labelStyle: { fontSize: '12px', fill: '#6B7280' },
  },
];

const DatabaseDiagram: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[800px] bg-gray-50 rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ background: "#F9FAFB" }}
      >
        <MiniMap 
          zoomable 
          pannable 
          style={{ 
            background: "#F3F4F6",
            border: "1px solid #E5E7EB"
          }}
        />
        <Controls 
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px"
          }}
        />
        <Background color="#E5E7EB" gap={20} />
      </ReactFlow>
    </div>
  );
};

export default DatabaseDiagram;