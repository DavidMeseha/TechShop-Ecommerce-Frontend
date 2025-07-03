import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes.
 *
 * This function uses `clsx` to conditionally combine class names and `twMerge`
 * to ensure that Tailwind CSS classes are merged correctly, allowing for the
 * elimination of conflicting classes.
 *
 * @param {...string[]} classNames - The array of product attributes.
 * @returns {string} a string of classNames after merging process.
 */
export function cn(...classNames: ClassValue[]) {
  return twMerge(clsx(classNames));
}

import { ICustomeProductAttribute, IProductAttribute, Language } from "@/types";

export const languages: Language[] = ["en", "ar", "fr"];
export const seoLanguages: { lang: Language; locale: string }[] = [
  { lang: "en", locale: "en_US" },
  { lang: "ar", locale: "ar_EG" },
  { lang: "fr", locale: "fr_FR" }
];

/**
 * Sets the default attributes by limiting the values to the first one.
 * @param {IProductAttribute[]} attributes - The array of product attributes.
 * @returns {IProductAttribute[]} The array of product attributes with selected values.
 */
export const selectDefaultAttributes = (attributes: IProductAttribute[]): ICustomeProductAttribute[] => {
  return attributes.map((attr) => ({ _id: attr._id, values: [{ _id: attr.values[0]._id }] }));
};

/**
 * Manipulates a description text by splitting it if it exceeds a certain length.
 * @param {string} text - The description text to manipulate.
 * @returns {[string, string]} An array containing the [first part(length: 170), the remaining of the text] respectively.
 */
export function manipulateDescription(text: string): [string, string] {
  if (!text) return ["", ""];
  if (text.length < 170) return [text, ""];
  return [text.slice(0, 170), text.slice(170)];
}

/**
 * Replaces the language in the pathname with a new language.
 * @param {Language} newLang - The new language to set in the pathname.
 * @param {string} pathname - The original pathname to modify.
 * @returns {string} The modified pathname with the new language.
 */
export function replacePathnameLang(newLang: Language, pathname: string): string {
  const pathnameLang = languages.find((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);
  if (pathnameLang) return pathname.replace(pathnameLang, newLang);
  else return `/${newLang + pathname}`;
}

/**
 * Retrieves the language from the pathname.
 * @param {string} pathname - The pathname to check for language.
 * @returns {Language | undefined} The language found in the pathname, or undefined if none.
 */
export function getPathnameLang(pathname: string) {
  return languages.find((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);
}

/**
 * Helper to check if we're on client side.
 * @returns {boolean}.
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}
