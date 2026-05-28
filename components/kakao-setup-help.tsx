export function KakaoSetupHelp() {
  return (
    <details className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
      <summary className="cursor-pointer text-xs font-black text-amber-900">
        KOE205 / 카카오 설정 (wadeal-test 기준)
      </summary>
      <div className="mt-3 space-y-3 text-[11px] font-bold leading-relaxed text-amber-950">
        <p>
          Wadeal은 Supabase 기본 Kakao OAuth 대신{" "}
          <strong>profile_nickname + profile_image만</strong> 요청하는
          전용 로그인을 사용합니다. 사업자/간편로그인 심사 없이도 테스트 가능합니다.
        </p>
        <ol className="list-decimal space-y-2 pl-4">
          <li>
            <strong>pindoudou / 예전 앱 연동 해제</strong>: 카카오 Developers에서
            예전 앱 Redirect URI에서 Supabase callback URL을 삭제하고, Wadeal에서
            쓰지 않는 REST API 키는 Supabase/Vercel env에서 제거
          </li>
          <li>
            <strong>wadeal-test 앱 사용</strong> (운영 전 테스트용). wadeal 앱은
            심사 통과 후 전환
          </li>
          <li>
            제품 설정 → 카카오 로그인 → 일반 → <strong>ON</strong>
          </li>
          <li>
            제품 설정 → 카카오 로그인 → 동의항목 →{" "}
            <strong>profile_nickname, profile_image ON</strong> (account_email OFF)
          </li>
          <li>
            앱 설정 → 플랫폼 → Web →{" "}
            <code className="rounded bg-white px-1">http://localhost:3000</code>,{" "}
            <code className="rounded bg-white px-1">https://wadeal-v2.vercel.app</code>
          </li>
          <li>
            앱 설정 → 플랫폼 키 → <strong>wadeal-test REST API 키</strong> →
            Redirect URI:
            <div className="mt-1 space-y-1">
              <code className="block rounded bg-white px-1">
                http://localhost:3000/auth/kakao/callback
              </code>
              <code className="block rounded bg-white px-1">
                https://wadeal-v2.vercel.app/auth/kakao/callback
              </code>
            </div>
          </li>
          <li>
            REST API 키에서 <strong>카카오 로그인 클라이언트 시크릿</strong> 활성화
          </li>
          <li>
            Vercel / .env.local 서버 변수:
            <code className="ml-1 rounded bg-white px-1">KAKAO_REST_API_KEY</code>,{" "}
            <code className="rounded bg-white px-1">KAKAO_CLIENT_SECRET</code>,{" "}
            <code className="rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code>
          </li>
        </ol>
      </div>
    </details>
  );
}
