import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import clsx from "clsx";

interface ReturnButtonProps {
  href: string;
  label: string;
  isLeftIcon?: boolean;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export const ReturnButton = ({
  href,
  label,
  isLeftIcon = true,
  className,
  variant,
}: ReturnButtonProps) => {
  return (
    <Button size={"sm"} asChild variant={variant} className={clsx(className)}>
      <Link href={href}>
        {isLeftIcon && <ArrowLeftIcon />}
        {label}
      </Link>
    </Button>
  );
};
