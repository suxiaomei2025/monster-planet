'use client' 
 
 import { useState, useRef, useEffect } from 'react' 
 import { useChat } from '@/hooks/useChat' 
 import { Button } from '@/components/ui/button' 
 import { Input } from '@/components/ui/input' 
 import { Card } from '@/components/ui/card' 
 import { ScrollArea } from '@/components/ui/scroll-area' 
 import { Send, Loader2, Sparkles } from 'lucide-react' 
 import { getEmotionColor, formatTime, getEmotionLabel } from '@/lib/utils' 
 import { ChatMessage } from '@/types' 
 
 interface ChatInterfaceProps { 
   userId: string 
   monsterId: string 
   monsterName: string 
   monsterType: string 
   monsterAvatar?: string 
 } 
 
 export default function ChatInterface({ 
   userId, 
   monsterId, 
   monsterName, 
   monsterType, 
   monsterAvatar 
 }: ChatInterfaceProps) { 
   const [input, setInput] = useState('') 
   const scrollRef = useRef<HTMLDivElement>(null) 
   
   const { messages, isLoading, error, sendMessage, loadHistory } = useChat({ 
     userId, 
     monsterId, 
     monsterName, 
     monsterType 
   }) 
 
   // 加载历史消息 
   useEffect(() => { 
     loadHistory() 
   }, [loadHistory]) 
 
   // 自动滚动到底部 
   useEffect(() => { 
     scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) 
   }, [messages]) 
 
   const handleSend = async () => { 
     if (!input.trim()) return 
     await sendMessage(input) 
     setInput('') 
   } 
 
   const handleKeyDown = (e: React.KeyboardEvent) => { 
     if (e.key === 'Enter' && !e.shiftKey) { 
       e.preventDefault() 
       handleSend() 
     } 
   } 
 
   return ( 
     <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto overflow-hidden"> 
       {/* 头部 */} 
       <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white"> 
         <div className="flex items-center gap-3"> 
           <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl"> 
             {monsterAvatar || '🐉'} 
           </div> 
           <div> 
             <h2 className="font-bold">{monsterName}</h2> 
             <p className="text-sm opacity-80">你的{monsterType}型怪兽伙伴</p> 
           </div> 
         </div> 
       </div> 
 
       {/* 消息列表 */} 
       <ScrollArea className="flex-1 p-4"> 
         <div className="space-y-4"> 
           {messages.length === 0 && !isLoading && ( 
             <div className="text-center py-8 text-gray-500"> 
               <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-400" /> 
               <p className="text-lg font-medium">开始和{monsterName}聊天吧！</p> 
               <p className="text-sm mt-1">分享你的想法、感受，或者随便聊聊</p> 
             </div> 
           )} 
           
           {messages.map((message) => ( 
             <ChatBubble 
               key={message.id} 
               message={message} 
               monsterName={monsterName} 
               monsterAvatar={monsterAvatar} 
             /> 
           ))} 
           <div ref={scrollRef} /> 
         </div> 
       </ScrollArea> 
 
       {/* 错误提示 */} 
       {error && ( 
         <div className="px-4 py-2 bg-red-50 text-red-600 text-sm"> 
           {error} 
         </div> 
       )} 
 
       {/* 输入框 */} 
       <div className="p-4 border-t"> 
         <div className="flex gap-2"> 
           <Input 
             value={input} 
             onChange={(e) => setInput(e.target.value)} 
             onKeyDown={handleKeyDown} 
             placeholder={`和${monsterName}说点什么...`} 
             disabled={isLoading} 
             className="flex-1" 
           /> 
           <Button 
             onClick={handleSend} 
             disabled={isLoading || !input.trim()} 
             className="bg-purple-500 hover:bg-purple-600" 
           > 
             {isLoading ? ( 
               <Loader2 className="w-4 h-4 animate-spin" /> 
             ) : ( 
               <Send className="w-4 h-4" /> 
             )} 
           </Button> 
         </div> 
       </div> 
     </Card> 
   ) 
 } 
 
 // 聊天消息气泡组件 
 function ChatBubble({ 
   message, 
   monsterName, 
   monsterAvatar 
 }: { 
   message: ChatMessage 
   monsterName: string 
   monsterAvatar?: string 
 }) { 
   const isUser = message.role === 'user' 
   
   return ( 
     <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}> 
       <div className={`flex gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}> 
         {/* 头像 */} 
         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm shrink-0"> 
           {isUser ? '👤' : (monsterAvatar || '🐉')} 
         </div> 
         
         {/* 消息内容 */} 
         <div 
           className={`rounded-2xl px-4 py-2 ${ 
             isUser 
               ? 'bg-purple-500 text-white rounded-br-none' 
               : 'bg-gray-100 text-gray-800 rounded-bl-none' 
           }`} 
         > 
           {!isUser && ( 
             <p className="text-xs font-semibold text-purple-600 mb-1">{monsterName}</p> 
           )} 
           <p className="whitespace-pre-wrap">{message.content}</p> 
           
           {/* 元信息 */} 
           <div className="flex items-center gap-2 mt-1"> 
             <span className={`text-xs ${isUser ? 'text-purple-200' : 'text-gray-500'}`}> 
               {formatTime(message.created_at)} 
             </span> 
             {message.emotion && ( 
               <span 
                 className="text-xs px-2 py-0.5 rounded-full" 
                 style={{ 
                   backgroundColor: getEmotionColor(message.emotion) + '40', 
                   color: getEmotionColor(message.emotion) 
                 }} 
               > 
                 {getEmotionLabel(message.emotion)} 
               </span> 
             )} 
           </div> 
         </div> 
       </div> 
     </div> 
   ) 
 } 
