'use client';

import { useState } from 'react';
import MultiplayerPlanet from '@/components/3d/MultiplayerPlanet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MultiplayerPage() {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && playerName) {
      setIsJoined(true);
    }
  };

  if (isJoined) {
    return (
      <main className="flex flex-col h-screen bg-gray-100">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              多人怪兽星球
            </h1>
          </div>
          <Button variant="outline" onClick={() => setIsJoined(false)}>
            退出房间
          </Button>
        </header>

        <div className="flex-1 p-4">
          <div className="h-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <MultiplayerPlanet 
              roomId={roomId} 
              playerName={playerName} 
              buildings={[
                { id: '1', position: [2, 0.25, 2], color: '#ffcc00' },
                { id: '2', position: [-3, 0.25, -1], color: '#ff5500' },
                { id: '3', position: [0, 0.25, -4], color: '#00ccff' }
              ]}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="text-center pb-2">
          <div className="text-5xl mb-4">🚀</div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            进入多人星球
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            与其他玩家实时探索 3D 互动空间
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">房间 ID</label>
              <Input
                placeholder="例如: galaxy-01"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">你的名字</label>
              <Input
                placeholder="输入你的昵称"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <Button type="submit" className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
              开始探索
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-gray-400">
              提示：目前连接的是本地测试服务器 (localhost:3001)
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
