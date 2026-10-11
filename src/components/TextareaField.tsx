import type { ComponentProps } from "react";

// Figma TextareaField (node 102:746)
// 여러 줄 입력 박스. 높이는 rows(보이는 줄 수)로 정한다.
// 빈 칸·입력 중(focus)·값 채움 상태는 브라우저가 알아서 바꾼다.
type TextareaFieldProps = ComponentProps<"textarea">;

export default function TextareaField({
  rows = 4,
  className = "",
  ...props
}: TextareaFieldProps) {
  return (
    <textarea
      rows={rows}
      className={`block w-full resize-none rounded-control border border-border-subtle bg-surface-default px-16 py-12 text-body-lg text-text-primary outline-none placeholder:text-text-disabled focus:border-action-primary ${className}`}
      {...props}
    />
  );
}
