export interface Workspace {
  id: string;
  name: string;
  mode: 'Concept Studio' | 'Manual Builder' | 'Direct Generation' | 'Photo to Model';
  status: 'Draft' | 'Active' | 'Analyzing' | 'Completed';
  lastEdited: string;
}
