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

    // 🆕 42개 학당 매핑 테이블 (InstituteMatcher 불가용 시 사용)
    instituteMapping: {
        // 🇻🇳 베트남 지역 (5개)
        '다낭': '베트남 다낭 세종학당',
        '후에': '베트남 후에 세종학당',
        '빈즈엉': '베트남 빈즈엉 세종학당',
        '껀터1': '베트남 껀터1 세종학당',
        '달랏': '베트남 달랏 세종학당',
        
        // 🇺🇿 우즈베키스탄 지역 (4개)
        '부하라': '우즈베키스탄 부하라 세종학당',
        '나망간': '우즈베키스탄 나망간 세종학당',
        '안디잔': '우즈베키스탄 안디잔 세종학당',
        '지자흐': '우즈베키스탄 지자흐 세종학당',
        
        // 🇰🇬 키르기스스탄 지역 (2개)
        '비슈케크': '키르기스스탄 비슈케크 세종학당',
        '소쿨루크': '키르기스스탄 소쿨루크 세종학당',
        
        // 🇱🇹 리투아니아 지역 (2개)
        '빌뉴스': '리투아니아 빌뉴스 세종학당',
        '카우나스': '리투아니아 카우나스 세종학당',
        
        // 🇮🇩 인도네시아 지역 (3개)
        '반둥1': '인도네시아 반둥1 세종학당',
        '수라바야': '인도네시아 수라바야 세종학당',
        '탕으랑': '인도네시아 탕으랑 세종학당',
        
        // 🇮🇳 인도 지역 (2개)
        '벵갈루루': '인도 벵갈루루 세종학당',
        '주인도한국문화원': '인도 주인도한국문화원 세종학당',
        
        // 🇨🇳 중국 지역 (2개)
        '청두1': '중국 청두1 세종학당',
        '타이중': '중국 타이중 세종학당',
        
        // 🇰🇭 캄보디아 지역 (2개)
        '시엠레아프': '캄보디아 시엠레아프 세종학당',
        '프놈펜1': '캄보디아 프놈펜1 세종학당',
        
        // 🇸🇦 사우디아라비아 지역 (1개)
        '리야드': '사우디아라비아 리야드 세종학당',
        
        // 🇰🇪 케냐 지역 (1개)
        '나이로비': '케냐 나이로비 세종학당',
        
        // 🇨🇿 체코 지역 (1개)
        '올로모우츠': '체코 올로모우츠 세종학당',
        
        // 🇨🇦 캐나다 지역 (1개)
        '몬트리올': '캐나다 몬트리올 세종학당',
        
        // 🇺🇸 미국 지역 (1개)
        '샌안토니오': '미국 샌안토니오 세종학당',
        
        // 🇬🇧 영국 지역 (1개)
        '런던': '영국 런던 세종학당',
        
        // 🇵🇱 폴란드 지역 (1개)
        '카토비체': '폴란드 카토비체 세종학당',
        
        // 🇹🇭 태국 지역 (1개)
        '마하사라캄': '태국 마하사라캄 세종학당',
        
        // 🇱🇦 라오스 지역 (1개)
        '폰사반': '라오스 폰사반 세종학당',
        
        // 🇷🇴 루마니아 지역 (1개)
        '부쿠레슈티': '루마니아 부쿠레슈티 세종학당',
        
        // 🇸🇪 스웨덴 지역 (1개)
        '예테보리': '스웨덴 예테보리 세종학당',
        
        // 🇸🇿 에스와티니 지역 (1개)
        '음바바네': '에스와티니 음바바네 세종학당',
        
        // 🇪🇪 에스토니아 지역 (1개)
        '탈린': '에스토니아 탈린 세종학당',
        
        // 🇺🇾 우루과이 지역 (1개)
        '몬테비데오': '우루과이 몬테비데오 세종학당',
        
        // 🇭🇷 크로아티아 지역 (1개)
        '리예카': '크로아티아 리예카 세종학당',
        
        // 🇭🇺 헝가리 지역 (1개)
        '부다페스트': '헝가리 부다페스트 세종학당',
        
        // 🇨🇴 콜롬비아 지역 (1개)
        '보고타': '콜롬비아 보고타 세종학당',
        
        // 🏢 한국문화원 (3개)
        '주독일한국문화원': '독일 주독일한국문화원 세종학당',
        '주이집트한국문화원': '이집트 주이집트한국문화원 세종학당',
        '주필리핀한국문화원': '필리핀 주필리핀한국문화원 세종학당',
        
        // 🧪 테스트용
        '테스트학당': '테스트학당'
    },

    // 🆕 매핑 변환 유틸리티 함수
    getFullInstituteName(shortName) {
        const fullName = this.instituteMapping[shortName];
        if (fullName) {
            console.log(`✅ 직접 매핑 성공: "${shortName}" → "${fullName}"`);
            return fullName;
        }
        
        console.warn(`⚠️ 직접 매핑 실패: "${shortName}"`);
        return shortName; // fallback으로 원본 반환
    },

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
                    // 매핑된 학당명으로 확인
                    const fullInstituteName = this.getFullInstituteName(instituteName);
                    const { data: instituteCheck, error: checkError } = await this.supabase
                        .from('user_profiles')
                        .select('sejong_institute')
                        .eq('sejong_institute', fullInstituteName)
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
            // 배치된 인턴 목록 조회 (새로운 매칭 시스템 사용)
            await this.loadAssignedInterns();
            
            // 재단 담당자 정보 설정 (기본값)
            this.setDefaultFoundationManager();
            
        } catch (error) {
            console.error('대시보드 데이터 로드 오류:', error);
            throw error;
        }
    },

    // 🔧 배치된 인턴 목록 조회 (수동 JOIN 방식으로 완전 수정)
    async loadAssignedInterns() {
        try {
            console.log('🔍 배치된 인턴 조회 시작:', this.currentManager.institute_name);
            
            // 💡 InstituteMatcher 모듈 사용 가능한 경우 우선 사용
            if (typeof InstituteMatcher !== 'undefined') {
                console.log('✅ InstituteMatcher 모듈 사용 - 추가 정보 포함');
                this.assignedInterns = await InstituteMatcher.getStudentsWithAdditionalInfo(
                    this.supabase,
                    this.currentManager.institute_name
                );
            } else {
                console.warn('⚠️ InstituteMatcher 모듈 없음 - 수동 JOIN 방식 사용');
                
                // 🆕 1차: 직접 매핑 변환 시도
                const fullInstituteName = this.getFullInstituteName(this.currentManager.institute_name);
                
                await this.loadInternsManualJoin(fullInstituteName);

                // 🆕 2차: 매핑 결과가 없으면 부분 문자열 검색 시도
                if (this.assignedInterns.length === 0) {
                    console.log(`📋 매핑 결과 없음. 부분 검색 시도: "${this.currentManager.institute_name}"`);
                    await this.loadInternsManualJoinPartial(this.currentManager.institute_name);
                }
            }
            
            console.log(`✅ 배치된 인턴 목록 로드 완료: ${this.assignedInterns.length}명`);
            
            // 🔍 디버그: 첫 번째 학생 정보 확인
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

    // 🆕 수동 JOIN 방식으로 인턴 정보 조회 (매핑된 학당명 사용)
    async loadInternsManualJoin(fullInstituteName) {
        console.log(`🎯 수동 JOIN: 매핑된 학당명으로 조회 - "${fullInstituteName}"`);

        // 1단계: user_profiles에서 학생들 조회
        const { data: students, error: studentsError } = await this.supabase
            .from('user_profiles')
            .select('*')
            .eq('sejong_institute', fullInstituteName)
            .eq('user_type', 'student');

        if (studentsError) {
            console.error('❌ 학생 데이터 조회 오류:', studentsError);
            throw studentsError;
        }

        if (!students || students.length === 0) {
            console.log('👥 해당 학당에 배치된 학생이 없습니다.');
            this.assignedInterns = [];
            return;
        }

        console.log(`👥 학생 ${students.length}명 조회됨`);

        // 2단계: student_additional_info에서 추가 정보 조회 (주당 근무시간 포함)
        const studentIds = students.map(s => s.id);
        const { data: additionalInfos, error: additionalError } = await this.supabase
            .from('student_additional_info')
            .select('*')
            .in('user_id', studentIds);

        if (additionalError) {
            console.error('❌ 학생 추가 정보 조회 오류:', additionalError);
            // 추가 정보 조회 실패 시에도 기본 정보는 표시
        }

        console.log(`📋 추가 정보 ${additionalInfos?.length || 0}개 조회됨`);

        // 3단계: 데이터 결합 (주당 근무시간 포함)
        this.assignedInterns = students.map(student => {
            const additionalInfo = additionalInfos?.find(info => info.user_id === student.id);
            
            return {
                ...student,
                gender: additionalInfo?.gender || '미정',
                major: additionalInfo?.major || [],
                teaching_fields: additionalInfo?.teaching_fields || [],
                weekly_working_hours: additionalInfo?.weekly_working_hours || null  // 🆕 주당 근무시간 추가
            };
        });

        console.log(`✅ 수동 JOIN 완료: ${this.assignedInterns.length}명의 인턴 정보 결합됨`);
    },

    // 🆕 수동 JOIN 방식으로 인턴 정보 조회 (부분 검색)
    async loadInternsManualJoinPartial(instituteName) {
        console.log(`🔍 수동 JOIN: 부분 검색으로 조회 - "${instituteName}"`);

        // 1단계: user_profiles에서 학생들 조회 (부분 검색)
        const { data: students, error: studentsError } = await this.supabase
            .from('user_profiles')
            .select('*')
            .ilike('sejong_institute', `%${instituteName}%`)
            .eq('user_type', 'student');

        if (studentsError) {
            console.error('❌ 학생 데이터 부분 검색 오류:', studentsError);
            throw studentsError;
        }

        if (!students || students.length === 0) {
            console.log('👥 부분 검색에서도 해당 학당에 배치된 학생이 없습니다.');
            this.assignedInterns = [];
            return;
        }

        console.log(`👥 부분 검색으로 학생 ${students.length}명 조회됨`);

        // 2단계: student_additional_info에서 추가 정보 조회 (주당 근무시간 포함)
        const studentIds = students.map(s => s.id);
        const { data: additionalInfos, error: additionalError } = await this.supabase
            .from('student_additional_info')
            .select('*')
            .in('user_id', studentIds);

        if (additionalError) {
            console.error('❌ 학생 추가 정보 조회 오류:', additionalError);
            // 추가 정보 조회 실패 시에도 기본 정보는 표시
        }

        console.log(`📋 부분 검색으로 추가 정보 ${additionalInfos?.length || 0}개 조회됨`);

        // 3단계: 데이터 결합 (주당 근무시간 포함)
        this.assignedInterns = students.map(student => {
            const additionalInfo = additionalInfos?.find(info => info.user_id === student.id);
            
            return {
                ...student,
                gender: additionalInfo?.gender || '미정',
                major: additionalInfo?.major || [],
                teaching_fields: additionalInfo?.teaching_fields || [],
                weekly_working_hours: additionalInfo?.weekly_working_hours || null  // 🆕 주당 근무시간 추가
            };
        });

        console.log(`✅ 부분 검색 수동 JOIN 완료: ${this.assignedInterns.length}명의 인턴 정보 결합됨`);
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

    // 🆕 인턴 목록 테이블 업데이트 (주당 근무시간 컬럼 추가)
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

        // 🆕 새로운 테이블 구조: 성명, 성별, 전공, 강의 가능 분야, 주당 근무시간, 지원서
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

    // 🆕 배열을 문자열로 변환하는 유틸리티 함수
    formatArrayToString(array) {
        if (!array || !Array.isArray(array) || array.length === 0) {
            return '';
        }
        
        // 배열의 각 요소를 쉼표로 구분하여 연결
        return array.join(', ');
    },

    // 🆕 주당 근무시간 포맷팅 함수
    formatWorkingHours(hours) {
        if (hours === null || hours === undefined) {
            return '<span class="no-data">미정</span>';
        }
        
        if (typeof hours === 'number' && hours > 0) {
            return `<span class="working-hours">${hours}시간/주</span>`;
        }
        
        return '<span class="no-data">미정</span>';
    },

    // 다운로드 모달 열기 (🔄 application_original_name 사용)
    openDownloadModal(internId) {
        const intern = this.assignedInterns.find(i => i.id === internId);
        if (!intern || !intern.application_document_url) {
            alert('지원서류를 찾을 수 없습니다.');
            return;
        }

        // 📁 원본 파일명 우선 사용, 없으면 fallback
        const originalFileName = intern.application_original_name || 
                                intern.application_document_name || 
                                `${intern.name}_지원서.pdf`;

        this.currentDocument = {
            internId: internId,
            internName: intern.name,
            fileName: originalFileName,  // 🎯 원본 파일명 사용
            url: intern.application_document_url
        };

        console.log('📁 다운로드 파일 정보:', {
            original: intern.application_original_name,
            document: intern.application_document_name,
            final: originalFileName
        });

        // 모달 정보 업데이트
        const studentNameEl = document.getElementById('modalStudentName');
        const fileNameEl = document.getElementById('modalFileName');

        if (studentNameEl) {
            studentNameEl.textContent = intern.name || '-';
        }

        if (fileNameEl) {
            fileNameEl.textContent = originalFileName;  // 🎯 원본 파일명 표시
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

    // 🚀 개별 문서 다운로드 (강제 다운로드 시스템)
    async downloadDocument(url, fileName) {
        try {
            console.log('📥 파일 다운로드 시작:', { url, fileName });
            
            // 실제 환경에서는 실제 URL로 다운로드
            // 현재는 테스트용으로 알림 표시
            if (url.includes('example.com')) {
                alert(`실제 환경에서는 "${fileName}" 파일이 다운로드됩니다.\n\n테스트 URL: ${url}`);
                console.log('다운로드 시뮬레이션:', { url, fileName });
                return;
            }

            // 🔥 강제 다운로드 시스템 (Blob 방식)
            try {
                // 로딩 표시
                this.showLoading(true);
                
                console.log('🔄 파일 가져오는 중...');
                
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
                downloadLink.download = fileName;  // 🎯 원본 파일명으로 다운로드
                downloadLink.style.display = 'none';
                
                // DOM에 추가하고 클릭
                document.body.appendChild(downloadLink);
                downloadLink.click();
                
                // 정리
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(blobUrl);
                
                console.log('✅ 파일 다운로드 완료:', fileName);
                
            } catch (fetchError) {
                console.warn('⚠️ Blob 다운로드 실패, 기본 방식으로 시도:', fetchError);
                
                // fallback: 기본 방식 (target 없이)
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                // ❌ target='_blank' 제거 (새 탭에서 열리지 않도록)
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('✅ 기본 방식 다운로드 시도 완료:', fileName);
            }
            
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
                mappingTableCount: Object.keys(this.instituteMapping).length,
                config: CONFIG
            });
            
            // InstituteMatcher 디버그 정보도 출력
            if (typeof InstituteMatcher !== 'undefined') {
                InstituteMatcher.debug();
            } else {
                console.log('🗺️ 자체 매핑 테이블 사용 중:', Object.keys(this.instituteMapping).length, '개 학당');
            }
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
