'use client' 
 
 import { useRef, useMemo } from 'react' 
 import { Canvas, useFrame } from '@react-three/fiber' 
 import { OrbitControls, Stars } from '@react-three/drei' 
 import * as THREE from 'three' 
 
 interface PlanetProps { 
   terrainType: string 
   themeColor: string 
   weather: string 
 } 
 
 // 星球主体 
 function Planet({ terrainType, themeColor }: PlanetProps) { 
   const meshRef = useRef<THREE.Mesh>(null) 
   
   useFrame((state) => { 
     if (meshRef.current) { 
       meshRef.current.rotation.y = state.clock.elapsedTime * 0.05 
     } 
   }) 
 
   // 根据地形类型选择颜色 
   const color = useMemo(() => { 
     const colors: Record<string, string> = { 
       earth: '#8B4513', 
       water: '#1E90FF', 
       fire: '#FF4500', 
       ice: '#E0FFFF', 
       cloud: '#F0F8FF', 
       crystal: '#DA70D6' 
     } 
     return colors[terrainType] || themeColor 
   }, [terrainType, themeColor]) 
 
   return ( 
     <mesh ref={meshRef}> 
       <sphereGeometry args={[2, 64, 64]} /> 
       <meshStandardMaterial 
         color={color} 
         roughness={0.7} 
         metalness={0.3} 
       /> 
     </mesh> 
   ) 
 } 
 
 // 大气层/云层 
 function Atmosphere({ weather }: { weather: string }) { 
   const groupRef = useRef<THREE.Group>(null) 
   
   useFrame((state) => { 
     if (groupRef.current) { 
       groupRef.current.rotation.y = state.clock.elapsedTime * 0.02 
     } 
   }) 
 
   const cloudColor = useMemo(() => { 
     const colors: Record<string, string> = { 
       sunny: '#FFFFFF', 
       rainy: '#808080', 
       stormy: '#2F4F4F', 
       snowy: '#FFFAFA', 
       cloudy: '#D3D3D3' 
     } 
     return colors[weather] || '#FFFFFF' 
   }, [weather]) 
 
   return ( 
     <group ref={groupRef}> 
       {[...Array(12)].map((_, i) => ( 
         <mesh 
           key={i} 
           position={[ 
             Math.sin(i * Math.PI / 6) * 2.8, 
             Math.cos(i * 0.5) * 0.8, 
             Math.cos(i * Math.PI / 6) * 2.8 
           ]} 
         > 
           <sphereGeometry args={[0.4, 16, 16]} /> 
           <meshStandardMaterial 
             color={cloudColor} 
             transparent 
             opacity={0.5} 
           /> 
         </mesh> 
       ))} 
     </group> 
   ) 
 } 
 
 // 装饰物 
 function Decorations({ decorations }: { decorations: any[] }) { 
   return ( 
     <group> 
       {decorations.map((dec, i) => ( 
         <mesh 
           key={i} 
           position={[dec.position.x, dec.position.y, dec.position.z]} 
           rotation={[dec.rotation.x, dec.rotation.y, dec.rotation.z]} 
           scale={dec.scale} 
         > 
           <boxGeometry args={[0.3, 0.3, 0.3]} /> 
           <meshStandardMaterial color="#FFD700" /> 
         </mesh> 
       ))} 
     </group> 
   ) 
 } 
 
 export default function PlanetScene({ 
   terrainType, 
   themeColor, 
   weather, 
   decorations = [] 
 }: PlanetProps & { decorations?: any[] }) { 
   return ( 
     <div className="w-full h-full min-h-[400px]"> 
       <Canvas camera={{ position: [0, 0, 7], fov: 45 }}> 
         <ambientLight intensity={0.4} /> 
         <pointLight position={[10, 10, 10]} intensity={1} /> 
         <pointLight position={[-10, -10, -10]} intensity={0.5} color={themeColor} /> 
         
         {/* 星空背景 */} 
         <Stars 
           radius={100} 
           depth={50} 
           count={5000} 
           factor={4} 
           saturation={0} 
           fade 
           speed={1} 
         /> 
         
         {/* 星球 */} 
         <Planet terrainType={terrainType} themeColor={themeColor} weather={weather} /> 
         
         {/* 大气层 */} 
         <Atmosphere weather={weather} /> 
         
         {/* 装饰物 */} 
         <Decorations decorations={decorations} /> 
         
         {/* 轨道控制器 */} 
         <OrbitControls 
           enableZoom={true} 
           enablePan={false} 
           minDistance={5} 
           maxDistance={12} 
           autoRotate 
           autoRotateSpeed={0.5} 
         /> 
       </Canvas> 
     </div> 
   ) 
 } 
