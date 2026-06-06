export type UserAddress = {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string | null;
  region: string | null;
  isRemoteArea: boolean;
  deliveryMemo: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressFormInput = {
  label?: string;
  recipientName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  region?: string | null;
  deliveryMemo?: string | null;
  isDefault?: boolean;
};

export type AddressCheckoutSelection = {
  addressId: string;
  deliveryMemo: string;
};
