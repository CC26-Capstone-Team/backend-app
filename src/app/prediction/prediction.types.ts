export interface MLPredictionItem {
  rank: number;
  job_title: string;
  probability: number;
}

export interface MLPredictionResponse {
  predicted: string;
  confidence: number;
  top_k: MLPredictionItem[];
}