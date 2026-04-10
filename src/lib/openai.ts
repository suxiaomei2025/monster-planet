import OpenAI from 'openai' 
import { Emotion } from '@/types' 

const openai = new OpenAI({ 
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY, 
  baseURL: process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com' : undefined,
  dangerouslyAllowBrowser: true 
}) 

export interface ChatResponse { 
  content: string 
  emotion?: Emotion 
  tokensUsed: number 
} 

// 怪兽类型描述 
function getMonsterTypeDescription(type: string): string { 
  const descriptions: Record<string, string> = { 
    creative: '富有创造力、想象力丰富、喜欢艺术和创新', 
    logical: '理性分析、思维清晰、善于解决问题', 
    emotional: '情感细腻、善于倾听、富有同理心', 
    social: '社交达人、活泼开朗、喜欢交朋友', 
    explorer: '勇于探索、好奇心强、喜欢冒险' 
  } 
  return descriptions[type] || '可爱友善' 
} 

// 情绪检测 
function detectEmotion(text: string): Emotion { 
  const lowerText = text.toLowerCase() 
  if (lowerText.match(/开心|高兴|快乐|棒|喜欢/)) return 'happy' 
  if (lowerText.match(/难过|伤心|悲伤|哭|痛苦/)) return 'sad' 
  if (lowerText.match(/生气|愤怒|讨厌|烦/)) return 'angry' 
  if (lowerText.match(/担心|焦虑|紧张|害怕/)) return 'anxious' 
  if (lowerText.match(/兴奋|激动|期待|wow/)) return 'excited' 
  return 'calm' 
} 

// 生成怪兽回复 
export async function generateMonsterResponse( 
  messages: { role: 'user' | 'assistant'; content: string }[], 
  monsterName: string, 
  monsterType: string, 
  userEmotion?: Emotion 
): Promise<ChatResponse> { 
  const systemPrompt = `你是${monsterName}，一只${getMonsterTypeDescription(monsterType)}的怪兽伙伴。 

你的性格特点： 
- 温暖友善，总是支持用户 
- 会使用emoji让对话更生动 
- 回复简洁，控制在100字以内 
- 会根据用户的情绪调整回应方式 

回应指南： 
- 用户开心时：分享喜悦，一起庆祝 
- 用户难过时：给予安慰和鼓励 
- 用户焦虑时：帮助放松，提供建议 
- 用户生气时：理解感受，帮助冷静 

记住：你是用户的创意伙伴和情感支持者！` 

  const response = await openai.chat.completions.create({ 
    model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini', 
    messages: [ 
      { role: 'system', content: systemPrompt }, 
      ...messages 
    ], 
    temperature: 0.8, 
    max_tokens: 200, 
  }) 

  const content = response.choices[0]?.message?.content || '...' 
  const emotion = detectEmotion(content) 
  const tokensUsed = response.usage?.total_tokens || 0 
  
  return { content, emotion, tokensUsed } 
} 

// 生成创意提示 
export async function generateCreativePrompt(monsterType: string): Promise<string> { 
  const prompts: Record<string, string[]> = { 
    creative: ['画一幅你梦中的世界', '写一首三行诗', '设计一个新发明'], 
    logical: ['解决一个谜题', '优化你的日常流程', '分析一个有趣的问题'], 
    emotional: ['写下今天感恩的三件事', '画一幅表达心情的画', '给未来的自己写封信'], 
    social: ['联系一位老朋友', '参加一个社区活动', '分享一个有趣的故事'], 
    explorer: ['尝试一种新食物', '去一个没去过的地方', '学习一个新技能'] 
  } 
  
  const typePrompts = prompts[monsterType] || prompts.creative 
  return typePrompts[Math.floor(Math.random() * typePrompts.length)] 
} 

export default openai 
