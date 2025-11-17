'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Importar SwaggerUI apenas no cliente
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error('Erro ao carregar documentação:', err));
  }, []);

  if (!spec) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Carregando documentação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Documentação da API - Stockly</h1>
          <p className="mt-2 text-gray-600">
            Documentação completa das Server Actions e funções de acesso a dados
          </p>
        </div>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}

