import { Scene } from '@/types';

export const sampleScenes: Scene[] = [
  {
    id: 'panorama-1',
    name: 'Mountain Panorama',
    description: 'A beautiful 360° view of mountain landscapes',
    type: 'panorama',
    assetPath: '/panoramas/sample-panorama.jpg',
    thumbnail: '/panoramas/sample-panorama-thumb.jpg',
  },
  {
    id: 'model-1',
    name: '3D Model Demo',
    description: 'Interactive 3D model viewer',
    type: 'model',
    assetPath: '/models/sample-model.glb',
    thumbnail: '/models/sample-model-thumb.jpg',
  },
  {
    id: 'mixed-1',
    name: 'Mixed Reality Scene',
    description: 'Combined panorama and 3D models',
    type: 'mixed',
    assetPath: '/panoramas/sample-panorama-2.jpg',
    thumbnail: '/panoramas/sample-panorama-2-thumb.jpg',
  },
];
