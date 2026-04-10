-- ============================================ 
-- 怪兽行星数据库Schema 
-- 表数量: 6张核心表 
-- 创建日期: 2026-04-08 
-- ============================================ 

-- 1. 用户档案表 
CREATE TABLE IF NOT EXISTS profiles ( 
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, 
  username TEXT UNIQUE, 
  full_name TEXT, 
  avatar_url TEXT, 
  bio TEXT DEFAULT '', 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

-- 2. 怪兽表 
CREATE TABLE IF NOT EXISTS monsters ( 
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, 
  name TEXT NOT NULL, 
  type TEXT NOT NULL CHECK (type IN ('creative', 'logical', 'emotional', 'social', 'explorer')), 
  stage INTEGER DEFAULT 1 CHECK (stage >= 1 AND stage <= 5), 
  experience INTEGER DEFAULT 0 CHECK (experience >= 0), 
  skill_points INTEGER DEFAULT 0 CHECK (skill_points >= 0), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

-- 3. DNA维度表 
CREATE TABLE IF NOT EXISTS dna_dimensions ( 
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  monster_id UUID REFERENCES monsters ON DELETE CASCADE NOT NULL, 
  dimensions JSONB DEFAULT '{}', 
  personality_type TEXT, 
  analysis_summary TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  UNIQUE(monster_id) 
); 

-- 4. 情绪记录表 
CREATE TABLE IF NOT EXISTS emotion_records ( 
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, 
  monster_id UUID REFERENCES monsters ON DELETE CASCADE, 
  emotion TEXT NOT NULL CHECK (emotion IN ('happy', 'sad', 'angry', 'anxious', 'calm', 'excited')), 
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10), 
  context TEXT, 
  source TEXT DEFAULT 'manual', -- manual, voice, chat 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

-- 5. 对话记录表 
CREATE TABLE IF NOT EXISTS chat_messages ( 
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL, 
  monster_id UUID REFERENCES monsters ON DELETE CASCADE NOT NULL, 
  role TEXT NOT NULL CHECK (role IN ('user', 'monster')), 
  content TEXT NOT NULL, 
  emotion TEXT CHECK (emotion IN ('happy', 'sad', 'angry', 'anxious', 'calm', 'excited')), 
  tokens_used INTEGER DEFAULT 0, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 

-- 6. 星球配置表 
CREATE TABLE IF NOT EXISTS planet_configs ( 
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  monster_id UUID REFERENCES monsters ON DELETE CASCADE NOT NULL, 
  terrain_type TEXT DEFAULT 'earth' CHECK (terrain_type IN ('earth', 'water', 'fire', 'ice', 'cloud', 'crystal')), 
  weather TEXT DEFAULT 'sunny' CHECK (weather IN ('sunny', 'rainy', 'stormy', 'snowy', 'cloudy')), 
  theme_color TEXT DEFAULT '#8B5CF6', 
  decorations JSONB DEFAULT '[]', 
  atmosphere_density INTEGER DEFAULT 50 CHECK (atmosphere_density >= 0 AND atmosphere_density <= 100), 
  gravity_level INTEGER DEFAULT 50 CHECK (gravity_level >= 0 AND gravity_level <= 100), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  UNIQUE(monster_id) 
); 

-- ============================================ 
-- 索引优化 
-- ============================================ 
CREATE INDEX IF NOT EXISTS idx_monsters_user_id ON monsters(user_id); 
CREATE INDEX IF NOT EXISTS idx_monsters_type ON monsters(type); 
CREATE INDEX IF NOT EXISTS idx_emotion_records_user_id ON emotion_records(user_id); 
CREATE INDEX IF NOT EXISTS idx_emotion_records_monster_id ON emotion_records(monster_id); 
CREATE INDEX IF NOT EXISTS idx_emotion_records_created_at ON emotion_records(created_at DESC); 
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id); 
CREATE INDEX IF NOT EXISTS idx_chat_messages_monster_id ON chat_messages(monster_id); 
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC); 
CREATE INDEX IF NOT EXISTS idx_planet_configs_monster_id ON planet_configs(monster_id); 

-- ============================================ 
-- 启用行级安全(RLS) 
-- ============================================ 
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY; 
ALTER TABLE dna_dimensions ENABLE ROW LEVEL SECURITY; 
ALTER TABLE emotion_records ENABLE ROW LEVEL SECURITY; 
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY; 
ALTER TABLE planet_configs ENABLE ROW LEVEL SECURITY; 

-- ============================================ 
-- RLS策略 
-- ============================================ 

-- Profiles: 用户只能访问自己的档案 
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id); 

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id); 

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id); 

