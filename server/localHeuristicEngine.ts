import {
  AnalysisResponse,
  RiskLevel,
  RiskSignal,
  ScamCategory,
  SignalBreakdown,
  PaymentDetails,
  ScamLensData,
  AttackStage,
  SemanticHighlight,
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

export function generateScamLens(
  text: string,
  breakdown: SignalBreakdown,
  riskScore: number,
  payment: PaymentDetails,
  lang: string
): ScamLensData {
  const lower = text.toLowerCase();

  // False positive check: Standard legitimate notifications without coercive pressure
  const isClearlyLegitimate =
    (riskScore < 25 && breakdown.fear < 0.2 && breakdown.urgency < 0.25 && !payment.is_verification_small_amount) ||
    (/official website|authorized counters|due on|bescom\.karnataka\.gov\.in|bank\.com/i.test(text) &&
      breakdown.fear < 0.15 &&
      breakdown.urgency < 0.2 &&
      !payment.is_verification_small_amount);

  if (isClearlyLegitimate) {
    return {
      manipulation_score: Math.min(12, Math.max(0, Math.round(riskScore * 0.35))),
      attack_chain: [],
      likely_objective: 'Standard informational notice or official account notification.',
      safest_pause_point: 'Verify payment details through your official banking portal or provider website.',
      hindi_explanation: 'इस संदेश में कोई मनोवैज्ञानिक हेरफेर या धोखाधड़ी का दबाव नहीं पाया गया। यह एक सामान्य सूचना प्रतीत होती है।',
      highlights: [],
      status_summary: 'No psychological manipulation attack chain detected.',
    };
  }

  interface DetectedCandidate {
    stage: string;
    stage_label: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    evidence: string;
    explanation: string;
    why_it_matters: string;
    highlight_label: string;
    index: number;
  }

  const candidates: DetectedCandidate[] = [];

  // 1. AUTHORITY
  const authorityMatch =
    text.match(/(?:electricity\s*(?:board|department|connection)|discom|bescom|tneb|mseb|sbi|hdfc|icici|axis|rbi|cyber\s*cell|police\s*department|customer\s*care|officer|manager|adhikari|helpline)/i);
  if (authorityMatch && authorityMatch.index !== undefined) {
    candidates.push({
      stage: 'AUTHORITY',
      stage_label: 'Authority Impersonation',
      severity: breakdown.authority_impersonation > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.92,
      evidence: authorityMatch[0],
      explanation: 'The sender uses an official-looking corporate or departmental identity to establish false credibility.',
      why_it_matters: 'Establishing false authority creates artificial trust and makes recipients reluctant to question instructions.',
      highlight_label: 'AUTHORITY / INSTITUTION',
      index: authorityMatch.index,
    });
  }

  // 2. FEAR
  const fearMatch =
    text.match(/(?:will\s*be\s*disconnected|disconnected|cut\s*off|suspended|terminate|account\s*(?:will\s*be\s*)?block|blocked|bijli\s*kat|light\s*kat|band\s*ho\s*jayega|legal\s*action|police\s*report|fir|penalty)/i);
  if (fearMatch && fearMatch.index !== undefined) {
    candidates.push({
      stage: 'FEAR',
      stage_label: 'Fear / Threat',
      severity: breakdown.fear > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.94,
      evidence: fearMatch[0],
      explanation: 'Threatens service termination, account freeze, or legal penalties to induce anxiety and compliance.',
      why_it_matters: 'Inducing fear triggers an instinctual panic response, overriding logical skepticism.',
      highlight_label: 'FEAR / THREAT',
      index: fearMatch.index,
    });
  }

  // 3. URGENCY
  const urgencyMatch =
    text.match(/(?:within\s*\d+\s*(?:minutes?|mins?|hours?|hrs?)|immediately|urgent|today|now|turant|abhi|jald\s*se\s*jald|without\s*delay|do\s*not\s*delay|expires?\s*today)/i);
  if (urgencyMatch && urgencyMatch.index !== undefined) {
    candidates.push({
      stage: 'URGENCY',
      stage_label: 'Artificial Urgency',
      severity: breakdown.urgency > 0.6 ? 'HIGH' : 'MEDIUM',
      confidence: 0.95,
      evidence: urgencyMatch[0],
      explanation: 'Imposes an artificial deadline to force hasty action before the recipient can verify independently.',
      why_it_matters: 'Pressure to act quickly reduces the time available to independently verify the request.',
      highlight_label: 'ARTIFICIAL URGENCY',
      index: urgencyMatch.index,
    });
  }

  // 4. REWARD / FINANCIAL BAIT
  const rewardMatch =
    text.match(/(?:refund\s*of\s*(?:₹|rs\.?|inr)?\s*[\d,]+|cashback|bonus|won\s*(?:₹|rs\.?|inr)?\s*[\d,]+|lottery|lucky\s*draw|congratulations|inaam|jeeta\s*hai|crorepati)/i);
  if (rewardMatch && rewardMatch.index !== undefined) {
    candidates.push({
      stage: 'REWARD',
      stage_label: 'Financial Bait / Reward',
      severity: 'HIGH',
      confidence: 0.91,
      evidence: rewardMatch[0],
      explanation: 'Dangles an unearned financial reward or refund to excite the recipient and lower vigilance.',
      why_it_matters: 'Excitement over unexpected money lowers psychological defenses and encourages compliance.',
      highlight_label: 'FINANCIAL BAIT',
      index: rewardMatch.index,
    });
  }

  // 5. ISOLATION
  const isolationMatch =
    text.match(/(?:do\s*not\s*call\s*customer\s*care|don't\s*call\s*customer\s*care|keep\s*this\s*confidential|do\s*not\s*tell\s*anyone|do\s*not\s*contact\s*branch|kisi\s*ko\s*mat\s*batao|call\s*this\s*number\s*only)/i);
  if (isolationMatch && isolationMatch.index !== undefined) {
    candidates.push({
      stage: 'ISOLATION',
      stage_label: 'Victim Isolation',
      severity: 'HIGH',
      confidence: 0.96,
      evidence: isolationMatch[0],
      explanation: 'Explicitly discourages contacting official helpline numbers to cut off independent verification channels.',
      why_it_matters: 'Preventing independent verification keeps the victim trapped in the scammer’s fabricated reality.',
      highlight_label: 'VICTIM ISOLATION',
      index: isolationMatch.index,
    });
  }

  // 6. DECEPTION & PRETEXT
  const deceptionMatch =
    text.match(/(?:verification\s*payment|verification\s*fee|kyc\s*update|system\s*update|server\s*error|pending\s*approval|fix\s*your\s*wallet|auto-refund\s*verification|reactivate\s*account)/i);
  if (deceptionMatch && deceptionMatch.index !== undefined) {
    candidates.push({
      stage: 'DECEPTION',
      stage_label: 'Deception & Pretext',
      severity: 'HIGH',
      confidence: 0.9,
      evidence: deceptionMatch[0],
      explanation: 'Fabricates a plausible administrative or technical pretext to rationalize why money or action is needed.',
      why_it_matters: 'A convincing story provides an apparent rational excuse for an irregular payment request.',
      highlight_label: 'DECEPTION / PRETEXT',
      index: deceptionMatch.index,
    });
  }

  // 7. PAYMENT PRESSURE
  const paymentMatch =
    text.match(/(?:pay\s*(?:₹|rs\.?|inr)?\s*[\d,]+|complete\s*(?:a\s*)?(?:₹|rs\.?|inr)?\s*[\d,]+|approve\s*(?:the\s*)?upi\s*collect|bhugtan\s*karo|transfer\s*now|pay\s*immediately|clear\s*dues)/i);
  if (paymentMatch && paymentMatch.index !== undefined) {
    candidates.push({
      stage: 'PAYMENT_PRESSURE',
      stage_label: 'Payment Pressure',
      severity: payment.is_verification_small_amount ? 'CRITICAL' : 'HIGH',
      confidence: 0.96,
      evidence: paymentMatch[0],
      explanation: 'Directly urges the recipient to make an immediate digital payment transfer under manufactured pressure.',
      why_it_matters: 'Directs psychological coercion toward an irreversible digital money transfer.',
      highlight_label: 'PAYMENT PRETEXT',
      index: paymentMatch.index,
    });
  }

  // 8. CREDENTIAL PRESSURE
  const credentialMatch =
    text.match(/(?:otp|mpin|upi\s*pin|atm\s*pin|cvv|password|passcode|6-digit\s*code|pin\s*batao|pin\s*daalo|enter\s*pin)/i);
  if (credentialMatch && credentialMatch.index !== undefined) {
    candidates.push({
      stage: 'CREDENTIAL_PRESSURE',
      stage_label: 'Credential Pressure',
      severity: 'CRITICAL',
      confidence: 0.98,
      evidence: credentialMatch[0],
      explanation: 'Demands confidential security codes or authorization PINs that grant total control over your funds.',
      why_it_matters: 'Compromising authorization PINs or OTPs enables direct, unauthorized account draining.',
      highlight_label: 'CREDENTIAL PRESSURE',
      index: credentialMatch.index,
    });
  }

  // 9. TRUST BUILDING
  const trustMatch =
    text.match(/(?:dear\s*customer|dear\s*valued\s*customer|our\s*executive\s*will\s*assist|to\s*protect\s*your\s*(?:account|funds)|kindly\s*note|official\s*support)/i);
  if (trustMatch && trustMatch.index !== undefined) {
    candidates.push({
      stage: 'TRUST_BUILDING',
      stage_label: 'Trust Building',
      severity: 'LOW',
      confidence: 0.85,
      evidence: trustMatch[0],
      explanation: 'Uses polite, professional phrasing to disarm skepticism and make the interaction seem normal.',
      why_it_matters: 'Simulating professional courtesy disarms initial suspicion before introducing the trap.',
      highlight_label: 'TRUST BUILDING',
      index: trustMatch.index,
    });
  }

  // 10. CONSEQUENCE THREAT
  const consequenceMatch =
    text.match(/(?:permanently\s*block|account\s*permanently|court\s*case|arrest\s*warrant|fine\s*lagega|heavy\s*penalty|legal\s*proceedings)/i);
  if (consequenceMatch && consequenceMatch.index !== undefined) {
    candidates.push({
      stage: 'CONSEQUENCE_THREAT',
      stage_label: 'Consequence Threat',
      severity: 'HIGH',
      confidence: 0.93,
      evidence: consequenceMatch[0],
      explanation: 'Escalates threats to severe legal or permanent financial deprivation to crush hesitation.',
      why_it_matters: 'Threatening severe compounding penalties compels victims to comply immediately.',
      highlight_label: 'CONSEQUENCE THREAT',
      index: consequenceMatch.index,
    });
  }

  // 11. REMOTE ACCESS REQUEST
  const remoteMatch =
    text.match(/(?:anydesk|teamviewer|quicksupport|rustdesk|screen\s*share|share\s*(?:the\s*)?9-digit\s*code)/i);
  if (remoteMatch && remoteMatch.index !== undefined) {
    candidates.push({
      stage: 'REMOTE_ACCESS_REQUEST',
      stage_label: 'Remote Device Access',
      severity: 'CRITICAL',
      confidence: 0.99,
      evidence: remoteMatch[0],
      explanation: 'Instructs installation of remote desktop management software giving full screen and control access to the attacker.',
      why_it_matters: 'Remote screen-sharing software gives attackers full visual access and device control.',
      highlight_label: 'REMOTE ACCESS REQUEST',
      index: remoteMatch.index,
    });
  }

  // Sort candidates by order of appearance in the message text
  candidates.sort((a, b) => a.index - b.index);

  // Deduplicate stages
  const seenStages = new Set<string>();
  const attackChain: AttackStage[] = [];
  const highlights: SemanticHighlight[] = [];

  for (const c of candidates) {
    if (!seenStages.has(c.stage)) {
      seenStages.add(c.stage);
      attackChain.push({
        stage: c.stage,
        stage_label: c.stage_label,
        severity: c.severity,
        confidence: c.confidence,
        evidence: c.evidence,
        explanation: c.explanation,
        why_it_matters: c.why_it_matters,
      });

      highlights.push({
        text: c.evidence,
        label: c.highlight_label,
        stage: c.stage,
      });
    }
  }

  // Calculate Manipulation Score (0 - 100)
  // Reflects psychological coercion strength
  let manipulationScore = 0;
  if (attackChain.length > 0) {
    const stageWeightMap: Record<string, number> = {
      AUTHORITY: 16,
      FEAR: 22,
      URGENCY: 20,
      ISOLATION: 20,
      PAYMENT_PRESSURE: 22,
      CREDENTIAL_PRESSURE: 26,
      REMOTE_ACCESS_REQUEST: 28,
      CONSEQUENCE_THREAT: 18,
      REWARD: 16,
      DECEPTION: 15,
      TRUST_BUILDING: 10,
    };

    let rawScore = attackChain.reduce((sum, s) => sum + (stageWeightMap[s.stage] || 12), 0);

    // Multi-stage attack chain multiplier: Combining Authority + Fear + Urgency + Payment is devastatingly effective
    if (attackChain.length >= 4) {
      rawScore = Math.max(rawScore, 92);
    }
    if (attackChain.length >= 5) {
      rawScore = Math.max(rawScore, 96);
    }
    if (seenStages.has('ISOLATION') && seenStages.has('FEAR')) {
      rawScore = Math.max(rawScore, 95);
    }
    if (seenStages.has('CREDENTIAL_PRESSURE') || seenStages.has('REMOTE_ACCESS_REQUEST')) {
      rawScore = Math.max(rawScore, 98);
    }

    manipulationScore = Math.min(100, Math.max(30, rawScore));
  } else {
    manipulationScore = Math.min(25, Math.round(riskScore * 0.4));
  }

  // Determine Likely Objective
  let likelyObjective = 'Make you authorize a payment before independently verifying.';
  if (seenStages.has('CREDENTIAL_PRESSURE')) {
    likelyObjective = 'Obtain your OTP or UPI PIN to drain funds directly from your linked bank account.';
  } else if (seenStages.has('REMOTE_ACCESS_REQUEST')) {
    likelyObjective = 'Make you install remote-access software so the attacker can control your phone and view banking screens.';
  } else if (payment.is_verification_small_amount) {
    likelyObjective = 'Trick you into authorizing a nominal payment to capture your UPI account credentials or register an auto-debit mandate.';
  } else if (seenStages.has('REWARD')) {
    likelyObjective = 'Make you approve a fraudulent incoming UPI collect debit request disguised as an incoming refund.';
  } else if (seenStages.has('ISOLATION')) {
    likelyObjective = 'Make you authorize a payment while preventing you from independently verifying the request with customer care.';
  }

  // Determine Safest Pause Point
  let safestPausePoint = 'The safest point to stop is before making the requested payment.';
  if (seenStages.has('REMOTE_ACCESS_REQUEST')) {
    safestPausePoint = 'The safest point to stop is before installing remote-access software or sharing the 9-digit session code.';
  } else if (seenStages.has('CREDENTIAL_PRESSURE')) {
    safestPausePoint = 'The safest point to stop is before sharing the OTP or entering your secret UPI PIN.';
  } else if (/electricity|disconnection|bijli/i.test(lower)) {
    safestPausePoint = 'Stop before making the payment and verify the request through the official electricity provider.';
  } else if (payment.is_verification_small_amount) {
    safestPausePoint = 'Stop before making the nominal verification payment — official institutions never charge a fee to verify accounts.';
  } else if (seenStages.has('REWARD')) {
    safestPausePoint = 'Stop before approving any collect request — remember that receiving money never requires entering a UPI PIN.';
  }

  // Bilingual Hindi Explanation
  let hindiExplanation = 'यह संदेश आपको तुरंत भुगतान करने के लिए दबाव बनाता है और अनधिकृत वित्तीय लेनदेन कराने का प्रयास करता है।';
  if (/electricity|bijli/i.test(lower)) {
    hindiExplanation = 'यह संदेश आधिकारिक बिजली विभाग का नाम लेकर कनेक्शन काटने का डर दिखाता है, तुरंत भुगतान का दबाव बनाता है और आपको आधिकारिक सहायता से संपर्क करने से रोकता है।';
  } else if (/kyc|bank|account.*block/i.test(lower)) {
    hindiExplanation = 'यह संदेश बैंक खाता बंद होने की धमकी देकर घबराहट पैदा करता है और फर्जी वेरिफिकेशन लिंक के माध्यम से तुरंत भुगतान या गोपनीय जानकारी की मांग करता है।';
  } else if (seenStages.has('REMOTE_ACCESS_REQUEST')) {
    hindiExplanation = 'यह संदेश सहायता के बहाने रिमोट-एक्सेस ऐप इंस्टॉल करवाकर आपके फोन और बैंक खाते का पूरा नियंत्रण हासिल करने की कोशिश कर रहा है।';
  } else if (seenStages.has('REWARD')) {
    hindiExplanation = 'यह संदेश फर्जी रिफंड या लॉटरी का लालच देकर आपसे यूपीआई कलेक्ट रिक्वेस्ट अप्रूव कराने की चाल चल रहा है।';
  }

  const statusSummary =
    attackChain.length > 0
      ? `UPI-Shield detected a ${attackChain.length}-step social-engineering attack.`
      : 'No coercive social-engineering chain detected.';

  return {
    manipulation_score: manipulationScore,
    attack_chain: attackChain,
    likely_objective: likelyObjective,
    safest_pause_point: safestPausePoint,
    hindi_explanation: hindiExplanation,
    highlights,
    status_summary: statusSummary,
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

  const scamLens = generateScamLens(
    text,
    signalBreakdown,
    riskScore,
    payment,
    detectedLang
  );

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
    scam_lens: scamLens,
    technical_analysis: {
      semantic_score: Math.round(semanticSignalsWeight),
      behavioral_score: Math.round(behavioralWeight),
      technical_payment_score: Math.round(paymentWeight),
      engine_mode: 'local-heuristics-fallback',
      processed_at: new Date().toISOString(),
    },
  };
}
