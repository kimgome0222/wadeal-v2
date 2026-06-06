/**
 * TODO: Connect real bank account holder verification API (NICE/Toss/etc.)
 */
export type VerifyBankAccountResult = {
  ok: boolean;
  accountHolder?: string;
  message: string;
};

export function normalizeAccountNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateBankAccountInput(input: {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}): string | null {
  if (!input.bankName.trim()) {
    return "은행명을 입력해 주세요.";
  }

  const accountNumber = normalizeAccountNumber(input.accountNumber);
  if (accountNumber.length < 10) {
    return "계좌번호 형식을 확인해 주세요.";
  }

  if (!input.accountHolder.trim()) {
    return "예금주명을 입력해 주세요.";
  }

  return null;
}

export async function verifyBankAccountHolder(input: {
  bankName: string;
  accountNumber: string;
}): Promise<VerifyBankAccountResult> {
  const accountNumber = normalizeAccountNumber(input.accountNumber);
  if (!input.bankName.trim() || accountNumber.length < 10) {
    return { ok: false, message: "은행명과 계좌번호를 확인해 주세요." };
  }

  if (process.env.NODE_ENV === "production") {
    return {
      ok: false,
      message: "예금주 확인 API 연동 준비 중입니다. 예금주명을 직접 입력해 주세요.",
    };
  }

  return {
    ok: true,
    accountHolder: "홍길동",
    message: "예금주 확인 완료 (개발용)",
  };
}
