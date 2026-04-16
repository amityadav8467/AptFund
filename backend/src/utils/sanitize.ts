import xss from "xss";

export const sanitizeText = (value: string): string => xss(value.trim());
