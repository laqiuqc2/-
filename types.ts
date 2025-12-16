export type TemplateType = 'classic' | 'traditional' | 'modern';

export interface CertificateData {
  studentName: string;
  startYear: string;
  startMonth: string;
  courseName: string;
  coachName: string;
  issueDate: string; // YYYY-MM-DD
}

export interface SuggestionResponse {
  suggestions: string[];
}