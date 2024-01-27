struct VSO {
  @builtin(position) position: vec4f,
  @location(0) fragUV: vec2f,
}

struct Params {
  filterDim: i32,
  blockDim: u32,
}

struct Flip {
  value: u32,
}

// FRAG
@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var tex: texture_2d<f32>;
// COMPUTE
@group(0) @binding(0) var samp: sampler;
@group(0) @binding(1) var<uniform> params: Params;
@group(1) @binding(1) var inputTex: texture_2d<f32>;
@group(1) @binding(2) var outputTex: texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(3) var<uniform> flip: Flip;

@vertex
fn v_main(@builtin(vertex_index) vertexIndex: u32) -> VSO {
  const position = array<vec2f, 6>(
    vec2( 1.0,  1.0),
    vec2( 1.0, -1.0),
    vec2(-1.0, -1.0),
    vec2( 1.0,  1.0),
    vec2(-1.0, -1.0),
    vec2(-1.0,  1.0),
  );

  const uv = array<vec2f, 6>(
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(0.0, 1.0),
    vec2(0.0, 0.0),
  );

  var output: VSO;
  output.position = vec4f(position[vertexIndex], 0.0, 1.0);
  output.fragUV = uv[vertexIndex];

  return output;
}

@fragment
fn f_main(@location(0) fragUV: vec2f) -> @location(0) vec4<f32> {
  return textureSample(tex, texSampler, fragUV);
}

var<workgroup> tile: array<array<vec3f, 128>, 4>;

@compute @workgroup_size(32, 1, 1)
fn c_main(@builtin(workgroup_id) wgId: vec3<u32>, @builtin(local_invocation_id) lInvId: vec3<u32>) {
  let filterOffset = (params.filterDim - 1) / 2;
  let dims = vec2<i32>(textureDimensions(inputTex, 0));

  let localOffset = lInvId.xy * vec2(4, 1);
  let workgroupOffset = vec2<i32>(wgId.xy * vec2(params.blockDim, 4) + localOffset);
  let baseIndex = workgroupOffset - vec2(filterOffset, 0);

  // Load phase
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var offsetIndex = baseIndex + vec2(col, row);
      if (flip.value != 0u) {
        offsetIndex = vec2<i32>(offsetIndex.y, offsetIndex.x);
      }

      let texCoord = (vec2<f32>(offsetIndex) + vec2<f32>(0.25)) / vec2<f32>(dims);
      let tileIndex = 4 * lInvId.x + u32(col);

      tile[row][tileIndex] = textureSampleLevel(inputTex, samp, texCoord, 0.0).rgb;
    }
  }


  workgroupBarrier();

  // Filter and write phase
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var writeIndex = baseIndex + vec2(col, row);

      if (flip.value != 0) {
        writeIndex = vec2<i32>(writeIndex.y, writeIndex.x);
      }

      let centerOffset = i32(4 * lInvId.x) + col;
      if (centerOffset >= filterOffset && centerOffset < 128 - filterOffset && all(writeIndex < dims)) {
        var acc = vec3(0.0, 0.0, 0.0);

        for (var filterIndex = 0; filterIndex < params.filterDim; filterIndex++) {
          var tileIndex = centerOffset + filterIndex - filterOffset;
          acc = acc + (1.0 / f32(params.filterDim)) * tile[row][tileIndex];
        }

        textureStore(outputTex, writeIndex, vec4(acc, 1.0));
      }
    }
  }
}
