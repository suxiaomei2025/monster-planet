import { createClient } from '@supabase/supabase-js' 
import { Database } from '@/types/database' 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 

if (!supabaseUrl || !supabaseKey) { 
  throw new Error('Missing Supabase environment variables') 
} 

export const supabase = createClient<Database>(supabaseUrl, supabaseKey) 

// ============================================ 
// 认证相关函数 
// ============================================ 

export async function signUp(email: string, password: string, username: string) { 
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password, 
    options: { 
      data: { username } 
    } 
  }) 
  
  if (error) throw error 
  
  // 创建用户档案 
  if (data.user) { 
    await supabase.from('profiles').insert({ 
      id: data.user.id, 
      username, 
    }) 
  } 
  
  return data 
} 

export async function signIn(email: string, password: string) { 
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password, 
  }) 
  if (error) throw error 
  return data 
} 

export async function signOut() { 
  const { error } = await supabase.auth.signOut() 
  if (error) throw error 
} 

export async function getCurrentUser() { 
  const { data: { user } } = await supabase.auth.getUser() 
  return user 
} 

export async function getCurrentSession() { 
  const { data: { session } } = await supabase.auth.getSession() 
  return session 
} 

// ============================================ 
// 数据库操作函数 
// ============================================ 

export async function getMonsters(userId: string) { 
  const { data, error } = await supabase 
    .from('monsters') 
    .select('*') 
    .eq('user_id', userId) 
    .order('created_at', { ascending: false }) 
  
  if (error) throw error 
  return data 
} 

export async function createMonster(monster: { 
  user_id: string 
  name: string 
  type: string 
}) { 
  const { data, error } = await supabase 
    .from('monsters') 
    .insert(monster) 
    .select() 
    .single() 
  
  if (error) throw error 
  return data 
} 

export async function saveEmotionRecord(record: { 
  user_id: string 
  monster_id?: string 
  emotion: string 
  intensity: number 
  context?: string 
  source?: string 
}) { 
  const { data, error } = await supabase 
    .from('emotion_records') 
    .insert(record) 
    .select() 
    .single() 
  
  if (error) throw error 
  return data 
} 

export async function saveChatMessage(message: { 
  user_id: string 
  monster_id: string 
  role: 'user' | 'monster' 
  content: string 
  emotion?: string 
}) { 
  const { data, error } = await supabase 
    .from('chat_messages') 
    .insert(message) 
    .select() 
    .single() 
  
  if (error) throw error 
  return data 
} 

export async function getChatHistory(userId: string, monsterId: string, limit = 50) { 
  const { data, error } = await supabase 
    .from('chat_messages') 
    .select('*') 
    .eq('user_id', userId) 
    .eq('monster_id', monsterId) 
    .order('created_at', { ascending: false }) 
    .limit(limit) 
  
  if (error) throw error 
  return data?.reverse() || [] 
} 
