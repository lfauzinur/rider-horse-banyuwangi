import { redirect } from 'next/navigation';

export const instant = false;

export default async function BookingPage({ params }: PageProps<'/book/[slug]'>) {
  const { slug } = await params;
  redirect(`/dashboard/book/${slug}`);
}
