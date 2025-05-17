'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import PageEditor from '@/components/page-builder/PageEditor';
import ComponentPalette from '@/components/page-builder/ComponentPallette';
import StyleEditor from '@/components/page-builder/StyleEditor';

export default function PageBuilder() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [pageComponents, setPageComponents] = useState([]);
  const [pageStyles, setPageStyles] = useState({
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: 'Arial, sans-serif',
  });

  const handleDrop = (item, index) => {
    const newComponents = [...pageComponents];
    newComponents.splice(index, 0, {
      type: item.type,
      content: item.defaultContent,
      styles: {},
      id: Date.now(),
    });
    setPageComponents(newComponents);
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };

  const handleStyleChange = (styles) => {
    if (selectedComponent) {
      const updatedComponents = pageComponents.map(comp => 
        comp.id === selectedComponent.id 
          ? { ...comp, styles: { ...comp.styles, ...styles } }
          : comp
      );
      setPageComponents(updatedComponents);
    } else {
      setPageStyles({ ...pageStyles, ...styles });
    }
  };

  const handleSavePage = async () => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components: pageComponents,
          styles: pageStyles,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save page');
      
      // Show success message
      toast.success('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        <ComponentPalette />
        <div className="flex-1 p-4">
          <PageEditor
            components={pageComponents}
            styles={pageStyles}
            onDrop={handleDrop}
            onComponentSelect={handleComponentSelect}
          />
        </div>
        <StyleEditor
          selectedComponent={selectedComponent}
          onStyleChange={handleStyleChange}
        />
        <button
          onClick={handleSavePage}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save Page
        </button>
      </div>
    </DndProvider>
  );
}