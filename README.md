# 세종학당 담당자 대시보드

![세종학당](https://img.shields.io/badge/세종학당-담당자대시보드-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

세종학당 담당자가 배정된 문화인턴 정보와 재단 담당자 정보를 확인할 수 있는 대시보드입니다.

## 🚀 주요 기능

- **담당자 로그인**: 학당명, 담당자명, 인증코드로 로그인
- **인턴 현황 조회**: 해당 학당에 배정된 문화인턴 목록 확인
- **재단 담당자 정보**: 세종학당재단 담당자 연락처 및 업무 정보
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **인쇄 기능**: 인턴 목록을 인쇄 가능

## 📋 사용 방법

### 1. 접속
브라우저에서 페이지에 접속합니다.

### 2. 로그인
- **학당명**: 담당하고 있는 세종학당명 입력
- **담당자 이름**: 본인의 이름 입력
- **인증코드**: 제공받은 인증코드 입력

### 3. 대시보드 확인
로그인 후 다음 정보를 확인할 수 있습니다:
- 배정된 문화인턴 수
- 각 인턴의 상세 정보 (이름, 생년월일, 전문분야)
- 세종학당재단 담당자 연락처

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide Icons
- **Styling**: CSS Grid, Flexbox, CSS Variables

## 📁 프로젝트 구조

```
institute-dashboard/
├── index.html          # 메인 HTML 파일
├── css/
│   └── main.css        # 스타일시트
├── js/
│   ├── config.js       # 설정 파일
│   └── app.js          # 메인 애플리케이션 로직
└── README.md
```

## 🗄️ 데이터베이스 구조

### user_profiles (기존 테이블)
학생(인턴) 정보를 저장하는 테이블
```sql
user_profiles (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    sejong_institute VARCHAR(100),
    field VARCHAR(50),
    user_type VARCHAR(20) -- 'student'
)
```

### institute_managers (새로 필요한 테이블)
학당 담당자 정보를 저장하는 테이블
```sql
institute_managers (
    id UUID PRIMARY KEY,
    institute_name VARCHAR(100) NOT NULL,
    manager_name VARCHAR(100) NOT NULL,
    auth_code VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
)
```

### foundation_managers (새로 필요한 테이블)
재단 담당자 정보를 저장하는 테이블
```sql
foundation_managers (
    id UUID PRIMARY KEY,
    institute_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
)
```

## 🔧 설정

### Supabase 연결
`js/config.js` 파일에서 Supabase 연결 정보를 설정합니다:
```javascript
const CONFIG = {
    SUPABASE: {
        URL: 'your-supabase-url',
        ANON_KEY: 'your-anon-key'
    }
};
```

## 🚦 로컬 개발

### 1. 파일 다운로드
```bash
git clone https://github.com/faye8796/institute-dashboard.git
cd institute-dashboard
```

### 2. 로컬 서버 실행
```bash
# Python을 사용하는 경우
python -m http.server 8000

# Node.js를 사용하는 경우
npx serve .

# Live Server VS Code 확장프로그램 사용
```

### 3. 브라우저에서 접속
```
http://localhost:8000
```

## 📊 데이터베이스 설정

### 1. 테이블 생성
Supabase에서 다음 SQL을 실행하여 필요한 테이블을 생성합니다:

```sql
-- 학당 담당자 테이블
CREATE TABLE institute_managers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institute_name VARCHAR(100) NOT NULL,
    manager_name VARCHAR(100) NOT NULL,
    auth_code VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 재단 담당자 테이블
CREATE TABLE foundation_managers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institute_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. 샘플 데이터 입력
```sql
-- 학당 담당자 샘플 데이터
INSERT INTO institute_managers (institute_name, manager_name, auth_code, phone, email) VALUES
('서울세종학당', '김담당', 'seoul2024', '02-1234-5678', 'kim@seoul.sejong.kr'),
('부산세종학당', '박관리', 'busan2024', '051-1234-5678', 'park@busan.sejong.kr');

-- 재단 담당자 샘플 데이터
INSERT INTO foundation_managers (institute_name, name, phone, email, role) VALUES
('서울세종학당', '홍길동', '02-1234-5678', 'hong@sejong.or.kr', '해외 문화인턴 담당'),
('부산세종학당', '이순신', '02-1234-5679', 'lee@sejong.or.kr', '지역 협력 담당');
```

## 📱 화면 구성

### 1. 로그인 페이지
- 학당명, 담당자명, 인증코드 입력
- 간편한 인증 시스템

### 2. 대시보드 페이지
- **요약 카드**: 배정된 인턴 수, 재단 담당자명
- **재단 담당자 정보**: 이름, 연락처, 이메일, 담당업무
- **인턴 목록**: 배정된 인턴들의 상세 정보

### 3. 반응형 지원
- **데스크톱**: 1200px 이상
- **태블릿**: 768px - 1199px
- **모바일**: 767px 이하

## 🔒 보안

- Row Level Security (RLS) 적용 권장
- 인증코드를 통한 접근 제어
- 민감한 정보는 필요한 범위 내에서만 표시

## 🔗 관련 시스템

- [세종학당 문화인턴 배정 공지](https://github.com/faye8796/intern-announcement) - 학생용 배정 결과 확인 페이지
- [세종학당 문화교구 신청 플랫폼](https://github.com/faye8796/request) - 기본 신청 시스템

## 🐛 문제 해결

### 자주 발생하는 문제

1. **로그인이 안 되는 경우**
   - 학당명, 담당자명, 인증코드가 정확한지 확인
   - 데이터베이스에 해당 정보가 등록되어 있는지 확인

2. **인턴 목록이 보이지 않는 경우**
   - user_profiles 테이블에 해당 학당으로 배정된 학생이 있는지 확인
   - sejong_institute 필드값이 정확한지 확인

3. **재단 담당자 정보가 보이지 않는 경우**
   - foundation_managers 테이블에 해당 학당 정보가 있는지 확인

## 📞 지원

문제가 발생하거나 질문이 있으시면 관리자에게 문의해주세요.

## 📄 라이선스

이 프로젝트는 세종학당 내부 사용을 위한 것입니다.

---

**🎯 목적**: 세종학당 담당자가 배정된 인턴 정보를 쉽게 확인하고 재단과 원활한 소통을 위한 대시보드 제공