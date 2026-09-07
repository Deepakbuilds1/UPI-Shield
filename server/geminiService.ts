import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResponse } from '../src/types';
import { analyzeLocally } from './localHeuristicEngine';
import { parseUpiString } from './upiParser';

let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export async function analyzeWithGemini(
  text: string,
  forcedLanguage?: string
): Promise<AnalysisResponse> {
  const localFallback = analyzeLocally(text, forcedLanguage);

  const client = getGeminiClient();
  if (!client) {
    // API key not configured or unavailable, use resilient local semantic engine
    return localFallback;
  }

  const systemInstruction = `
You are UPI-Shield, an advanced contextual NLP cybersecurity analyzer specializing in Indian digital payment scams (UPI, SMS, WhatsApp, Hinglish coercion, bank impersonation, and social engineering).

Context & Mission:
Victims of social engineering voluntarily authorize payments using valid MPIN/OTP/biometrics because they are manipulated. UPI-Shield detects the psychological manipulation, artificial urgency, coercion, fear, authority impersonation, credential theft, and payment pretexts BEFORE they authorize.

Analyze the given message text and return a JSON object with:
1. "risk_score": integer 0-100 (weighted assessment).
   - 0-24: SAFE
   - 25-49: LOW RISK
   - 50-69: MEDIUM RISK
   - 70-84: HIGH RISK
   - 85-100: CRITICAL RISK
2. "risk_level": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL".
3. "confidence": float between 0.70 and 1.0.
4. "language": detected language: "English" | "Hindi" | "Hinglish" | "Mixed".
5. "categories": array of { "name": string, "confidence": float, "description": string } from standard Indian scam typologies (Electricity Disconnection Scam, Fake Refund Scam, Fake KYC, Bank Account Threat, Remote Access Scam, QR Code Scam, UPI Collect Request Scam, OTP/PIN Credential Theft, Prize/Lottery, Job/Investment Scam, General Social Engineering, Legitimate Notice).
6. "signal_breakdown": {
     "urgency": float 0-1,
     "fear": float 0-1,
     "authority_impersonation": float 0-1,
     "payment_pressure": float 0-1,
     "credential_request": float 0-1,
     "verification_pretext": float 0-1,
     "remote_access_request": float 0-1,
     "qr_payment_request": float 0-1,
     "suspicious_link": float 0-1,
     "coercion": float 0-1,
     "social_engineering": float 0-1
   }
7. "signals": array of { "name": string, "severity": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "confidence": float, "score": number, "explanation": string, "evidence": string }.
8. "why_suspicious": array of 3-5 plain-language non-technical bullet points explaining WHY this message is risky.
9. "recommendations": array of 3-5 concrete action recommendations for the user.
10. "warnings": { "english": string, "hindi": string } (Bilingual warning message).
11. "payment": {
      "detected": boolean,
      "amount": string or null (e.g. "₹2", "₹4850"),
      "reason": string or null,
      "method": string or null,
      "upi_id": string or null,
      "phone_number": string or null,
      "url": string or null,
      "is_verification_small_amount": boolean (true if nominal amount like ₹1, ₹2 is used as a verification trap),
      "risk_level": "SAFE"|"LOW"|"MEDIUM"|"HIGH"|"CRITICAL",
      "explanation": string or null
    },
12. "scam_lens": {
      "manipulation_score": integer 0-100 (measures how strongly the message pressures, deceives, or emotionally influences the victim),
      "attack_chain": array of {
        "stage": one of "AUTHORITY"|"FEAR"|"URGENCY"|"REWARD"|"ISOLATION"|"DECEPTION"|"PAYMENT_PRESSURE"|"CREDENTIAL_PRESSURE"|"TRUST_BUILDING"|"CONSEQUENCE_THREAT"|"REMOTE_ACCESS_REQUEST",
        "severity": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL",
        "confidence": float 0.70-1.0,
        "evidence": short exact quote from message,
        "explanation": brief explanation of the psychological technique,
        "why_it_matters": concise why this matters to the victim
      },
      "likely_objective": string (cautious wording e.g. "Make you authorize a payment.", "Obtain your OTP or UPI PIN.", "Make you install remote-access software.", "Prevent you from independently verifying the request."),
      "safest_pause_point": string (e.g. "Stop before making the payment and verify the request through the official electricity provider."),
      "hindi_explanation": string (Hindi explanation of how the message attempts to manipulate the recipient),
      "highlights": array of { "text": string (quote), "label": string (e.g. "FEAR / THREAT", "ARTIFICIAL URGENCY", "PAYMENT PRETEXT", "VICTIM ISOLATION"), "stage": string },
      "status_summary": string (e.g. "UPI-Shield detected a 5-step social-engineering attack.")
    }

Crucial Rules:
- ScamLens Attack Chain: Only select stages genuinely present in the message. Do NOT force all stages into every result. Order stages by their flow of manipulation.
- If the message is a legitimate notice (e.g. bill due date without coercion), manipulation_score should be low (<15) and attack_chain should be empty [].
- Support Hinglish slang & phrases ("turant", "warna", "kat jayega", "paisa bhejo", "account block").
- Understand that nominal ₹1 or ₹2 verification payments are high-risk pretexts.
- Understand that asking a user to scan a QR code to RECEIVE money is a high-risk scam.
- AnyDesk/TeamViewer/screen sharing requests are CRITICAL risk.
- Return ONLY valid JSON conforming to the schema.
`;

  try {
    const config = {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risk_score: { type: Type.INTEGER },
          risk_level: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          language: { type: Type.STRING },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                description: { type: Type.STRING },
              },
              required: ['name', 'confidence'],
            },
          },
          signal_breakdown: {
            type: Type.OBJECT,
            properties: {
              urgency: { type: Type.NUMBER },
              fear: { type: Type.NUMBER },
              authority_impersonation: { type: Type.NUMBER },
              payment_pressure: { type: Type.NUMBER },
              credential_request: { type: Type.NUMBER },
              verification_pretext: { type: Type.NUMBER },
              remote_access_request: { type: Type.NUMBER },
              qr_payment_request: { type: Type.NUMBER },
              suspicious_link: { type: Type.NUMBER },
              coercion: { type: Type.NUMBER },
              social_engineering: { type: Type.NUMBER },
            },
            required: [
              'urgency',
              'fear',
              'authority_impersonation',
              'payment_pressure',
              'credential_request',
              'verification_pretext',
              'remote_access_request',
              'qr_payment_request',
              'suspicious_link',
              'coercion',
              'social_engineering',
            ],
          },
          signals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                severity: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                score: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                evidence: { type: Type.STRING },
              },
              required: ['name', 'severity', 'confidence', 'explanation'],
            },
          },
          why_suspicious: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          warnings: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              hindi: { type: Type.STRING },
            },
            required: ['english', 'hindi'],
          },
          payment: {
            type: Type.OBJECT,
            properties: {
              detected: { type: Type.BOOLEAN },
              amount: { type: Type.STRING },
              reason: { type: Type.STRING },
              method: { type: Type.STRING },
              upi_id: { type: Type.STRING },
              phone_number: { type: Type.STRING },
              url: { type: Type.STRING },
              is_verification_small_amount: { type: Type.BOOLEAN },
              risk_level: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['detected', 'is_verification_small_amount', 'risk_level'],
          },
          scam_lens: {
            type: Type.OBJECT,
            properties: {
              manipulation_score: { type: Type.INTEGER },
              attack_chain: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stage: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    evidence: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    why_it_matters: { type: Type.STRING },
                  },
                  required: ['stage', 'severity', 'confidence', 'evidence', 'explanation'],
                },
              },
              likely_objective: { type: Type.STRING },
              safest_pause_point: { type: Type.STRING },
              hindi_explanation: { type: Type.STRING },
              highlights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    label: { type: Type.STRING },
                    stage: { type: Type.STRING },
                  },
                  required: ['text', 'label', 'stage'],
                },
              },
              status_summary: { type: Type.STRING },
            },
            required: ['manipulation_score', 'attack_chain', 'likely_objective', 'safest_pause_point'],
          },
        },
        required: [
          'risk_score',
          'risk_level',
          'confidence',
          'language',
          'categories',
          'signal_breakdown',
          'signals',
          'why_suspicious',
          'recommendations',
          'warnings',
          'payment',
        ],
      },
    };

    // Resilient model fallback: Try primary gemini-3.8-flash; if unavailable (503/429), try gemini-3.1-flash-lite
    const candidateModels = [
      { id: 'gemini-3.8-flash', mode: 'gemini-ai' as const },
      { id: 'gemini-3.1-flash-lite', mode: 'gemini-flash-lite' as const },
    ];

    let jsonStr: string | null = null;
    let engineMode: 'gemini-ai' | 'gemini-flash-lite' = 'gemini-ai';

    for (const candidate of candidateModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await client.models.generateContent({
            model: candidate.id,
            contents: `Analyze this payment message:\n"""\n${text}\n"""\nPreferred language mode: ${forcedLanguage || 'auto'}`,
            config,
          });

          const resText = response.text?.trim();
          if (resText) {
            jsonStr = resText;
            engineMode = candidate.mode;
            break;
          }
        } catch (callErr: any) {
          const errString = callErr?.message || String(callErr);
          const isBusyOrTransient =
            errString.includes('503') ||
            errString.includes('UNAVAILABLE') ||
            errString.includes('high demand') ||
            errString.includes('RESOURCE_EXHAUSTED') ||
            errString.includes('429');

          if (isBusyOrTransient && attempt === 0) {
            // Brief backoff before retry or switching model
            await new Promise((resolve) => setTimeout(resolve, 350));
            continue;
          }
          // Move to next candidate model
          break;
        }
      }

      if (jsonStr) break;
    }

    if (!jsonStr) {
      console.log('[UPI-Shield Engine] Gemini models busy or unavailable; operating on local heuristic fallback.');
      return localFallback;
    }

    const parsed = JSON.parse(jsonStr);

    // Validate risk level
    const validLevels = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const normalizedRiskLevel = validLevels.includes(parsed.risk_level?.toUpperCase())
      ? (parsed.risk_level.toUpperCase() as AnalysisResponse['risk_level'])
      : localFallback.risk_level;

    // Also enrich with UPI intent parser if upi:// link is present in text
    const upiIntent = parseUpiString(text);

    return {
      risk_score: Math.min(100, Math.max(0, Number(parsed.risk_score) || localFallback.risk_score)),
      risk_level: normalizedRiskLevel,
      confidence: Number(parsed.confidence) || 0.94,
      language: parsed.language || localFallback.language,
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : localFallback.categories,
      signals: parsed.signals && parsed.signals.length > 0 ? parsed.signals : localFallback.signals,
      signal_breakdown: parsed.signal_breakdown || localFallback.signal_breakdown,
      payment: {
        ...localFallback.payment,
        ...parsed.payment,
        detected: parsed.payment?.detected ?? localFallback.payment.detected,
      },
      upi_intent: upiIntent || localFallback.upi_intent,
      why_suspicious: parsed.why_suspicious && parsed.why_suspicious.length > 0 ? parsed.why_suspicious : localFallback.why_suspicious,
      recommendations: parsed.recommendations && parsed.recommendations.length > 0 ? parsed.recommendations : localFallback.recommendations,
      warnings: {
        english: parsed.warnings?.english || localFallback.warnings.english,
        hindi: parsed.warnings?.hindi || localFallback.warnings.hindi,
      },
      scam_lens: parsed.scam_lens && Array.isArray(parsed.scam_lens.attack_chain)
        ? {
            manipulation_score: Math.min(100, Math.max(0, Number(parsed.scam_lens.manipulation_score) || (localFallback.scam_lens?.manipulation_score ?? 85))),
            attack_chain: parsed.scam_lens.attack_chain,
            likely_objective: parsed.scam_lens.likely_objective || localFallback.scam_lens?.likely_objective || 'Make you authorize a payment.',
            safest_pause_point: parsed.scam_lens.safest_pause_point || localFallback.scam_lens?.safest_pause_point || 'The safest point to stop is before making the requested payment.',
            hindi_explanation: parsed.scam_lens.hindi_explanation || localFallback.scam_lens?.hindi_explanation,
            highlights: parsed.scam_lens.highlights || localFallback.scam_lens?.highlights || [],
            status_summary: parsed.scam_lens.status_summary || `UPI-Shield detected a ${parsed.scam_lens.attack_chain.length}-step social-engineering attack.`,
          }
        : localFallback.scam_lens,
      technical_analysis: {
        semantic_score: Math.round(Number(parsed.risk_score || 80) * 0.6),
        behavioral_score: Math.round(Number(parsed.risk_score || 80) * 0.25),
        technical_payment_score: Math.round(Number(parsed.risk_score || 80) * 0.15),
        engine_mode: engineMode,
        processed_at: new Date().toISOString(),
      },
    };
  } catch (_err) {
    console.log('[UPI-Shield Engine] Smoothly switched to local heuristic analysis.');
    return localFallback;
  }
}

