export interface CourseItem {
  topic: string;
  platform: string;
  reason: string;
  level: string;
}

export interface AIRecommendationResult {
  analysis: string;
  courses: CourseItem[];
}

export interface SerpApiJob {
  title: string;
  company_name: string;
  location: string;
  via: string;
  description?: string;
  apply_options?: Array<{
    title?: string;
    link: string;
  }>;
  detected_extensions?: {
    posted_at?: string;
    schedule_type?: string;
    work_from_home?: boolean;
    [key: string]: unknown; // Menampung field ekstensi lain jika ada
  };
}

export interface AIJobResult {
  title: string;
  company_name: string;
  location: string;
  via: string;
  match_score: number;
  match_reason: string;
}

export interface AIJobRecommendationResponse {
  analysis: string;
  jobs: AIJobResult[];
}

export interface GeminiError extends Error {
  status?: number | string
}