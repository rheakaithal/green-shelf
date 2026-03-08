/**
 * Security Handlers
 * Used to sanitize inputs against Buffer Overflow DoS and Prompt Injection vectors.
 */

// Reasonable constraints for the local inventory management use case.
const MAX_ITEM_NAME_LENGTH = 100;
const MAX_LOCATION_LENGTH = 100;
const MAX_UNIT_LENGTH = 30;

/**
 * Validates strings before entering the database to prevent DOS/Database Bloat
 * from pseudo-buffer-overflows (excessively long strings).
 */
export function validateStorageString(input: string, fieldType: 'name' | 'location' | 'unit'): string {
  if (!input) return "";

  let maxLen = 0;
  switch (fieldType) {
    case 'name': maxLen = MAX_ITEM_NAME_LENGTH; break;
    case 'location': maxLen = MAX_LOCATION_LENGTH; break;
    case 'unit': maxLen = MAX_UNIT_LENGTH; break;
  }

  const trimmed = input.trim();
  if (trimmed.length > maxLen) {
    throw new Error(`Validation Error: ${fieldType} exceeds maximum length of ${maxLen} characters.`);
  }

  return trimmed;
}

/**
 * Validates logical bounds for numbers to prevent integer overflows or negative quantities.
 */
export function validateQuantity(quantity: number): number {
  if (isNaN(quantity) || quantity < 0) {
    throw new Error("Validation Error: Quantity cannot be less than zero.");
  }
  // Max safe inventory size for this application
  if (quantity > 1000000) {
    throw new Error("Validation Error: Quantity exceeds reasonable limits.");
  }
  return quantity;
}

/**
 * Sanitizes input immediately before inserting it into an LLM Prompt.
 * - Strips out command instruction keywords (like "Ignore previous instructions")
 * - Escapes specific markdown control characters commonly used in JSON injection (`, \`)
 * - Enforces extreme length limits to prevent token stuffing attacks.
 */
export function sanitizePromptInjection(input: string): string {
  if (!input) return "";

  // 1. Basic limit - prevents token dumping attacks
  let safeStr = input.trim().substring(0, 150);

  // 2. Strip obvious prompt hijack attempts
  const dangerousPatterns = [
    /ignore previous/gi,
    /forget previous/gi,
    /system prompt/gi,
    /bypass system/gi,
    /you are now/gi,
    /drop table/gi,
  ];

  for (const pattern of dangerousPatterns) {
    safeStr = safeStr.replace(pattern, "[REDACTED]");
  }

  // 3. Strip structural JSON markers that could break out of formatted expectations
  // e.g., if we are interpolating this string dynamically inside JSON.stringify body.
  // Less critical here since we are mostly embedding this in `content: \`...${foo}...\` `
  // But good for general safety.
  safeStr = safeStr.replace(/`/g, "'").replace(/[{}<>]/g, "");

  return safeStr;
}
