import { type ClassValue, clsx } from "clsx" 
import { twMerge } from "tailwind-merge" 
import { Emotion, MonsterType, TRAIT_NAMES } from "@/types" 

// Tailwind类名合并 
export function cn(...inputs: ClassValue[]) { 
  return twMerge(clsx(inputs)) 
} 

// ============================================ 
// 情绪相关工具函数 
// ============================================ 

// 情绪映射到怪兽类型 
export function mapEmotionToMonsterType(emotion: Emotion): MonsterType { 
  const mapping: Record<Emotion, MonsterType> = { 
    'happy': 'creative', 
    'excited': 'creative', 
    'calm': 'logical', 
    'sad': 'emotional', 
    'anxious': 'emotional', 
    'angry': 'explorer' 
  } 
  return mapping[emotion] || 'creative' 
} 

// 情绪到颜色映射 
export function getEmotionColor(emotion: string): string { 
  const colors: Record<string, string> = { 
    'happy': '#FFD700', 
    'excited': '#FF6B6B', 
    'calm': '#4ECDC4', 
    'sad': '#95A5A6', 
    'anxious': '#9B59B6', 
    'angry': '#E74C3C' 
  } 
  return colors[emotion] || '#8B5CF6' 
} 

// 情绪中文名 
export function getEmotionLabel(emotion: string): string { 
  const labels: Record<string, string> = { 
    'happy': '开心', 
    'excited': '兴奋', 
    'calm': '平静', 
    'sad': '难过', 
    'anxious': '焦虑', 
    'angry': '生气' 
  } 
  return labels[emotion] || emotion 
} 

// ============================================ 
// 格式化工具函数 
// ============================================ 

// 格式化时间 
export function formatTime(date: string | Date): string { 
  const d = new Date(date) 
  return d.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) 
} 

// 格式化日期 
export function formatDate(date: string | Date): string { 
  const d = new Date(date) 
  return d.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) 
} 

// 格式化相对时间 
export function formatRelativeTime(date: string | Date): string { 
  const d = new Date(date) 
  const now = new Date() 
  const diff = now.getTime() - d.getTime() 
  
  const minutes = Math.floor(diff / 60000) 
  const hours = Math.floor(diff / 3600000) 
  const days = Math.floor(diff / 86400000) 
  
  if (minutes < 1) return '刚刚' 
  if (minutes < 60) return `${minutes}分钟前` 
  if (hours < 24) return `${hours}小时前` 
  if (days < 7) return `${days}天前` 
  return formatDate(date) 
} 

// ============================================ 
// 生成工具函数 
// ============================================ 

// 生成唯一ID 
export function generateId(): string { 
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) 
} 

// 生成随机颜色 
export function generateRandomColor(): string { 
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'] 
  return colors[Math.floor(Math.random() * colors.length)] 
} 

// ============================================ 
// DNA相关工具函数 
// ============================================ 

// 获取特质中文名 
export function getTraitName(traitKey: string): string { 
  return TRAIT_NAMES[traitKey] || traitKey 
} 

// 计算DNA平均值 
export function calculateDNAAverage(dna: Record<string, number>): number { 
  const values = Object.values(dna) 
  return values.reduce((a, b) => a + b, 0) / values.length 
} 

// 获取高特质列表 
export function getHighTraits(dna: Record<string, number>, threshold = 7): string[] { 
  return Object.entries(dna) 
    .filter(([_, value]) => value >= threshold) 
    .map(([key, _]) => key) 
} 

// ============================================ 
// 验证工具函数 
// ============================================ 

// 验证邮箱格式 
export function isValidEmail(email: string): boolean { 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  return emailRegex.test(email) 
} 

// 验证密码强度 
export function isValidPassword(password: string): { 
  valid: boolean 
  message: string 
} { 
  if (password.length < 6) { 
    return { valid: false, message: '密码至少需要6个字符' } 
  } 
  return { valid: true, message: '密码有效' } 
} 
