import * as THREE from 'three';
import { useFBO } from '@react-three/drei';
import { useRef } from 'react';

export const useDoubleFBO = (width, height, options) => {
    const read = useFBO(width, height, options);
    const write = useFBO(width, height, options);

    const fbo = useRef({
        read,
        write,
        swap: () => {
            const temp = fbo.read;
            fbo.read = fbo.write;
            fbo.write = temp;
        },
        dispose: () => {
            read.dispose();
            write.dispose();
        },
    }).current;

    return fbo;
};
