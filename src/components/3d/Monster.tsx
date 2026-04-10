'use client'; 
 
 import { Canvas } from '@react-three/fiber'; 
 import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'; 
 
 interface Monster3DProps { 
   species: string; 
   color: string; 
   mood: number; 
   name: string; 
 } 
 
 export default function Monster3D({ species, color = '#ff00ff', mood, name }: Monster3DProps) { 
   return ( 
     <Canvas camera={{ position: [0, 0, 4], fov: 50 }}> 
       <ambientLight intensity={0.8} /> 
       <pointLight position={[10, 10, 10]} /> 
       
       <Sphere args={[1, 64, 64]}> 
         <MeshDistortMaterial 
           color={color} 
           speed={mood / 20} 
           distort={0.4} 
         /> 
       </Sphere> 
       
       <OrbitControls enableZoom={false} /> 
     </Canvas> 
   ); 
 } 
