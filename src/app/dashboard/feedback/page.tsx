import type { Metadata } from 'next';
import MemberFeedbackClient from './MemberFeedbackClient';
export const metadata: Metadata = { title: 'Testimoni & Saran' };
export default function Page() { return <MemberFeedbackClient />; }
