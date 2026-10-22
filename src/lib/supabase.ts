import { createClient } from "@supabase/supabase-js";

// Supabase 연결. .env.local의 공개 URL·키만 쓴다 (service_role 키는 쓰지 않는다)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(".env.local에 Supabase URL·키가 없어요");
}

// 로그인을 쓰지 않으므로 로그인 정보는 저장하지 않는다
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
