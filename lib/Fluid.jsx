"use client";
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import { Camera, Color, Mesh, Scene, Texture, Vector2, Vector3 } from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { Effect as FluidEffect } from './effect/Fluid';
import { useFBOs } from './hooks/useFBOs';
import { useMaterials } from './hooks/useMaterials';
import { OPTS } from './constant';
import { usePointer } from './hooks/usePointer';

export const Fluid = ({
    blend = OPTS.blend,
    force = OPTS.force,
    radius = OPTS.radius,
    curl = OPTS.curl,
    swirl = OPTS.swirl,
    intensity = OPTS.intensity,
    distortion = OPTS.distortion,
    fluidColor = OPTS.fluidColor,
    backgroundColor = OPTS.backgroundColor,
    showBackground = OPTS.showBackground,
    rainbow = OPTS.rainbow,
    pressure = OPTS.pressure,
    densityDissipation = OPTS.densityDissipation,
    velocityDissipation = OPTS.velocityDissipation,
}) => {
    const size = useThree((three) => three.size);
    const gl = useThree((three) => three.gl);

    const bufferScene = useMemo(() => new Scene(), []);
    const bufferCamera = useMemo(() => new Camera(), []);

    const meshRef = useRef(null);
    const postRef = useRef(null);

    const FBOs = useFBOs();
    const materials = useMaterials();
    const { onPointerMove, splatStack } = usePointer({ force });

    const setShaderMaterial = useCallback(
        (name) => {
            if (!meshRef.current) return;

            meshRef.current.material = materials[name];
            meshRef.current.material.needsUpdate = true;
        },
        [materials],
    );

    const setRenderTarget = useCallback(
        (name) => {
            const target = FBOs[name];

            if ('write' in target) {
                gl.setRenderTarget(target.write);
                gl.clear();
                gl.render(bufferScene, bufferCamera);
                target.swap();
            } else {
                gl.setRenderTarget(target);
                gl.clear();
                gl.render(bufferScene, bufferCamera);
            }
        },
        [bufferCamera, bufferScene, FBOs, gl],
    );

    const setUniforms = useCallback(
        (material, uniform, value) => {
            const mat = materials[material];

            if (mat && mat.uniforms[uniform]) {
                mat.uniforms[uniform].value = value;
            }
        },
        [materials],
    );

    useFrame(({ gl }) => {
        if (!meshRef.current || !postRef.current) return;

        for (let i = splatStack.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = splatStack[i];

            setShaderMaterial('splat');
            setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
            setUniforms('splat', 'uPointer', new Vector2(mouseX, mouseY));
            setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
            setUniforms('splat', 'uRadius', radius / 100.0);
            setRenderTarget('velocity');
            setUniforms('splat', 'uTarget', FBOs.density.read.texture);
            setRenderTarget('density');

            splatStack.pop();
        }

        setShaderMaterial('curl');
        setUniforms('curl', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('curl');

        setShaderMaterial('vorticity');
        setUniforms('vorticity', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('vorticity', 'uCurl', FBOs.curl.texture);
        setUniforms('vorticity', 'uCurlValue', curl);
        setRenderTarget('velocity');

        setShaderMaterial('divergence');
        setUniforms('divergence', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('divergence');

        setShaderMaterial('clear');
        setUniforms('clear', 'uTexture', FBOs.pressure.read.texture);
        setUniforms('clear', 'uClearValue', pressure);
        setRenderTarget('pressure');

        setShaderMaterial('pressure');
        setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);

        for (let i = 0; i < swirl; i++) {
            setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
            setRenderTarget('pressure');
        }

        setShaderMaterial('gradientSubstract');
        setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
        setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('velocity');

        setShaderMaterial('advection');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
        setUniforms('advection', 'uDissipation', velocityDissipation);

        setRenderTarget('velocity');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.density.read.texture);
        setUniforms('advection', 'uDissipation', densityDissipation);

        setRenderTarget('density');

        gl.setRenderTarget(null);
        gl.clear();
    });

    return (
        <>
            {createPortal(
                <mesh
                    ref={meshRef}
                    onPointerMove={onPointerMove}
                    scale={[size.width, size.height, 1]}>
                    <planeGeometry args={[2, 2, 10, 10]} />
                </mesh>,
                bufferScene,
            )}

            <FluidEffect
                intensity={intensity * 0.0001}
                rainbow={rainbow}
                distortion={distortion * 0.001}
                backgroundColor={backgroundColor}
                blend={blend * 0.01}
                fluidColor={fluidColor}
                showBackground={showBackground}
                ref={postRef}
                tFluid={FBOs.density.read.texture}
            />
        </>
    );
};
