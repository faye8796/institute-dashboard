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

            // institute_managers 테이블에서 조회
            const { data, error } = await this.supabase
                .from('institute_managers')
                .select('*')
                .eq('institute_name', instituteName)
                .eq('mail', managerEmail)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.warn('등록되지 않은 담당자 정보입니다:', instituteName, managerEmail);
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('담당자 인증 오류:', error);
            return null;
        }
    },

    // 대시보드 데이터 로드
    async loadDashboardData() {
        try {
            // 배치된 인턴 목록 조회
            await this.loadAssignedInterns();
            
            // 재단 담당자 정보 설정
            this.setFoundationManager();
            
        } catch (error) {
            console.error('대시보드 데이터 로드 오류:', error);
            throw error;
        }
    },

    // 🆕 institute_dashboard_interns 테이블에서 직접 조회
    async loadAssignedInterns() {
        try {
            console.log('🔍 배치된 인턴 조회 시작:', this.currentManager.institute_name);
            
            // institute_dashboard_interns 테이블에서 직접 조회
            const { data: interns, error } = await this.supabase
                .from('institute_dashboard_interns')
                .select('*')
                .eq('institute_name', this.currentManager.institute_name)
                .eq('is_current_assignment', true)
                .order('student_name');

            if (error) {
                console.error('❌ 인턴 데이터 조회 오류:', error);
                throw error;
            }

            if (!interns || interns.length === 0) {
                console.log('👥 해당 학당에 배치된 학생이 없습니다.');
                this.assignedInterns = [];
                return;
            }

            console.log(`✅ 배치된 인턴 목록 로드 완료: ${interns.length}명`);
            
            // 데이터 매핑 (컬럼명 변환)
            this.assignedInterns = interns.map(intern => ({
                id: intern.user_id,
                name: intern.student_name,
                email: intern.student_email,
                gender: intern.gender || '미정',
                major: intern.major || [],
                teaching_fields: intern.teaching_fields || [],
                weekly_working_hours: intern.weekly_working_hours,
                application_document_url: intern.application_document_url,
                application_original_name: intern.application_original_name,
                application_document_name: intern.application_document_name
            }));

            // 디버그: 첫 번째 학생 정보 확인
            if (this.assignedInterns.length > 0) {
                const firstStudent = this.assignedInterns[0];
                console.log('🧑‍🎓 첫 번째 학생 정보:', {
                    name: firstStudent.name,
                    gender: firstStudent.gender,
                    major: firstStudent.major,
                    teaching_fields: firstStudent.teaching_fields,
                    weekly_working_hours: firstStudent.weekly_working_hours
                });
            }
            
        } catch (error) {
            console.error('❌ 인턴 목록 조회 오류:', error);
            this.assignedInterns = [];
        }
    },

    // 재단 담당자 정보 설정
    setFoundationManager() {
        // institute_managers에서 가져온 재단 담당자 정보 사용
        if (this.currentManager.foundation_manager_name) {
            this.foundationManager = {
                name: this.currentManager.foundation_manager_name,
                email: this.currentManager.foundation_manager_email || 'manager@ksif.or.kr',
                phone: '02-2669-2700',
                role: '해외 문화인턴 담당'
            };
        } else {
            // 기본값
            this.foundationManager = {
                name: '미정',
                phone: '02-2669-2700',
                email: 'manager@ksif.or.kr',
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

        // 테이블 구조: 성명, 성별, 전공, 강의 가능 분야, 주당 근무시간, 지원서
        const tableHTML = `
            <div class="interns-table">
                <table>
                    <thead>
                        <tr>
                            <th>성명</th>
                            <th>성별</th>
                            <th>전공</th>
                            <th>강의 가능 분야</th>
                            <th>주당 근무시간</th>
                            <th>지원서</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.assignedInterns.map(intern => `
                            <tr>
                                <td>
                                    <div class="intern-name">
                                        <strong>${intern.name || '-'}</strong>
                                    </div>
                                </td>
                                <td>
                                    <div class="intern-gender">
                                        ${intern.gender || '미정'}
                                    </div>
                                </td>
                                <td>
                                    <div class="intern-major">
                                        ${this.formatArrayToString(intern.major) || '미정'}
                                    </div>
                                </td>
                                <td>
                                    <div class="intern-teaching-fields">
                                        ${this.formatArrayToString(intern.teaching_fields) || '미정'}
                                    </div>
                                </td>
                                <td>
                                    <div class="intern-working-hours">
                                        ${this.formatWorkingHours(intern.weekly_working_hours)}
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

    // 배열을 문자열로 변환하는 유틸리티 함수
    formatArrayToString(array) {
        if (!array || !Array.isArray(array) || array.length === 0) {
            return '';
        }
        
        return array.join(', ');
    },

    // 주당 근무시간 포맷팅 함수
    formatWorkingHours(hours) {
        if (hours === null || hours === undefined) {
            return '<span class="no-data">미정</span>';
        }
        
        if (typeof hours === 'number' && hours > 0) {
            return `<span class="working-hours">${hours}시간/주</span>`;
        }
        
        return '<span class="no-data">미정</span>';
    },

    // 다운로드 모달 열기
    openDownloadModal(internId) {
        const intern = this.assignedInterns.find(i => i.id === internId);
        if (!intern || !intern.application_document_url) {
            alert('지원서류를 찾을 수 없습니다.');
            return;
        }

        // 원본 파일명 우선 사용
        const originalFileName = intern.application_original_name || 
                                intern.application_document_name || 
                                `${intern.name}_지원서.pdf`;

        this.currentDocument = {
            internId: internId,
            internName: intern.name,
            fileName: originalFileName,
            url: intern.application_document_url
        };

        // 모달 정보 업데이트
        const studentNameEl = document.getElementById('modalStudentName');
        const fileNameEl = document.getElementById('modalFileName');

        if (studentNameEl) {
            studentNameEl.textContent = intern.name || '-';
        }

        if (fileNameEl) {
            fileNameEl.textContent = originalFileName;
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

    // 개별 문서 다운로드 (강제 다운로드 시스템)
    async downloadDocument(url, fileName) {
        try {
            console.log('📥 파일 다운로드 시작:', { url, fileName });
            
            // 로딩 표시
            this.showLoading(true);
            
            // fetch로 파일 가져오기
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
            
            // blob으로 변환
            const blob = await response.blob();
            console.log('✅ Blob 생성 완료:', blob.size, 'bytes');
            
            // blob URL 생성
            const blobUrl = window.URL.createObjectURL(blob);
            
            // 강제 다운로드 링크 생성
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            
            // DOM에 추가하고 클릭
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // 정리
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(blobUrl);
            
            console.log('✅ 파일 다운로드 완료:', fileName);
            
        } catch (error) {
            console.error('❌ 다운로드 오류:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        } finally {
            // 로딩 숨김
            this.showLoading(false);
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
