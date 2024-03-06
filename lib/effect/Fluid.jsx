
import { forwardRef, useEffect, useMemo } from 'react';

import { FluidEffect } from './FluidEffect';

export const Effect = forwardRef(function Fluid(props, ref) {
    const effect = useMemo(() => new FluidEffect(props), [props]);

    useEffect(() => {
        return () => {
            if (effect) effect.dispose();
        };
    }, [effect]);

    return <primitive ref={ref} object={effect} />;
});
