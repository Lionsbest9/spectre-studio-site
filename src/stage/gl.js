// No dependencies on purpose: the home page asks this before it loads React or three.js.

// WebGL that is drawn on the CPU (SwiftShader, llvmpipe, Microsoft Basic Render) blocks the main
// thread for seconds per frame on a slow machine. Treat it as no WebGL: every scene has a still.
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;
let glVerdict;

export function webglAvailable() {
  if (glVerdict !== undefined) return glVerdict;
  try {
    const c = document.createElement("canvas");
    // the browser refuses a context it would have to draw in software: one cheap attempt
    const gl = c.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return (glVerdict = false);
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    glVerdict = !SOFTWARE_GL.test(String(renderer || ""));
  } catch {
    glVerdict = false;
  }
  return glVerdict;
}
