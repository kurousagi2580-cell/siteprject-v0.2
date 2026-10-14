// src/lib/formdata.ts
export function objectToFormData(obj: Record<string, any>, fd = new FormData(), parentKey?: string) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (value === undefined || value === null) {
      fd.append(formKey, "");
    } else if (value instanceof File) {
      fd.append(formKey, value);
    } else if (Array.isArray(value)) {
      // 配列は JSON 文字列化するか、要件に合わせて個別 append する
      fd.append(formKey, JSON.stringify(value));
    } else if (typeof value === "object") {
      objectToFormData(value, fd, formKey);
    } else {
      fd.append(formKey, String(value));
    }
  }
  return fd;
}
