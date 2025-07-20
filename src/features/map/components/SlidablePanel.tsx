
import React, { useCallback, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { useDrag } from '@use-gesture/react';

export interface SlidablePanelState {
  collapsed: number;
  partial: number;
  expanded: number;
}

interface SlidablePanelProps {
  children: React.ReactNode;
  isExpanded: boolean;
  onStateChange: (state: 'collapsed' | 'partial' | 'expanded') => void;
}

const SlidablePanel: React.FC<SlidablePanelProps> = ({
  children,
  isExpanded,
  onStateChange
}) => {
  // Calculate panel states based on viewport height
  const getStates = useCallback((): SlidablePanelState => {
    const vh = window.visualViewport?.height || window.innerHeight;
    return {
      collapsed: vh - 140, // Show handle + peek (140px visible)
      partial: vh * 0.6,   // 40% of screen
      expanded: vh * 0.2   // 80% of screen (20% from top)
    };
  }, []);

  const [states, setStates] = React.useState(getStates);
  const [currentState, setCurrentState] = React.useState<keyof SlidablePanelState>('partial');

  // Spring animation for panel position
  const [{ y }, api] = useSpring(() => ({
    y: states.partial,
    config: config.gentle
  }));

  // Update states on viewport changes
  useEffect(() => {
    const updateStates = () => {
      const newStates = getStates();
      setStates(newStates);
      
      // Update current position to maintain relative state
      api.start({ y: newStates[currentState] });
    };

    window.addEventListener('resize', updateStates);
    window.visualViewport?.addEventListener('resize', updateStates);

    return () => {
      window.removeEventListener('resize', updateStates);
      window.visualViewport?.removeEventListener('resize', updateStates);
    };
  }, [api, currentState, getStates]);

  // Handle external state changes
  useEffect(() => {
    const targetState = isExpanded ? 'expanded' : 'partial';
    if (targetState !== currentState) {
      setCurrentState(targetState);
      api.start({ y: states[targetState] });
    }
  }, [isExpanded, api, states, currentState]);

  // Determine target state based on position and velocity
  const getTargetState = useCallback((position: number, velocity: number): keyof SlidablePanelState => {
    const { collapsed, partial, expanded } = states;
    
    // High velocity detection for quick swipes
    if (Math.abs(velocity) > 0.5) {
      return velocity > 0 ? 'collapsed' : 'expanded';
    }
    
    // Position-based detection with hysteresis
    if (position > (collapsed + partial) / 2) {
      return 'collapsed';
    } else if (position > (partial + expanded) / 2) {
      return 'partial';
    } else {
      return 'expanded';
    }
  }, [states]);

  // Drag gesture handler
  const bind = useDrag(
    ({ last, movement: [, my], velocity: [, vy], cancel, event }) => {
      // Prevent interference with scroll
      if (event?.target && (event.target as Element).closest('.overflow-y-auto')) {
        const scrollContainer = (event.target as Element).closest('.overflow-y-auto');
        if (scrollContainer && scrollContainer.scrollTop > 0 && my < 0) {
          cancel();
          return;
        }
      }

      if (last) {
        // Gesture ended - snap to nearest state
        const currentPosition = y.get() + my;
        const targetState = getTargetState(currentPosition, vy);
        
        setCurrentState(targetState);
        api.start({ y: states[targetState] });
        onStateChange(targetState);
      } else {
        // Gesture in progress - follow drag with constraints
        const newPosition = Math.max(
          states.expanded,
          Math.min(states.collapsed, y.get() + my)
        );
        api.start({ y: newPosition, immediate: true });
      }
    },
    {
      filterTaps: true,
      rubberband: true,
      from: () => [0, y.get()],
      bounds: { top: states.expanded - y.get(), bottom: states.collapsed - y.get() }
    }
  );

  return (
    <animated.div
      {...bind()}
      className="fixed bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-lg z-20 touch-none"
      style={{
        transform: y.to(y => `translateY(${y}px)`),
        height: `calc(100vh - ${states.expanded}px)`,
        maxHeight: 'calc(100vh - 120px)'
      }}
    >
      {/* Drag Handle */}
      <div className="w-full flex justify-center py-3 cursor-pointer active:bg-muted/20">
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{ 
          height: 'calc(100% - 60px)',
        }}
      >
        {children}
      </div>
    </animated.div>
  );
};

export default SlidablePanel;
