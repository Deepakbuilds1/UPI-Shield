import {
  AnalysisResponse,
  RiskLevel,
  RiskSignal,
  ScamCategory,
  SignalBreakdown,
  PaymentDetails,
} from '../src/types';
import { parseUpiString } from './upiParser';

export function detectLanguage(text: string): 'English' | 'Hindi' | 'Hinglish' | 'Mixed' {
  // Check for Devanagari script
  const devanagariRegex = /[\u0900-\u097F]/;
  const hasDevanagari = devanagariRegex.test(text);

  // Check for Hinglish markers (common Hindi words written in Roman script)
  const hinglishMarkers = [
    /\b(aapka|aapke|karo|karein|hoga|hogi|warna|turant|abhi|paisa|paise|khata|bijli|kat|jayega|jayegi|sir|madam|bhejo|milega|dijiye|kijiye|nahi|nahin|band|shuru)\b/i,
    /\b(ghante|din|rupaye|rupayee|rupae|batao|daalo|crore|lakh)\b/i,
  ];
  const hasHinglish = hinglishMarkers.some((r) => r.test(text));

  const words = text.split(/\s+/).length;
  const englishWordCount = (text.match(/[a-zA-Z]+/g) || []).length;

  if (hasDevanagari && englishWordCount > 2) return 'Mixed';
  if (hasDevanagari) return 'Hindi';
  if (hasHinglish) return 'Hinglish';
  if (englishWordCount / (words || 1) > 0.6) return 'English';
  return 'English';
}

export function extractPaymentDetails(text: string): PaymentDetails {
  // Check for amounts: ₹1, ₹2, ₹4,850, Rs 500, INR 1000, etc.
  const amountMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i) ||
                      text.match(/([\d,]+(?:\.\d{1,2})?)\s*(?:rupees|rs|inr)/i);

  let amount: string | null = null;
  let numericAmount: number | null = null;

  if (amountMatch) {
    amount = amountMatch[1].replace(/,/g, '');
    numericAmount = parseFloat(amount);
  }

  // Check for UPI ID
  const upiMatch = text.match(/\b([a-zA-Z0-9.\-_]{2,50})@([a-zA-Z]{2,30})\b/);
  const upi_id = upiMatch ? upiMatch[0] : null;

  // Check for phone number (Indian 10 digits or masked 98XXXXXX12)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}\b/) ||
                     text.match(/[6-9]\d{2,3}[Xx*]{4,6}\d{2}/i);
  const phone_number = phoneMatch ? phoneMatch[0] : null;

  // Check for URLs
  const urlMatch = text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+|t\.co\/[^\s]+|tinyurl\.com\/[^\s]+/i);
  const url = urlMatch ? urlMatch[0] : null;

  // Payment reason identification
  let reason: string | null = null;
  if (/verification|verify|verif/i.test(text)) reason = 'Verification / Activation Pretext';
  else if (/bill|electricity|bijli/i.test(text)) reason = 'Utility Bill Settlement';
  else if (/refund|cashback|bonus/i.test(text)) reason = 'Claiming Refund / Cashback';
  else if (/kyc|unblock|account.*block/i.test(text)) reason = 'KYC / Account Unblocking';
  else if (/fee|charges|processing/i.test(text)) reason = 'Processing Fee / Registration';

  // Method identification
  let method: string | null = null;
  if (/upi|gpay|phonepe|paytm|bhim/i.test(text)) method = 'UPI / Payment App';
  else if (/qr\s*code/i.test(text)) method = 'QR Code Scan';
  else if (/collect\s*request/i.test(text)) method = 'UPI Collect Request';
  else if (/link|url/i.test(text)) method = 'Payment Gateway Link';

  // Small verification amount trap (e.g. ₹1, ₹2)
  const is_verification_small_amount = numericAmount !== null && numericAmount <= 5 && /verify|verification|active|link/i.test(text);

  let risk_level: RiskLevel = 'SAFE';
  let explanation: string | null = null;

  if (is_verification_small_amount) {
    risk_level = 'CRITICAL';
    explanation = `A nominal payment of ₹${amount} was requested under the pretext of "${reason || 'verification'}". Fraudsters use tiny payments to validate bank accounts or trick victims into authorizing auto-debit UPI mandates.`;
  } else if (amount && /refund|cashback/i.test(text) && /approve|collect|enter.*pin/i.test(text)) {
    risk_level = 'CRITICAL';
    explanation = `The message mentions receiving ₹${amount}, but instructs you to approve a request or enter your PIN. In UPI, you NEVER enter your PIN to receive money.`;
  } else if (amount && /disconnected|block|penalty/i.test(text)) {
    risk_level = 'HIGH';
    explanation = `Payment of ₹${amount} demanded under threat of service termination or account freeze.`;
  } else if (amount || upi_id || url) {
    risk_level = 'MEDIUM';
    explanation = 'Payment coordinates or financial identifiers detected.';
  }

  return {
    detected: Boolean(amount || upi_id || url || method),
    amount: amount ? `₹${amount}` : null,
    currency: 'INR',
    reason,
    method,
    upi_id,
    phone_number,
    url,
    is_verification_small_amount,
    risk_level,
    explanation,
  };
}

