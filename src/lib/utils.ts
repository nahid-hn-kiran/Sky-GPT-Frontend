import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility to merge Tailwind CSS classes cleanly without conflicts
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
