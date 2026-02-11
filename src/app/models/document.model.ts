export interface DocumentItem {
  id: string;
  title: string;
  type: 'report' | 'statement' | 'tax' | 'contract';
  date: string;
  icon: string;
}

export interface DocumentsData {
  documents: DocumentItem[];
}
