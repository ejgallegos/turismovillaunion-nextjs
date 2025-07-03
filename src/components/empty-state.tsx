import { Card, CardContent } from '@/components/ui/card';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No hay contenido para mostrar",
  description = "Prueba a crear nuevo contenido desde el panel de administración o vuelve a intentarlo más tarde.",
  icon = <PackageOpen className="h-16 w-16 text-muted-foreground" />,
}: EmptyStateProps) {
  return (
    <div className="col-span-full">
        <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4">{icon}</div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </div>
  );
}
