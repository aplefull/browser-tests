struct Uniforms {
  projectionMat: mat4x4f,
}

struct VSO {
  @builtin(position) position: vec4f,
  @location(0) fragUV: vec2f,
  @location(1) fragPosition: vec4f,
}

// VERT
@binding(0) @group(0) var<uniform> uniforms: Uniforms;
// FRAG
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var tex: texture_2d<f32>;

@vertex
fn v_main(@location(0) position: vec4f, @location(1) uv: vec2f) -> VSO {
  var output: VSO;
  output.position = uniforms.projectionMat * position;
  output.fragPosition = position;
  output.fragUV = uv;

  return output;
}

@fragment
fn f_main(@location(0) fragUV: vec2f, @location(1) fragPosition: vec4f) -> @location(0) vec4f {
  return textureSample(tex, texSampler, fragUV);
}
