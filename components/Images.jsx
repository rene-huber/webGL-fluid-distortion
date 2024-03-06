"use client";
import { useTexture } from '@react-three/drei';

import img from '@/public/img.jpg';

function Images() {
  const texture = useTexture(img.src);

  return (
      <mesh position-z={-4}>
          <planeGeometry args={[7, 10, 20, 20]} attach='geometry' />
          <meshBasicMaterial map={texture} color='#d5cfc9' />
      </mesh>
  );
}

export default Images;
