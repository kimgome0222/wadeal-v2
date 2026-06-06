-- Category review rules and admin product review checklists.

CREATE TABLE IF NOT EXISTS public.category_review_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  rule_title TEXT NOT NULL,
  rule_description TEXT NOT NULL,
  required_documents TEXT[] NOT NULL DEFAULT '{}',
  warning_keywords TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT category_review_rules_title_not_empty CHECK (char_length(trim(rule_title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_category_review_rules_category_id
  ON public.category_review_rules(category_id);

CREATE TABLE IF NOT EXISTS public.product_review_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  check_key TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  memo TEXT,
  checked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ,
  CONSTRAINT product_review_checklists_key_check CHECK (
    check_key IN (
      'prohibited_products_cleared',
      'category_requirements_met',
      'required_documents_verified',
      'exaggerated_claims_checked',
      'price_stock_shipping_verified'
    )
  ),
  CONSTRAINT product_review_checklists_product_key_unique UNIQUE (product_id, check_key)
);

CREATE INDEX IF NOT EXISTS idx_product_review_checklists_product_id
  ON public.product_review_checklists(product_id);

ALTER TABLE public.category_review_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_review_checklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS category_review_rules_select_active ON public.category_review_rules;
CREATE POLICY category_review_rules_select_active
  ON public.category_review_rules FOR SELECT
  USING (is_active = true OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS category_review_rules_admin_all ON public.category_review_rules;
CREATE POLICY category_review_rules_admin_all
  ON public.category_review_rules FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS product_review_checklists_admin_all ON public.product_review_checklists;
CREATE POLICY product_review_checklists_admin_all
  ON public.product_review_checklists FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Seed category review rules (by category slug).
INSERT INTO public.category_review_rules (
  category_id,
  rule_title,
  rule_description,
  required_documents,
  warning_keywords
)
SELECT c.id, v.rule_title, v.rule_description, v.required_documents, v.warning_keywords
FROM public.categories c
JOIN (
  VALUES
    (
      'food',
      '식품 표시사항',
      '원산지, 유통기한, 보관방법, 영양/알레르기 표시사항을 확인합니다.',
      ARRAY['원산지 증빙', '유통기한 표시', '식품등록/신고 서류(해당 시)'],
      ARRAY['치료', '완치', '의약', '100% 효과']
    ),
    (
      'beauty',
      '화장품 표시·광고',
      '기능성 문구, 전성분, 사용법 표시를 확인합니다. 과장·허위 효능 표현을 금합니다.',
      ARRAY['화장품 책임판매업 신고(해당 시)', '전성분 표시'],
      ARRAY['치료', '완치', '주름 제거', '미백 보장']
    ),
    (
      'living',
      '생활용품 안전',
      'KC 인증 필요 여부, 사용 연령, 안전 주의사항을 확인합니다.',
      ARRAY['KC 인증서(해당 시)', '품질표시'],
      ARRAY['무조건 안전', '100% 효과']
    ),
    (
      'digital',
      '전자·가전 인증',
      'KC/전파인증, A/S 안내, 정품 여부를 확인합니다.',
      ARRAY['KC 인증서', '전파인증(해당 시)', 'A/S 안내'],
      ARRAY['정품 보장', '평생 A/S']
    ),
    (
      'baby',
      '유아·아동 안전',
      'KC 안전인증, 연령 표시, 소재 정보를 확인합니다.',
      ARRAY['KC 안전인증', '연령 표시'],
      ARRAY['무조건 안전', '100% 순면']
    ),
    (
      'pet',
      '반려동물용품',
      '사료/간식 원료·유통기한, 사용 대상(견/묘) 표시를 확인합니다.',
      ARRAY['원료/성분 표시', '유통기한'],
      ARRAY['치료', '완치']
    ),
    (
      'fashion',
      '패션·잡화',
      '가품/상표권, 소재·세탁 표시, 정품 여부를 확인합니다.',
      ARRAY['정품 증빙(해당 시)', '소재/세탁 표시'],
      ARRAY['정품 보장', '100% 가죽', '명품']
    ),
    (
      'local',
      '지역특산물',
      '원산지·생산자 정보, 유통기한/보관방법을 확인합니다.',
      ARRAY['원산지 증빙', '생산자 정보'],
      ARRAY['100% 국산', '완치']
    )
) AS v(slug, rule_title, rule_description, required_documents, warning_keywords)
  ON c.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM public.category_review_rules r WHERE r.category_id = c.id
);
