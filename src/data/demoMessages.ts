import { DemoTestCase } from '../types';

export const HACKATHON_DEMO = {
  id: 'demo-scamlens-signature',
  title: 'Electricity Disconnection (Signature ScamLens Demo)',
  text: 'URGENT: Your electricity connection will be disconnected within 30 minutes. Complete a ₹2 verification payment immediately. Do not call customer care.',
  expectedChain: ['AUTHORITY', 'FEAR', 'URGENCY', 'ISOLATION', 'PAYMENT_PRESSURE'],
  expectedRisk: 'HIGH' as const,
  riskScore: 94,
  manipulationScore: 96,
  safestPausePoint: 'Stop before making the payment and verify the request through the official electricity provider.',
};

export const BUILT_IN_DEMO = HACKATHON_DEMO.text;

export const SCAMLENS_DEMOS = [
  {
    id: 'scamlens-demo-1',
    title: 'DEMO 1: Electricity Disconnection',
    badge: 'Authority → Fear → Urgency → Isolation → Payment',
    text: 'URGENT: Your electricity connection will be disconnected within 30 minutes. Complete a ₹2 verification payment immediately. Do not call customer care.',
    chainSummary: 'AUTHORITY → FEAR → URGENCY → ISOLATION → PAYMENT PRESSURE',
  },
  {
    id: 'scamlens-demo-2',
    title: 'DEMO 2: Fake Refund',
    badge: 'Trust Building → Deception → Urgency → Payment',
    text: 'Dear customer, your refund of ₹4,850 for order #98219 is pending approval. To credit directly to your bank account, approve the UPI collect request received on PhonePe / GPay within 15 minutes or click upi://pay?pa=refunds-desk@okicici&pn=RefundDesk&am=1&cu=INR for auto-refund verification.',
    chainSummary: 'TRUST BUILDING → DECEPTION → URGENCY → PAYMENT PRESSURE',
  },
  {
    id: 'scamlens-demo-3',
    title: 'DEMO 3: Fake KYC',
    badge: 'Authority → Consequence → Urgency → Payment',
    text: 'Sir aapka bank account KYC expire ho gaya hai. 2 ghante me account permanently block ho jayega. Abhi verification ke liye ₹1 pay karo through UPI link warna fine lagega: upi://pay?pa=sbi.kyc.portal@ybl&pn=SBI_KYC_Verification&am=1&cu=INR',
    chainSummary: 'AUTHORITY → CONSEQUENCE THREAT → URGENCY → PAYMENT PRESSURE',
  },
  {
    id: 'scamlens-demo-4',
    title: 'DEMO 4: Remote-Access Scam',
    badge: 'Authority → Trust → Deception → Remote Access',
    text: 'Customer support: Install AnyDesk from Play Store and share the 9-digit code with our executive so we can process your refund and fix your wallet.',
    chainSummary: 'AUTHORITY → TRUST BUILDING → DECEPTION → REMOTE ACCESS REQUEST',
  },
];

export const QUICK_DEMOS = [
  {
    id: 'demo-electricity',
    title: 'Electricity Disconnection',
    badge: 'Urgent Threat',
    text: HACKATHON_DEMO.text,
  },
  {
    id: 'demo-refund',
    title: 'Fake Refund & UPI Collect',
    badge: 'Financial Trap',
    text: 'Dear customer, your refund of ₹4,850 for order #98219 is pending approval. To credit directly to your bank account, approve the UPI collect request received on PhonePe / GPay within 15 minutes or click upi://pay?pa=refunds-desk@okicici&pn=RefundDesk&am=1&cu=INR for auto-refund verification.',
  },
  {
    id: 'demo-kyc',
    title: 'Urgent KYC Block (Hinglish)',
    badge: 'Social Engineering',
    text: 'Sir aapka bank account KYC expire ho gaya hai. 2 ghante me account permanently block ho jayega. Abhi verification ke liye ₹1 pay karo through UPI link warna fine lagega: upi://pay?pa=sbi.kyc.portal@ybl&pn=SBI_KYC_Verification&am=1&cu=INR',
  },
];

