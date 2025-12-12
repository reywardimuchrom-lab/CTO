'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function PanoramaPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Panorama Viewer</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            🚧 This viewer is under construction. It will display 360° panoramas using
            React Three Fiber.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Coming Soon:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>360° equirectangular panorama display</li>
            <li>Mouse/touch controls for navigation</li>
            <li>VR mode support</li>
            <li>Hotspot annotations</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
