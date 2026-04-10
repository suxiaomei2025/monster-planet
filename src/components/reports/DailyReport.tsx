'use client'; 
 
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
 import { Badge } from '@/components/ui/badge'; 
 
 interface DailyReportProps { 
   data: { 
     date: string; 
     conversationCount: number; 
     moodAvg: number; 
     emotionBreakdown: Record<string, number>; 
     creativityScore: number; 
     summary: string; 
   }; 
 } 
 
 export default function DailyReport({ data }: DailyReportProps) { 
   return ( 
     <Card className="w-full"> 
       <CardHeader className="border-b"> 
         <div className="flex justify-between items-center"> 
           <CardTitle className="text-xl">📊 成长报告 - {data.date}</CardTitle> 
           <Badge variant="outline">已生成</Badge> 
         </div> 
       </CardHeader> 
       <CardContent className="pt-6 space-y-6"> 
         <div className="grid grid-cols-2 gap-4"> 
           <div className="bg-blue-50 p-4 rounded-xl text-center"> 
             <div className="text-2xl font-bold text-blue-600">{data.conversationCount}</div> 
             <div className="text-xs text-gray-500 uppercase">对话次数</div> 
           </div> 
           <div className="bg-purple-50 p-4 rounded-xl text-center"> 
             <div className="text-2xl font-bold text-purple-600">{data.moodAvg}%</div> 
             <div className="text-xs text-gray-500 uppercase">平均心情</div> 
           </div> 
         </div> 
 
         <div className="space-y-3"> 
           <h3 className="text-sm font-semibold text-gray-700">情绪分布</h3> 
           <div className="flex gap-2"> 
             {Object.entries(data.emotionBreakdown).map(([emotion, value]) => ( 
               <div key={emotion} className="flex-1"> 
                 <div className="flex justify-between text-[10px] text-gray-400 mb-1 uppercase"> 
                   <span>{emotion}</span> 
                   <span>{value}%</span> 
                 </div> 
                 <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"> 
                   <div  
                     className="h-full bg-blue-400"  
                     style={{ width: `${value}%` }} 
                   /> 
                 </div> 
               </div> 
             ))} 
           </div> 
         </div> 
 
         <div className="bg-gray-50 p-4 rounded-xl"> 
           <h3 className="text-sm font-semibold text-gray-700 mb-2">今日总结</h3> 
           <p className="text-sm text-gray-600 italic">"{data.summary}"</p> 
         </div> 
       </CardContent> 
     </Card> 
   ); 
 } 
