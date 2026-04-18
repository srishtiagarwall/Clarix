export interface InsightsPayload {
  period: { start: string; end: string; label: string };
  accountName: string;
  totalSpend: number;
  spendChangePct: number;
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  totalConversions: number;
  costPerConversion: number;
  topCampaign: { name: string; spend: number; conversions: number; roas: number };
  worstCampaign: { name: string; spend: number; ctr: number };
  budgetUtilizationPct: number;
  recommendationsFlags: string[];
}
