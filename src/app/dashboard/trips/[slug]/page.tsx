import MemberTripDetailClient from './MemberTripDetailClient';

export const instant = false;

export default async function MemberTripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MemberTripDetailClient slug={slug} />;
}
