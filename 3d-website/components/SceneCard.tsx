import React from 'react';
import Link from 'next/link';
import { Scene } from '@/types';

interface SceneCardProps {
  scene: Scene;
}

export default function SceneCard({ scene }: SceneCardProps) {
  const getViewerLink = () => {
    switch (scene.type) {
      case 'panorama':
        return '/panorama';
      case 'model':
        return '/model';
      case 'mixed':
        return '/vr';
      default:
        return '/';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white text-4xl">
          {scene.type === 'panorama' ? '🌄' : scene.type === 'model' ? '🎨' : '🥽'}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{scene.name}</h3>
        <p className="text-gray-600 mb-4">{scene.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">{scene.type}</span>
          <Link
            href={getViewerLink()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
