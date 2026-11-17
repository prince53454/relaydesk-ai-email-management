import elenaImg from "./avatar_elena_vance_1794720715424.jpg";
import marcusImg from "./avatar_marcus_chen_1794720715884.jpg";
import victoriaImg from "./avatar_victoria_sterling_1794720715844.jpg";
import davidImg from "./avatar_david_thorne_1794720716400.jpg";
import ariaImg from "./avatar_aria_kapoor_1794720716435.jpg";
const AVATAR_MAP = {
  elena: elenaImg,
  marcus: marcusImg,
  victoria: victoriaImg,
  david: davidImg,
  aria: ariaImg
};
function resolveAvatarSrc(avatarKey) {
  if (!avatarKey) return void 0;
  return AVATAR_MAP[avatarKey] || void 0;
}
export {
  resolveAvatarSrc
};
