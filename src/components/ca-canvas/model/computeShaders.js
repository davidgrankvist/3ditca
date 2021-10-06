export const ggolTransitionShader = `
uniform sampler2D data;
uniform vec4 dims;
uniform vec4 lims;

float get_cell_state(float x, float y, float z) {
    float xm = dims.x;
    float ym = dims.y;
    float zm = dims.z;

    if (x > xm || y > ym || z > zm) {
        return 0.0;
    }

    float index = z * (ym * xm + xm) + y * xm + x;
    vec4 cell_state = texture(data, vec2(index / resolution.x));
    float cell_state_f = cell_state.r;
    return cell_state_f;
}

// index corresponds to an iteration in a for z, y, x nested loop
vec3 get_position(float index) {
    float xm = dims.x;
    float ym = dims.y;
    float zm = dims.z;

    // x = id mod xm
    float x = index - (xm * floor(index / xm));
    // y = (index / xm) mod ym
    float y = floor(index / xm) - (ym * floor(floor(index / xm) / ym));
    // z = (id / ((xm + 1)(ym + 1))) mod zm
    float a = floor(index / ((xm + 1.0) * (ym + 1.0)));
    float z = a - (zm * floor(a / zm));

    return vec3(x, y, z);
}

float count_neighbors(float x, float y, float z) {
    float sum = 0.0;
    sum += get_cell_state(x - 1.0, y, z);
    for(float dx = -1.0; dx <= 1.0; dx++) {
        for(float dy = -1.0; dy <= 1.0; dy++) {
            for(float dz = -1.0; dz <= 1.0; dz++) {
                if (dx == 0.0 && dy == 0.0 && dz == 0.0) {
                    continue;
                }
                sum += get_cell_state(x + dx, y + dy, z + dz);
            }
        }
    }
    return sum;
}

void main() {
    float xm = dims.x;
    float ym = dims.y;
    float zm = dims.z;
    float survive_min = lims.x;
    float survive_max = lims.y;
    float revive_min = lims.z;
    float revive_max = lims.w;
    float size = resolution.x;
    float index = gl_FragCoord.x;

    vec3 pos = get_position(index);
    float count = count_neighbors(pos.x, pos.y, pos.z);
    float cell_state_f = get_cell_state(pos.x, pos.y, pos.z);

    float lim_min = survive_min;
    float lim_max = survive_max;
    if (floor(cell_state_f) == 0.0) {
        lim_min = revive_min;
        lim_max = revive_max;
    }
    float next_cell_state = 0.0;
    if (count >= lim_min && count <= lim_max) {
        next_cell_state = 1.0;
    }

    gl_FragColor = vec4(next_cell_state, 0.0, 0.0, 1.0);
}
`;
