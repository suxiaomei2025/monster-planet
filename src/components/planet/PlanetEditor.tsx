'use client' 
 
 import { useState } from 'react' 
 import PlanetScene from './PlanetScene' 
 import { Button } from '@/components/ui/button' 
 import { Card } from '@/components/ui/card' 
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs' 
 import { Slider } from '@/components/ui/slider' 
 import { Palette, Cloud, Mountain, Sparkles } from 'lucide-react' 
 import { supabase } from '@/lib/supabase' 
 
 // 配置选项 
 const terrainTypes = [ 
   { id: 'earth', name: '大地', color: '#8B4513', icon: '🌍', description: '坚实的土地，适合建造' }, 
   { id: 'water', name: '海洋', color: '#1E90FF', icon: '🌊', description: '广阔的水域，充满生机' }, 
   { id: 'fire', name: '火焰', color: '#FF4500', icon: '🔥', description: '炽热的能量，充满激情' }, 
   { id: 'ice', name: '冰雪', color: '#E0FFFF', icon: '❄️', description: '纯净的冰晶，宁静致远' }, 
   { id: 'cloud', name: '云端', color: '#F0F8FF', icon: '☁️', description: '飘渺的云雾，自由自在' }, 
   { id: 'crystal', name: '水晶', color: '#DA70D6', icon: '💎', description: '闪耀的水晶，神秘莫测' } 
 ] 
 
 const weatherTypes = [ 
   { id: 'sunny', name: '晴朗', icon: '☀️', description: '阳光明媚，心情愉悦' }, 
   { id: 'rainy', name: '雨天', icon: '🌧️', description: '细雨绵绵，宁静安详' }, 
   { id: 'stormy', name: '雷暴', icon: '⛈️', description: '电闪雷鸣，激情澎湃' }, 
   { id: 'snowy', name: '下雪', icon: '🌨️', description: '雪花飘飘，纯净美好' }, 
   { id: 'cloudy', name: '多云', icon: '☁️', description: '云层密布，神秘莫测' } 
 ] 
 
 const themeColors = [ 
   { id: 'purple', value: '#8B5CF6', name: '紫色' }, 
   { id: 'pink', value: '#EC4899', name: '粉色' }, 
   { id: 'blue', value: '#3B82F6', name: '蓝色' }, 
   { id: 'green', value: '#10B981', name: '绿色' }, 
   { id: 'yellow', value: '#F59E0B', name: '黄色' }, 
   { id: 'red', value: '#EF4444', name: '红色' } 
 ] 
 
 interface PlanetEditorProps { 
   monsterId: string 
   initialConfig?: { 
     terrainType: string 
     weather: string 
     themeColor: string 
     atmosphereDensity: number 
     gravityLevel: number 
   } 
   onSave?: (config: any) => void 
 } 
 
 export default function PlanetEditor({ monsterId, initialConfig, onSave }: PlanetEditorProps) { 
   const [terrainType, setTerrainType] = useState(initialConfig?.terrainType || 'earth') 
   const [weather, setWeather] = useState(initialConfig?.weather || 'sunny') 
   const [themeColor, setThemeColor] = useState(initialConfig?.themeColor || '#8B5CF6') 
   const [atmosphereDensity, setAtmosphereDensity] = useState(initialConfig?.atmosphereDensity || 50) 
   const [gravityLevel, setGravityLevel] = useState(initialConfig?.gravityLevel || 50) 
   const [isSaving, setIsSaving] = useState(false) 
 
   const handleSave = async () => { 
     setIsSaving(true) 
     
     const config = { 
       monster_id: monsterId, 
       terrain_type: terrainType, 
       weather, 
       theme_color: themeColor, 
       atmosphere_density: atmosphereDensity, 
       gravity_level: gravityLevel, 
       decorations: [] 
     } 
 
     try { 
       // 保存到数据库 
       const { error } = await supabase 
         .from('planet_configs') 
         .upsert(config, { onConflict: 'monster_id' }) 
 
       if (error) throw error 
       
       onSave?.(config) 
       alert('星球配置已保存！') 
     } catch (error) { 
       console.error('保存失败:', error) 
       alert('保存失败，请重试') 
     } finally { 
       setIsSaving(false) 
     } 
   } 
 
   return ( 
     <Card className="p-6 max-w-5xl mx-auto"> 
       <div className="flex items-center gap-3 mb-6"> 
         <Sparkles className="w-6 h-6 text-purple-500" /> 
         <h2 className="text-2xl font-bold">🪐 星球编辑器</h2> 
       </div> 
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
         {/* 3D预览 */} 
         <div className="rounded-xl overflow-hidden bg-gray-900 h-[400px]"> 
           <PlanetScene 
             terrainType={terrainType} 
             themeColor={themeColor} 
             weather={weather} 
           /> 
         </div> 
 
         {/* 编辑面板 */} 
         <div> 
           <Tabs defaultValue="terrain" className="w-full"> 
             <TabsList className="grid w-full grid-cols-3"> 
               <TabsTrigger value="terrain"> 
                 <Mountain className="w-4 h-4 mr-2" /> 
                 地形 
               </TabsTrigger> 
               <TabsTrigger value="weather"> 
                 <Cloud className="w-4 h-4 mr-2" /> 
                 天气 
               </TabsTrigger> 
               <TabsTrigger value="advanced"> 
                 <Palette className="w-4 h-4 mr-2" /> 
                 高级 
               </TabsTrigger> 
             </TabsList> 
 
             {/* 地形选择 */} 
             <TabsContent value="terrain" className="space-y-4 mt-4"> 
               <p className="text-sm text-gray-600">选择你的星球地形类型：</p> 
               <div className="grid grid-cols-2 gap-3"> 
                 {terrainTypes.map((terrain) => ( 
                   <button 
                     key={terrain.id} 
                     onClick={() => setTerrainType(terrain.id)} 
                     className={`p-4 rounded-xl border-2 text-left transition-all ${ 
                       terrainType === terrain.id 
                         ? 'border-purple-500 bg-purple-50' 
                         : 'border-gray-200 hover:border-purple-300' 
                     }`} 
                   > 
                     <span className="text-2xl">{terrain.icon}</span> 
                     <h4 className="font-bold mt-2">{terrain.name}</h4> 
                     <p className="text-xs text-gray-500 mt-1">{terrain.description}</p> 
                   </button> 
                 ))} 
               </div> 
             </TabsContent> 
 
             {/* 天气选择 */} 
             <TabsContent value="weather" className="space-y-4 mt-4"> 
               <p className="text-sm text-gray-600">选择你的星球天气：</p> 
               <div className="grid grid-cols-2 gap-3"> 
                 {weatherTypes.map((w) => ( 
                   <button 
                     key={w.id} 
                     onClick={() => setWeather(w.id)} 
                     className={`p-4 rounded-xl border-2 text-left transition-all ${ 
                       weather === w.id 
                         ? 'border-purple-500 bg-purple-50' 
                         : 'border-gray-200 hover:border-purple-300' 
                     }`} 
                   > 
                     <span className="text-2xl">{w.icon}</span> 
                     <h4 className="font-bold mt-2">{w.name}</h4> 
                     <p className="text-xs text-gray-500 mt-1">{w.description}</p> 
                   </button> 
                 ))} 
               </div> 
             </TabsContent> 
 
             {/* 高级设置 */} 
             <TabsContent value="advanced" className="space-y-6 mt-4"> 
               {/* 主题颜色 */} 
               <div> 
                 <label className="text-sm font-medium mb-3 block">主题颜色</label> 
                 <div className="flex flex-wrap gap-3"> 
                   {themeColors.map((color) => ( 
                     <button 
                       key={color.id} 
                       onClick={() => setThemeColor(color.value)} 
                       className={`w-12 h-12 rounded-full border-4 transition-all ${ 
                         themeColor === color.value 
                           ? 'border-gray-800 scale-110' 
                           : 'border-transparent hover:scale-105' 
                       }`} 
                       style={{ backgroundColor: color.value }} 
                       title={color.name} 
                     /> 
                   ))} 
                 </div> 
               </div> 
 
               {/* 大气密度 */} 
               <div> 
                 <label className="text-sm font-medium mb-3 block"> 
                   大气密度: {atmosphereDensity}% 
                 </label> 
                 <Slider 
                   value={[atmosphereDensity]} 
                   onValueChange={(value) => setAtmosphereDensity(value[0])} 
                   min={0} 
                   max={100} 
                   step={10} 
                 /> 
               </div> 
 
               {/* 重力等级 */} 
               <div> 
                 <label className="text-sm font-medium mb-3 block"> 
                   重力等级: {gravityLevel}% 
                 </label> 
                 <Slider 
                   value={[gravityLevel]} 
                   onValueChange={(value) => setGravityLevel(value[0])} 
                   min={0} 
                   max={100} 
                   step={10} 
                 /> 
               </div> 
             </TabsContent> 
           </Tabs> 
 
           {/* 保存按钮 */} 
           <Button 
             onClick={handleSave} 
             className="w-full mt-6 bg-purple-500 hover:bg-purple-600" 
             disabled={isSaving} 
           > 
             {isSaving ? '保存中...' : '💾 保存星球配置'} 
           </Button> 
         </div> 
       </div> 
     </Card> 
   ) 
 } 
