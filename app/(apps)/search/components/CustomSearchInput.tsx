import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from '@/contexts/subscription-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { webFree_CharactersLimit } from '@/config/freeLimits';

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
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { plan } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    const newValue = value.startsWith(prefix) ? value.slice(prefix.length) : value;
    setInputValue(newValue);
  }, [value, prefix]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (plan === 'free' && newValue.length > webFree_CharactersLimit) {
      setShowUpgradeDialog(true);
      return;
    }
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
    <>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground z-10" />
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
          />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            {prefix}
          </div>
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              Free users can only search with {webFree_CharactersLimit} characters keywords. Upgrade to Pro to unlock custom search capabilities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              router.push('/payment');
              setShowUpgradeDialog(false);
            }}>
              Upgrade to Pro
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

CustomSearchInput.displayName = 'CustomSearchInput';

export default CustomSearchInput;