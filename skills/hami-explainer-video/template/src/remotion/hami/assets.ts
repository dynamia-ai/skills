// Official HAMi artwork, copied from the HAMi website checkout by the skill's init_project.sh.
// Never redraw, recolor, crop or restyle these (see references/brand.md in the skill).
import logoHorizontal from "./assets/hami-horizontal-color-black.svg";
import logoIcon from "./assets/hami-graph-color.svg";
import glasses from "./assets/hami-glasses.png";
import balloon from "./assets/hami-balloon.png";
import service from "./assets/hami-service.png";
import curiosity from "./assets/hami-curiosity.png";
import broadcast from "./assets/hami-broadcast.png";

/** For light backgrounds. */
export const LOGO = { horizontal: logoHorizontal, icon: logoIcon };

export const MASCOT = {
  /** Transparent background: hami at a laptop with a lightbulb (explaining, testing). */
  glasses,
  /** Transparent background: hami running with a star balloon (greeting, goodbye). */
  balloon,
  /** Transparent background: hami with a headset (service, support). */
  service,
  /** Square tile with its own background: show it uncropped, no rounded corners. */
  curiosity,
  /** Square tile with its own background: show it uncropped, no rounded corners. */
  broadcast,
};
