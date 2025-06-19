// 세종학당 담당자 대시보드 설정
const CONFIG = {
    // Supabase 설정 (기존 시스템과 동일)
    SUPABASE: {
        URL: 'https://aazvopacnbbkvusihqva.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhenZvcGFjbmJia3Z1c2locXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTQyMjQsImV4cCI6MjA2NTM3MDIyNH0.0NXI_tohwFCOl3xY4b1jIlxQR_zGTS9tWDM2OFxTq4s'
    },
    
    // 애플리케이션 설정
    APP: {
        NAME: '세종학당 담당자 대시보드',
        VERSION: '1.0.0'
    },
    
    // 개발 환경 설정
    DEV: {
        DEBUG: true,
        ENABLE_CONSOLE_LOGS: true
    }
};

// 전역 접근을 위해 window 객체에 추가
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// 모듈 내보내기 (Node.js 환경용)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
}