import { useState, useCallback, useRef } from 'react' 
 
 interface UseVoiceRecorderReturn { 
   isRecording: boolean 
   isPaused: boolean 
   recordingTime: number 
   audioBlob: Blob | null 
   audioUrl: string | null 
   error: string | null 
   startRecording: () => Promise<void> 
   stopRecording: () => void 
   pauseRecording: () => void 
   resumeRecording: () => void 
   resetRecording: () => void 
 } 
 
 export function useVoiceRecorder(): UseVoiceRecorderReturn { 
   const [isRecording, setIsRecording] = useState(false) 
   const [isPaused, setIsPaused] = useState(false) 
   const [recordingTime, setRecordingTime] = useState(0) 
   const [audioBlob, setAudioBlob] = useState<Blob | null>(null) 
   const [audioUrl, setAudioUrl] = useState<string | null>(null) 
   const [error, setError] = useState<string | null>(null) 
   
   const mediaRecorderRef = useRef<MediaRecorder | null>(null) 
   const chunksRef = useRef<Blob[]>([]) 
   const timerRef = useRef<NodeJS.Timeout | null>(null) 
 
   // 开始录音 
   const startRecording = useCallback(async () => { 
     try { 
       // 重置状态 
       setAudioBlob(null) 
       setAudioUrl(null) 
       setError(null) 
       setRecordingTime(0) 
       chunksRef.current = [] 
 
       // 获取麦克风权限 
       const stream = await navigator.mediaDevices.getUserMedia({ 
         audio: { 
           echoCancellation: true, 
           noiseSuppression: true, 
           sampleRate: 44100 
         } 
       }) 
       
       const mediaRecorder = new MediaRecorder(stream, { 
         mimeType: 'audio/webm;codecs=opus' 
       }) 
       
       mediaRecorderRef.current = mediaRecorder 
       
       // 收集音频数据 
       mediaRecorder.ondataavailable = (event) => { 
         if (event.data.size > 0) { 
           chunksRef.current.push(event.data) 
         } 
       } 
       
       // 录音停止处理 
       mediaRecorder.onstop = () => { 
         const blob = new Blob(chunksRef.current, { type: 'audio/webm' }) 
         const url = URL.createObjectURL(blob) 
         setAudioBlob(blob) 
         setAudioUrl(url) 
         
         // 停止所有轨道 
         stream.getTracks().forEach(track => track.stop()) 
         
         // 清除计时器 
         if (timerRef.current) { 
           clearInterval(timerRef.current) 
           timerRef.current = null 
         } 
       } 
       
       // 错误处理 
       mediaRecorder.onerror = () => { 
         setError('录音出现错误') 
         setIsRecording(false) 
       } 
       
       // 开始录音 
       mediaRecorder.start(100) // 每100ms收集一次数据 
       setIsRecording(true) 
       
       // 启动计时器 
       timerRef.current = setInterval(() => { 
         setRecordingTime(prev => prev + 1) 
       }, 1000) 
       
     } catch (err) { 
       console.error('录音错误:', err) 
       if (err instanceof DOMException) { 
         if (err.name === 'NotAllowedError') { 
           setError('麦克风权限被拒绝，请在浏览器设置中允许访问麦克风') 
         } else if (err.name === 'NotFoundError') { 
           setError('未找到麦克风设备') 
         } else { 
           setError('无法访问麦克风: ' + err.message) 
         } 
       } else { 
         setError('启动录音失败') 
       } 
     } 
   }, []) 
 
   // 停止录音 
   const stopRecording = useCallback(() => { 
     if (mediaRecorderRef.current && isRecording) { 
       mediaRecorderRef.current.stop() 
       setIsRecording(false) 
       setIsPaused(false) 
     } 
   }, [isRecording]) 
 
   // 暂停录音 
   const pauseRecording = useCallback(() => { 
     if (mediaRecorderRef.current && isRecording && !isPaused) { 
       mediaRecorderRef.current.pause() 
       setIsPaused(true) 
       if (timerRef.current) { 
         clearInterval(timerRef.current) 
       } 
     } 
   }, [isRecording, isPaused]) 
 
   // 恢复录音 
   const resumeRecording = useCallback(() => { 
     if (mediaRecorderRef.current && isRecording && isPaused) { 
       mediaRecorderRef.current.resume() 
       setIsPaused(false) 
       timerRef.current = setInterval(() => { 
         setRecordingTime(prev => prev + 1) 
       }, 1000) 
     } 
   }, [isRecording, isPaused]) 
 
   // 重置录音 
   const resetRecording = useCallback(() => { 
     if (audioUrl) { 
       URL.revokeObjectURL(audioUrl) 
     } 
     setAudioBlob(null) 
     setAudioUrl(null) 
     setError(null) 
     setRecordingTime(0) 
     setIsRecording(false) 
     setIsPaused(false) 
     chunksRef.current = [] 
   }, [audioUrl]) 
 
   return { 
     isRecording, 
     isPaused, 
     recordingTime, 
     audioBlob, 
     audioUrl, 
     error, 
     startRecording, 
     stopRecording, 
     pauseRecording, 
     resumeRecording, 
     resetRecording 
   } 
 } 
