'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CategoryButtonProps {
  category: string;
}

export default function CategoryButton({ category }: CategoryButtonProps) {
  const router = useRouter();

  return (
    <button
      className="p-0 h-auto font-normal hover:text-primary transition-colors"
      onClick={(e) => {
        e.preventDefault();
        router.push(`/publications/category/${category}`);
      }}
    >
      {category}
    </button>
  );
}