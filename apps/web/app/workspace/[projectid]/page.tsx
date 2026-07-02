'use client';

import React, { useEffect } from 'react';
import Menubar from '../../../components/workspace/editor/Menubar';
import Sidebar from '../../../components/workspace/editor/Sidebar';
import Viewport from '../../../components/workspace/editor/Viewport';
import Toolbar from '../../../components/workspace/editor/Toolbar';
import ViewportOverlay from '../../../components/workspace/editor/ViewportOverlay';
import ShortcutsModal from '../../../components/workspace/editor/ShortcutsModal';
import useStore from '../../../store/editorStore';

export default function WorkspaceEditorPage() {
  const selectedIds = useStore((s: any) => s.selectedIds);
  const removePrimitive = useStore((s: any) => s.removePrimitive);
  const setTransformMode = useStore((s: any) => s.setTransformMode);
  const showShortcuts = useStore((s: any) => s.showShortcuts);
  const setShowShortcuts = useStore((s: any) => s.setShowShortcuts);
  const copySelected = useStore((s: any) => s.copySelected);
  const pasteClipboard = useStore((s: any) => s.pasteClipboard);
  const undo = useStore((s: any) => s.undo);
  const redo = useStore((s: any) => s.redo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;

      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === 'c') { e.preventDefault(); copySelected(); }
      if (ctrl && e.key.toLowerCase() === 'v') { e.preventDefault(); pasteClipboard(); }
      if (ctrl && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
      if (ctrl && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      if (e.key === '?') setShowShortcuts(true);
      if (e.key === 'Delete' && selectedIds.length > 0) {
        selectedIds.forEach((id: string) => removePrimitive(id));
      }
      if (e.key.toLowerCase() === 'w') setTransformMode('translate');
      if (e.key.toLowerCase() === 'e') setTransformMode('rotate');
      if (e.key.toLowerCase() === 'r') setTransformMode('scale');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, removePrimitive, setTransformMode, copySelected, pasteClipboard, undo, redo, setShowShortcuts]);

  const editorTheme = useStore((s: any) => s.editorTheme);
  const envSettings = useStore((s: any) => s.envSettings);
  const setEnvSettings = useStore((s: any) => s.setEnvSettings);

  useEffect(() => {
    // If no isolated editor theme is forced, sync the background UI to the global Next.js theme
    if (!editorTheme) {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark && envSettings.bgId !== 'dark') {
        setEnvSettings({ bgId: 'dark' });
      } else if (!isDark && envSettings.bgId !== 'light') {
        setEnvSettings({ bgId: 'light' });
      }
    }
  }, [editorTheme]);

  const THEMES: Record<string, React.CSSProperties> = {
    dracula: {
      '--color-light-bg': '#282a36',
      '--color-dark-bg': '#282a36',
      '--color-light-surface': '#44475a',
      '--color-dark-surface': '#44475a',
      '--color-light-text': '#f8f8f2',
      '--color-dark-text': '#f8f8f2',
      '--color-light-muted': '#6272a4',
      '--color-dark-muted': '#6272a4',
      '--color-light-border': '#6272a4',
      '--color-dark-border': '#6272a4',
      '--color-light-primary': '#bd93f9',
      '--color-dark-primary': '#bd93f9',
    } as any,
    sage: {
      '--color-light-bg': '#eef2ec',
      '--color-dark-bg': '#eef2ec',
      '--color-light-surface': '#e2e8df',
      '--color-dark-surface': '#e2e8df',
      '--color-light-text': '#2f3d32',
      '--color-dark-text': '#2f3d32',
      '--color-light-muted': '#728276',
      '--color-dark-muted': '#728276',
      '--color-light-border': '#c8d4c5',
      '--color-dark-border': '#c8d4c5',
      '--color-light-primary': '#5f8566',
      '--color-dark-primary': '#5f8566',
    } as any,
    ocean: {
      '--color-light-bg': '#0f172a',
      '--color-dark-bg': '#0f172a',
      '--color-light-surface': '#1e293b',
      '--color-dark-surface': '#1e293b',
      '--color-light-text': '#f8fafc',
      '--color-dark-text': '#f8fafc',
      '--color-light-muted': '#94a3b8',
      '--color-dark-muted': '#94a3b8',
      '--color-light-border': '#334155',
      '--color-dark-border': '#334155',
      '--color-light-primary': '#38bdf8',
      '--color-dark-primary': '#38bdf8',
    } as any,
  };

  const themeStyle = THEMES[editorTheme] || {};

  return (
    <div style={themeStyle} className="flex flex-col w-full h-screen bg-light-bg dark:bg-dark-bg overflow-hidden text-light-text dark:text-dark-text font-sans">
      <Menubar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 relative min-w-0">
          <Viewport />
          <ViewportOverlay />
        </div>
      </div>
      {showShortcuts && <ShortcutsModal />}
    </div>
  );
}
