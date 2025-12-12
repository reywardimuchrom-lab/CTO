'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { useVRSupport } from '@/hooks/useVRSupport';

export default function VRPage() {
  const vrState = useVRSupport();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">VR Experience</h1>
        
        {vrState.isVRSupported ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800">
              ✓ VR is supported on this device! You can experience immersive content.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-800">
              VR is not available on this device. You can still view 3D content normally.
            </p>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            🚧 This viewer is under construction. It will provide immersive VR experiences
            using React Three XR.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Coming Soon:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>WebXR session management</li>
            <li>VR controller support</li>
            <li>Room-scale experiences</li>
            <li>Hand tracking</li>
            <li>Mixed reality features</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            VR Hardware Requirements:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Meta Quest 2/3/Pro</li>
            <li>HTC Vive / Valve Index</li>
            <li>Windows Mixed Reality headsets</li>
            <li>Compatible WebXR browser</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
