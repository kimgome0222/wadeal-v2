export const SELLER_DOCUMENTS_BUCKET = "seller-documents";
export const SETTLEMENT_FILES_BUCKET = "settlement-files";

export function buildSellerDocumentPath(
  sellerId: string,
  fileName: string,
): string {
  return `${sellerId}/${fileName}`;
}

export function buildSettlementFilePath(
  sellerId: string,
  settlementId: string,
  fileName: string,
): string {
  return `${sellerId}/${settlementId}/${fileName}`;
}
