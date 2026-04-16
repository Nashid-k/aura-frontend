import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils/cn";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-border/50 bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass-card text-foreground hover:bg-white/40 dark:hover:bg-white/10",
      },
      size: {
        default: "h-12 px-6 rounded-2xl", // Apple likes larger, touch-friendly targets
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-[1.5rem] px-8 text-base",
        icon: "h-12 w-12 rounded-2xl",
        pill: "h-10 px-6 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : motion.button;
  
  // If rendering as a custom motion component, we apply the spring physics
  const motionProps = asChild ? {} : {
    whileTap: { scale: 0.96 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...motionProps}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };