export const AVATAR_MAP: Record<number, any> = {
  0: require("@/assets/avatars/0.png"),
  1: require("@/assets/avatars/1.png"),
  2: require("@/assets/avatars/2.png"),
  3: require("@/assets/avatars/3.png"),
  4: require("@/assets/avatars/4.png"),
  5: require("@/assets/avatars/5.png"),
  6: require("@/assets/avatars/6.png"),
};

export const getAvatarSource = (code: number | null | undefined) => {
  // 1. If code is null/undefined, default to 0
  if (code == null) return AVATAR_MAP[0];

  // 2. Try to get the specific image
  const image = AVATAR_MAP[code];

  // 3. If image doesn't exist (e.g. code is 99), fallback to 0
  return image ?? AVATAR_MAP[0];
};
