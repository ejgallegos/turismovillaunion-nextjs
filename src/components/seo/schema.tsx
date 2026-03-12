'use client';

import Script from 'next/script';

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristInformationCenter",
    "name": "Secretaría de Turismo del Departamento Felipe Varela",
    "description": "Organismo oficial de turismo de Villa Unión, La Rioja, Argentina. Promociona el Parque Nacional Talampaya, Cuesta de Miranda y demás atractivos de la región.",
    "url": "https://turismovillaunion.gob.ar",
    "logo": "https://turismovillaunion.gob.ar/images/Logos/logo-sec.png",
    "image": "https://turismovillaunion.gob.ar/images/Logos/logo-sec.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Villa Unión",
      "addressRegion": "La Rioja",
      "addressCountry": "AR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Spanish"]
    },
    "sameAs": [
      "https://www.facebook.com/turismovillaunion"
    ]
  };

  return <JsonLd data={schema} />;
}