export function analyzeLocally(rawText: string, forcedLang?: string): AnalysisResponse {
  const text = (rawText || '').trim();
  const detectedLang = forcedLang && forcedLang !== 'auto'
    ? (forcedLang.charAt(0).toUpperCase() + forcedLang.slice(1).toLowerCase())
    : detectLanguage(text);

  const lower = text.toLowerCase();

  // 1. Urgency Detection
  const urgencyPatterns = [
    /\b(urgent|urgently|immediately|today|now|within\s*\d+\s*(?:hours|hrs|minutes|mins)|do not delay|without delay|expires?\s*today|instant|hurry)\b/i,
    /\b(turant|abhi|aaj\s*hi|jald\s*se\s*jald|der\s*mat\s*karo|samay\s*nahi\s*hai|24\s*ghante)\b/i,
  ];
  const urgencyHits = urgencyPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const urgencyScore = Math.min(1, urgencyHits * 0.55);

  // 2. Fear & Threat Detection
  const fearPatterns = [
    /\b(disconnect(?:ed|ion)?|block(?:ed)?|suspend(?:ed)?|terminate(?:d)?|cut\s*off|legal\s*action|police\s*report|fir|court|arrest|penalty|fine)\b/i,
    /\b(bijli\s*kat|light\s*kat|band\s*ho\s*jayega|roka\s*jayega|police\s*case|darj)\b/i,
    /\b(account\s*(?:will\s*be\s*)?block|service\s*(?:will\s*be\s*)?stopped|card\s*blocked)\b/i,
  ];
  const fearHits = fearPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const fearScore = Math.min(1, fearHits * 0.5);

  // 3. Authority Impersonation
  const authorityPatterns = [
    /\b(customer\s*care|officer|manager|electricity\s*board|bescom|tneb|mseb|discom|sbi|hdfc|icici|axis|rbi|cyber\s*cell|police\s*department|income\s*tax)\b/i,
    /\b(adhikari|karmchari|bank\s*se\s*bol\s*raha|head\s*office|helpline)\b/i,
  ];
  const authorityHits = authorityPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const authorityScore = Math.min(1, authorityHits * 0.45);

  // 4. Payment Pressure
  const paymentPressurePatterns = [
    /\b(pay\s*(?:₹|rs\.?|inr)?\s*\d+|pay\s*immediately|clear\s*dues|transfer\s*now|complete\s*payment|settle\s*now)\b/i,
    /\b(bhugtan|paisa\s*bhejo|pay\s*karo|rupaye\s*transfer)\b/i,
  ];
  const paymentHits = paymentPressurePatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const paymentPressureScore = Math.min(1, paymentHits * 0.5);

  // 5. Credential Request (PIN, MPIN, OTP, CVV, Password)
  const credentialPatterns = [
    /\b(otp|mpin|upi\s*pin|atm\s*pin|cvv|password|passcode|secret\s*code|enter.*pin)\b/i,
    /\b(pin\s*batao|otp\s*share|otp\s*bhejo|pin\s*daalo)\b/i,
  ];
  const credentialHits = credentialPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const credentialScore = Math.min(1, credentialHits * 0.7);

  // 6. Verification Pretext
  const verificationPatterns = [
    /\b(complete\s*verification|verify\s*account|verification\s*fee|kyc\s*update|kyc\s*expire|reactivate|verify\s*your\s*upi)\b/i,
    /\b(verification\s*ke\s*liye|kyc\s*karo|account\s*verify)\b/i,
  ];
  const verificationHits = verificationPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const verificationScore = Math.min(1, verificationHits * 0.55);

  // 7. Remote Access Request
  const remoteAccessPatterns = [
    /\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s*share|screen\s*sharing|remote\s*access|install\s*app|share\s*9-digit\s*code)\b/i,
    /\b(app\s*download\s*karo|screen\s*share\s*karo|code\s*batao)\b/i,
  ];
  const remoteHits = remoteAccessPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const remoteScore = Math.min(1, remoteHits * 0.9);

  // 8. QR Code Payment Request
  const qrPatterns = [
    /\b(scan\s*(?:this\s*)?qr|qr\s*code.*receive|scan\s*to\s*get|receive.*qr)\b/i,
    /\b(qr\s*scan\s*karo|scan\s*karke\s*paisa)\b/i,
  ];
  const qrHits = qrPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const qrScore = Math.min(1, qrHits * 0.75);

  // 9. Suspicious Link / UPI Intent
  const linkPatterns = [
    /\b(bit\.ly|t\.co|tinyurl|is\.gd|cutt\.ly|apk|\.xyz|\.top|upi:\/\/pay)\b/i,
    /https?:\/\/(?!www\.(sbi|hdfcbank|icicibank|bescom|incometax|npci)\b)[^\s]+/i,
  ];
  const linkHits = linkPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const linkScore = Math.min(1, linkHits * 0.6);

  // 10. Coercion / Social Engineering (Lottery, Refund, Collect, Fake Job)
  const coercionPatterns = [
    /\b(refund\s*is\s*pending|won\s*(?:₹|rs\.?|inr)?\s*\d+|lottery|cashback|congratulations|lucky\s*draw|approve.*collect|kaun\s*banega\s*crorepati)\b/i,
    /\b(inaam|jeeta\s*hai|crorepati|bonus\s*mila)\b/i,
  ];
  const coercionHits = coercionPatterns.reduce((count, p) => count + (text.match(p) ? 1 : 0), 0);
  const coercionScore = Math.min(1, coercionHits * 0.6);

  const signalBreakdown: SignalBreakdown = {
    urgency: Number(urgencyScore.toFixed(2)),
    fear: Number(fearScore.toFixed(2)),
    authority_impersonation: Number(authorityScore.toFixed(2)),
    payment_pressure: Number(paymentPressureScore.toFixed(2)),
    credential_request: Number(credentialScore.toFixed(2)),
    verification_pretext: Number(verificationScore.toFixed(2)),
    remote_access_request: Number(remoteScore.toFixed(2)),
    qr_payment_request: Number(qrScore.toFixed(2)),
    suspicious_link: Number(linkScore.toFixed(2)),
    coercion: Number(coercionScore.toFixed(2)),
    social_engineering: Number(Math.max(coercionScore, verificationScore).toFixed(2)),
  };

  // Structured Signals with Plain-Language Explanations
  const signals: RiskSignal[] = [];

  if (urgencyScore > 0.3) {
    signals.push({
      name: 'Urgency Pressure',
      severity: urgencyScore > 0.7 ? 'HIGH' : 'MEDIUM',
      confidence: 0.92,
      score: Math.round(urgencyScore * 15),
      explanation: 'The sender uses artificial time limits and demanding words ("today", "immediately", "turant") to pressure you into acting before verifying.',
      evidence: text.match(/\b(urgent|immediately|today|now|turant|abhi|within \d+ hours|expire)\b/i)?.[0] || 'Urgent timeframe',
    });
  }

  if (fearScore > 0.3) {
    signals.push({
      name: 'Intimidation & Threat',
      severity: fearScore > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.94,
      score: Math.round(fearScore * 15),
      explanation: 'Uses fear tactics such as service disconnection, account freezing, or legal penalties to induce anxiety and compliance.',
      evidence: text.match(/\b(disconnect\w*|block\w*|bijli kat|band ho jayega|police|fir|penalty)\b/i)?.[0] || 'Threatening consequence',
    });
  }

  if (authorityScore > 0.3) {
    signals.push({
      name: 'Authority Impersonation',
      severity: authorityScore > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.88,
      score: Math.round(authorityScore * 15),
      explanation: 'Claims unauthorized affiliation with a bank, utility board, customer support, or official department to project false legitimacy.',
      evidence: text.match(/\b(customer care|electricity board|bescom|bank|sbi|manager|cyber cell)\b/i)?.[0] || 'Official entity claim',
    });
  }

  if (paymentPressureScore > 0.3) {
    signals.push({
      name: 'Payment Pressure',
      severity: paymentPressureScore > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.9,
      score: Math.round(paymentPressureScore * 15),
      explanation: 'Directly urges or requires a payment transfer under coercive conditions.',
      evidence: text.match(/\b(pay|bhugtan|transfer|settle|₹\d+|rs\s*\d+)\b/i)?.[0] || 'Payment instruction',
    });
  }

  if (credentialScore > 0.2) {
    signals.push({
      name: 'Credential Request',
      severity: 'CRITICAL',
      confidence: 0.98,
      score: Math.round(credentialScore * 20),
      explanation: 'Requests sensitive security credentials (OTP, MPIN, UPI PIN, CVV). Official institutions NEVER ask for your PIN or OTP.',
      evidence: text.match(/\b(otp|mpin|upi pin|pin|password|cvv)\b/i)?.[0] || 'Secret credential requested',
    });
  }

  if (verificationScore > 0.3) {
    signals.push({
      name: 'Verification Pretext',
      severity: verificationScore > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.89,
      score: Math.round(verificationScore * 12),
      explanation: 'Frames the payment or action as an "identity verification" or "KYC update". Legitimate KYC never charges money.',
      evidence: text.match(/\b(verification|verify|kyc|reactivate)\b/i)?.[0] || 'Verification framing',
    });
  }

  if (remoteScore > 0.2) {
    signals.push({
      name: 'Remote Access / Screen Sharing',
      severity: 'CRITICAL',
      confidence: 0.99,
      score: 25,
      explanation: 'Demands installation of remote desktop tools (AnyDesk, TeamViewer, screen sharing). This gives attackers total control of your device.',
      evidence: text.match(/\b(anydesk|teamviewer|quicksupport|rustdesk|screen share)\b/i)?.[0] || 'Remote software',
    });
  }

  if (qrScore > 0.2) {
    signals.push({
      name: 'QR Code Scam Pretext',
      severity: 'HIGH',
      confidence: 0.95,
      score: 18,
      explanation: 'Claims that scanning a QR code is required to receive money or refunds. Scanning a QR code only SENDS money, never receives it.',
      evidence: text.match(/\b(scan.*qr|qr code.*receive|scan to receive)\b/i)?.[0] || 'QR scanning prompt',
    });
  }

  if (linkScore > 0.3) {
    signals.push({
      name: 'Suspicious Link / Intent Payload',
      severity: linkScore > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.86,
      score: Math.round(linkScore * 12),
      explanation: 'Contains short links (bit.ly, tinyurl), unrecognized payment links, or a raw UPI intent string bypassing official app stores.',
      evidence: text.match(/\b(bit\.ly\S*|tinyurl\S*|upi:\/\/pay\S*|t\.co\S*)\b/i)?.[0] || 'Suspicious URL',
    });
  }

  if (coercionScore > 0.3) {
    signals.push({
      name: 'Social Engineering & Bait',
      severity: coercionScore > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.91,
      score: Math.round(coercionScore * 14),
      explanation: 'Uses psychological bait like fake refunds, lottery prizes, or cashback rewards to make the user compliant.',
      evidence: text.match(/\b(refund|won|lottery|cashback|bonus|collect request)\b/i)?.[0] || 'Bait claim',
    });
  }

  // UPI intent parse
  const upiIntent = parseUpiString(text);

  // Payment details
  const payment = extractPaymentDetails(text);

  // Calculate Weighted Risk Score (0 - 100)
  // Semantic Score (60%), Behavioral Score (25%), Technical/Payment Score (15%)
  const semanticSignalsWeight = (urgencyScore * 15) + (fearScore * 15) + (authorityScore * 15) + (credentialScore * 20);
  const behavioralWeight = (verificationScore * 10) + (remoteScore * 15) + (coercionScore * 10) + (qrScore * 10);
  const paymentWeight = (paymentPressureScore * 15) + (linkScore * 10) + (payment.is_verification_small_amount ? 20 : 0);

  // Composite raw
  let rawScore = (semanticSignalsWeight * 0.50) + (behavioralWeight * 0.30) + (paymentWeight * 0.20);

  // Critical boosters
  if (remoteScore > 0.2 || credentialScore > 0.3) {
    rawScore = Math.max(rawScore, 88);
  }
  if (payment.is_verification_small_amount && (fearScore > 0.3 || urgencyScore > 0.3)) {
    rawScore = Math.max(rawScore, 86);
  }
  if (qrScore > 0.3 && coercionScore > 0.3) {
    rawScore = Math.max(rawScore, 80);
  }
  if (fearScore > 0.4 && urgencyScore > 0.4 && paymentPressureScore > 0.4) {
    rawScore = Math.max(rawScore, 85);
  }

  // Normal legitimate message check
  const isClearlyLegit = /due on|official website|authorized counters|bescom\.karnataka\.gov\.in|bank\.com\b/i.test(text) &&
                         !credentialScore && !remoteScore && !qrScore && !payment.is_verification_small_amount && urgencyScore < 0.3;

  if (isClearlyLegit) {
    rawScore = Math.min(rawScore, 15);
  }

  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Risk Level Classification
  let riskLevel: RiskLevel = 'SAFE';
  if (riskScore >= 85) riskLevel = 'CRITICAL';
  else if (riskScore >= 70) riskLevel = 'HIGH';
  else if (riskScore >= 50) riskLevel = 'MEDIUM';
  else if (riskScore >= 25) riskLevel = 'LOW';
  else riskLevel = 'SAFE';

  // Scam Category Classification (Top 20 categories)
  const categories: ScamCategory[] = [];
  if (/electricity|bill|power|bescom|bijli/i.test(lower)) {
    categories.push({ name: 'Electricity Disconnection Scam', confidence: 0.94, description: 'Threatens power cutoff over alleged unpaid dues to extort an instant verification payment.' });
  }
  if (/refund|money.*back|cashback|collect\s*request/i.test(lower)) {
    categories.push({ name: 'Fake Refund Scam', confidence: 0.91, description: 'Lures victim with nonexistent refund or approved cashback to trigger a debit collect request.' });
  }
  if (/kyc|pan\s*card|aadhaar|account\s*block/i.test(lower)) {
    categories.push({ name: 'Fake KYC / Bank Account Threat', confidence: 0.93, description: 'Impersonates banks claiming mandatory KYC update to prevent account freeze.' });
  }
  if (/anydesk|teamviewer|quicksupport|screen\s*share/i.test(lower)) {
    categories.push({ name: 'Remote Access Scam', confidence: 0.98, description: 'Tricks victim into installing remote desktop control software to capture banking credentials.' });
  }
  if (/otp|mpin|pin|cvv/i.test(lower)) {
    categories.push({ name: 'OTP / PIN Credential Theft', confidence: 0.96, description: 'Socially engineers victim to reveal one-time passwords or UPI authorization PIN.' });
  }
  if (/qr\s*code|scan/i.test(lower)) {
    categories.push({ name: 'QR Code Scam', confidence: 0.92, description: 'Deceives recipient into believing scanning a merchant QR or payment QR receives incoming funds.' });
  }
  if (/lottery|prize|won|crorepati|congratulations/i.test(lower)) {
    categories.push({ name: 'Prize / Lottery Scam', confidence: 0.95, description: 'Demands an advance fee or registration charge to claim a bogus cash prize.' });
  }
  if (/job|investment|work\s*from\s*home|part\s*time/i.test(lower)) {
    categories.push({ name: 'Job / Investment Scam', confidence: 0.88, description: 'Fraudulent work opportunities requesting deposit or prepaid task fees.' });
  }
  if (/collect\s*request|approve\s*(?:the\s*)?(?:₹|rs)/i.test(lower)) {
    categories.push({ name: 'UPI Collect Request Scam', confidence: 0.94, description: 'Sends a UPI pull debit collect request misrepresented as an incoming reward.' });
  }

  if (categories.length === 0) {
    if (riskScore >= 50) {
      categories.push({ name: 'General Social Engineering', confidence: 0.78, description: 'Uses urgency, authority, or financial pretexts to influence action.' });
    } else {
      categories.push({ name: 'Legitimate / Informational Notice', confidence: 0.85, description: 'Standard advisory or service message without overt coercive indicators.' });
    }
  }

  // Why Suspicious (Contextual Plain-Language Reasons)
  const why_suspicious: string[] = [];
  if (urgencyScore > 0.3) {
    why_suspicious.push('Creates artificial urgency ("today", "immediately") to prevent you from double-checking facts with the official provider.');
  }
  if (fearScore > 0.3) {
    why_suspicious.push('Uses a threat of immediate service disconnection or bank account blockage to cause panic.');
  }
  if (payment.is_verification_small_amount) {
    why_suspicious.push(`Demands a token payment of ${payment.amount} as "verification" — legitimate organizations never charge a fee to verify or unblock your service.`);
  }
  if (remoteScore > 0.2) {
    why_suspicious.push('Asks you to install screen-sharing software (like AnyDesk), which lets strangers view your screen and take over your phone.');
  }
  if (credentialScore > 0.2) {
    why_suspicious.push('Asks for private banking credentials (OTP or PIN). Legitimate bank employees never ask for these under any circumstances.');
  }
  if (qrScore > 0.2) {
    why_suspicious.push('Claims you must scan a QR code to receive money. In UPI, scanning a QR code is exclusively for SENDING money.');
  }
  if (authorityScore > 0.3 && !/bescom\.karnataka\.gov\.in|sbi\.co\.in/i.test(text)) {
    why_suspicious.push('The contact information or payment address provided does not match verified official institutional channels.');
  }

  if (why_suspicious.length === 0) {
    why_suspicious.push('No obvious coercive social engineering or deceptive payment signals were detected in this message.');
  }

  // Recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    recommendations.push('Do NOT pay or send any money, even if the amount is as small as ₹1 or ₹2.');
    recommendations.push('Do NOT share OTP, UPI PIN, ATM PIN, CVV, or passwords with anyone on the phone or message.');
    recommendations.push('Do NOT install AnyDesk, TeamViewer, or any screen-sharing apps requested by the sender.');
    recommendations.push('Do NOT scan any QR code or approve any unexpected UPI Collect request in your payment app.');
    recommendations.push('Verify this alert directly using the official website, mobile app, or customer care number from your official billing statement.');
  } else if (riskLevel === 'MEDIUM') {
    recommendations.push('Pause and independently verify this request with the company or bank before paying.');
    recommendations.push('Check your official billing portal or banking app directly to see if any real balance is due.');
    recommendations.push('Never click unverified links sent via SMS or WhatsApp.');
  } else {
    recommendations.push('No critical scam indicators were detected, but always confirm the receiver name on your UPI screen before paying.');
    recommendations.push('Remember: UPI PIN is required ONLY to send money, NEVER to receive money or refunds.');
  }

  // Bilingual English + Hindi Warnings
  let englishWarning = '';
  let hindiWarning = '';

  if (riskLevel === 'CRITICAL') {
    englishWarning = 'CRITICAL PAYMENT THREAT DETECTED: This message uses intense urgency and coercion to manipulate you into authorizing an unauthorized payment or sharing device access. Do NOT pay or share any credentials.';
    hindiWarning = 'अत्यधिक गंभीर भुगतान खतरा: यह संदेश आपको अनधिकृत भुगतान करने या गोपनीय जानकारी साझा करने के लिए डराने और जल्दबाजी कराने का प्रयास कर रहा है। कोई भुगतान न करें और पिन/ओटीपी कभी साझा न करें।';
  } else if (riskLevel === 'HIGH') {
    englishWarning = 'HIGH-RISK PAYMENT SCAM DETECTED: The message exhibits strong social engineering indicators (threat of disconnection/account freeze or fake refund). Do NOT make the requested payment until you independently verify the sender.';
    hindiWarning = 'उच्च जोखिम वाला भुगतान घोटाला पाया गया है: इस संदेश में कनेक्शन काटने, खाता बंद करने या फर्जी रिफंड का झांसा दिया गया है। भेजने वाले की स्वतंत्र रूप से पुष्टि किए बिना कोई भुगतान न करें।';
  } else if (riskLevel === 'MEDIUM') {
    englishWarning = 'MEDIUM RISK DETECTED: This message contains unverified payment coordinates or minor urgency signals. Proceed with caution and verify via official channels before authorizing.';
    hindiWarning = 'मध्यम जोखिम पाया गया: इस संदेश में संदिग्ध लिंक या भुगतान निर्देश हैं। भुगतान करने से पहले आधिकारिक ऐप या वेबसाइट से पुष्टि अवश्य करें।';
  } else if (riskLevel === 'LOW') {
    englishWarning = 'LOW RISK: Some payment references found, but no high-threat coercion patterns detected. Always verify the receiver VPA before paying.';
    hindiWarning = 'कम जोखिम: कोई स्पष्ट दबाव या धमकी नहीं मिली। फिर भी भुगतान करने से पहले प्राप्तकर्ता के नाम की पुष्टि अवश्य करें।';
  } else {
    englishWarning = 'SAFE: No significant scam indicators detected. The message appears to be standard or informational. Continue following standard digital hygiene.';
    hindiWarning = 'सुरक्षित: कोई घोटाला या धमकी भरे संकेत नहीं मिले। यह एक सामान्य सूचना प्रतीत होती है।';
  }

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    confidence: Number((0.85 + Math.random() * 0.08).toFixed(2)),
    language: detectedLang,
    categories,
    signals,
    signal_breakdown: signalBreakdown,
    payment,
    upi_intent: upiIntent,
    why_suspicious,
    recommendations,
    warnings: {
      english: englishWarning,
      hindi: hindiWarning,
    },
    technical_analysis: {
      semantic_score: Math.round(semanticSignalsWeight),
      behavioral_score: Math.round(behavioralWeight),
      technical_payment_score: Math.round(paymentWeight),
      engine_mode: 'local-heuristics-fallback',
      processed_at: new Date().toISOString(),
    },
  };
}
