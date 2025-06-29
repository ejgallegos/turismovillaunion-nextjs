import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-muted-foreground mb-6">
        Bienvenido al gestor de contenidos. Desde aquí podrás administrar el contenido de las diferentes secciones del sitio web.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Atractivos</CardTitle>
            <CardDescription>Gestiona los puntos de interés turístico.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Crea, edita y elimina atractivos turísticos.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
            <CardDescription>Administra los eventos y festivales.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Añade próximos eventos y celebraciones.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Servicios</CardTitle>
            <CardDescription>Gestiona la información de servicios.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Actualiza la información sobre alojamiento, gastronomía, etc.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
