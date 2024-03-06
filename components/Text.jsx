'use client';

import { Text as DreiText } from '@react-three/drei';



const Text = () => {
    return (
        <group position-y={0.2}>    

            <DreiText
                letterSpacing={-0.07}               
                position-y={-0.12}
                fontSize={0.94}
                color='#ffffff'>
                Send Nu.des
            </DreiText>          
        </group>
    );
};

export default Text;
