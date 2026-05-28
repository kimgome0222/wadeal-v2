export function KakaoSetupHelp() {
  return (
    <details className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
      <summary className="cursor-pointer text-xs font-black text-amber-900">
        KOE205 / 카카오 설정 오류 해결 방법
      </summary>
      <ol className="mt-3 list-decimal space-y-2 pl-4 text-[11px] font-bold leading-relaxed text-amber-950">
        <li>
          제품 설정 → 카카오 로그인 → 동의항목에서{" "}
          <strong>profile_nickname, profile_image</strong> ON
          (account_email은 사용하지 않음)
        </li>
        <li>
          Supabase → Auth → Providers → Kakao →{" "}
          <strong>Allow users without an email</strong> ON
        </li>
        <li>
          앱 설정 → 플랫폼 → Web → 사이트 도메인에{" "}
          <code className="rounded bg-white px-1">http://localhost:3000</code>,{" "}
          <code className="rounded bg-white px-1">https://wadeal-v2.vercel.app</code>
        </li>
        <li>
          앱 설정 → 플랫폼 키 → REST API 키 → Redirect URI에 Supabase Callback URL
          등록 (Dashboard → Auth → Kakao에서 복사)
        </li>
        <li>
          REST API 키 설정에서 <strong>카카오 로그인 클라이언트 시크릿</strong> 활성화 후
          Supabase Kakao Provider에 Client ID/Secret 저장
        </li>
        <li>
          Supabase → Auth → URL Configuration → Redirect URLs에{" "}
          <code className="rounded bg-white px-1">http://localhost:3000/auth/callback</code>,{" "}
          <code className="rounded bg-white px-1">https://wadeal-v2.vercel.app/auth/callback</code>
        </li>
      </ol>
    </details>
  );
}
