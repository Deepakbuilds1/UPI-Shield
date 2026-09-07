import { UpiIntentDetails } from '../src/types';

export function parseUpiString(input: string): UpiIntentDetails | null {
  if (!input) return null;

  // Check if string contains upi://pay
  const match = input.match(/upi:\/\/pay\?[^\s"'>]+/i);
  let uriString = match ? match[0] : null;

  // If no upi:// scheme, check if user provided a plain query or raw UPI ID
  let pa: string | null = null;
  let pn: string | null = null;
  let am: string | null = null;
  let cu: string | null = 'INR';
  let tn: string | null = null;
  let mc: string | null = null;
  let tr: string | null = null;
  let url: string | null = null;

  if (uriString) {
    try {
      // Fix potential formatting issues for URLSearchParams
      const queryString = uriString.includes('?') ? uriString.substring(uriString.indexOf('?') + 1) : '';
      const params = new URLSearchParams(queryString);

      pa = params.get('pa');
      pn = params.get('pn');
      am = params.get('am');
      cu = params.get('cu') || 'INR';
      tn = params.get('tn');
      mc = params.get('mc');
      tr = params.get('tr');
      url = params.get('url');
    } catch {
      // Fallback regex matching
      const getParam = (key: string) => {
        const m = uriString?.match(new RegExp(`[?&]${key}=([^&]+)`, 'i'));
        return m ? decodeURIComponent(m[1]) : null;
      };
      pa = getParam('pa');
      pn = getParam('pn');
      am = getParam('am');
      cu = getParam('cu') || 'INR';
      tn = getParam('tn');
      mc = getParam('mc');
      tr = getParam('tr');
      url = getParam('url');
    }
  } else {
    // Check if there is a standalone VPA / UPI ID in text (e.g., example@ybl, name@oksbi)
    const vpaMatch = input.match(/\b([a-zA-Z0-9.\-_]{2,50})@([a-zA-Z]{2,30})\b/);
    if (vpaMatch) {
      pa = vpaMatch[0];
    }
  }

  if (!pa && !pn && !am) {
    return null;
  }

  // Assess verification status and advisory
  let verification_status = 'Destination requires verification';
  let safety_advisory = 'NPCI Advisory: Always verify the merchant or receiver identity on your UPI app before completing payment.';

  const isSmallVerification = am && (parseFloat(am) === 1 || parseFloat(am) === 2 || parseFloat(am) <= 5);
  const isSuspiciousName = pn && /sbi|hdfc|icici|axis|bank|kyc|electricity|bill|support|refund|care|police/i.test(pn) && !mc;

  if (isSmallVerification) {
    safety_advisory = 'CAUTION: ₹1 or ₹2 requests are frequently used as verification pretexts to link or compromise UPI mandates. Never approve requests from untrusted sources.';
  } else if (isSuspiciousName) {
    safety_advisory = 'WARNING: Payee name claims bank/official status but lacks verified merchant registration (MC). Verify independently.';
  }

  return {
    raw_uri: uriString,
    pa,
    pn,
    am,
    cu,
    tn,
    mc,
    tr,
    url,
    verification_status,
    safety_advisory,
  };
}
