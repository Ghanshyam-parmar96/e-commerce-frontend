import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative mr-auto flex-1 md:grow-0">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent pr-9 pl-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
        />
        {showPassword ? (
          <EyeOpenIcon
            onClick={() => setShowPassword(false)}
            className="absolute right-2.5 top-2.5 h-4 w-4 stroke-black/30 text-muted-foreground select-none"
          />
        ) : (
          <EyeNoneIcon
            onClick={() => setShowPassword(true)}
            className="absolute right-2.5 top-2.5 h-4 w-4 stroke-black/30 text-muted-foreground select-none"
          />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
