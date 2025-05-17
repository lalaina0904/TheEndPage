'use client';

import { SketchPicker } from 'react-color';
import { useState } from 'react';

export default function StyleEditor({ selectedComponent, onStyleChange }) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const fontFamilies = [
    'Arial, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Verdana, sans-serif',
  ];

  const handleFontFamilyChange = (e) => {
    onStyleChange({ fontFamily: e.target.value });
  };

  const handleColorChange = (color) => {
    onStyleChange({ color: color.hex });
  };

  const handleBgColorChange = (color) => {
    onStyleChange({ backgroundColor: color.hex });
  };

  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">
        {selectedComponent ? 'Component Styles' : 'Page Styles'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Font Family</label>
          <select
            className="w-full p-2 rounded border"
            onChange={handleFontFamilyChange}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <div
            className="w-full h-8 rounded border cursor-pointer"
            style={{
              backgroundColor: selectedComponent?.styles?.color || '#000000',
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div className="absolute mt-2">
              <SketchPicker onChange={handleColorChange} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Background Color
          </label>
          <div
            className="w-full h-8 rounded border cursor-pointer"
            style={{
              backgroundColor:
                selectedComponent?.styles?.backgroundColor || '#ffffff',
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div className="absolute mt-2">
              <SketchPicker onChange={handleBgColorChange} />
            </div>
          )}
        </div>

        {selectedComponent?.type === 'heading' && (
          <div>
            <label className="block text-sm font-medium mb-1">Font Size</label>
            <select
              className="w-full p-2 rounded border"
              onChange={(e) =>
                onStyleChange({ fontSize: e.target.value })
              }
            >
              <option value="text-xl">Small</option>
              <option value="text-2xl">Medium</option>
              <option value="text-3xl">Large</option>
              <option value="text-4xl">Extra Large</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}