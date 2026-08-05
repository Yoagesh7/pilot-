'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ToastProvider } from '@/components/ui/Toast';
import { FileUploadModal } from '@/components/documents/FileUploadModal';
import { CommandPaletteModal } from '@/components/search/CommandPaletteModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onOpenUploadModal={() => setUploadModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            onOpenSearchModal={() => setSearchModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>

        {/* Global Modals */}
        <FileUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />

        <CommandPaletteModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
