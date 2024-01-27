struct Uniforms {
  projectionMat: mat4x4f
}

struct VSI {
  @location(0) position: vec4f,
  @location(1) normal: vec3f,
  @location(2) uv: vec2f
}

struct VSO {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) uv: vec2f,
}

// VERT
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(1) @binding(0) var<uniform> modelMatrix: mat4x4f;
// FRAG
@group(1) @binding(1) var meshSampler: sampler;
@group(1) @binding(2) var meshTexture: texture_2d<f32>;

@vertex
fn v_main(input: VSI) -> VSO {
  var output: VSO;
  output.position = uniforms.projectionMat * modelMatrix * input.position;
  output.normal = input.normal;
  output.uv = input.uv;

  return output;
}

@fragment
fn f_main(input: VSO) -> @location(0) vec4f {
  var textureColor = textureSample(meshTexture, meshSampler, input.uv);

  return vec4f(textureColor.rgb, textureColor.a);
}
