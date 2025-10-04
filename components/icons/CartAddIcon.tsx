import React from 'react';

// A modern shopping trolley icon
export const CartAddIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.839a.75.75 0 00-.543-.922H3.821a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75H4.5" />
    <circle cx="7.5" cy="18.75" r="1.5" />
    <circle cx="17.25" cy="18.75" r="1.5" />
  </svg>
);
