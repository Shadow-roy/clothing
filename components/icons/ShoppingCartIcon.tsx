// Fix: Created the ShoppingCartIcon component.
import React from 'react';

export const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.839a.75.75 0 0 0-.543-.922H3.821a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75H4.5m3-8.25-1.125 4.5M7.5 14.25 6.375 18.75m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6m11.25 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
    </svg>
);
