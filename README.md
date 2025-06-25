# 세종학당 담당자 대시보드

![세종학당](https://img.shields.io/badge/세종학당-담당자대시보드-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

세종학당 담당자가 배정된 문화인턴 정보를 확인할 수 있는 대시보드입니다.

## 🚀 주요 기능

- **👤 간편 로그인**: 학당명과 담당자 이메일만으로 간편 접속 ⭐ **NEW**
- **📊 인턴 현황 대시보드**: 해당 학당에 배정된 문화인턴 목록과 통계
- **📄 지원서류 다운로드**: 인턴들이 제출한 지원서류 PDF 다운로드 ⭐ **개별 다운로드**
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **📋 테이블 형태 인턴 목록**: 성명, 전공분야, 지원서 정보 3컬럼 구성 ⭐ **NEW**
- **🔄 실시간 데이터**: Supabase를 통한 실시간 데이터 동기화

## 📸 스크린샷

### 로그인 페이지
<img src="https://via.placeholder.com/800x600/667eea/ffffff?text=Login+Page" alt="로그인 페이지" width="400"/>

### 대시보드 메인
<img src="https://via.placeholder.com/800x600/667eea/ffffff?text=Dashboard+Main" alt="대시보드 메인" width="400"/>

## 📋 빠른 시작

### 1. 테스트 환경에서 바로 사용
```
🔗 데모 링크: https://faye8796.github.io/institute-dashboard

📝 테스트용 학당명과 담당자 이메일:
학당명: 다낭
담당자 이메일: danang@ksif.or.kr

학당명: 부하라
담당자 이메일: bukhara@ksif.or.kr
```

### 2. 로컬 환경에서 실행
```bash
# 1. 레포지토리 클론
git clone https://github.com/faye8796/institute-dashboard.git
cd institute-dashboard

# 2. 로컬 서버 실행
python -m http.server 8000
# 또는
npx serve .

# 3. 브라우저에서 접속
http://localhost:8000
```

## 🛠️ 시스템 구성

### 기술 스택
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Icons**: Lucide Icons
- **Deployment**: GitHub Pages

### 아키텍처
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   브라우저       │    │   GitHub Pages  │    │   Supabase      │
│                │    │                │    │                │
│ • HTML/CSS/JS  │◄──►│ • 정적 호스팅    │◄──►│ • PostgreSQL   │
│ • 반응형 UI    │    │ • HTTPS 지원    │    │ • Real-time API │
│ • 테이블 UI    │    │ • CDN 배포      │    │ • 인증/보안     │
│ • PDF 다운로드 │    │                │    │ • 파일 저장     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 프로젝트 구조

```
institute-dashboard/
├── 📄 index.html              # 메인 애플리케이션 (최적화됨)
├── 📁 css/
│   └── main.css              # 스타일시트 (테이블 스타일 포함)
├── 📁 js/
│   ├── config.js             # 설정 파일
│   └── app.js                # 메인 애플리케이션 로직 (간소화됨)
├── 📁 database/
│   ├── schema.sql            # 데이터베이스 스키마
│   └── sample_data.sql       # 샘플 데이터
├── 📁 docs/
│   ├── SETUP_GUIDE.md        # 설정 가이드
│   └── API_REFERENCE.md      # API 참조 문서
└── 📄 README.md              # 프로젝트 개요
```

## 🗄️ 데이터베이스 스키마

### 핵심 테이블 구조
```sql
-- 학당 담당자 (로그인 정보) ⭐ 이메일 인증 방식
institute_managers (
    id, institute_name, manager_name, 
    mail, phone, created_at          -- mail 컬럼 사용
)

-- 문화인턴 (배정 정보 + 지원서류)
user_profiles (
    id, name, birth_date, sejong_institute,
    field, user_type, phone, email,
    application_document_url,          
    application_document_name,         
    application_submitted_at           
)
```

## ⭐ 새로운 기능: 최적화된 UI/UX

### 🎯 개선된 대시보드 구성
- **간소화된 상단 카드**: 배치된 인턴, 재단 담당자 (2개로 축소)
- **테이블 형태 인턴 목록**: 성명, 전공분야, 지원서 정보 3컬럼 ⭐ **NEW**
- **개별 다운로드 시스템**: 각 인턴의 지원서 개별 다운로드 가능
- **모바일 최적화**: 반응형 테이블 디자인

### 🔐 간편한 인증 시스템
```
✅ 학당명 + 담당자 이메일 (간단하고 정확함)
```

**장점**:
- 더 정확한 담당자 식별
- 이메일 형식 자동 검증
- 향후 이메일 알림 기능 연동 가능
- 보안성 및 신뢰성 향상

## 🔧 설정 및 배포

### 1. Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `database/schema.sql` 실행으로 테이블 생성
3. `database/sample_data.sql` 실행으로 샘플 데이터 삽입
4. API URL과 키를 `js/config.js`에 설정

### 2. GitHub Pages 배포
1. 이 레포지토리를 포크하거나 클론
2. `js/config.js`에서 Supabase 설정 업데이트
3. GitHub Pages 활성화
4. 자동 배포 완료

📖 **자세한 설정 방법**: [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

## 🧪 테스트 가능한 학당 목록

시스템에 등록된 테스트 계정들 (이메일 기반):

| 학당명 | 담당자 이메일 | 지원서류 보유 인턴 | 비고 |
|--------|---------------|-------------------|------|
| **다낭** | danang@ksif.or.kr | 윤예원 (1명) | ⭐ 베트남 다낭 세종학당 |
| **부하라** | bukhara@ksif.or.kr | 김희준 (1명) | ⭐ 우즈베키스탄 부하라 세종학당 |
| **후에** | hue@ksif.or.kr | 박소연 (1명) | 베트남 후에 세종학당 |
| **런던** | london@ksif.or.kr | 장진휘 (1명) | 영국 런던 세종학당 |
| **샌안토니오** | sanantonio@ksif.or.kr | 최지원 (1명) | 미국 샌안토니오 세종학당 |
| **독일** | germany@ksif.or.kr | 송선호 (1명) | 독일 주독일한국문화원 세종학당 |
| **벵갈루루** | bangalore@ksif.or.kr | 심지은, 김민준 (2명) | 인도 벵갈루루 세종학당 |
| **청두1** | chengdu@ksif.or.kr | 이규서 (1명) | 중국 청두1 세종학당 |
| **카토비체** | katowice@ksif.or.kr | 김서영 (1명) | 폴란드 카토비체 세종학당 |
| **몬트리올** | montreal@ksif.or.kr | 이승호, 권승연 (2명) | 캐나다 몬트리올 세종학당 |
| **필리핀** | philippines@ksif.or.kr | 정윤서 (1명) | 필리핀 주필리핀한국문화원 세종학당 |
| **마하사라캄** | thailand@ksif.or.kr | 최가을 (1명) | 태국 마하사라캄 세종학당 |

**참고**: 등록되지 않은 학당이라도 user_profiles에 해당 학당 데이터가 있으면 임시 접속이 가능합니다.

## 🔗 관련 시스템

이 시스템은 세종학당 문화인턴 관리 생태계의 일부입니다:

- **[학생용 배정 결과 확인](https://github.com/faye8796/intern-announcement)** - 인턴들이 배정 결과를 확인하는 페이지
- **[문화교구 신청 플랫폼](https://github.com/faye8796/request)** - 기본 신청 및 관리 시스템

## 📱 지원 환경

### 브라우저 지원
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 반응형 지원
- 📱 **모바일**: 320px ~ 767px (테이블 최적화)
- 📟 **태블릿**: 768px ~ 1199px  
- 💻 **데스크톱**: 1200px+

## 🔒 보안 기능

- **🛡️ Row Level Security**: Supabase RLS로 데이터 접근 제어
- **🔐 이메일 인증**: 학당명 + 담당자 이메일 2단계 인증 ⭐ **NEW**
- **📧 형식 검증**: 이메일 형식 자동 검증 ⭐ **NEW**
- **🌐 HTTPS**: GitHub Pages 기본 HTTPS 지원
- **🚫 민감정보 보호**: 필요한 정보만 노출
- **📄 문서 보안**: 담당 학당 지원서류만 접근 가능

## 🚀 최신 업데이트 (v2.0)

### ✨ UI/UX 대폭 개선
- **테이블 형태 인턴 목록**: 카드에서 테이블로 변경
- **3컬럼 구성**: 성명, 전공분야, 지원서 정보
- **개별 다운로드**: 각 인턴의 지원서 개별 다운로드
- **모바일 최적화**: 반응형 테이블 디자인

### 🎯 간소화된 인터페이스
- **상단 카드 축소**: 3개 → 2개 (배치된 인턴, 재단 담당자)
- **불필요한 기능 제거**: 인쇄, 전체 다운로드 기능 제거
- **재단 담당자**: 기본값 "미정"으로 설정
- **로그인 예시**: "다낭" 등 간단한 학당명 사용

## 📈 향후 개발 계획

- [ ] 📊 **고급 통계**: 인턴 배정 현황 차트 및 분석
- [ ] 📧 **이메일 알림**: 배정 변경사항 자동 알림 ⭐ **이메일 인증과 연동**
- [ ] 📱 **PWA 지원**: 모바일 앱처럼 사용 가능
- [ ] 🌍 **다국어 지원**: 영어/중국어 버전
- [ ] 📊 **대시보드 확장**: 더 상세한 관리 기능
- [ ] ☁️ **클라우드 저장소**: Supabase Storage 연동으로 실제 PDF 파일 관리
- [ ] 🔐 **다단계 인증**: 이메일 OTP 인증 추가

## 🐛 버그 리포트 & 기능 요청

시스템 사용 중 문제가 있거나 새로운 기능이 필요하시면:

1. **GitHub Issues**: [이슈 등록](https://github.com/faye8796/institute-dashboard/issues)
2. **이메일**: 관리자에게 직접 연락
3. **디버깅**: 브라우저 콘솔에서 `DashboardApp.debug()` 실행

## 📞 지원 및 문의

- 📧 **기술 지원**: 시스템 관리자
- 📖 **문서**: [docs/](docs/) 폴더의 상세 가이드
- 🔧 **설정 도움**: [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- 🔍 **API 참조**: [API_REFERENCE.md](docs/API_REFERENCE.md)

## 📄 라이선스

이 프로젝트는 세종학당 내부 사용을 위한 것입니다.

---

<div align="center">

**🎯 세종학당 문화인턴 관리의 새로운 표준**

*Made with ❤️ for Sejong Institute*

[![GitHub stars](https://img.shields.io/github/stars/faye8796/institute-dashboard.svg?style=social&label=Star)](https://github.com/faye8796/institute-dashboard)
[![GitHub forks](https://img.shields.io/github/forks/faye8796/institute-dashboard.svg?style=social&label=Fork)](https://github.com/faye8796/institute-dashboard/fork)

</div>