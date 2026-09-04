import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-ui",
  {
    variants: {
      variant: {
        default:
          "bg-noche text-marfil hover:bg-noche-deep shadow-[0_10px_30px_rgba(43,38,84,0.35)]",
        gold:
          "bg-gradient-to-r from-arena via-ocre to-gold-muted text-marfil hover:brightness-105 shadow-[0_10px_35px_rgba(148,108,38,0.35)]",
        outline:
          "border border-ocre/50 bg-transparent text-noche hover:bg-ocre/10",
        ghost: "hover:bg-noche/5 text-noche",
        admin: "rounded-md bg-noche text-marfil hover:bg-noche-deep",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-base tracking-[0.18em] uppercase",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
