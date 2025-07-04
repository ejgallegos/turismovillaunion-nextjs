
import { getFolletos } from '@/lib/folletos.service';
import { notFound } from 'next/navigation';
import { FolletoForm } from '../../folleto-form';

export default async function EditFolletoPage({ params }: { params: { id: string } }) {
  const folletos = await getFolletos();
  const folleto = folletos.find(f => f.id === params.id);

  if (!folleto) {
    notFound();
  }

  return (
    <div>
      <FolletoForm folleto={folleto} />
    </div>
  );
}
