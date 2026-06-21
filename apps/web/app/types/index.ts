export interface Workspace {
  id: string;
  name: string;
  mode: 'Concept Studio' | 'Blank Workspace' | 'Text → 3D' | 'Image → 3D';
  status: 'Draft' | 'Active' | 'Analyzing' | 'Completed';
  lastEdited: string;
}
