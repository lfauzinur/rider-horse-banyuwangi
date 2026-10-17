import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes} WIB`;
}

export function generateQRToken(): string {
  return `RH-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export function getDifficultyColor(level: string): string {
  switch (level) {
    case 'Easy':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'Moderate':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'Challenging':
      return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'confirmed':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'completed':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'cancelled':
      return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    beach_ride: 'Beach Ride',
    forest_trail: 'Forest Trail',
    sunset_ride: 'Sunset Ride',
    mountain_trail: 'Mountain Trail',
    private_lesson: 'Private Lesson',
    group_class: 'Group Class',
  };
  return labels[category] || category;
}
