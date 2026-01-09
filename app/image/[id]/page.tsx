import { ImageDetailContainer } from '@/components/image/ImageDetailContainer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ImageDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ImageDetailContainer imageId={id} />;
}
