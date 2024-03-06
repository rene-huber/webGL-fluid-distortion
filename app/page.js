"use client"

import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@/lib/Fluid';
import { ThreeTunnel } from '@/components/tunel';


import Text from '@/components/Text';
import Images from '@/components/Images';


const Home = () => {
    return (
        <ThreeTunnel.In>
            <Text />

            <Images />


            <EffectComposer>
              
                <Fluid
                    radius={0.03}
                    curl={10}
                    swirl={5}
                    distortion={1}
                    force={2}
                    pressure={0.94}
                    densityDissipation={0.98}
                    velocityDissipation={0.99}
                    intensity={0.3}
                    rainbow={false}
                    blend={0}
                    showBackground={true}
                    backgroundColor='#000'
                    fluidColor='#cfc0a8'
                />

            </EffectComposer>
        </ThreeTunnel.In>
    );
};

export default Home;
