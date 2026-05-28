"use client";

type KakaoSharePayload = {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
};

type KakaoSdk = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (options: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
      buttons?: Array<{
        title: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      }>;
    }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";

let sdkLoadPromise: Promise<KakaoSdk | null> | null = null;

function getKakaoJavascriptKey(): string | null {
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
  return key || null;
}

export function isKakaoShareEnabled(): boolean {
  return Boolean(getKakaoJavascriptKey());
}

function loadKakaoSdk(): Promise<KakaoSdk | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.Kakao) {
    return Promise.resolve(window.Kakao);
  }

  if (!sdkLoadPromise) {
    sdkLoadPromise = new Promise((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-kakao-sdk="true"]',
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(window.Kakao ?? null), {
          once: true,
        });
        existing.addEventListener("error", () => resolve(null), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.dataset.kakaoSdk = "true";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(window.Kakao ?? null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }

  return sdkLoadPromise;
}

export async function shareViaKakao(payload: KakaoSharePayload): Promise<boolean> {
  const key = getKakaoJavascriptKey();
  if (!key) {
    return false;
  }

  const kakao = await loadKakaoSdk();
  if (!kakao) {
    return false;
  }

  if (!kakao.isInitialized()) {
    kakao.init(key);
  }

  try {
    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: payload.title,
        description: payload.description,
        imageUrl: payload.imageUrl,
        link: {
          mobileWebUrl: payload.linkUrl,
          webUrl: payload.linkUrl,
        },
      },
      buttons: [
        {
          title: "공동구매 보러가기",
          link: {
            mobileWebUrl: payload.linkUrl,
            webUrl: payload.linkUrl,
          },
        },
      ],
    });
    return true;
  } catch (error) {
    console.error("[share] shareViaKakao:", error);
    return false;
  }
}

export async function copyShareLink(url: string): Promise<boolean> {
  if (typeof navigator === "undefined") {
    return false;
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    } catch {
      return false;
    }
  }
}

export async function shareViaWebApi(payload: KakaoSharePayload): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: payload.title,
      text: payload.description,
      url: payload.linkUrl,
    });
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return false;
    }

    console.error("[share] shareViaWebApi:", error);
    return false;
  }
}

export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
