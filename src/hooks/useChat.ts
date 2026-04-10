import { useState, useCallback } from 'react' 
import { generateMonsterResponse } from '@/lib/openai' 
import { saveChatMessage, getChatHistory } from '@/lib/supabase' 
import { ChatMessage } from '@/types' 

interface UseChatProps { 
  userId: string 
  monsterId: string 
  monsterName: string 
  monsterType: string 
} 

interface UseChatReturn { 
  messages: ChatMessage[] 
  isLoading: boolean 
  error: string | null 
  sendMessage: (content: string) => Promise<void> 
  loadHistory: () => Promise<void> 
  clearMessages: () => void 
} 

export function useChat({ 
  userId, 
  monsterId, 
  monsterName, 
  monsterType 
}: UseChatProps): UseChatReturn { 
  const [messages, setMessages] = useState<ChatMessage[]>([]) 
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState<string | null>(null) 

  // 加载历史消息 
  const loadHistory = useCallback(async () => { 
    try { 
      const history = await getChatHistory(userId, monsterId) 
      setMessages(history) 
    } catch (err) { 
      console.error('加载历史消息失败:', err) 
      setError('加载历史消息失败') 
    } 
  }, [userId, monsterId]) 

  // 发送消息 
  const sendMessage = useCallback(async (content: string) => { 
    if (!content.trim() || isLoading) return 

    setIsLoading(true) 
    setError(null) 

    try { 
      // 1. 保存用户消息 
      const userMessage = await saveChatMessage({ 
        user_id: userId, 
        monster_id: monsterId, 
        role: 'user', 
        content: content.trim() 
      }) 

      setMessages(prev => [...prev, userMessage]) 

      // 2. 准备AI对话历史 
      const chatHistory = messages.slice(-10).map(m => ({ 
        role: m.role === 'monster' ? 'assistant' as const : 'user' as const, 
        content: m.content 
      })) 

      // 3. 生成怪兽回复 
      const response = await generateMonsterResponse( 
        [...chatHistory, { role: 'user', content }], 
        monsterName, 
        monsterType 
      ) 

      // 4. 保存怪兽回复 
      const monsterMessage = await saveChatMessage({ 
        user_id: userId, 
        monster_id: monsterId, 
        role: 'monster', 
        content: response.content, 
        emotion: response.emotion 
      }) 

      setMessages(prev => [...prev, monsterMessage]) 

    } catch (err) { 
      console.error('发送消息失败:', err) 
      setError('发送消息失败，请重试') 
    } finally { 
      setIsLoading(false) 
    } 
  }, [userId, monsterId, monsterName, monsterType, messages, isLoading]) 

  // 清空消息 
  const clearMessages = useCallback(() => { 
    setMessages([]) 
  }, []) 

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    loadHistory, 
    clearMessages 
  } 
} 
