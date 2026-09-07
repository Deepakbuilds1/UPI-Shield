export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SignalSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScamCategory {
  name: string;
  confidence: number;
  description?: string;
}

export interface RiskSignal {
  name: string;
  severity: SignalSeverity;
  confidence: number;
  score: number; // 0 to 100 contribution
  explanation: string;
  evidence?: string;
}

export interface SignalBreakdown {
  urgency: number; // 0 - 1
  fear: number; // 0 - 1
  authority_impersonation: number; // 0 - 1
  payment_pressure: number; // 0 - 1
  credential_request: number; // 0 - 1
  verification_pretext: number; // 0 - 1
  remote_access_request: number; // 0 - 1
  qr_payment_request: number; // 0 - 1
  suspicious_link: number; // 0 - 1
  coercion: number; // 0 - 1
  social_engineering: number; // 0 - 1
}

export interface PaymentDetails {
  detected: boolean;
  amount: string | number | null;
  currency?: string;
  reason: string | null;
  method?: string | null;
  upi_id: string | null;
  phone_number: string | null;
  url: string | null;
  is_verification_small_amount: boolean;
  risk_level: RiskLevel;
  explanation: string | null;
}

export interface UpiIntentDetails {
  raw_uri?: string | null;
  pa?: string | null; // Payee Address (VPA)
  pn?: string | null; // Payee Name
  am?: string | null; // Amount
  cu?: string | null; // Currency
  tn?: string | null; // Note
  mc?: string | null; // Merchant code
  tr?: string | null; // Ref
  url?: string | null;
  verification_status: string;
  safety_advisory: string;
}

export interface AnalysisResponse {
  risk_score: number; // 0 to 100
  risk_level: RiskLevel;
  confidence: number; // 0 to 1
  language: string; // English | Hindi | Hinglish | Mixed
  categories: ScamCategory[];
  signals: RiskSignal[];
  signal_breakdown: SignalBreakdown;
  payment: PaymentDetails;
  upi_intent: UpiIntentDetails | null;
  why_suspicious: string[];
  recommendations: string[];
  warnings: {
    english: string;
    hindi: string;
  };
  technical_analysis: {
    semantic_score: number;
    behavioral_score: number;
    technical_payment_score: number;
    engine_mode: 'gemini-ai' | 'gemini-flash-lite' | 'local-heuristics-fallback';
    processed_at: string;
  };
}

export interface AnalysisRequest {
  text: string;
  language?: 'auto' | 'english' | 'hindi' | 'hinglish';
}

export interface DemoTestCase {
  id: string;
  title: string;
  tag: string;
  expectedRisk: RiskLevel;
  text: string;
  description: string;
}

export type AppRoute =
  | 'home'
  | 'help'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'acceptable-use'
  | 'security'
  | 'cookies'
  | 'accessibility'
  | 'onboarding'
  | 'not-found';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
