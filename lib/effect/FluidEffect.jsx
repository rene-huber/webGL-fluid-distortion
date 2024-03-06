"use client";
import { Effect } from 'postprocessing';
import { Texture, Uniform, Vector3 } from 'three';
import { hexToRgb } from '../utils';

import fragmentShader from '../glsl/post.frag';

class FluidEffect extends Effect {
    constructor(props = {}) {
        const uniforms = {
            tFluid: new Uniform(props.tFluid),
            uDistort: new Uniform(props.distortion),
            uRainbow: new Uniform(props.rainbow),
            uIntensity: new Uniform(props.intensity),
            uBlend: new Uniform(props.blend),
            uShowBackground: new Uniform(props.showBackground),

            uColor: new Uniform(hexToRgb(props.fluidColor)),
            uBackgroundColor: new Uniform(hexToRgb(props.backgroundColor)),
        };

        super('FluidEffect', fragmentShader, { uniforms: new Map(Object.entries(uniforms)) });

        this.state = {
            ...props,
        };
    }

    updateUniform(key, value) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    update() {
        this.updateUniform('uIntensity', this.state.intensity);
        this.updateUniform('uDistort', this.state.distortion);
        this.updateUniform('uRainbow', this.state.rainbow);
        this.updateUniform('uBlend', this.state.blend);
        this.updateUniform('uShowBackground', this.state.showBackground);
        this.updateUniform('uColor', hexToRgb(this.state.fluidColor));
        this.updateUniform('uBackgroundColor', hexToRgb(this.state.backgroundColor));
    }
}

export default FluidEffect;
