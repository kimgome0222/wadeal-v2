export type UserConsentRecord = {
  id: string;
  userId: string;
  termsAgreedAt: string | null;
  privacyAgreedAt: string | null;
  groupbuyAgreedAt: string | null;
  marketingAgreedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SaveUserConsentsInput = {
  terms: boolean;
  privacy: boolean;
  groupbuy: boolean;
  marketing?: boolean;
};

export type ConsentFormValues = {
  terms: boolean;
  privacy: boolean;
  groupbuy: boolean;
  marketing: boolean;
  age14: boolean;
  orderPolicy: boolean;
  personalization: boolean;
};

export const EMPTY_CONSENT_FORM: ConsentFormValues = {
  terms: false,
  privacy: false,
  groupbuy: false,
  marketing: false,
  age14: false,
  orderPolicy: false,
  personalization: false,
};

export function hasRequiredConsentFields(
  record: Pick<
    UserConsentRecord,
    "termsAgreedAt" | "privacyAgreedAt" | "groupbuyAgreedAt"
  > | null,
): boolean {
  if (!record) {
    return false;
  }

  return Boolean(
    record.termsAgreedAt && record.privacyAgreedAt && record.groupbuyAgreedAt,
  );
}
