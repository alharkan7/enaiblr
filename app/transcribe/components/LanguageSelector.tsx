import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../types';

const languages: Language[] = [
  { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' },
  { code: 'jv', name: 'Javanese' },
  { code: 'su', name: 'Sundanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <Globe className="h-7 w-7 text-blue-600" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border-2 border-gray-200 px-4 text-base font-small
        shadow-sm transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none 
        focus:ring-2 focus:ring-blue-500/20 sm:text-lg appearance-none bg-[length:12px] bg-[right_1rem_center] 
        bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
        pr-12"
      >
        {languages.map((language) => (
          <option 
            key={language.code} 
            value={language.code}
            className="py-2 text-base"
          >
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}
