/**
 * 세종학당 담당자 대시보드 - 학당 매칭 모듈
 * 
 * institute_managers 테이블의 간단한 학당명과 
 * user_profiles 테이블의 상세한 학당명을 매핑
 */

const InstituteMatcher = {
    
    /**
     * 학당명 매핑 테이블
     * key: institute_managers.institute_name (간단한 형태)
     * value: user_profiles.sejong_institute (상세한 형태)
     */
    instituteMapping: {
        // 아시아 지역
        '다낭': '베트남 다낭 세종학당',
        '후에': '베트남 후에 세종학당',
        '청두1': '중국 청두1 세종학당',
        '벵갈루루': '인도 벵갈루루 세종학당',
        '마하사라캄': '태국 마하사라캄 세종학당',
        '필리핀': '필리핀 주필리핀한국문화원 세종학당',
        
        // 유럽 지역
        '런던': '영국 런던 세종학당',
        '독일': '독일 주독일한국문화원 세종학당',
        '카토비체': '폴란드 카토비체 세종학당',
        
        // 아메리카 지역
        '샌안토니오': '미국 샌안토니오 세종학당',
        '몬트리올': '캐나다 몬트리올 세종학당',
        
        // 중앙아시아 지역
        '부하라': '우즈베키스탄 부하라 세종학당',
        
        // 테스트용
        '테스트학당': '테스트학당'
    },

    /**
     * 간단한 학당명 → 상세한 학당명 변환
     * @param {string} shortName - institute_managers에서 가져온 간단한 학당명
     * @returns {string} user_profiles에서 사용하는 상세한 학당명
     */
    getFullInstituteName(shortName) {
        const fullName = this.instituteMapping[shortName];
        
        if (fullName) {
            console.log(`✅ 학당 매핑 성공: "${shortName}" → "${fullName}"`);
            return fullName;
        }
        
        console.warn(`⚠️ 학당 매핑 실패: "${shortName}"을 찾을 수 없습니다.`);
        
        // 매핑이 없는 경우 원본 반환 (fallback)
        return shortName;
    },

    /**
     * 상세한 학당명 → 간단한 학당명 변환 (역변환)
     * @param {string} fullName - user_profiles에서 가져온 상세한 학당명
     * @returns {string} institute_managers에서 사용하는 간단한 학당명
     */
    getShortInstituteName(fullName) {
        // 역매핑 검색
        for (const [shortName, mappedFullName] of Object.entries(this.instituteMapping)) {
            if (mappedFullName === fullName) {
                return shortName;
            }
        }
        
        console.warn(`⚠️ 역 매핑 실패: "${fullName}"에 해당하는 간단한 학당명을 찾을 수 없습니다.`);
        return fullName;
    },

    /**
     * 학당별 배정된 학생 목록 조회
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록
     */
    async getAssignedStudents(supabaseClient, shortInstituteName) {
        try {
            // 1. 간단한 학당명을 상세한 학당명으로 변환
            const fullInstituteName = this.getFullInstituteName(shortInstituteName);
            
            console.log(`🔍 학생 조회 시작: "${shortInstituteName}" → "${fullInstituteName}"`);
            
            // 2. user_profiles에서 해당 학당의 학생들 조회
            const { data, error } = await supabaseClient
                .from('user_profiles')
                .select('*')
                .eq('sejong_institute', fullInstituteName)
                .eq('user_type', 'student')
                .order('name', { ascending: true }); // 이름순 정렬
            
            if (error) {
                console.error('❌ Supabase 조회 오류:', error);
                throw error;
            }
            
            const students = data || [];
            console.log(`✅ 학생 조회 완료: ${students.length}명 찾음`);
            
            // 3. 결과 반환
            return students;
            
        } catch (error) {
            console.error('❌ 학생 목록 조회 실패:', error);
            return [];
        }
    },

    /**
     * 🆕 학당별 배정된 학생 목록 조회 (추가 정보 포함)
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록 (성별, 전공, 강의 가능 분야 포함)
     */
    async getAssignedStudentsWithAdditionalInfo(supabaseClient, shortInstituteName) {
        try {
            // 1. 간단한 학당명을 상세한 학당명으로 변환
            const fullInstituteName = this.getFullInstituteName(shortInstituteName);
            
            console.log(`🔍 학생 조회 (추가 정보 포함) 시작: "${shortInstituteName}" → "${fullInstituteName}"`);
            
            // 2. user_profiles와 student_additional_info 조인 조회
            const { data, error } = await supabaseClient
                .from('user_profiles')
                .select(`
                    *,
                    student_additional_info(
                        gender,
                        major,
                        teaching_fields
                    )
                `)
                .eq('sejong_institute', fullInstituteName)
                .eq('user_type', 'student')
                .order('name', { ascending: true }); // 이름순 정렬
            
            if (error) {
                console.error('❌ Supabase 조회 오류 (추가 정보 포함):', error);
                throw error;
            }
            
            // 3. 데이터 구조 정규화
            const students = (data || []).map(student => ({
                ...student,
                gender: student.student_additional_info?.[0]?.gender || '미정',
                major: student.student_additional_info?.[0]?.major || [],
                teaching_fields: student.student_additional_info?.[0]?.teaching_fields || []
            }));
            
            console.log(`✅ 학생 조회 (추가 정보 포함) 완료: ${students.length}명 찾음`);
            
            return students;
            
        } catch (error) {
            console.error('❌ 학생 목록 조회 실패 (추가 정보 포함):', error);
            return [];
        }
    },

    /**
     * 부분 문자열 검색으로 학당 매칭 (fallback 방식)
     * 매핑 테이블에 없는 경우 부분 문자열로 검색
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록
     */
    async getAssignedStudentsByPartialMatch(supabaseClient, shortInstituteName) {
        try {
            console.log(`🔍 부분 문자열 검색: "${shortInstituteName}"`);
            
            // ilike를 사용한 부분 문자열 검색
            const { data, error } = await supabaseClient
                .from('user_profiles')
                .select('*')
                .ilike('sejong_institute', `%${shortInstituteName}%`)
                .eq('user_type', 'student')
                .order('name', { ascending: true });
            
            if (error) {
                console.error('❌ 부분 검색 오류:', error);
                throw error;
            }
            
            const students = data || [];
            console.log(`✅ 부분 검색 완료: ${students.length}명 찾음`);
            
            return students;
            
        } catch (error) {
            console.error('❌ 부분 검색 실패:', error);
            return [];
        }
    },

    /**
     * 🆕 부분 문자열 검색으로 학당 매칭 (추가 정보 포함)
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록 (성별, 전공, 강의 가능 분야 포함)
     */
    async getAssignedStudentsByPartialMatchWithAdditionalInfo(supabaseClient, shortInstituteName) {
        try {
            console.log(`🔍 부분 문자열 검색 (추가 정보 포함): "${shortInstituteName}"`);
            
            // ilike를 사용한 부분 문자열 검색 + 조인
            const { data, error } = await supabaseClient
                .from('user_profiles')
                .select(`
                    *,
                    student_additional_info(
                        gender,
                        major,
                        teaching_fields
                    )
                `)
                .ilike('sejong_institute', `%${shortInstituteName}%`)
                .eq('user_type', 'student')
                .order('name', { ascending: true });
            
            if (error) {
                console.error('❌ 부분 검색 오류 (추가 정보 포함):', error);
                throw error;
            }
            
            // 데이터 구조 정규화
            const students = (data || []).map(student => ({
                ...student,
                gender: student.student_additional_info?.[0]?.gender || '미정',
                major: student.student_additional_info?.[0]?.major || [],
                teaching_fields: student.student_additional_info?.[0]?.teaching_fields || []
            }));
            
            console.log(`✅ 부분 검색 (추가 정보 포함) 완료: ${students.length}명 찾음`);
            
            return students;
            
        } catch (error) {
            console.error('❌ 부분 검색 실패 (추가 정보 포함):', error);
            return [];
        }
    },

    /**
     * 통합 학생 조회 함수 (매핑 + fallback)
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록
     */
    async getStudentsWithFallback(supabaseClient, shortInstituteName) {
        try {
            // 1차: 매핑 테이블 사용
            let students = await this.getAssignedStudents(supabaseClient, shortInstituteName);
            
            // 2차: 결과가 없으면 부분 문자열 검색
            if (students.length === 0) {
                console.log(`📋 매핑 결과 없음. 부분 검색 시도...`);
                students = await this.getAssignedStudentsByPartialMatch(supabaseClient, shortInstituteName);
            }
            
            console.log(`🎯 최종 결과: ${students.length}명의 학생 찾음`);
            return students;
            
        } catch (error) {
            console.error('❌ 통합 조회 실패:', error);
            return [];
        }
    },

    /**
     * 🆕 통합 학생 조회 함수 (추가 정보 포함, 매핑 + fallback)
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록 (성별, 전공, 강의 가능 분야 포함)
     */
    async getStudentsWithAdditionalInfo(supabaseClient, shortInstituteName) {
        try {
            // 1차: 매핑 테이블 사용 (추가 정보 포함)
            let students = await this.getAssignedStudentsWithAdditionalInfo(supabaseClient, shortInstituteName);
            
            // 2차: 결과가 없으면 부분 문자열 검색 (추가 정보 포함)
            if (students.length === 0) {
                console.log(`📋 매핑 결과 없음. 부분 검색 시도... (추가 정보 포함)`);
                students = await this.getAssignedStudentsByPartialMatchWithAdditionalInfo(supabaseClient, shortInstituteName);
            }
            
            console.log(`🎯 최종 결과 (추가 정보 포함): ${students.length}명의 학생 찾음`);
            return students;
            
        } catch (error) {
            console.error('❌ 통합 조회 실패 (추가 정보 포함):', error);
            return [];
        }
    },

    /**
     * 매핑 테이블에 새로운 학당 추가
     * @param {string} shortName - 간단한 학당명
     * @param {string} fullName - 상세한 학당명
     */
    addInstituteMapping(shortName, fullName) {
        this.instituteMapping[shortName] = fullName;
        console.log(`✅ 새로운 학당 매핑 추가: "${shortName}" → "${fullName}"`);
    },

    /**
     * 현재 등록된 모든 학당 매핑 조회
     * @returns {object} 전체 매핑 테이블
     */
    getAllMappings() {
        return { ...this.instituteMapping };
    },

    /**
     * 디버그 정보 출력
     */
    debug() {
        console.log('🔍 InstituteMatcher Debug Info:');
        console.log('📋 등록된 학당 수:', Object.keys(this.instituteMapping).length);
        console.log('📋 전체 매핑:', this.instituteMapping);
    }
};

// 전역 객체로 노출 (개발 모드에서만)
if (typeof window !== 'undefined') {
    window.InstituteMatcher = InstituteMatcher;
    console.log('✅ InstituteMatcher 모듈 로드 완료');
}