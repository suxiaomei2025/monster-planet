'use client'; 
 
 import { useEffect, useRef, useState, useCallback } from 'react'; 
 import { io, Socket } from 'socket.io-client'; 
 
 interface Player { 
   id: string; 
   name: string; 
   x: number; 
   y: number; 
   avatar?: string; 
 } 
 
 interface UseMultiplayerOptions { 
   roomId: string; 
   playerName: string; 
   onPlayerJoin?: (player: Player) => void; 
   onPlayerLeave?: (playerId: string) => void; 
   onPlayerMove?: (playerId: string, x: number, y: number) => void; 
 } 
 
 export function useMultiplayer({ roomId, playerName, onPlayerJoin, onPlayerLeave, onPlayerMove }: UseMultiplayerOptions) { 
   const [isConnected, setIsConnected] = useState(false); 
   const [players, setPlayers] = useState<Player[]>([]); 
   const socketRef = useRef<Socket | null>(null); 
 
   useEffect(() => { 
     // 注意：实际部署需要配置Socket.io服务器 
     const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'; 
     const socket = io(socketUrl); 
     socketRef.current = socket; 
 
     socket.on('connect', () => { 
       setIsConnected(true); 
       socket.emit('join-room', { roomId, playerName }); 
     }); 
 
     socket.on('disconnect', () => { 
       setIsConnected(false); 
     }); 
 
     socket.on('player-joined', (player: Player) => { 
       setPlayers(prev => [...prev, player]); 
       onPlayerJoin?.(player); 
     }); 
 
     socket.on('player-left', (playerId: string) => { 
       setPlayers(prev => prev.filter(p => p.id !== playerId)); 
       onPlayerLeave?.(playerId); 
     }); 
 
     socket.on('player-moved', ({ playerId, x, y }: { playerId: string; x: number; y: number }) => { 
       setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, x, y } : p)); 
       onPlayerMove?.(playerId, x, y); 
     }); 
 
     socket.on('current-players', (currentPlayers: Player[]) => { 
       setPlayers(currentPlayers); 
     }); 
 
     return () => { 
       socket.disconnect(); 
     }; 
   }, [roomId, playerName, onPlayerJoin, onPlayerLeave, onPlayerMove]); 
 
   const movePlayer = useCallback((x: number, y: number) => { 
     socketRef.current?.emit('move', { roomId, x, y }); 
   }, [roomId]); 
 
   const sendMessage = useCallback((message: string) => { 
     socketRef.current?.emit('chat-message', { roomId, message }); 
   }, [roomId]); 
 
   return { 
     isConnected, 
     players, 
     movePlayer, 
     sendMessage 
   }; 
 } 
