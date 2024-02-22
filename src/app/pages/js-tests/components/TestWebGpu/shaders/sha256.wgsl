struct CTX {
    data: array<u32, 64>,
    datalen: u32,
    bitlen: array<u32, 2>,
    state: array<u32, 8>,
    info: u32,
};

@group(0) @binding(0) var<storage, read> input: array<u32>;
@group(0) @binding(1) var<storage, read> inputSize: array<u32>;
@group(0) @binding(2) var<storage, read_write> result: array<u32>;

const k = array<u32, 64> (
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
);

fn rotate_left(a: u32, b: u32) -> u32 {
    return ((a << b) | (a >> (32 - b)));
}

fn rotate_right(a: u32, b: u32) -> u32 {
    return ((a >> b) | (a << (32 - b)));
}

fn choose(x: u32, y: u32, z: u32) -> u32 {
    return ((x & y) ^ (~x & z));
}

fn majority(x: u32, y: u32, z: u32) -> u32 {
    return ((x & y) ^ (x & z) ^ (y & z));
}

fn ep0(x: u32) -> u32 {
    return (rotate_right(x, 2) ^ rotate_right(x, 13) ^ rotate_right(x, 22));
}

fn ep1(x: u32) -> u32 {
    return (rotate_right(x, 6) ^ rotate_right(x, 11) ^ rotate_right(x, 25));
}

fn sig0(x: u32) -> u32 {
    return (rotate_right(x, 7) ^ rotate_right(x, 18) ^ (x >> 3));
}

fn sig1(x: u32) -> u32 {
    return (rotate_right(x, 17) ^ rotate_right(x, 19) ^ (x >> 10));
}

fn initialize_context(ctx: ptr<function, CTX>) {
    (*ctx).datalen = 0;
    (*ctx).bitlen[0] = 0;
    (*ctx).bitlen[1] = 0;
    (*ctx).state[0] = 0x6a09e667;
    (*ctx).state[1] = 0xbb67ae85;
    (*ctx).state[2] = 0x3c6ef372;
    (*ctx).state[3] = 0xa54ff53a;
    (*ctx).state[4] = 0x510e527f;
    (*ctx).state[5] = 0x9b05688c;
    (*ctx).state[6] = 0x1f83d9ab;
    (*ctx).state[7] = 0x5be0cd19;
}

fn main_loop(ctx: ptr<function, CTX>) {
    var current_word_index: u32 = 0;
    var message_word_index: u32 = 0;
    var a: u32;
    var b: u32;
    var c: u32;
    var d: u32;
    var e: u32;
    var f: u32;
    var g: u32;
    var h: u32;
    var t1: u32;
    var t2: u32;
    var message_schedule: array<u32, 64>;

    while (current_word_index < 16) {
        message_schedule[current_word_index] = ((*ctx).data[message_word_index] << 24)
            | ((*ctx).data[message_word_index + 1] << 16)
            | ((*ctx).data[message_word_index + 2] << 8)
            | ((*ctx).data[message_word_index + 3]);
        current_word_index++;
        message_word_index += 4;
    }

    while (current_word_index < 64) {
        message_schedule[current_word_index] = sig1(message_schedule[current_word_index - 2])
            + message_schedule[current_word_index - 7]
            + sig0(message_schedule[current_word_index - 15])
            + message_schedule[current_word_index - 16];
        current_word_index++;
    }

    a = (*ctx).state[0];
    b = (*ctx).state[1];
    c = (*ctx).state[2];
    d = (*ctx).state[3];
    e = (*ctx).state[4];
    f = (*ctx).state[5];
    g = (*ctx).state[6];
    h = (*ctx).state[7];

    current_word_index = 0;
    for (; current_word_index < 64; current_word_index++) {
        t1 = h + ep1(e) + choose(e, f, g) + k[current_word_index] + message_schedule[current_word_index];
        t2 = ep0(a) + majority(a, b, c);
        h = g;
        g = f;
        f = e;
        e = d + t1;
        d = c;
        c = b;
        b = a;
        a = t1 + t2;
    }

    (*ctx).state[0] += a;
    (*ctx).state[1] += b;
    (*ctx).state[2] += c;
    (*ctx).state[3] += d;
    (*ctx).state[4] += e;
    (*ctx).state[5] += f;
    (*ctx).state[6] += g;
    (*ctx).state[7] += h;
}


fn update(ctx: ptr<function, CTX>, input_length: u32) {
    var current_input_index: u32 = 0;

    for (; current_input_index < input_length; current_input_index++) {
        (*ctx).data[(*ctx).datalen] = input[current_input_index];
        (*ctx).datalen++;

        if ((*ctx).datalen == 64) {
            main_loop(ctx);

            if ((*ctx).bitlen[0] > 0xffffffff - 512) {
                (*ctx).bitlen[1]++;
            }
            (*ctx).bitlen[0] += 512;

            (*ctx).datalen = 0;
        }
    }
}

fn finalize(ctx: ptr<function, CTX>, hash: ptr<function, array<u32, 32>>) {
    var padding_index: u32 = (*ctx).datalen;

    if ((*ctx).datalen < 56) {
        (*ctx).data[padding_index] = 0x80;

        padding_index++;

        while (padding_index < 56) {
            (*ctx).data[padding_index] = 0x00;
            padding_index++;
        }
    } else {
        (*ctx).data[padding_index] = 0x80;

        padding_index++;

        while (padding_index < 64) {
            (*ctx).data[padding_index] = 0x00;
            padding_index++;
        }

        main_loop(ctx);

        for (var i = 0; i < 56; i++) {
            (*ctx).data[i] = 0;
        }
    }

    if ((*ctx).bitlen[0] > 0xffffffff - (*ctx).datalen * 8) {
        (*ctx).bitlen[1]++;
    }

    (*ctx).bitlen[0] += (*ctx).datalen * 8;

    (*ctx).data[63] = (*ctx).bitlen[0];
    (*ctx).data[62] = (*ctx).bitlen[0] >> 8;
    (*ctx).data[61] = (*ctx).bitlen[0] >> 16;
    (*ctx).data[60] = (*ctx).bitlen[0] >> 24;
    (*ctx).data[59] = (*ctx).bitlen[1];
    (*ctx).data[58] = (*ctx).bitlen[1] >> 8;
    (*ctx).data[57] = (*ctx).bitlen[1] >> 16;
    (*ctx).data[56] = (*ctx).bitlen[1] >> 24;

    main_loop(ctx);

    for (var i: u32 = 0; i < 4; i++) {
        (*hash)[i] = ((*ctx).state[0] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 4] = ((*ctx).state[1] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 8] = ((*ctx).state[2] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 12] = ((*ctx).state[3] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 16] = ((*ctx).state[4] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 20] = ((*ctx).state[5] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 24] = ((*ctx).state[6] >> (24 - i * 8)) & 0x000000ff;
        (*hash)[i + 28] = ((*ctx).state[7] >> (24 - i * 8)) & 0x000000ff;
      }
}

@compute @workgroup_size(1, 1)
fn c_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    var ctx: CTX;
    var hash_result: array<u32, 32>;

    initialize_context(&ctx);

    update(&ctx, inputSize[0]);
    finalize(&ctx, &hash_result);

    for (var i = 0; i < 32; i++) {
      result[i] = hash_result[i];
    }
}
