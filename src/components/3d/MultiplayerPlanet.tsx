'use client'; 

import { useState } from 'react'; 
import { Canvas } from '@react-three/fiber'; 
import { OrbitControls, Text } from '@react-three/drei'; 
import { useMultiplayer } from '@/lib/webrtc/useMultiplayer'; 

interface MultiplayerPlanetProps { 
  roomId: string; 
  playerName: string; 
  buildings?: Array<{ 
    id: string; 
    position: [number, number, number]; 
    color: string; 
  }>; 
} 

function PlayerAvatar({ x, y, name }: { x: number; y: number; name: string }) { 
  return ( 
    <group position={[x, 0.5, y]}> 
      <mesh> 
        <sphereGeometry args={[0.3, 16, 16]} /> 
        <meshStandardMaterial color="#FF6B6B" /> 
      </mesh> 
      <Text 
        position={[0, 0.6, 0]} 
        fontSize={0.2} 
        color="#333" 
        anchorX="center" 
      > 
        {name} 
      </Text> 
    </group> 
  ); 
} 

export default function MultiplayerPlanet({ roomId, playerName, buildings = [] }: MultiplayerPlanetProps) { 
  const { isConnected, players, movePlayer } = useMultiplayer({ roomId, playerName }); 
  const [messages, setMessages] = useState<string[]>([]); 

  const handleGroundClick = (e: any) => { 
    const point = e.point; 
    movePlayer(point.x, point.z); 
  }; 

  if (!isConnected) { 
    return ( 
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl"> 
        <div className="text-center"> 
          <div className="text-4xl mb-4">🌐</div> 
          <p className="text-gray-600">正在连接多人服务器...</p> 
          <p className="text-sm text-gray-400 mt-2">请确保Socket.io服务器已启动</p> 
        </div> 
      </div> 
    ); 
  } 

  return ( 
    <div className="flex flex-col h-full"> 
      {/* 状态栏 */} 
      <div className="bg-green-500 text-white px-4 py-2 flex justify-between items-center"> 
        <span>🟢 已连接 | 房间: {roomId}</span> 
        <span>在线玩家: {players.length + 1}</span> 
      </div> 

      {/* 玩家列表 */} 
      <div className="bg-gray-50 px-4 py-2 flex gap-2 overflow-x-auto"> 
        <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">{playerName} (我)</span> 
        {players.map(p => ( 
          <span key={p.id} className="px-3 py-1 bg-gray-200 rounded-full text-sm">{p.name}</span> 
        ))} 
      </div> 

      {/* 3D场景 */} 
      <div className="flex-1"> 
        <Canvas camera={{ position: [8, 8, 8], fov: 50 }}> 
          <ambientLight intensity={0.6} /> 
          <directionalLight position={[10, 10, 5]} /> 
          
          {/* 地面 */} 
          <mesh rotation={[-Math.PI/2, 0, 0]} onClick={handleGroundClick}> 
            <circleGeometry args={[15, 64]} /> 
            <meshStandardMaterial color="#90EE90" /> 
          </mesh> 

          {/* 建筑 */} 
          {buildings.map(b => ( 
            <mesh key={b.id} position={b.position}> 
              <boxGeometry args={[0.5, 0.5, 0.5]} /> 
              <meshStandardMaterial color={b.color} /> 
            </mesh> 
          ))} 

          {/* 其他玩家 */} 
          {players.map(p => ( 
            <PlayerAvatar key={p.id} x={p.x} y={p.y} name={p.name} /> 
          ))} 

          <OrbitControls enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2 - 0.1} /> 
        </Canvas> 
      </div> 

      {/* 聊天区域 */} 
      <div className="h-32 bg-white border-t p-4"> 
        <div className="h-full overflow-y-auto space-y-1"> 
          {messages.length === 0 ? ( 
            <p className="text-gray-400 text-sm">点击地面移动你的角色</p> 
          ) : ( 
            messages.map((msg, i) => ( 
              <p key={i} className="text-sm">{msg}</p> 
            )) 
          )} 
        </div> 
      </div> 
    </div> 
  ); 
} 
