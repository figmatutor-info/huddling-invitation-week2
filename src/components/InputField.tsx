import type { ComponentProps } from "react";

// Figma InputField (node 4:331)
// 한 줄 입력 박스. 빈 칸·입력 중(focus)·값 채움 상태는 브라우저가 알아서 바꾼다.
type InputFieldProps = ComponentProps<"input">;

export default function InputField({
  type = "text",
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <input
      type={type}
      className={`w-full rounded-control border border-border-subtle bg-surface-default px-16 py-12 text-body-lg text-text-primary outline-none placeholder:text-text-disabled focus:border-action-primary ${className}`}
      {...props}
    />
  );
}
