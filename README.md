# 세종학당 담당자 대시보드

![세종학당](https://img.shields.io/badge/세종학당-담당자대시보드-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

세종학당 담당자가 배정된 문화인턴 정보와 재단 담당자 정보를 확인할 수 있는 대시보드입니다.

## 🚀 주요 기능

- **👤 간편 로그인**: 학당명과 담당자명만으로 간편 접속
- **📊 인턴 현황 대시보드**: 해당 학당에 배정된 문화인턴 목록과 통계
- **📄 지원서류 다운로드**: 인턴들이 제출한 지원서류 PDF 다운로드 ⭐ **NEW**
- **👥 재단 담당자 정보**: 세종학당재단 담당자 연락처 및 업무 정보
- **📱 반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **🖨️ 인쇄 기능**: 인턴 목록을 깔끔하게 인쇄 가능
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

📝 테스트용 학당명과 담당자명:
학당명: 테스트학당
담당자명: 테스트담당

학당명: 베트남 다낭 세종학당
담당자명: 김다낭
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
│ • PDF 다운로드 │    │                │    │ • 파일 저장     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 프로젝트 구조

```
institute-dashboard/
├── 📄 index.html              # 메인 애플리케이션
├── 📁 css/
│   └── main.css              # 스타일시트 (모달, 다운로드 UI 포함)
├── 📁 js/
│   ├── config.js             # 설정 파일
│   └── app.js                # 메인 애플리케이션 로직 (다운로드 기능 포함)
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
    phone, email, created_at
)

-- 재단 담당자 (연락처 정보)  
foundation_managers (
    id, institute_name, name, 
    phone, email, role
)

-- 문화인턴 (배정 정보 + 지원서류)
user_profiles (
    id, name, birth_date, sejong_institute,
    field, user_type, phone, email,
    application_document_url,          -- ⭐ NEW
    application_document_name,         -- ⭐ NEW  
    application_submitted_at           -- ⭐ NEW
)
```

## ⭐ 새로운 기능: 지원서류 다운로드

### 📄 지원서류 관리 기능
- **개별 다운로드**: 각 인턴의 지원서류를 개별적으로 다운로드
- **전체 다운로드**: 해당 학당 모든 인턴의 지원서류를 한번에 다운로드
- **다운로드 모달**: 사용자 친화적인 다운로드 확인 창
- **지원서류 통계**: 대시보드에서 지원서류 보유 현황 확인

### 🔍 지원서류 표시 방식
```
✅ 지원서류 있음: "📄 지원서류" 버튼 표시
❌ 지원서류 없음: "📄 지원서류 없음" 회색 표시
📊 통계 카드: 전체 지원서류 개수 표시
```

### 🎯 지원서류 다운로드 플로우
1. **인턴 카드**에서 "지원서류" 버튼 클릭
2. **다운로드 모달**에서 파일명과 학생 정보 확인
3. **"다운로드"** 버튼으로 실제 다운로드 실행
4. **전체 다운로드**는 우상단 버튼으로 일괄 다운로드

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

시스템에 등록된 테스트 계정들:

| 학당명 | 담당자명 | 지원서류 보유 인턴 | 비고 |
|--------|----------|-------------------|------|
| **테스트학당** | 테스트담당 | 이가짜 (1명) | 🧪 기본 테스트용 |
| **베트남 다낭 세종학당** | 김다낭 | 윤예원 (1명) | 아시아 지역 |
| **베트남 후에 세종학당** | 박후에 | 박소연 (1명) | 아시아 지역 |
| **영국 런던 세종학당** | 이런던 | 장진휘 (1명) | 유럽 지역 |
| **미국 샌안토니오 세종학당** | 정샌안 | 최지원 (1명) | 아메리카 지역 |
| **독일 주독일한국문화원 세종학당** | 김독일 | 송선호 (1명) | 유럽 지역 |
| **우즈베키스탄 부하라 세종학당** | 박부하라 | 김희준 (1명) | 중앙아시아 지역 |
| **인도 벵갈루루 세종학당** | 이벵갈루루 | 심지은, 김민준 (2명) | 남아시아 지역 |
| **중국 청두1 세종학당** | 정청두 | 이규서 (1명) | 동아시아 지역 |
| **폴란드 카토비체 세종학당** | 최폴란드 | 김서영 (1명) | 유럽 지역 |
| **캐나다 몬트리올 세종학당** | 김캐나다 | 이승호, 권승연 (2명) | 아메리카 지역 |
| **필리핀 주필리핀한국문화원 세종학당** | 박필리핀 | 정윤서 (1명) | 아시아 지역 |
| **태국 마하사라캄 세종학당** | 이태국 | 최가을 (1명) | 아시아 지역 |

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
- 📱 **모바일**: 320px ~ 767px
- 📟 **태블릿**: 768px ~ 1199px  
- 💻 **데스크톱**: 1200px+

## 🔒 보안 기능

- **🛡️ Row Level Security**: Supabase RLS로 데이터 접근 제어
- **🔐 간편 인증**: 학당명 + 담당자명 2단계 인증
- **🌐 HTTPS**: GitHub Pages 기본 HTTPS 지원
- **🚫 민감정보 보호**: 필요한 정보만 노출
- **📄 문서 보안**: 담당 학당 지원서류만 접근 가능

## 🚀 간편해진 접속 방법

### 이전 방식 (3단계 인증)
```
❌ 학당명 + 담당자명 + 인증코드 (번거로움)
```

### 현재 방식 (2단계 인증)
```
✅ 학당명 + 담당자명 (간편함)
```

**장점**:
- 별도 인증코드 관리 불필요
- 담당자들에게 코드 전달할 필요 없음  
- 기존 학당/담당자 정보만으로 즉시 접속
- 더 직관적이고 사용하기 편함

## 📈 향후 개발 계획

- [ ] 📊 **고급 통계**: 인턴 배정 현황 차트 및 분석
- [ ] 📧 **이메일 알림**: 배정 변경사항 자동 알림
- [ ] 📱 **PWA 지원**: 모바일 앱처럼 사용 가능
- [ ] 🔄 **배치 관리**: 인턴 재배정 기능
- [ ] 🌍 **다국어 지원**: 영어/중국어 버전
- [ ] 📊 **대시보드 확장**: 더 상세한 관리 기능
- [ ] ☁️ **클라우드 저장소**: Supabase Storage 연동으로 실제 PDF 파일 관리 ⭐ **개선 예정**
- [ ] 📥 **파일 업로드**: 담당자가 직접 지원서류 업로드 기능

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