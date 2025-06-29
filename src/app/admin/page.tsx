import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido al Panel de Administración</CardTitle>
          <CardDescription>
            Desde aquí podrás gestionar el contenido de tu sitio web.
            Selecciona una sección del menú de navegación para comenzar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Este es el panel principal. Futuras estadísticas y accesos directos aparecerán aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
