-- 세종학당 담당자 대시보드 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 학당 담당자 테이블 생성
CREATE TABLE IF NOT EXISTS institute_managers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institute_name VARCHAR(100) NOT NULL,
    manager_name VARCHAR(100) NOT NULL,
    auth_code VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 재단 담당자 테이블 생성
CREATE TABLE IF NOT EXISTS foundation_managers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institute_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. 기존 user_profiles 테이블이 없다면 생성 (이미 있다면 스킵)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    sejong_institute VARCHAR(100),
    field VARCHAR(50),
    user_type VARCHAR(20) DEFAULT 'student',
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_institute_managers_auth ON institute_managers(institute_name, manager_name, auth_code);
CREATE INDEX IF NOT EXISTS idx_foundation_managers_institute ON foundation_managers(institute_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_institute ON user_profiles(sejong_institute, user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_student_auth ON user_profiles(name, birth_date, user_type);

-- 5. Row Level Security (RLS) 정책 설정
ALTER TABLE institute_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. 기본 정책 생성 (읽기 허용)
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON institute_managers
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON foundation_managers
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON user_profiles
    FOR SELECT USING (true);

-- 7. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. 업데이트 트리거 적용
CREATE TRIGGER update_institute_managers_updated_at 
    BEFORE UPDATE ON institute_managers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundation_managers_updated_at 
    BEFORE UPDATE ON foundation_managers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 세종학당 담당자 대시보드 데이터베이스 스키마 생성 완료!';
    RAISE NOTICE '📝 이제 sample_data.sql을 실행하여 샘플 데이터를 추가하세요.';
END $$;