export const TEST_CASES: DemoTestCase[] = [
  {
    id: 'test-1',
    title: 'TEST 1 — Electricity Scam',
    tag: 'Utility Threat',
    expectedRisk: 'CRITICAL',
    description: 'Threatens immediate power cut with small verification fee pretext.',
    text: 'Your electricity connection will be disconnected today. Pay ₹2 immediately for verification on UPI: power-bill@upi',
  },
  {
    id: 'test-2',
    title: 'TEST 2 — Fake Refund',
    tag: 'Refund Bait',
    expectedRisk: 'HIGH',
    description: 'Claims large pending refund to coerce clicking a verification link.',
    text: 'Your refund of ₹4,850 is pending. Click this link and verify your UPI account to claim money back immediately.',
  },
  {
    id: 'test-3',
    title: 'TEST 3 — Fake Bank Account Threat',
    tag: 'Banking Fear',
    expectedRisk: 'HIGH',
    description: 'Creates panic about immediate account freeze unless KYC is done.',
    text: 'Dear customer, your bank account will be blocked within 2 hours unless KYC is completed immediately. Click bit.ly/bank-kyc-update to verify.',
  },
  {
    id: 'test-4',
    title: 'TEST 4 — Remote Access (AnyDesk)',
    tag: 'Device Takeover',
    expectedRisk: 'CRITICAL',
    description: 'Requests screen sharing and remote desktop tool installation.',
    text: 'Install AnyDesk from Play Store and share the 9-digit code with our executive so we can process your refund and fix your wallet.',
  },
  {
    id: 'test-5',
    title: 'TEST 5 — OTP / MPIN Theft',
    tag: 'Credential Theft',
    expectedRisk: 'CRITICAL',
    description: 'Directly asks for OTP to bypass payment security.',
    text: 'Customer Care: Tell me the 6-digit OTP you just received on SMS so I can complete your pending transaction and cancel the unauthorized debit.',
  },
  {
    id: 'test-6',
    title: 'TEST 6 — QR Code to Receive Money',
    tag: 'QR Inversion',
    expectedRisk: 'HIGH',
    description: 'Exploits the misconception that scanning a QR code can receive funds.',
    text: 'To receive ₹15,000 for your OLX sofa, scan this QR code on Google Pay and enter your UPI PIN. The money will be instantly credited to your bank.',
  },
  {
    id: 'test-7',
    title: 'TEST 7 — UPI Collect Request',
    tag: 'Collect Scam',
    expectedRisk: 'HIGH',
    description: 'Disguises an outgoing debit collect request as a cashback prize.',
    text: 'Congratulations! You have received a ₹5,000 festive bonus. Approve the ₹5,000 UPI request in PhonePe/Paytm now to receive your cashback reward in account.',
  },
  {
    id: 'test-8',
    title: 'TEST 8 — Prize / Lottery Scam',
    tag: 'Advance Fee',
    expectedRisk: 'HIGH',
    description: 'Promises large winnings if victim pays an upfront registration charge.',
    text: 'Congratulations! You won ₹50,000 in Kaun Banega Crorepati lucky draw. Pay ₹499 processing fee via UPI to claim prize before offer expires tonight.',
  },
  {
    id: 'test-9',
    title: 'TEST 9 — Normal Legitimate Message',
    tag: 'Legitimate Notice',
    expectedRisk: 'SAFE',
    description: 'Standard informational billing notification without urgency or coercive links.',
    text: 'Your electricity bill of ₹1,240 is due on September 15. Pay through the official electricity board website at www.bescom.karnataka.gov.in or authorized counters.',
  },
  {
    id: 'test-10',
    title: 'TEST 10 — Hinglish Urgent KYC Scam',
    tag: 'Hinglish Coercion',
    expectedRisk: 'CRITICAL',
    description: 'Social engineering in conversational Hinglish with account freeze intimidation.',
    text: 'Sir aapka KYC expire ho gaya hai abhi verification ke liye ₹1 pay karo warna account block ho jayega aur police report darj hogi.',
  },
];

export const DEMO_MESSAGES = TEST_CASES;
