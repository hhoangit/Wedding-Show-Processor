export enum Role {
  MUA = 'MUA',
  PHOTOGRAPHER = 'PHOTOGRAPHER'
}

export interface ShowData {
  date: string | null;
  customer_name: string;
  type_of_show: string;
}

export interface ProcessedResult {
  assigned: boolean;
  Raw_data: string;
  data: ShowData;
}

export interface ProcessingRequest {
  rawData: string;
  ekipName: string;
  role: Role;
}