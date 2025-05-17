'use client';

import { useDrag } from 'react-dnd';
import { Button } from '../ui/button';

const components = [
  {
    type: 'heading',
    label: 'Heading',
    defaultContent: 'New Heading',
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    defaultContent: 'New paragraph text',
  },
  {
    type: 'image',
    label: 'Image',
    defaultContent: 'https://via.placeholder.com/300x200',
  },
  {
    type: 'button',
    label: 'Button',
    defaultContent: 'Click me',
  },
];

const DraggableComponent = ({ type, label, defaultContent }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, defaultContent },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-white rounded shadow cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {label}
    </div>
  );
};

export default function ComponentPalette() {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      {components.map((component) => (
        <DraggableComponent key={component.type} {...component} />
      ))}
    </div>
  );
}