import { ResourceEditPage } from '@/components/resource/resource-form-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  return <ResourceEditPage resourceKey="units" id={resolved.id} />;
}
