import { notFound } from 'next/navigation';

export default function UnimplementedPage() {
    // Keep unknown routes inside the dashboard layout without creating feature pages.
    notFound();
}
