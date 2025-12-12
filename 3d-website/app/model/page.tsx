'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function ModelPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">3D Model Viewer</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            🚧 This viewer is under construction. It will display interactive 3D models
            using React Three Fiber.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Coming Soon:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>GLB/GLTF model loading</li>
            <li>Orbit controls for camera</li>
            <li>Model animations</li>
            <li>Material and texture previews</li>
            <li>AR mode support</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
