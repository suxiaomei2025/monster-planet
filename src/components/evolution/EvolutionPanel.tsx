'use client'; 
 
 import { useState } from 'react'; 
 
 interface Skill { 
   id: string; 
   name: string; 
   description: string; 
   level: number; 
   maxLevel: number; 
   icon: string; 
 } 
 
 interface EvolutionPanelProps { 
   monsterId: string; 
   currentStage: number; 
   skillPoints: number; 
   skills: Skill[]; 
   experience: number; 
   onEvolve?: () => void; 
   onUpgradeSkill?: (skillId: string) => void; 
 } 
 
 const evolutionStages = [ 
   { stage: 1, name: '幼年期', icon: '🥚', requiredExp: 0 }, 
   { stage: 2, name: '成长期', icon: '🐣', requiredExp: 100 }, 
   { stage: 3, name: '成熟期', icon: '🦖', requiredExp: 500 }, 
   { stage: 4, name: '完全体', icon: '🐉', requiredExp: 1000 }, 
   { stage: 5, name: '究极体', icon: '👑', requiredExp: 2000 } 
 ]; 
 
 const availableSkills: Skill[] = [ 
   { id: 'fire_breath', name: '火焰吐息', description: '发射小火球', level: 1, maxLevel: 5, icon: '🔥' }, 
   { id: 'healing', name: '治愈之光', description: '恢复心情', level: 1, maxLevel: 5, icon: '💚' }, 
   { id: 'shield', name: '防护盾', description: '抵挡负面情绪', level: 1, maxLevel: 5, icon: '🛡️' }, 
   { id: 'fly', name: '飞行', description: '探索更远的地方', level: 1, maxLevel: 3, icon: '🦅' }, 
   { id: 'telepathy', name: '心灵感应', description: '更好的理解你', level: 1, maxLevel: 5, icon: '💭' }, 
   { id: 'creativity', name: '创意爆发', description: '生成更多创意', level: 1, maxLevel: 5, icon: '✨' } 
 ]; 
 
 export default function EvolutionPanel({ 
   currentStage = 1, 
   skillPoints = 0, 
   skills = [], 
   experience = 0, 
   onEvolve, 
   onUpgradeSkill 
 }: EvolutionPanelProps) { 
   const [activeTab, setActiveTab] = useState<'evolution' | 'skills'>('evolution'); 
   
   const currentStageInfo = evolutionStages.find(s => s.stage === currentStage) || evolutionStages[0]; 
   const nextStage = evolutionStages.find(s => s.stage === currentStage + 1); 
   const canEvolve = nextStage && experience >= nextStage.requiredExp; 
   const progress = nextStage ? (experience / nextStage.requiredExp) * 100 : 100; 
 
   return ( 
     <div className="bg-white rounded-xl shadow-lg p-6"> 
       <div className="flex justify-between items-center mb-6"> 
         <h2 className="text-2xl font-bold text-gray-800">⚡ 进化与技能</h2> 
         <div className="flex gap-2"> 
           <button 
             onClick={() => setActiveTab('evolution')} 
             className={`px-4 py-2 rounded-lg font-medium ${ 
               activeTab === 'evolution' ? 'bg-purple-500 text-white' : 'bg-gray-100' 
             }`} 
           > 
             进化 
           </button> 
           <button 
             onClick={() => setActiveTab('skills')} 
             className={`px-4 py-2 rounded-lg font-medium ${ 
               activeTab === 'skills' ? 'bg-purple-500 text-white' : 'bg-gray-100' 
             }`} 
           > 
             技能 
           </button> 
         </div> 
       </div> 
 
       {activeTab === 'evolution' ? ( 
         <div className="space-y-6"> 
           {/* 当前阶段 */} 
           <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"> 
             <div className="text-6xl mb-2">{currentStageInfo.icon}</div> 
             <h3 className="text-xl font-bold text-purple-700">{currentStageInfo.name}</h3> 
             <p className="text-gray-600">当前阶段</p> 
           </div> 
 
           {/* 进度条 */} 
           {nextStage && ( 
             <div> 
               <div className="flex justify-between text-sm text-gray-600 mb-2"> 
                 <span>经验值: {experience} / {nextStage.requiredExp}</span> 
                 <span>{Math.round(progress)}%</span> 
               </div> 
               <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden"> 
                 <div 
                   className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" 
                   style={{ width: `${progress}%` }} 
                 /> 
               </div> 
             </div> 
           )} 
 
           {/* 下一阶段 */} 
           {nextStage ? ( 
             <div className="flex items-center justify-between p-4 border-2 border-dashed border-purple-300 rounded-lg"> 
               <div className="flex items-center gap-4"> 
                 <span className="text-4xl">{nextStage.icon}</span> 
                 <div> 
                   <h4 className="font-bold text-gray-800">下一阶段: {nextStage.name}</h4> 
                   <p className="text-sm text-gray-500">需要 {nextStage.requiredExp} 经验值</p> 
                 </div> 
               </div> 
               <button 
                 onClick={onEvolve} 
                 disabled={!canEvolve} 
                 className={`px-6 py-3 rounded-lg font-bold ${ 
                   canEvolve 
                     ? 'bg-purple-500 text-white hover:bg-purple-600' 
                     : 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                 }`} 
               > 
                 {canEvolve ? '✨ 进化!' : '经验不足'} 
               </button> 
             </div> 
           ) : ( 
             <div className="text-center p-4 bg-yellow-50 rounded-lg"> 
               <p className="text-yellow-700">🎉 已达到最高阶段！</p> 
             </div> 
           )} 
         </div> 
       ) : ( 
         <div className="space-y-4"> 
           {/* 技能点 */} 
           <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg"> 
             <span className="font-medium text-blue-800">可用技能点</span> 
             <span className="text-2xl font-bold text-blue-600">{skillPoints}</span> 
           </div> 
 
           {/* 技能列表 */} 
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
             {availableSkills.map(skill => { 
               const ownedSkill = skills.find(s => s.id === skill.id); 
               const currentLevel = ownedSkill?.level || 0; 
               const canUpgrade = skillPoints > 0 && currentLevel < skill.maxLevel; 
               
               return ( 
                 <div 
                   key={skill.id} 
                   className={`p-4 rounded-lg border-2 transition-all ${ 
                     currentLevel > 0 ? 'border-green-300 bg-green-50' : 'border-gray-200' 
                   }`} 
                 > 
                   <div className="flex items-start gap-3"> 
                     <span className="text-3xl">{skill.icon}</span> 
                     <div className="flex-1"> 
                       <h4 className="font-bold text-gray-800">{skill.name}</h4> 
                       <p className="text-sm text-gray-500">{skill.description}</p> 
                       <div className="flex items-center gap-2 mt-2"> 
                         <span className="text-sm font-medium">等级:</span> 
                         <div className="flex gap-1"> 
                           {Array.from({ length: skill.maxLevel }).map((_, i) => ( 
                             <div 
                               key={i} 
                               className={`w-4 h-4 rounded-full ${ 
                                 i < currentLevel ? 'bg-yellow-400' : 'bg-gray-200' 
                               }`} 
                             /> 
                           ))} 
                         </div> 
                         <span className="text-sm text-gray-500">{currentLevel}/{skill.maxLevel}</span> 
                       </div> 
                     </div> 
                     <button 
                       onClick={() => onUpgradeSkill?.(skill.id)} 
                       disabled={!canUpgrade} 
                       className={`px-3 py-1 rounded text-sm font-medium ${ 
                         canUpgrade 
                           ? 'bg-blue-500 text-white hover:bg-blue-600' 
                           : 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                       }`} 
                     > 
                       {currentLevel === 0 ? '学习' : '升级'} 
                     </button> 
                   </div> 
                 </div> 
               ); 
             })} 
           </div> 
         </div> 
       )} 
     </div> 
   ); 
 } 
