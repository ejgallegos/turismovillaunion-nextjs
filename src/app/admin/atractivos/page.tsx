import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminAtractivosPage() {
  return (
    <div>
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestionar Atractivos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Atractivo
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Atractivos</CardTitle>
          <CardDescription>
            Aquí podrás editar y eliminar los atractivos turísticos existentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente: listado de atractivos para gestionar.</p>
        </CardContent>
      </Card>
    </div>
  );
}
