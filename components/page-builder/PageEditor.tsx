'use client';

import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

const ComponentRenderer = ({ component, onClick }) => {
  const { type, content, styles } = component;

  const componentMap = {
    heading: () => (
      <h2 style={styles} className="text-2xl font-bold mb-4">
        {content}
      </h2>
    ),
    paragraph: () => (
      <p style={styles} className="mb-4">
        {content}
      </p>
    ),
    image: () => (
      <img
        src={content}
        alt="Content"
        style={styles}
        className="max-w-full h-auto mb-4"
      />
    ),
    button: () => (
      <button
        style={styles}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {content}
      </button>
    ),
  };

  const Component = componentMap[type];
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(component)}
      className="cursor-pointer"
    >
      <Component />
    </motion.div>
  );
};

export default function PageEditor({
  components,
  styles,
  onDrop,
  onComponentSelect,
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      // Calculate drop index based on mouse position
      const dropIndex = calculateDropIndex(clientOffset);
      onDrop(item, dropIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const calculateDropIndex = (clientOffset) => {
    // Implement logic to determine the index based on mouse position
    // For now, we'll just append to the end
    return components.length;
  };

  return (
    <div
      ref={drop}
      style={styles}
      className={`min-h-full p-8 bg-white rounded-lg shadow ${
        isOver ? 'border-2 border-blue-500' : ''
      }`}
    >
      {components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          onClick={onComponentSelect}
        />
      ))}
      {components.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Drag components here
        </div>
      )}
    </div>
  );
}