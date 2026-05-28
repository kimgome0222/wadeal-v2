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