-- Monsters: 用户只能访问自己的怪兽 
CREATE POLICY "Users can view own monsters" 
  ON monsters FOR SELECT USING (auth.uid() = user_id); 

CREATE POLICY "Users can create own monsters" 
  ON monsters FOR INSERT WITH CHECK (auth.uid() = user_id); 

CREATE POLICY "Users can update own monsters" 
  ON monsters FOR UPDATE USING (auth.uid() = user_id); 

CREATE POLICY "Users can delete own monsters" 
  ON monsters FOR DELETE USING (auth.uid() = user_id); 

-- DNA Dimensions: 通过怪兽关联访问 
CREATE POLICY "Users can view own DNA" 
  ON dna_dimensions FOR SELECT USING ( 
    EXISTS (SELECT 1 FROM monsters WHERE monsters.id = dna_dimensions.monster_id AND monsters.user_id = auth.uid()) 
  ); 

CREATE POLICY "Users can manage own DNA" 
  ON dna_dimensions FOR ALL USING ( 
    EXISTS (SELECT 1 FROM monsters WHERE monsters.id = dna_dimensions.monster_id AND monsters.user_id = auth.uid()) 
  ); 

-- Emotion Records: 用户只能访问自己的情绪记录 
CREATE POLICY "Users can view own emotions" 
  ON emotion_records FOR SELECT USING (auth.uid() = user_id); 

CREATE POLICY "Users can create own emotions" 
  ON emotion_records FOR INSERT WITH CHECK (auth.uid() = user_id); 

CREATE POLICY "Users can delete own emotions" 
  ON emotion_records FOR DELETE USING (auth.uid() = user_id); 

-- Chat Messages: 用户只能访问自己的对话 
CREATE POLICY "Users can view own messages" 
  ON chat_messages FOR SELECT USING (auth.uid() = user_id); 

CREATE POLICY "Users can create own messages" 
  ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id); 

CREATE POLICY "Users can delete own messages" 
  ON chat_messages FOR DELETE USING (auth.uid() = user_id); 

-- Planet Configs: 通过怪兽关联访问 
CREATE POLICY "Users can view own planet" 
  ON planet_configs FOR SELECT USING ( 
    EXISTS (SELECT 1 FROM monsters WHERE monsters.id = planet_configs.monster_id AND monsters.user_id = auth.uid()) 
  ); 

CREATE POLICY "Users can manage own planet" 
  ON planet_configs FOR ALL USING ( 
    EXISTS (SELECT 1 FROM monsters WHERE monsters.id = planet_configs.monster_id AND monsters.user_id = auth.uid()) 
  ); 

-- ============================================ 
-- 触发器函数：自动更新 updated_at 
-- ============================================ 
CREATE OR REPLACE FUNCTION update_updated_at_column() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW; 
END; 
$$ language 'plpgsql'; 

-- 应用触发器 
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

CREATE TRIGGER update_monsters_updated_at BEFORE UPDATE ON monsters 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

CREATE TRIGGER update_dna_dimensions_updated_at BEFORE UPDATE ON dna_dimensions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

CREATE TRIGGER update_planet_configs_updated_at BEFORE UPDATE ON planet_configs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

-- ============================================ 
-- Schema创建完成 
-- ============================================ 
