// ============================================ 
// 怪兽行星业务类型定义 
// ============================================ 

// 怪兽类型 
export type MonsterType = 'creative' | 'logical' | 'emotional' | 'social' | 'explorer' 

export interface Monster { 
  id: string 
  user_id: string 
  name: string 
  type: MonsterType 
  stage: number 
  experience: number 
  skill_points: number 
  created_at: string 
  updated_at: string 
} 

// 情绪类型 
export type Emotion = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited' 

export interface EmotionRecord { 
  id: string 
  user_id: string 
  monster_id: string | null 
  emotion: Emotion 
  intensity: number 
  context?: string 
  source: 'manual' | 'voice' | 'chat' 
  created_at: string 
} 

// 对话类型 
export interface ChatMessage { 
  id: string 
  user_id: string 
  monster_id: string 
  role: 'user' | 'monster' 
  content: string 
  emotion?: Emotion 
  tokens_used: number 
  created_at: string 
} 

// 星球配置 
export interface PlanetConfig { 
  id: string 
  monster_id: string 
  terrain_type: 'earth' | 'water' | 'fire' | 'ice' | 'cloud' | 'crystal' 
  weather: 'sunny' | 'rainy' | 'stormy' | 'snowy' | 'cloudy' 
  theme_color: string 
  decorations: Decoration[] 
  atmosphere_density: number 
  gravity_level: number 
  created_at: string 
  updated_at: string 
} 

export interface Decoration { 
  id: string 
  type: string 
  position: { x: number; y: number; z: number } 
  rotation: { x: number; y: number; z: number } 
  scale: number 
} 

// DNA 32维度 
export interface DNA32Dimensions { 
  [key: string]: number 
} 

export const DEFAULT_DNA: DNA32Dimensions = { 
  // 核心特质 (5) 
  curiosity: 5, empathy: 5, creativity: 5, patience: 5, bravery: 5, 
  // 社交特质 (10) 
  sociability: 5, cooperation: 5, leadership: 5, loyalty: 5, humor: 5, 
  kindness: 5, honesty: 5, adaptability: 5, optimism: 5, humility: 5, 
  // 认知特质 (10) 
  analytical: 5, intuition: 5, memory: 5, learning: 5, focus: 5, 
  observation: 5, logic: 5, emotion_control: 5, stress_resist: 5, self_awareness: 5, 
  // 行动特质 (5) 
  activity: 5, independence: 5, discipline: 5, risk_taking: 5, goal_orientation: 5, 
  // 扩展维度 (2) 
  exploration: 5, imagination: 5 
} 

// DNA特质分组 
export const TRAIT_GROUPS = { 
  '核心特质': ['curiosity', 'empathy', 'creativity', 'patience', 'bravery'], 
  '社交特质': ['sociability', 'cooperation', 'leadership', 'loyalty', 'humor', 'kindness', 'honesty', 'adaptability', 'optimism', 'humility'], 
  '认知特质': ['analytical', 'intuition', 'memory', 'learning', 'focus', 'observation', 'logic', 'emotion_control', 'stress_resist', 'self_awareness'], 
  '行动特质': ['activity', 'independence', 'discipline', 'risk_taking', 'goal_orientation'], 
  '扩展维度': ['exploration', 'imagination'] 
} 

// 特质中文名映射 
export const TRAIT_NAMES: Record<string, string> = { 
  curiosity: '好奇心', empathy: '同理心', creativity: '创造力', patience: '耐心', bravery: '勇气', 
  sociability: '社交性', cooperation: '合作精神', leadership: '领导力', loyalty: '忠诚度', humor: '幽默感', 
  kindness: '善良', honesty: '诚实', adaptability: '适应力', optimism: '乐观度', humility: '谦逊度', 
  analytical: '分析能力', intuition: '直觉', memory: '记忆力', learning: '学习能力', focus: '专注力', 
  observation: '观察力', logic: '逻辑思维', emotion_control: '情绪控制', stress_resist: '抗压力', self_awareness: '自我认知', 
  activity: '活跃度', independence: '独立性', discipline: '自律性', risk_taking: '冒险精神', goal_orientation: '目标导向', 
  exploration: '探索精神', imagination: '想象力' 
} 

// 技能类型 
export interface Skill { 
  id: string 
  name: string 
  description: string 
  level: number 
  maxLevel: number 
  icon: string 
  category: 'combat' | 'support' | 'exploration' | 'creative' 
} 

// 代币交易 
export interface StarTransaction { 
  id: string 
  user_id: string 
  monster_id: string 
  amount: number 
  type: 'earned' | 'spent' 
  reason: string 
  metadata?: Record<string, any> 
  created_at: string 
} 

// 用户档案 
export interface Profile { 
  id: string 
  username: string | null 
  full_name: string | null 
  avatar_url: string | null 
  bio: string 
  created_at: string 
  updated_at: string 
} 

// 情绪分析结果 
export interface EmotionAnalysis { 
  emotion: Emotion 
  confidence: number 
  keywords: string[] 
} 

// AI对话配置 
export interface ChatConfig { 
  model: string 
  temperature: number 
  maxTokens: number 
  systemPrompt: string 
} 
