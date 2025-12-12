'use client';

import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import SceneCard from '@/components/SceneCard';
import { useAppStore } from '@/lib/store';
import { sampleScenes } from '@/lib/sample-scenes';
import { useVRSupport } from '@/hooks/useVRSupport';

export default function HomePage() {
  const { scenes, addScene } = useAppStore();
  const vrState = useVRSupport();

  useEffect(() => {
    if (scenes.length === 0) {
      sampleScenes.forEach(scene => addScene(scene));
    }
  }, [scenes.length, addScene]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to 3D Viewer
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Explore immersive 3D experiences and VR content
          </p>
          {vrState.isVRSupported && (
            <p className="text-sm text-green-600">✓ VR is supported on this device</p>
          )}
          {!vrState.isVRSupported && (
            <p className="text-sm text-gray-500">VR is not available on this device</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Getting Started
          </h2>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>View 360° panoramas in the Panorama viewer</li>
            <li>Interact with 3D models in the Model viewer</li>
            <li>Experience VR with a compatible headset</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Scenes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map(scene => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technology Stack
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-md">
              <div className="text-2xl mb-2">⚛️</div>
              <div className="text-sm font-medium">Next.js 14</div>
            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-medium">Three.js</div>
            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="text-2xl mb-2">🥽</div>
              <div className="text-sm font-medium">WebXR</div>
            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="text-2xl mb-2">🎭</div>
              <div className="text-sm font-medium">React Three Fiber</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
