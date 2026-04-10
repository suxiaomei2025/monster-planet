'use client' 
 
 import { useState, useCallback } from 'react' 
 import { Card } from '@/components/ui/card' 
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs' 
 import { Slider } from '@/components/ui/slider' 
 import { Button } from '@/components/ui/button' 
 import { Badge } from '@/components/ui/badge' 
 import { Dna, Sparkles, RotateCcw } from 'lucide-react' 
 import { DEFAULT_DNA, TRAIT_GROUPS, TRAIT_NAMES, DNA32Dimensions } from '@/types' 
 import { supabase } from '@/lib/supabase' 
 
 interface DNAAnalyzerProps { 
   monsterId: string 
   initialDNA?: Partial<DNA32Dimensions> 
   readonly?: boolean 
   onAnalysisComplete?: (dna: DNA32Dimensions, personalityType: string) => void 
 } 
 
 export default function DNAAnalyzer({ 
   monsterId, 
   initialDNA, 
   readonly = false, 
   onAnalysisComplete 
 }: DNAAnalyzerProps) { 
   const [dna, setDna] = useState<DNA32Dimensions>({ ...DEFAULT_DNA, ...initialDNA }) 
   const [activeTab, setActiveTab] = useState('核心特质') 
   const [isSaving, setIsSaving] = useState(false) 
 
   // 更新特质值 
   const updateTrait = useCallback((trait: keyof DNA32Dimensions, value: number) => { 
     if (readonly) return 
     const newDna = { ...dna, [trait]: Math.max(1, Math.min(10, value)) } 
     setDna(newDna) 
   }, [dna, readonly]) 
 
   // 获取特质颜色 
   const getTraitColor = (value: number): string => { 
     if (value >= 8) return 'bg-green-500' 
     if (value >= 6) return 'bg-blue-500' 
     if (value >= 4) return 'bg-yellow-500' 
     return 'bg-red-500' 
   } 
 
   // 获取人格类型 
   const getPersonalityType = (): string => { 
     const sortedTraits = Object.entries(dna).sort((a, b) => b[1] - a[1]) 
     const topTraits = sortedTraits.slice(0, 3).map(([key]) => TRAIT_NAMES[key]) 
     return topTraits.join('') + '型' 
   } 
 
   // 获取高特质数量 
   const getHighTraitCount = (): number => { 
     return Object.values(dna).filter(v => v >= 8).length 
   } 
 
   // 计算平均分 
   const getAverageScore = (): number => { 
     const values = Object.values(dna) 
     return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 
   } 
 
   // 重置DNA 
   const handleReset = () => { 
     if (readonly) return 
     setDna({ ...DEFAULT_DNA }) 
   } 
 
   // 随机生成 
   const handleRandom = () => { 
     if (readonly) return 
     const randomDNA: DNA32Dimensions = {} 
     Object.keys(DEFAULT_DNA).forEach(key => { 
       randomDNA[key] = Math.floor(Math.random() * 10) + 1 
     }) 
     setDna(randomDNA as DNA32Dimensions) 
   } 
 
   // 保存分析结果 
   const handleSave = async () => { 
     setIsSaving(true) 
     
     try { 
       const personalityType = getPersonalityType() 
       
       // 保存到数据库 
       const { error } = await supabase 
         .from('dna_dimensions') 
         .upsert({ 
           monster_id: monsterId, 
           dimensions: dna, 
           personality_type: personalityType 
         }, { onConflict: 'monster_id' }) 
 
       if (error) throw error 
       
       onAnalysisComplete?.(dna, personalityType) 
       alert('DNA分析已保存！') 
     } catch (error) { 
       console.error('保存失败:', error) 
       alert('保存失败，请重试') 
     } finally { 
       setIsSaving(false) 
     } 
   } 
 
   return ( 
     <Card className="p-6 max-w-4xl mx-auto"> 
       {/* 头部 */} 
       <div className="flex justify-between items-start mb-6"> 
         <div className="flex items-center gap-3"> 
           <Dna className="w-8 h-8 text-purple-500" /> 
           <div> 
             <h2 className="text-2xl font-bold">🧬 创意DNA分析器</h2> 
             <p className="text-sm text-gray-500">32维度人格特质分析</p> 
           </div> 
         </div> 
         
         <div className="text-right"> 
           <Badge className="text-lg px-4 py-1 bg-purple-100 text-purple-700"> 
             <Sparkles className="w-4 h-4 mr-1 inline" /> 
             {getPersonalityType()} 
           </Badge> 
           <div className="flex gap-4 mt-2 text-sm text-gray-600"> 
             <span>平均分: <strong>{getAverageScore()}</strong></span> 
             <span>高特质: <strong className="text-green-600">{getHighTraitCount()}</strong></span> 
           </div> 
         </div> 
       </div> 
 
       {/* 特质分组标签 */} 
       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> 
         <TabsList className="grid w-full grid-cols-5"> 
           {Object.keys(TRAIT_GROUPS).map(group => ( 
             <TabsTrigger key={group} value={group} className="text-xs"> 
               {group} 
             </TabsTrigger> 
           ))} 
         </TabsList> 
 
         {/* 特质滑块 */} 
         {Object.entries(TRAIT_GROUPS).map(([group, traits]) => ( 
           <TabsContent key={group} value={group} className="mt-4"> 
             <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> 
               {traits.map((trait) => ( 
                 <div key={trait} className="flex items-center gap-4"> 
                   <span className="w-24 text-sm font-medium text-gray-700"> 
                     {TRAIT_NAMES[trait]} 
                   </span> 
                   <Slider 
                     value={[dna[trait]]} 
                     onValueChange={(value) => updateTrait(trait, value[0])} 
                     min={1} 
                     max={10} 
                     step={1} 
                     disabled={readonly} 
                     className="flex-1" 
                   /> 
                   <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${ 
                     getTraitColor(dna[trait]) 
                   }`}> 
                     {dna[trait]} 
                   </span> 
                 </div> 
               ))} 
             </div> 
           </TabsContent> 
         ))} 
       </Tabs> 
 
       {/* 可视化图表 */} 
       <div className="mt-6 pt-6 border-t"> 
         <h3 className="font-semibold text-gray-700 mb-4">特质分布概览</h3> 
         <div className="grid grid-cols-8 gap-1"> 
           {Object.entries(dna).slice(0, 16).map(([trait, value]) => ( 
             <div key={trait} className="text-center"> 
               <div 
                 className={`w-full rounded-t transition-all ${getTraitColor(value)}`} 
                 style={{ height: `${value * 8}px` }} 
               /> 
               <span className="text-[10px] text-gray-500 mt-1 block truncate" title={TRAIT_NAMES[trait]}> 
                 {TRAIT_NAMES[trait].slice(0, 2)} 
               </span> 
             </div> 
           ))} 
         </div> 
       </div> 
 
       {/* 操作按钮 */} 
       {!readonly && ( 
         <div className="flex gap-3 mt-6"> 
           <Button 
             variant="outline" 
             onClick={handleReset} 
             className="flex-1" 
           > 
             <RotateCcw className="w-4 h-4 mr-2" /> 
             重置 
           </Button> 
           <Button 
             variant="outline" 
             onClick={handleRandom} 
             className="flex-1" 
           > 
             🎲 随机 
           </Button> 
           <Button 
             onClick={handleSave} 
             disabled={isSaving} 
             className="flex-1 bg-purple-500 hover:bg-purple-600" 
           > 
             {isSaving ? '保存中...' : '💾 保存分析'} 
           </Button> 
         </div> 
       )} 
     </Card> 
   ) 
 } 
