import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortBySort<T extends { sort: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort - b.sort);
}
