import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApplicationProvider } from '@/context/ApplicationContext';
import { AppShell } from '@/AppShell';
import { Landing } from '@/pages/Landing';

export default function App() {
  return (
    <HashRouter>
      <ApplicationProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/apply" element={<AppShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ApplicationProvider>
    </HashRouter>
  );
}
