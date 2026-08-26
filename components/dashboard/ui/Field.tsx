/** Shared form-control classes — replaces the three duplicate `inputClass` consts. */

export const labelClass =
  "block font-ui text-ink-70 text-sm font-medium mb-2";

export const inputClass =
  "w-full rounded-full border border-rule-strong bg-paper px-5 py-3 " +
  "font-ui text-sm text-ink placeholder-ink-45 outline-none " +
  "focus-ring focus:border-ink transition-colors duration-200 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const selectClass =
  "rounded-full border border-rule-strong bg-paper px-5 py-3 " +
  "font-ui text-sm text-ink outline-none focus-ring focus:border-ink " +
  "transition-colors duration-200 disabled:opacity-50";

export const textareaClass =
  "w-full rounded-2xl border border-rule-strong bg-paper px-5 py-3 " +
  "font-ui text-sm text-ink placeholder-ink-45 outline-none " +
  "focus-ring focus:border-ink transition-colors duration-200 resize-none";

/** Inline error / limit message. */
export const noticeClass = "font-ui text-ember text-sm";
