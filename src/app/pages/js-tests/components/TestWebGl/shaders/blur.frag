precision mediump float;

varying vec2 v_texCoord;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_blurRadius;

void main() {
  vec2 onePixel = vec2(1.0) / u_resolution;
  vec4 color = vec4(0.0);
  float totalWeight = 0.0;

  for (float x = -4.0; x <= 4.0; x += 1.0) {
    for (float y = -4.0; y <= 4.0; y += 1.0) {
      vec2 offset = vec2(x, y) * onePixel * u_blurRadius;
      float weight = exp(-(x*x + y*y) / 8.0);
      color += texture2D(u_texture, v_texCoord + offset) * weight;
      totalWeight += weight;
    }
  }

  gl_FragColor = color / totalWeight;
}