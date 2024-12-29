import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CustomSearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  onClear?: () => void;
};

const CustomSearchInput = React.forwardRef<HTMLInputElement, CustomSearchInputProps>(({ 
  value, 
  onChange, 
  className = "", 
  prefix = "AI Tools for ",
  onClear,
  ...props
}, forwardedRef) => {
  const [inputValue, setInputValue] = useState(() => 
    value.startsWith(prefix) ? value.slice(prefix.length) : value
  );

  useEffect(() => {
    const newValue = value.startsWith(prefix) ? value.slice(prefix.length) : value;
    setInputValue(newValue);
  }, [value, prefix]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(prefix + newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange(prefix);
    onClear?.();
  };

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <div className="relative flex-1">
        <Input
          ref={forwardedRef}
          className={cn(
            "pl-[8rem] pr-9 flex items-center h-full",
            className
          )}
          value={inputValue}
          onChange={handleChange}
          {...props}
          style={{ 
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }}
        />
        <div 
          className="absolute left-10 top-0 bottom-0 flex items-center pointer-events-none text-foreground"
          style={{ 
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }}
        >
          {prefix}
        </div>
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
            aria-label="Clear input"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
});

CustomSearchInput.displayName = 'CustomSearchInput';

export default CustomSearchInput;