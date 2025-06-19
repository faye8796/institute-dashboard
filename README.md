# 세종학당 담당자 대시보드

![세종학당](https://img.shields.io/badge/세종학당-담당자대시보드-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

세종학당 담당자가 배정된 문화인턴 정보와 재단 담당자 정보를 확인할 수 있는 대시보드입니다.

## 🚀 주요 기능

- **👤 담당자 로그인**: 학당명, 담당자명, 인증코드로 안전한 로그인
- **📊 인턴 현황 대시보드**: 해당 학당에 배정된 문화인턴 목록과 통계
- **👥 재단 담당자 정보**: 세종학당재단 담당자 연락처 및 업무 정보
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **🖨️ 인쇄 기능**: 인턴 목록을 깔끔하게 인쇄 가능
- **🔄 실시간 데이터**: Supabase를 통한 실시간 데이터 동기화

## 📸 스크린샷

### 로그인 페이지
<img src=\"https://via.placeholder.com/800x600/667eea/ffffff?text=Login+Page\" alt=\"로그인 페이지\" width=\"400\"/>

### 대시보드 메인
<img src=\"https://via.placeholder.com/800x600/667eea/ffffff?text=Dashboard+Main\" alt=\"대시보드 메인\" width=\"400\"/>

## 📋 빠른 시작

### 1. 테스트 환경에서 바로 사용
```
🔗 데모 링크: https://faye8796.github.io/institute-dashboard

📝 테스트 계정:
학당명: 서울세종학당
담당자명: 김담당
인증코드: seoul2024
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
│ • 인쇄 지원    │    │ • CDN 배포      │    │ • 인증/보안     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 프로젝트 구조

```
institute-dashboard/
├── 📄 index.html              # 메인 애플리케이션
├── 📁 css/
│   └── main.css              # 스타일시트
├── 📁 js/
│   ├── config.js             # 설정 파일
│   └── app.js                # 메인 애플리케이션 로직
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
-- 학당 담당자 (로그인 정보)
institute_managers (
    id, institute_name, manager_name, 
    auth_code, phone, email
)

-- 재단 담당자 (연락처 정보)  
foundation_managers (
    id, institute_name, name, 
    phone, email, role
)

-- 문화인턴 (배정 정보)
user_profiles (
    id, name, birth_date, sejong_institute,
    field, user_type, phone, email
)
```

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

## 🧪 테스트 계정

시스템 테스트를 위한 사전 준비된 계정들:

| 학당명 | 담당자명 | 인증코드 | 배정된 인턴 수 |
|--------|----------|----------|---------------|
| 서울세종학당 | 김담당 | `seoul2024` | 5명 |
| 부산세종학당 | 박관리 | `busan2024` | 4명 |
| 대구세종학당 | 이책임 | `daegu2024` | 4명 |
| 인천세종학당 | 정주임 | `incheon2024` | 2명 |

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
- 📱 **모바일**: 320px ~ 767px
- 📟 **태블릿**: 768px ~ 1199px  
- 💻 **데스크톱**: 1200px+

## 🔒 보안 기능

- **🛡️ Row Level Security**: Supabase RLS로 데이터 접근 제어
- **🔐 인증 시스템**: 3단계 인증 (학당명 + 담당자명 + 인증코드)
- **🌐 HTTPS**: GitHub Pages 기본 HTTPS 지원
- **🚫 민감정보 보호**: 필요한 정보만 노출

## 📈 향후 개발 계획

- [ ] 📊 **고급 통계**: 인턴 배정 현황 차트 및 분석
- [ ] 📧 **이메일 알림**: 배정 변경사항 자동 알림
- [ ] 📱 **PWA 지원**: 모바일 앱처럼 사용 가능
- [ ] 🔄 **배치 관리**: 인턴 재배정 기능
- [ ] 🌍 **다국어 지원**: 영어/중국어 버전
- [ ] 📊 **대시보드 확장**: 더 상세한 관리 기능

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

<div align=\"center\">

**🎯 세종학당 문화인턴 관리의 새로운 표준**

*Made with ❤️ for Sejong Institute*

[![GitHub stars](https://img.shields.io/github/stars/faye8796/institute-dashboard.svg?style=social&label=Star)](https://github.com/faye8796/institute-dashboard)
[![GitHub forks](https://img.shields.io/github/forks/faye8796/institute-dashboard.svg?style=social&label=Fork)](https://github.com/faye8796/institute-dashboard/fork)

</div>