// 세종학당 담당자 대시보드 메인 애플리케이션
const DashboardApp = {
    // Supabase 클라이언트
    supabase: null,
    
    // 현재 로그인한 담당자 정보
    currentManager: null,
    
    // 배치된 인턴 목록
    assignedInterns: [],
    
    // 재단 담당자 정보
    foundationManager: null,

    // 초기화
    async init() {
        console.log('🚀 Dashboard App 초기화 중...');
        
        // Supabase 클라이언트 초기화
        await this.initSupabase();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 초기 페이지 설정
        this.showPage('loginPage');
        
        console.log('✅ Dashboard App 초기화 완료');
    },

    // Supabase 클라이언트 초기화
    async initSupabase() {
        try {
            if (!window.supabase || !CONFIG.SUPABASE.URL || !CONFIG.SUPABASE.ANON_KEY) {
                throw new Error('Supabase 설정이 올바르지 않습니다.');
            }
            
            this.supabase = window.supabase.createClient(
                CONFIG.SUPABASE.URL,
                CONFIG.SUPABASE.ANON_KEY
            );
            
            console.log('✅ Supabase 클라이언트 초기화 완료');
        } catch (error) {
            console.error('❌ Supabase 초기화 실패:', error);
            this.showError('시스템 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    },

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 로그인 버튼
        const loginBtn = document.getElementById('managerLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }

        // Enter 키 이벤트
        const inputs = ['instituteName', 'managerName', 'authCode'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleLogin();
                });
            }
        });

        // 로그아웃 버튼
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // 다시 시도하기 버튼
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.goBack());
        }

        // 인쇄 버튼
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printPage());
        }
    },

    // 로그인 처리
    async handleLogin() {
        const instituteInput = document.getElementById('instituteName');
        const managerInput = document.getElementById('managerName');
        const authInput = document.getElementById('authCode');
        const loginBtn = document.getElementById('managerLoginBtn');

        if (!instituteInput || !managerInput || !authInput || !loginBtn) {
            console.error('필수 요소를 찾을 수 없습니다.');
            return;
        }

        const instituteName = instituteInput.value.trim();
        const managerName = managerInput.value.trim();
        const authCode = authInput.value.trim();

        // 입력 검증
        if (!instituteName) {
            alert('학당명을 입력해주세요.');
            instituteInput.focus();
            return;
        }

        if (!managerName) {
            alert('담당자 이름을 입력해주세요.');
            managerInput.focus();
            return;
        }

        if (!authCode) {
            alert('인증 코드를 입력해주세요.');
            authInput.focus();
            return;
        }

        // 로딩 상태 표시
        this.showLoading(true);
        loginBtn.disabled = true;

        try {
            // 담당자 인증
            const manager = await this.authenticateManager(instituteName, managerName, authCode);
            
            if (manager) {
                this.currentManager = manager;
                
                // 대시보드 데이터 로드
                await this.loadDashboardData();
                
                // 대시보드 표시
                this.showDashboard();
            } else {
                this.showError('입력하신 정보가 올바르지 않습니다.<br>학당명, 담당자 이름, 인증 코드를 다시 확인해주세요.');
            }
        } catch (error) {
            console.error('로그인 처리 중 오류:', error);
            this.showError('로그인 처리 중 오류가 발생했습니다.<br>잠시 후 다시 시도해주세요.');
        } finally {
            this.showLoading(false);
            loginBtn.disabled = false;
        }
    },

    // 담당자 인증
    async authenticateManager(instituteName, managerName, authCode) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
            }

            // 임시 인증 로직 (실제로는 institute_managers 테이블에서 조회)
            // 현재는 간단한 검증으로 구현
            const { data, error } = await this.supabase
                .from('institute_managers')
                .select('*')
                .eq('institute_name', instituteName)
                .eq('manager_name', managerName)
                .eq('auth_code', authCode)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // 데이터가 없는 경우 - 임시로 모든 입력을 허용
                    console.warn('institute_managers 테이블이 없습니다. 임시 인증을 사용합니다.');
                    return {
                        institute_name: instituteName,
                        manager_name: managerName,
                        id: 'temp-' + Date.now()
                    };
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('담당자 인증 오류:', error);
            // 개발 단계에서는 임시 인증 허용
            if (error.message.includes('relation "institute_managers" does not exist')) {
                console.warn('테이블이 존재하지 않습니다. 임시 인증을 사용합니다.');
                return {
                    institute_name: instituteName,
                    manager_name: managerName,
                    id: 'temp-' + Date.now()
                };
            }
            return null;
        }
    },

    // 대시보드 데이터 로드
    async loadDashboardData() {
        try {
            // 배치된 인턴 목록 조회
            await this.loadAssignedInterns();
            
            // 재단 담당자 정보 조회
            await this.loadFoundationManager();
            
        } catch (error) {
            console.error('대시보드 데이터 로드 오류:', error);
            throw error;
        }
    },

    // 배치된 인턴 목록 조회
    async loadAssignedInterns() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('sejong_institute', this.currentManager.institute_name)
                .eq('user_type', 'student');

            if (error) {
                throw error;
            }

            this.assignedInterns = data || [];
            console.log('배치된 인턴 목록:', this.assignedInterns);
        } catch (error) {
            console.error('인턴 목록 조회 오류:', error);
            this.assignedInterns = [];
        }
    },

    // 재단 담당자 정보 조회
    async loadFoundationManager() {
        try {
            const { data, error } = await this.supabase
                .from('foundation_managers')
                .select('*')
                .eq('institute_name', this.currentManager.institute_name)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // 데이터가 없는 경우 기본값 설정
                    this.foundationManager = {
                        name: '홍길동',
                        phone: '02-1234-5678',
                        email: 'manager@sejong.or.kr',
                        role: '해외 문화인턴 담당'
                    };
                    return;
                }
                throw error;
            }

            this.foundationManager = data;
        } catch (error) {
            console.error('재단 담당자 정보 조회 오류:', error);
            // 기본값 설정
            this.foundationManager = {
                name: '홍길동',
                phone: '02-1234-5678',
                email: 'manager@sejong.or.kr',
                role: '해외 문화인턴 담당'
            };
        }
    },

    // 대시보드 표시
    showDashboard() {
        // 헤더 정보 업데이트
        this.updateHeader();
        
        // 요약 카드 업데이트
        this.updateSummaryCards();
        
        // 재단 담당자 정보 업데이트
        this.updateFoundationInfo();
        
        // 인턴 목록 업데이트
        this.updateInternsList();
        
        // 대시보드 페이지 표시
        this.showPage('dashboardPage');
        
        // 입력 필드 초기화
        this.clearLoginForm();
    },

    // 헤더 정보 업데이트
    updateHeader() {
        const instituteNameEl = document.getElementById('instituteNameDisplay');
        const managerNameEl = document.getElementById('managerNameDisplay');

        if (instituteNameEl) {
            instituteNameEl.textContent = this.currentManager.institute_name || '-';
        }

        if (managerNameEl) {
            managerNameEl.textContent = this.currentManager.manager_name || '-';
        }
    },

    // 요약 카드 업데이트
    updateSummaryCards() {
        const totalInternsEl = document.getElementById('totalInterns');
        const foundationManagerEl = document.getElementById('foundationManager');

        if (totalInternsEl) {
            totalInternsEl.textContent = this.assignedInterns.length;
        }

        if (foundationManagerEl) {
            foundationManagerEl.textContent = this.foundationManager?.name || '-';
        }
    },

    // 재단 담당자 정보 업데이트
    updateFoundationInfo() {
        const elements = {
            foundationManagerName: this.foundationManager?.name || '-',
            foundationManagerPhone: this.foundationManager?.phone || '-',
            foundationManagerEmail: this.foundationManager?.email || '-',
            foundationManagerRole: this.foundationManager?.role || '-'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    },

    // 인턴 목록 업데이트
    updateInternsList() {
        const internsListEl = document.getElementById('internsList');
        
        if (!internsListEl) return;

        if (this.assignedInterns.length === 0) {
            internsListEl.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="users"></i>
                    <h3>배치된 인턴이 없습니다</h3>
                    <p>현재 이 학당에 배치된 문화인턴이 없습니다.</p>
                </div>
            `;
            // 아이콘 재초기화
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        const internsHTML = this.assignedInterns.map(intern => `
            <div class="intern-card">
                <div class="intern-header">
                    <div class="intern-name">${intern.name || '-'}</div>
                    <div class="intern-field">${intern.field || '전문분야'}</div>
                </div>
                <div class="intern-details">
                    <div class="detail-item">
                        <i data-lucide="calendar"></i>
                        <span>생년월일: ${this.formatDate(intern.birth_date) || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <i data-lucide="map-pin"></i>
                        <span>배치 학당: ${intern.sejong_institute || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <i data-lucide="book-open"></i>
                        <span>전문 분야: ${intern.field || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <i data-lucide="user-check"></i>
                        <span>상태: 배치 완료</span>
                    </div>
                </div>
            </div>
        `).join('');

        internsListEl.innerHTML = internsHTML;
        
        // 아이콘 재초기화
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // 로그아웃 처리
    handleLogout() {
        this.currentManager = null;
        this.assignedInterns = [];
        this.foundationManager = null;
        this.showPage('loginPage');
        
        // 첫 번째 입력 필드에 포커스
        setTimeout(() => {
            const instituteInput = document.getElementById('instituteName');
            if (instituteInput) {
                instituteInput.focus();
            }
        }, 100);
    },

    // 오류 페이지 표시
    showError(message) {
        const errorMessageEl = document.getElementById('errorMessage');
        if (errorMessageEl) {
            errorMessageEl.innerHTML = message;
        }
        
        this.showPage('errorPage');
        this.clearLoginForm();
    },

    // 페이지 전환
    showPage(pageId) {
        // 모든 페이지 숨기기
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 지정된 페이지 표시
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        console.log('페이지 전환:', pageId);
    },

    // 뒤로 가기
    goBack() {
        this.currentManager = null;
        this.assignedInterns = [];
        this.foundationManager = null;
        this.showPage('loginPage');
        
        // 첫 번째 입력 필드에 포커스
        setTimeout(() => {
            const instituteInput = document.getElementById('instituteName');
            if (instituteInput) {
                instituteInput.focus();
            }
        }, 100);
    },

    // 로그인 폼 초기화
    clearLoginForm() {
        const inputs = ['instituteName', 'managerName', 'authCode'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
    },

    // 로딩 표시/숨김
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('show');
            } else {
                loadingOverlay.classList.remove('show');
            }
        }
    },

    // 인쇄 기능
    printPage() {
        window.print();
    },

    // 유틸리티: 날짜 포맷팅
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // 디버그 정보 출력
    debug() {
        if (CONFIG.DEV.DEBUG) {
            console.log('🔍 Debug Info:', {
                currentManager: this.currentManager,
                assignedInterns: this.assignedInterns,
                foundationManager: this.foundationManager,
                supabaseConnected: !!this.supabase,
                config: CONFIG
            });
        }
    }
};

// DOM 로드 완료 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    DashboardApp.init();
    
    // 개발 모드에서 전역 접근 허용
    if (CONFIG.DEV.DEBUG) {
        window.DashboardApp = DashboardApp;
        console.log('💡 개발 모드: window.DashboardApp으로 접근 가능');
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    console.log('페이지 언로드');
});