export async function extractTextFromScreenshot(
  base64Data: string,
  mimeType: string
): Promise<{ text: string; source: string; confidence: number }> {
  const client = getGeminiClient();
  if (!client) {
    return {
      text: 'Sample screenshot OCR: "URGENT: Electricity connection will be cut off by 9:30 PM due to unpaid bill of ₹1,420. Call Electricity Officer at 9845123456 or verify immediately on UPI link." (Vision OCR requires Gemini API key)',
      source: 'Local Parser (No API Key)',
      confidence: 0.8,
    };
  }

  const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'] as const;

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/png',
              },
            },
            {
              text: 'Extract all visible text from this screenshot of an SMS, WhatsApp message, chat notification, or payment app screen. Return ONLY the exact extracted text as a plain string, preserving phone numbers, amounts, and payment links. Do not add markdown or preamble.',
            },
          ],
        },
      });

      const extracted = response.text?.trim() || '';
      if (extracted) {
        return {
          text: extracted,
          source: `Gemini Multimodal Vision (${model})`,
          confidence: 0.95,
        };
      }
    } catch (_ocrErr) {
      continue;
    }
  }

  return {
    text: 'Unable to extract text automatically from image. Please paste the message text into the analyzer.',
    source: 'Vision Parser Fallback',
    confidence: 0.5,
  };
}
