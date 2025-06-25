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

    // 현재 다운로드 대상 문서 정보
    currentDocument: null,

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
        const inputs = ['instituteName', 'managerEmail'];
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

        // 모달 관련 이벤트
        this.setupModalEvents();
    },

    // 모달 이벤트 설정
    setupModalEvents() {
        const modal = document.getElementById('documentModal');
        const closeBtn = document.getElementById('closeModal');
        const confirmBtn = document.getElementById('confirmDownload');
        const cancelBtn = document.getElementById('cancelDownload');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmDownload());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // 모달 외부 클릭 시 닫기
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    },

    // 로그인 처리
    async handleLogin() {
        const instituteInput = document.getElementById('instituteName');
        const managerInput = document.getElementById('managerEmail');
        const loginBtn = document.getElementById('managerLoginBtn');

        if (!instituteInput || !managerInput || !loginBtn) {
            console.error('필수 요소를 찾을 수 없습니다.');
            return;
        }

        const instituteName = instituteInput.value.trim();
        const managerEmail = managerInput.value.trim();

        // 입력 검증
        if (!instituteName) {
            alert('학당명을 입력해주세요.');
            instituteInput.focus();
            return;
        }

        if (!managerEmail) {
            alert('담당자 이메일을 입력해주세요.');
            managerInput.focus();
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(managerEmail)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            managerInput.focus();
            return;
        }

        // 로딩 상태 표시
        this.showLoading(true);
        loginBtn.disabled = true;

        try {
            // 담당자 인증 (2단계 인증: 학당명 + 담당자 이메일)
            const manager = await this.authenticateManager(instituteName, managerEmail);
            
            if (manager) {
                this.currentManager = manager;
                
                // 대시보드 데이터 로드
                await this.loadDashboardData();
                
                // 대시보드 표시
                this.showDashboard();
            } else {
                this.showError('입력하신 정보가 올바르지 않습니다.<br>학당명과 담당자 이메일을 다시 확인해주세요.');
            }
        } catch (error) {
            console.error('로그인 처리 중 오류:', error);
            this.showError('로그인 처리 중 오류가 발생했습니다.<br>잠시 후 다시 시도해주세요.');
        } finally {
            this.showLoading(false);
            loginBtn.disabled = false;
        }
    },

    // 담당자 인증 (2단계 인증: 학당명 + 담당자 이메일)
    async authenticateManager(instituteName, managerEmail) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
            }

            // 1. institute_managers 테이블에서 조회 시도 (컬럼명: institute_name, mail)
            const { data, error } = await this.supabase
                .from('institute_managers')
                .select('*')
                .eq('institute_name', instituteName)
                .eq('mail', managerEmail)  // 실제 컬럼명 'mail' 사용
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // 데이터가 없는 경우, user_profiles에서 해당 학당이 있는지 확인
                    const { data: instituteCheck, error: checkError } = await this.supabase
                        .from('user_profiles')
                        .select('sejong_institute')
                        .eq('sejong_institute', instituteName)
                        .limit(1);

                    if (checkError || !instituteCheck || instituteCheck.length === 0) {
                        console.warn('존재하지 않는 학당입니다:', instituteName);
                        return null;
                    }

                    // 학당은 존재하지만 등록된 담당자가 없는 경우 임시 인증 허용
                    console.info('학당은 존재하지만 등록된 담당자가 없습니다. 임시 인증을 허용합니다.');
                    return {
                        institute_name: instituteName,
                        mail: managerEmail,  // 'mail' 컬럼명 사용
                        manager_name: managerEmail.split('@')[0], // 이메일에서 이름 부분 추출
                        id: 'temp-' + Date.now()
                    };
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('담당자 인증 오류:', error);
            
            // 테이블이 존재하지 않는 경우 등의 시스템 오류 시 임시 인증
            if (error.message.includes('relation') || error.message.includes('does not exist')) {
                console.warn('시스템 오류로 인한 임시 인증을 사용합니다.');
                return {
                    institute_name: instituteName,
                    mail: managerEmail,  // 'mail' 컬럼명 사용
                    manager_name: managerEmail.split('@')[0], // 이메일에서 이름 부분 추출
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
            
            // 재단 담당자 정보 설정 (기본값)
            this.setDefaultFoundationManager();
            
        } catch (error) {
            console.error('대시보드 데이터 로드 오류:', error);
            throw error;
        }
    },

    // 배치된 인턴 목록 조회 (지원서류 정보 포함)
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

    // 재단 담당자 기본값 설정
    setDefaultFoundationManager() {
        this.foundationManager = {
            name: '미정',
            phone: '02-2669-2700',
            email: 'manager@sejong.or.kr',
            role: '해외 문화인턴 담당'
        };
    },

    // 대시보드 표시
    showDashboard() {
        // 헤더 정보 업데이트
        this.updateHeader();
        
        // 요약 카드 업데이트
        this.updateSummaryCards();
        
        // 인턴 목록 테이블 업데이트
        this.updateInternsTable();
        
        // 대시보드 페이지 표시
        this.showPage('dashboardPage');
        
        // 입력 필드 초기화
        this.clearLoginForm();
    },

    // 헤더 정보 업데이트
    updateHeader() {
        const instituteNameEl = document.getElementById('instituteNameDisplay');
        const managerEmailEl = document.getElementById('managerEmailDisplay');

        if (instituteNameEl) {
            instituteNameEl.textContent = this.currentManager.institute_name || '-';
        }

        if (managerEmailEl) {
            // mail 컬럼에서 데이터 가져오기
            managerEmailEl.textContent = this.currentManager.mail || '-';
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
            foundationManagerEl.textContent = this.foundationManager?.name || '미정';
        }
    },

    // 인턴 목록 테이블 업데이트
    updateInternsTable() {
        const internsTableEl = document.getElementById('internsTableContainer');
        
        if (!internsTableEl) return;

        if (this.assignedInterns.length === 0) {
            internsTableEl.innerHTML = `
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

        // 테이블 형태로 인턴 목록 생성
        const tableHTML = `
            <div class="interns-table">
                <table>
                    <thead>
                        <tr>
                            <th>성명</th>
                            <th>전공분야</th>
                            <th>지원서 정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.assignedInterns.map(intern => `
                            <tr>
                                <td>
                                    <div class="intern-name">
                                        <strong>${intern.name || '-'}</strong>
                                        <small>${this.formatDate(intern.birth_date) || '-'}</small>
                                    </div>
                                </td>
                                <td>
                                    <div class="intern-field">
                                        ${intern.field || '미정'}
                                    </div>
                                </td>
                                <td>
                                    <div class="document-actions">
                                        ${intern.application_document_url ? `
                                            <button class="download-btn primary" onclick="DashboardApp.openDownloadModal('${intern.id}')">
                                                <i data-lucide="download"></i>
                                                지원서 다운로드
                                            </button>
                                        ` : `
                                            <span class="no-document">
                                                <i data-lucide="file-x"></i>
                                                지원서 없음
                                            </span>
                                        `}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        internsTableEl.innerHTML = tableHTML;
        
        // 아이콘 재초기화
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // 다운로드 모달 열기
    openDownloadModal(internId) {
        const intern = this.assignedInterns.find(i => i.id === internId);
        if (!intern || !intern.application_document_url) {
            alert('지원서류를 찾을 수 없습니다.');
            return;
        }

        this.currentDocument = {
            internId: internId,
            internName: intern.name,
            fileName: intern.application_document_name || `${intern.name}_지원서.pdf`,
            url: intern.application_document_url
        };

        // 모달 정보 업데이트
        const studentNameEl = document.getElementById('modalStudentName');
        const fileNameEl = document.getElementById('modalFileName');

        if (studentNameEl) {
            studentNameEl.textContent = intern.name || '-';
        }

        if (fileNameEl) {
            fileNameEl.textContent = intern.application_document_name || `${intern.name}_지원서.pdf`;
        }

        // 모달 표시
        const modal = document.getElementById('documentModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('documentModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.currentDocument = null;
    },

    // 다운로드 확인
    confirmDownload() {
        if (!this.currentDocument) {
            alert('다운로드할 문서 정보가 없습니다.');
            return;
        }

        this.downloadDocument(this.currentDocument.url, this.currentDocument.fileName);
        this.closeModal();
    },

    // 개별 문서 다운로드
    downloadDocument(url, fileName) {
        try {
            // 실제 환경에서는 실제 URL로 다운로드
            // 현재는 테스트용으로 알림 표시
            if (url.includes('example.com')) {
                alert(`실제 환경에서는 "${fileName}" 파일이 다운로드됩니다.\n\n테스트 URL: ${url}`);
                console.log('다운로드 시뮬레이션:', { url, fileName });
            } else {
                // 실제 파일 다운로드
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('다운로드 오류:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        }
    },

    // 로그아웃 처리
    handleLogout() {
        this.currentManager = null;
        this.assignedInterns = [];
        this.foundationManager = null;
        this.currentDocument = null;
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
        this.currentDocument = null;
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
        const inputs = ['instituteName', 'managerEmail'];
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
                currentDocument: this.currentDocument,
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