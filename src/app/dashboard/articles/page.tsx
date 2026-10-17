import type { Metadata } from 'next';
import MemberArticlesClient from './MemberArticlesClient';

export const metadata: Metadata = { title: 'Rider Journal | Member Rider Horse', description: 'Baca artikel berkuda langsung dari aplikasi member.' };
export default function MemberArticlesPage() { return <MemberArticlesClient />; }
