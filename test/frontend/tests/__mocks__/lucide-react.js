import React from 'react';

const createMockIcon = (name) => {
  const MockIcon = React.forwardRef((props, ref) => {
    return React.createElement('svg', {
      ...props,
      ref,
      'data-testid': `${name.toLowerCase()}-icon`,
      width: props.width || '24',
      height: props.height || '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    });
  });
  
  MockIcon.displayName = `Mock${name}`;
  return MockIcon;
};

export const BookOpen = createMockIcon('BookOpen');
export const Star = createMockIcon('Star');
export const Clock = createMockIcon('Clock');
export const Users = createMockIcon('Users');
export const ChevronRight = createMockIcon('ChevronRight');