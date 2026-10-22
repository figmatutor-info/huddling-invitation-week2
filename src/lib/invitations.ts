import { supabase } from "@/lib/supabase";

// 초대장: 제목 · 일시 · 장소 · 본문 (Supabase invitations 표)
export type Invitation = {
  id: string;
  title: string; // 최대 2줄, 줄바꿈(\n)은 그대로 보여준다
  date: string; // 일시. 화면에 보이는 글자 그대로 저장한다
  location: string; // 장소. 주소를 글자로만 표시한다 (지도 없음)
  body: string; // 본문. 줄바꿈(\n)은 그대로 보여준다
};

// 참석 응답: 이름 · 참석 여부 · 동반 인원 (Supabase rsvps 표)
export type Rsvp = {
  id: string;
  invitationId: string; // 표에서는 invitation_id
  name: string;
  status: "yes" | "no"; // yes 참석 · no 불참
  companions: number; // 본인을 제외한 동반 인원. 불참이면 0
};

// 초대장 id는 crypto.randomUUID()로 만든 uuid다
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(id: string) {
  return UUID.test(id);
}

// id로 초대장을 찾는다. 없으면 null
export async function getInvitation(id: string): Promise<Invitation | null> {
  // uuid 모양이 아니면 DB에 묻지 않고 바로 없음으로 처리한다
  if (!isUuid(id)) return null;

  const { data, error } = await supabase
    .from("invitations")
    .select("id, title, date, location, body")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 초대장의 응답 목록. 먼저 응답한 순서로 가져온다
export async function getRsvps(invitationId: string): Promise<Rsvp[]> {
  const { data, error } = await supabase
    .from("rsvps")
    .select("id, invitation_id, name, status, companions")
    .eq("invitation_id", invitationId)
    .order("created_at");

  if (error) throw error;
  return data.map((r) => ({
    id: r.id,
    invitationId: r.invitation_id,
    name: r.name,
    status: r.status,
    companions: r.companions,
  }));
}
