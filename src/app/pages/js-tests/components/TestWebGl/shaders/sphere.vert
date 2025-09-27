precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertTexCoord;
varying vec3 fragNormal;
varying vec2 fragTexCoord;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
  fragNormal = vertNormal;
  fragTexCoord = vertTexCoord;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}