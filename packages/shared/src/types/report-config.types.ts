export interface TemplateConfig {
  sections: {
    overview: boolean;
    campaignBreakdown: boolean;
    keywordAnalysis: boolean;
    aiNarrative: boolean;
    recommendations: boolean;
  };
  dateRange: 'last_7_days' | 'last_30_days' | 'last_month' | 'custom';
  customDateRange?: { start: string; end: string };
  currency: string;
  language: 'en';
  aiNarrativeConfig: {
    tone: 'professional' | 'friendly' | 'executive';
    focusAreas: string[];
  };
}
