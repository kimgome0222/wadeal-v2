export const BUSINESS_SETTINGS_ID = 1;

export type BusinessSettings = {
  id: number;
  businessName: string | null;
  representativeName: string | null;
  businessNumber: string | null;
  mailOrderSalesNumber: string | null;
  businessAddress: string | null;
  customerServicePhone: string | null;
  customerServiceEmail: string | null;
  customerServiceHours: string | null;
  hostingProvider: string | null;
  privacyManagerName: string | null;
  privacyManagerEmail: string | null;
  bankAccountInfo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BusinessSettingsFormInput = {
  businessName: string;
  representativeName: string;
  businessNumber: string;
  mailOrderSalesNumber: string;
  businessAddress: string;
  customerServicePhone: string;
  customerServiceEmail: string;
  customerServiceHours: string;
  hostingProvider: string;
  privacyManagerName: string;
  privacyManagerEmail: string;
  bankAccountInfo: string;
};

export const EMPTY_BUSINESS_SETTINGS: BusinessSettings = {
  id: BUSINESS_SETTINGS_ID,
  businessName: null,
  representativeName: null,
  businessNumber: null,
  mailOrderSalesNumber: null,
  businessAddress: null,
  customerServicePhone: null,
  customerServiceEmail: null,
  customerServiceHours: null,
  hostingProvider: null,
  privacyManagerName: null,
  privacyManagerEmail: null,
  bankAccountInfo: null,
  createdAt: "",
  updatedAt: "",
};

const BUSINESS_NUMBER_PATTERN = /^\d{3}-\d{2}-\d{5}$/;

export function isBusinessSettingsConfigured(settings: BusinessSettings): boolean {
  return Boolean(
    settings.businessName?.trim() &&
      settings.representativeName?.trim() &&
      settings.businessNumber?.trim() &&
      settings.mailOrderSalesNumber?.trim() &&
      settings.businessAddress?.trim(),
  );
}

export function parseBusinessSettingsForm(
  raw: Partial<BusinessSettingsFormInput>,
): { ok: true; input: BusinessSettingsFormInput } | { ok: false } {
  const input: BusinessSettingsFormInput = {
    businessName: raw.businessName?.trim() ?? "",
    representativeName: raw.representativeName?.trim() ?? "",
    businessNumber: raw.businessNumber?.trim() ?? "",
    mailOrderSalesNumber: raw.mailOrderSalesNumber?.trim() ?? "",
    businessAddress: raw.businessAddress?.trim() ?? "",
    customerServicePhone: raw.customerServicePhone?.trim() ?? "",
    customerServiceEmail: raw.customerServiceEmail?.trim() ?? "",
    customerServiceHours: raw.customerServiceHours?.trim() ?? "",
    hostingProvider: raw.hostingProvider?.trim() ?? "",
    privacyManagerName: raw.privacyManagerName?.trim() ?? "",
    privacyManagerEmail: raw.privacyManagerEmail?.trim() ?? "",
    bankAccountInfo: raw.bankAccountInfo?.trim() ?? "",
  };

  if (
    !input.businessName ||
    !input.representativeName ||
    !input.businessNumber ||
    !input.mailOrderSalesNumber ||
    !input.businessAddress
  ) {
    return { ok: false };
  }

  if (input.businessNumber && !BUSINESS_NUMBER_PATTERN.test(input.businessNumber)) {
    return { ok: false };
  }

  if (input.customerServiceEmail && !input.customerServiceEmail.includes("@")) {
    return { ok: false };
  }

  if (input.privacyManagerEmail && !input.privacyManagerEmail.includes("@")) {
    return { ok: false };
  }

  return { ok: true, input };
}

export function normalizeBusinessSettingsText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toBusinessSettingsDbPayload(input: BusinessSettingsFormInput) {
  return {
    id: BUSINESS_SETTINGS_ID,
    business_name: normalizeBusinessSettingsText(input.businessName),
    representative_name: normalizeBusinessSettingsText(input.representativeName),
    business_number: normalizeBusinessSettingsText(input.businessNumber),
    mail_order_sales_number: normalizeBusinessSettingsText(input.mailOrderSalesNumber),
    business_address: normalizeBusinessSettingsText(input.businessAddress),
    customer_service_phone: normalizeBusinessSettingsText(input.customerServicePhone),
    customer_service_email: normalizeBusinessSettingsText(input.customerServiceEmail),
    customer_service_hours: normalizeBusinessSettingsText(input.customerServiceHours),
    hosting_provider: normalizeBusinessSettingsText(input.hostingProvider),
    privacy_manager_name: normalizeBusinessSettingsText(input.privacyManagerName),
    privacy_manager_email: normalizeBusinessSettingsText(input.privacyManagerEmail),
    bank_account_info: normalizeBusinessSettingsText(input.bankAccountInfo),
  };
}

export function mapBusinessSettingsRow(row: {
  id: number;
  business_name: string | null;
  representative_name: string | null;
  business_number: string | null;
  mail_order_sales_number: string | null;
  business_address: string | null;
  customer_service_phone: string | null;
  customer_service_email: string | null;
  customer_service_hours: string | null;
  hosting_provider: string | null;
  privacy_manager_name: string | null;
  privacy_manager_email: string | null;
  bank_account_info: string | null;
  created_at: string;
  updated_at: string;
}): BusinessSettings {
  return {
    id: row.id,
    businessName: row.business_name,
    representativeName: row.representative_name,
    businessNumber: row.business_number,
    mailOrderSalesNumber: row.mail_order_sales_number,
    businessAddress: row.business_address,
    customerServicePhone: row.customer_service_phone,
    customerServiceEmail: row.customer_service_email,
    customerServiceHours: row.customer_service_hours,
    hostingProvider: row.hosting_provider,
    privacyManagerName: row.privacy_manager_name,
    privacyManagerEmail: row.privacy_manager_email,
    bankAccountInfo: row.bank_account_info,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
