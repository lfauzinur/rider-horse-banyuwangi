import MemberArticleDetailClient from './MemberArticleDetailClient';

export const instant = false;
export default async function MemberArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <MemberArticleDetailClient slug={slug} />; }
