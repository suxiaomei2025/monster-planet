import { useState, useCallback } from 'react' 
 import { Emotion, EmotionAnalysis } from '@/types' 
 
 interface UseEmotionAnalysisReturn { 
   isAnalyzing: boolean 
   analysis: EmotionAnalysis | null 
   transcript: string 
   error: string | null 
   analyzeText: (text: string) => Promise<EmotionAnalysis> 
   analyzeAudio: (audioBlob: Blob) => Promise<void> 
   resetAnalysis: () => void 
 } 
 
 // 情绪关键词词典 
 const EMOTION_KEYWORDS: Record<Emotion, string[]> = { 
   happy: ['开心', '高兴', '快乐', '棒', '好', '喜欢', '爱', '优秀', '完美', '幸福', '满足', '愉快', '欢乐', '棒极了', '太好了'], 
   sad: ['难过', '伤心', '悲伤', '哭', '痛苦', '失望', '遗憾', '不开心', '沮丧', '失落', '郁闷', '愁', '哀伤'], 
   angry: ['生气', '愤怒', '讨厌', '恨', '烦', '火大', '恼火', '气愤', '暴怒', '不满', '反感', '厌恶'], 
   anxious: ['焦虑', '担心', '紧张', '害怕', '恐惧', '不安', '着急', '慌', '忐忑', '忧虑', '焦急', '心慌'], 
   calm: ['平静', '放松', '舒服', '安心', '淡定', '宁静', '安详', '平和', '沉稳', '从容', '闲适'], 
   excited: ['兴奋', '激动', '期待', '迫不及待', 'wow', '太棒了', ' amazing', '激动人心', '亢奋', '热血'] 
 } 
 
 export function useEmotionAnalysis(): UseEmotionAnalysisReturn { 
   const [isAnalyzing, setIsAnalyzing] = useState(false) 
   const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null) 
   const [transcript, setTranscript] = useState('') 
   const [error, setError] = useState<string | null>(null) 
 
   // 分析文本情绪（基于关键词） 
   const analyzeText = useCallback(async (text: string): Promise<EmotionAnalysis> => { 
     setIsAnalyzing(true) 
     setError(null) 
     
     try { 
       const lowerText = text.toLowerCase() 
       
       // 计算各情绪得分 
       const scores: Record<string, number> = {} 
       const matchedKeywords: string[] = [] 
       
       for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) { 
         let score = 0 
         for (const keyword of keywords) { 
           const regex = new RegExp(keyword, 'gi') 
           const matches = lowerText.match(regex) 
           if (matches) { 
             score += matches.length 
             matchedKeywords.push(keyword) 
           } 
         } 
         scores[emotion] = score 
       } 
       
       // 找出得分最高的情绪 
       let detectedEmotion: Emotion = 'calm' 
       let maxScore = 0 
       
       for (const [emotion, score] of Object.entries(scores)) { 
         if (score > maxScore) { 
           maxScore = score 
           detectedEmotion = emotion as Emotion 
         } 
       } 
       
       // 如果没有关键词匹配，基于文本特征猜测 
       if (maxScore === 0) { 
         if (text.includes('!') || text.includes('！') || text.toUpperCase() === text) { 
           detectedEmotion = 'excited' 
         } else if (text.includes('?') || text.includes('？')) { 
           detectedEmotion = 'anxious' 
         } else if (text.length < 5) { 
           detectedEmotion = 'calm' 
         } 
       } 
       
       // 计算置信度 
       const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) 
       const confidence = totalScore > 0 
         ? Math.min(0.3 + (maxScore / totalScore) * 0.7, 0.95) 
         : 0.5 
       
       const result: EmotionAnalysis = { 
         emotion: detectedEmotion, 
         confidence, 
         keywords: [...new Set(matchedKeywords)] 
       } 
       
       setAnalysis(result) 
       return result 
       
     } catch (err) { 
       const errorMsg = '情绪分析失败' 
       setError(errorMsg) 
       console.error('分析错误:', err) 
       throw new Error(errorMsg) 
     } finally { 
       setIsAnalyzing(false) 
     } 
   }, []) 
 
   // 语音转文字（模拟版） 
   const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => { 
     // 注意：实际项目中应使用 OpenAI Whisper API 或类似服务 
     // 这里返回占位符，提示用户需要配置语音识别服务 
     return '[语音转文字需要配置OpenAI Whisper API或其他语音识别服务]' 
   }, []) 
 
   // 分析语音 
   const analyzeAudio = useCallback(async (audioBlob: Blob) => { 
     setIsAnalyzing(true) 
     setError(null) 
     
     try { 
       // 1. 转录音频 
       const text = await transcribeAudio(audioBlob) 
       setTranscript(text) 
       
       // 2. 分析文本情绪 
       await analyzeText(text) 
       
     } catch (err) { 
       setError('语音分析失败') 
       console.error('语音分析错误:', err) 
     } finally { 
       setIsAnalyzing(false) 
     } 
   }, [analyzeText, transcribeAudio]) 
 
   // 重置分析 
   const resetAnalysis = useCallback(() => { 
     setAnalysis(null) 
     setTranscript('') 
     setError(null) 
   }, []) 
 
   return { 
     isAnalyzing, 
     analysis, 
     transcript, 
     error, 
     analyzeText, 
     analyzeAudio, 
     resetAnalysis 
   } 
 } 
