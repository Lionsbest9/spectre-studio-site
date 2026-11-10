// Springs described the Apple way: response (seconds) and damping ratio.
// They start from the current value and carry velocity, so any motion can be
// grabbed and reversed mid-flight.

export function spring(x = 0, response = 0.45, ratio = 1) {
  return { x, v: 0, target: x, response, ratio };
}

export function stepSpring(s, dt) {
  const w = (2 * Math.PI) / s.response;
  const a = -w * w * (s.x - s.target) - 2 * s.ratio * w * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
  if (Math.abs(s.v) < 0.0008 && Math.abs(s.x - s.target) < 0.0008) {
    s.x = s.target;
    s.v = 0;
    return false;
  }
  return true;
}

// Past a limit the element follows less and less: a soft edge instead of a wall.
export function rubberband(offset, limit, constant = 0.55) {
  const over = Math.abs(offset) - limit;
  if (over <= 0) return offset;
  const eased = (over * limit * constant) / (limit + constant * over);
  return Math.sign(offset) * (limit + eased);
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { webglAvailable } from "./gl.js";
