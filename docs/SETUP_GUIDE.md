# 세종학당 담당자 대시보드 설정 가이드

이 가이드는 세종학당 담당자 대시보드를 처음부터 설정하는 방법을 설명합니다.

## 📋 사전 준비사항

- Supabase 계정
- GitHub 계정 (선택사항)
- 웹 서버 또는 GitHub Pages

## 🚀 1단계: 데이터베이스 설정

### 1.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름과 비밀번호 설정
4. 리전 선택 (Asia Pacific (Seoul) 권장)

### 1.2 데이터베이스 테이블 생성
1. Supabase 대시보드 → "SQL Editor" 이동
2. `database/schema.sql` 파일 내용을 복사하여 실행
3. 성공 메시지 확인

### 1.3 샘플 데이터 삽입
1. SQL Editor에서 `database/sample_data.sql` 파일 내용 실행
2. 데이터 삽입 완료 확인

### 1.4 API 키 확인
1. Supabase 대시보드 → "Settings" → "API" 이동
2. `URL`과 `anon public` 키 복사

## 🔧 2단계: 애플리케이션 설정

### 2.1 설정 파일 수정
`js/config.js` 파일에서 Supabase 정보 업데이트:

```javascript
const CONFIG = {
    SUPABASE: {
        URL: 'YOUR_SUPABASE_URL',  // 여기에 URL 입력
        ANON_KEY: 'YOUR_ANON_KEY'  // 여기에 anon key 입력
    },
    // ...
};
```

### 2.2 로컬 테스트
```bash
# Python 사용 시
python -m http.server 8000

# Node.js 사용 시
npx serve .

# PHP 사용 시
php -S localhost:8000
```

브라우저에서 `http://localhost:8000` 접속

## 🌐 3단계: 배포 (GitHub Pages)

### 3.1 GitHub 레포지토리 생성
1. GitHub에서 새 레포지토리 생성
2. 파일들 업로드 또는 클론

### 3.2 GitHub Pages 활성화
1. 레포지토리 → "Settings" → "Pages"
2. Source: "Deploy from a branch"
3. Branch: "main" 선택
4. 폴더: "/ (root)" 선택
5. "Save" 클릭

### 3.3 접속 확인
몇 분 후 `https://username.github.io/repository-name`으로 접속

## 🧪 4단계: 테스트

### 4.1 기본 테스트 계정
```
학당명: 서울세종학당
담당자명: 김담당
인증코드: seoul2024
```

### 4.2 다른 테스트 계정들
| 학당명 | 담당자명 | 인증코드 |
|--------|----------|----------|
| 부산세종학당 | 박관리 | busan2024 |
| 대구세종학당 | 이책임 | daegu2024 |
| 인천세종학당 | 정주임 | incheon2024 |

## 🔒 5단계: 보안 설정 (선택사항)

### 5.1 Row Level Security 정책 추가
더 엄격한 보안이 필요한 경우 RLS 정책을 수정:

```sql
-- 예: 특정 도메인에서만 접근 허용
CREATE POLICY "Restrict access by domain" ON user_profiles
    FOR SELECT USING (
        current_setting('request.headers')::json->>'origin' 
        LIKE '%yourdomain.com%'
    );
```

### 5.2 환경 변수 사용
프로덕션 환경에서는 API 키를 환경 변수로 관리:

```javascript
const CONFIG = {
    SUPABASE: {
        URL: process.env.SUPABASE_URL || 'fallback-url',
        ANON_KEY: process.env.SUPABASE_ANON_KEY || 'fallback-key'
    }
};
```

## 🎯 6단계: 실제 데이터 준비

### 6.1 학당 담당자 데이터 추가
```sql
INSERT INTO institute_managers (institute_name, manager_name, auth_code, phone, email) 
VALUES ('실제학당명', '실제담당자명', '실제인증코드', '연락처', '이메일');
```

### 6.2 재단 담당자 데이터 추가
```sql
INSERT INTO foundation_managers (institute_name, name, phone, email, role) 
VALUES ('실제학당명', '재단담당자명', '연락처', '이메일', '담당업무');
```

### 6.3 기존 인턴 데이터 연동
기존 `user_profiles` 테이블이 있다면 `sejong_institute` 필드만 업데이트:

```sql
UPDATE user_profiles 
SET sejong_institute = '해당학당명' 
WHERE name = '학생이름' AND birth_date = '생년월일';
```

## 🔧 문제 해결

### 일반적인 문제들

1. **CORS 오류가 발생하는 경우**
   - Supabase 대시보드에서 허용된 도메인 확인
   - `localhost`나 실제 도메인이 추가되어 있는지 확인

2. **데이터가 보이지 않는 경우**
   - RLS 정책 확인
   - API 키가 올바른지 확인
   - 네트워크 탭에서 API 호출 상태 확인

3. **로그인이 안 되는 경우**
   - `institute_managers` 테이블에 데이터가 있는지 확인
   - 대소문자 정확히 입력했는지 확인

### 디버깅 모드
개발자 도구 콘솔에서 다음 명령어로 디버깅 정보 확인:
```javascript
DashboardApp.debug();
```

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 브라우저 개발자 도구 콘솔의 오류 메시지
2. Supabase 대시보드의 로그
3. 네트워크 요청 상태

## 🎉 완료!

모든 설정이 완료되면 세종학당 담당자들이 다음 정보로 접속할 수 있습니다:
- 자신의 학당에 배정된 문화인턴 목록
- 각 인턴의 상세 정보 (이름, 생년월일, 전문분야)
- 세종학당재단 담당자 연락처
- 인쇄 기능으로 목록 출력 가능