import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VALID_DOMAIN = () => {
  const domain = ["gmail.com", "yahoo.com", "zoho.mail.in"];

  if (process.env.NODE_ENV === "development") {
    domain.push("example.com");
  }

  return domain;
};

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ") //bob    tom -> bob tom
    .replace(/[^a-zA-Z\s'-]/g, "") //bob!45 -> bob
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
