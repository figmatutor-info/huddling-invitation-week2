"use server";

// 서버에서 실행되는 저장 함수 (Server Action).
// 화면을 거치지 않고 직접 호출될 수도 있으므로 입력을 여기서 다시 검사한다.
import type { RsvpData } from "@/components/RSVPCard";
import { isUuid, type Invitation } from "@/lib/invitations";
import { LIMITS } from "@/lib/limits";
import { supabase } from "@/lib/supabase";

// 비어 있지 않은 글자이고 max 글자 이하인지
function isValidText(value: unknown, max: number): value is string {
  return (
    typeof value === "string" && value.trim() !== "" && value.length <= max
  );
}

// 초대장을 저장하고 새 id를 돌려준다
export async function publishInvitation(
  input: Omit<Invitation, "id">,
): Promise<string> {
  const { title, date, location, body } = input;

  if (
    !isValidText(title, LIMITS.title) ||
    title.split("\n").length > 2 || // 제목은 최대 2줄
    !isValidText(date, LIMITS.date) ||
    !isValidText(location, LIMITS.location) ||
    !isValidText(body, LIMITS.body)
  ) {
    throw new Error("입력값이 올바르지 않아요");
  }

  // 추측하기 어려운 id
  const id = crypto.randomUUID();
  const { error } = await supabase.from("invitations").insert({
    id,
    title: title.trim(),
    date: date.trim(),
    location: location.trim(),
    body: body.trim(),
  });

  if (error) throw new Error("초대장을 저장하지 못했어요");
  return id;
}

// 게스트의 참석 응답을 저장한다
export async function submitRsvp(
  invitationId: string,
  data: RsvpData,
): Promise<void> {
  const { name, status, companions } = data;

  if (
    !isUuid(invitationId) ||
    !isValidText(name, LIMITS.name) ||
    (status !== "yes" && status !== "no") ||
    !Number.isInteger(companions) ||
    companions < 0 // 음수 인원은 막는다
  ) {
    throw new Error("입력값이 올바르지 않아요");
  }

  const { error } = await supabase.from("rsvps").insert({
    invitation_id: invitationId,
    name: name.trim(),
    status,
    // 불참이면 동반 인원은 0
    companions: status === "yes" ? companions : 0,
  });

  if (error) throw new Error("응답을 저장하지 못했어요");
}
