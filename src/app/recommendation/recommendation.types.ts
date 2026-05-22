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
