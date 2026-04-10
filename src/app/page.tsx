'use client'; 
  
 import { useState, useEffect } from 'react'; 
 import { createClient } from '@supabase/supabase-js'; 
 import Monster3D from '@/components/3d/Monster'; 
 import VoiceRecorder from '@/components/voice/VoiceRecorder'; 
 import DNAAnalyzer from '@/components/dna/DNAAnalyzer'; 
 import EvolutionPanel from '@/components/evolution/EvolutionPanel'; 
 import StarToken from '@/components/evolution/StarToken'; 
 import PlanetEditor from '@/components/planet/PlanetEditor'; 
 import DailyReport from '@/components/reports/DailyReport'; 
  
 const supabase = createClient( 
   process.env.NEXT_PUBLIC_SUPABASE_URL!, 
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
 ); 
  
 export default function Home() { 
   const [user, setUser] = useState<any>(null); 
   const [child, setChild] = useState<any>(null); 
   const [monster, setMonster] = useState<any>(null); 
   const [activeTab, setActiveTab] = useState('monster'); 
  
   useEffect(() => { 
     supabase.auth.getUser().then(({ data }) => { 
       setUser(data.user); 
       if (data.user) loadUserData(data.user.id); 
     }); 
   }, []); 
  
   const loadUserData = async (userId: string) => { 
     const { data: profiles } = await supabase.from('profiles').select('*').eq('id', userId); 
     if (profiles && profiles[0]) { 
       setChild(profiles[0]); 
       const { data: monsters } = await supabase.from('monsters').select('*').eq('user_id', profiles[0].id); 
       if (monsters && monsters[0]) setMonster(monsters[0]); 
     } 
   }; 
  
   const handleVoiceRecorded = async (audioBlob: Blob, text: string) => { 
     console.log('语音记录:', text); 
     // 这里可以发送到Chat API 
   }; 
  
   if (!user) { 
     return ( 
       <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center"> 
         <div className="text-center"> 
           <h1 className="text-4xl font-bold text-purple-600 mb-4">🦖 怪兽行星</h1> 
           <p className="text-xl mb-8">登录开始你的怪兽之旅</p> 
           <button  
             onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })} 
             className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600" 
           > 
             使用 GitHub 登录 
           </button> 
         </div> 
       </main> 
     ); 
   } 
  
   return ( 
     <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50"> 
       <div className="container mx-auto px-4 py-8"> 
         <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">🦖 怪兽行星</h1> 
          
         {/* 导航 */} 
         <div className="flex flex-wrap justify-center gap-2 mb-8"> 
           {[ 
             { id: 'monster', label: '🦖 我的怪兽' }, 
             { id: 'voice', label: '🎤 语音对话' }, 
             { id: 'dna', label: '🧬 DNA分析' }, 
             { id: 'planet', label: '🌍 星球建造' }, 
             { id: 'evolution', label: '⚡ 进化' }, 
             { id: 'star', label: '⭐ STAR代币' }, 
             { id: 'report', label: '📊 成长报告' } 
           ].map(tab => ( 
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id)} 
               className={`px-4 py-2 rounded-lg font-medium ${ 
                 activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-white text-gray-700' 
               }`} 
             > 
               {tab.label} 
             </button> 
           ))} 
         </div> 
  
         {/* 内容区域 */} 
         <div className="max-w-4xl mx-auto"> 
           {activeTab === 'monster' && monster && ( 
             <div className="bg-white rounded-xl shadow-lg p-6"> 
               <div className="h-96"> 
                 <Monster3D  
                   species={monster.species}  
                   color={monster.appearance?.color}  
                   mood={monster.mood} 
                   name={monster.name} 
                 /> 
               </div> 
               <div className="mt-4 text-center"> 
                 <h2 className="text-2xl font-bold">{monster.name}</h2> 
                 <p className="text-gray-500">心情: {monster.mood}/100 | 等级: {monster.level}</p> 
               </div> 
             </div> 
           )} 
  
           {activeTab === 'voice' && ( 
             <VoiceRecorder onRecordingComplete={handleVoiceRecorded} /> 
           )} 
  
           {activeTab === 'dna' && ( 
             <DNAAnalyzer initialDNA={child?.dna} /> 
           )} 
  
           {activeTab === 'planet' && ( 
             <div className="h-96"> 
               <PlanetEditor /> 
             </div> 
           )} 
  
           {activeTab === 'evolution' && monster && ( 
             <EvolutionPanel  
               monsterId={monster.id} 
               currentStage={monster.evolution_stage} 
               skillPoints={monster.skill_points} 
               skills={monster.skills} 
               experience={child?.experience || 0} 
             /> 
           )} 
  
           {activeTab === 'star' && ( 
             <StarToken balance={child?.star_tokens || 0} /> 
           )} 
  
           {activeTab === 'report' && ( 
             <DailyReport data={{ 
               date: new Date().toISOString().split('T')[0], 
               conversationCount: 15, 
               moodAvg: 78, 
               emotionBreakdown: { joy: 60, neutral: 30, sadness: 10 }, 
               creativityScore: 85, 
               summary: '今天和怪兽进行了很多有趣的对话，创造力表现突出！' 
             }} /> 
           )} 
         </div> 
       </div> 
     </main> 
   ); 
 } 
