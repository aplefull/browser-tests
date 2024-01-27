struct VSO {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@vertex
fn v_main(@builtin(vertex_index) vertexIndex : u32) -> VSO {
  var pos = array<vec2f, 3>(
    vec2f(0.0, 0.5),
    vec2f(-0.5, -0.5),
    vec2f(0.5, -0.5)
  );

  var colors = array<vec4f, 3>(
    vec4f(1.0, 0.0, 0.0, 1.0),
    vec4f(0.0, 0.0, 1.0, 1.0),
    vec4f(0.0, 1.0, 0.0, 1.0)
  );

  var output: VSO;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  output.color = colors[vertexIndex];

  return output;
}

@fragment
fn f_main(FSInput: VSO) -> @location(0) vec4f {
  return FSInput.color;
}
