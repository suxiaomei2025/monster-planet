'use client'; 
 
 import { useState } from 'react'; 
 import { Button } from '@/components/ui/button'; 
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
 import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'; 
 
 interface VoiceRecorderProps { 
   onRecordingComplete: (audioBlob: Blob, text: string) => void; 
 } 
 
 export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) { 
   const { isRecording, startRecording, stopRecording } = useVoiceRecorder(); 
 
   const handleToggleRecording = async () => { 
     if (isRecording) { 
       const blob = await stopRecording(); 
       if (blob) { 
         // 这里简单演示，调用外部传入的回调 
         onRecordingComplete(blob, '模拟转录文字'); 
       } 
     } else { 
       startRecording(); 
     } 
   }; 
 
   return ( 
     <Card className="p-6 text-center"> 
       <CardHeader> 
         <CardTitle>语音录制</CardTitle> 
       </CardHeader> 
       <CardContent className="space-y-4"> 
         <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-100'}`}> 
           {isRecording ? '🎙️' : '🎤'} 
         </div> 
         <p className="text-gray-500"> 
           {isRecording ? '正在录音...' : '点击按钮开始录音'} 
         </p> 
         <Button  
           onClick={handleToggleRecording} 
           variant={isRecording ? 'destructive' : 'default'} 
           className="w-full" 
         > 
           {isRecording ? '停止录音' : '开始录音'} 
         </Button> 
       </CardContent> 
     </Card> 
   ); 
 } 
