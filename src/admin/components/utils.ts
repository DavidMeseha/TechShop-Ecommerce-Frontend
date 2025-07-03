import { ProductForm } from "@/admin/schemas/valdation";

export function getChangedFields(initial: ProductForm, current: ProductForm) {
  let changed: any = {};
  let key: keyof ProductForm;
  for (key in current) {
    if (Array.isArray(current[key]) || typeof current[key] === "object") {
      if (JSON.stringify(current[key]) !== JSON.stringify(initial[key])) {
        changed[key] = current[key];
      }
    } else {
      if (current[key] !== initial[key] && typeof current[key] === typeof initial[key]) {
        changed[key] = current[key];
      }
    }
  }
  return changed as Partial<ProductForm>;
}
