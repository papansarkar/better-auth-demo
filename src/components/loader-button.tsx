import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Check } from "lucide-react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // A dedicated variant for the 'Smart' action look, but 'default' can also handle it if status is passed
        smart:
          "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 rounded-full",
      },
      size: {
        default: "h-10 px-6 py-2", // Slightly taller/wider for the pill shape aesthetic
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      status: {
        idle: "",
        loading:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 pointer-events-none",
        success:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "idle",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  status?: "idle" | "loading" | "success";
}

function LoaderButton({
  className,
  variant,
  size,
  status = "idle",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-status={status}
      className={cn(buttonVariants({ variant, size, status, className }))}
      {...props}
    >
      <span
        className={cn(
          "flex items-center gap-2 transition-transform duration-300",
          status === "loading" && "translate-x-[-4px]", // Slight shift to visually balance the badge
          status === "success" && "translate-x-[-4px]"
        )}
      >
        {children}
      </span>

      {/* Loading Badge */}
      <div
        className={cn(
          "absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-zinc-900 text-white transition-all duration-300 ring-2 ring-background dark:bg-accent-foreground",
          status === "loading" ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Loader2 className="size-3 animate-spin dark:text-accent" />
      </div>

      {/* Success Badge */}
      <div
        className={cn(
          "absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm transition-all duration-300",
          status === "success" ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check className="size-3.5 stroke-[3px]" />
      </div>
    </Comp>
  );
}

export { LoaderButton, buttonVariants };
