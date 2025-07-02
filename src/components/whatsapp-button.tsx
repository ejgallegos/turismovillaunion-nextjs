'use client';

import Link from 'next/link';
import React from 'react';

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props} className="h-8 w-8 text-white">
        <path
            d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.316 0-.5-.015-.76-.015h-.234c-.27 0-1.008.13-1.33.92-.322.79-.748 2.148-.748 2.148s-1.077 3.367 1.36 5.868c2.438 2.502 5.56 3.39 5.56 3.39s2.042-.625 2.404-1.22c.362-.595.362-1.08.214-1.355-.143-.27-.248-.36-.518-.59-.27-.23-.59-.26-.86-.26z"
            fill="currentColor"
        ></path>
        <path
            d="M20.57 4.31a12.18 12.18 0 0 0-16.57 16.57l-1.4 5.48 5.6-1.38a12.18 12.18 0 0 0 16.57-16.57zm-1.55 15.27a10.17 10.17 0 0 1-14.99-14.99 10.17 10.17 0 0 1 14.99 14.99z"
            fill="currentColor"
        ></path>
    </svg>
);

export function WhatsAppButton() {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const message = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE;

    const whatsappUrl = `https://wa.me/${phoneNumber || ''}?text=${encodeURIComponent(
        message || ''
    )}`;

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600"
            aria-label="Contactar por WhatsApp"
        >
            <WhatsappIcon />
        </Link>
    );
}
