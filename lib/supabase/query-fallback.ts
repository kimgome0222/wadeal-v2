export function isMissingTableError(message: string | undefined): boolean {
  if (!message) {
    return false;
  }

  return (
    message.includes("Could not find the table") ||
    message.includes("schema cache") ||
    message.includes("relation") && message.includes("does not exist")
  );
}

export function isMissingColumnError(message: string | undefined): boolean {
  return Boolean(message?.includes("does not exist"));
}

/** probe / mock fallback — console.error 대신 warn 또는 생략 */
export function isFallbackDataError(message: string | undefined): boolean {
  const trimmed = message?.trim();
  if (!trimmed) {
    return true;
  }

  return isMissingTableError(trimmed) || isMissingColumnError(trimmed);
}

export function logDataQueryFallback(context: string, message?: string) {
  if (isFallbackDataError(message)) {
    return;
  }

  console.warn(`[data] ${context}:`, message);
}
