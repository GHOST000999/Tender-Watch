export type SourceType = 'tender_site' | 'gazette';

export interface Tender {
  id: number;
  title: string;
  ref_number: string;
  procurer: string;
  category: string;
  region: string;
  deadline: string;
  source_name: string;
  source_url: string;
  description: string;
  status?: string;
  created_at?: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  source_type: SourceType;
  category: string;
  country: string;
  description: string;
  verified: boolean;
  created_at?: string;
}

export interface ActivityItem {
  id: number;
  action: string;
  detail: string;
  created_at: string;
}

export interface NewSourceInput {
  name: string;
  url: string;
  source_type: SourceType;
  category: string;
  country: string;
  description: string;
}
