precision mediump float;

varying vec3 fragNormal;
varying vec2 fragTexCoord;
uniform sampler2D u_texture;

void main() {
  vec4 textureColor = texture2D(u_texture, fragTexCoord);
  gl_FragColor = vec4(textureColor.rgb, textureColor.a);
}