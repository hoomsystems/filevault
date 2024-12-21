'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from 'lucide-react';

export default function SharedDocsPage() {
  const { token } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessInfo, setAccessInfo] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Verificar el token y obtener información de acceso
        const { data: accessData, error: accessError } = await supabase
          .from('shared_document_access')
          .select('*, client:client_id(*)')
          .eq('access_token', token)
          .single();

        if (accessError) throw accessError;
        if (!accessData) throw new Error('Link de acceso no válido');

        // Verificar si el link ha expirado
        if (new Date(accessData.expires_at) < new Date()) {
          throw new Error('Este link ha expirado');
        }

        setAccessInfo(accessData);

        // Obtener documentos aprobados del cliente
        const { data: docs, error: docsError } = await supabase
          .from('documentos_cliente')
          .select('*')
          .eq('cliente_id', accessData.client_id)
          .order('orden');

        if (docsError) throw docsError;

        // Filtrar solo documentos con archivos aprobados
        const approvedDocs = docs.map(doc => ({
          ...doc,
          archivos: doc.archivos?.filter(archivo => archivo.estado === 'aprobado') || []
        })).filter(doc => doc.archivos.length > 0);

        setDocuments(approvedDocs);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

  if (loading) {
    return <div className="flex justify-center p-8">Cargando documentos...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-xl font-bold text-red-500 mb-2">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Documentos de {accessInfo?.client?.nombre}
      </h1>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle>{doc.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {doc.archivos.map((archivo, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="text-sm">{archivo.nombre}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(archivo.url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      {accessInfo.access_type === 'download' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(archivo.url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 