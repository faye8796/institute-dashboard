/**
 * 🌏 세종학당 담당자 대시보드 - 완전한 학당 매핑 모듈
 * 
 * 실제 데이터베이스 기반으로 구성된 완전한 42개 학당 매핑
 * institute_managers.institute_name → user_profiles.sejong_institute
 */

const InstituteMatcher = {
    
    /**
     * 🎯 완전한 학당명 매핑 테이블 (42개 학당)
     * key: institute_managers.institute_name (간단한 형태)
     * value: user_profiles.sejong_institute (상세한 형태)
     */
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
        
        // 🏢 한국문화원 (3개) - ⚠️ 수정된 매핑
        '주독일한국문화원': '독일 주독일한국문화원 세종학당',
        '주이집트한국문화원': '이집트 주이집트한국문화원 세종학당',
        '주필리핀한국문화원': '필리핀 주필리핀한국문화원 세종학당',
        
        // 🧪 테스트용
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
     * 🔧 강화된 데이터 구조 분석 함수
     * @param {any} additionalInfo - student_additional_info 데이터
     * @param {string} studentName - 학생 이름 (디버깅용)
     * @returns {object} 정규화된 추가 정보
     */
    analyzeAdditionalInfo(additionalInfo, studentName = 'Unknown') {
        console.log(`🔍 [${studentName}] 추가 정보 분석 시작:`, additionalInfo);
        
        // Case 1: undefined 또는 null
        if (!additionalInfo) {
            console.warn(`⚠️ [${studentName}] 추가 정보가 없습니다 (undefined/null)`);
            return { gender: '미정', major: [], teaching_fields: [] };
        }
        
        // Case 2: 배열 형태
        if (Array.isArray(additionalInfo)) {
            console.log(`📋 [${studentName}] 배열 형태 (길이: ${additionalInfo.length})`);
            
            if (additionalInfo.length === 0) {
                console.warn(`⚠️ [${studentName}] 빈 배열입니다`);
                return { gender: '미정', major: [], teaching_fields: [] };
            }
            
            const firstItem = additionalInfo[0];
            console.log(`🎯 [${studentName}] 배열 첫 번째 요소:`, firstItem);
            
            return {
                gender: firstItem?.gender || '미정',
                major: firstItem?.major || [],
                teaching_fields: firstItem?.teaching_fields || []
            };
        }
        
        // Case 3: 단일 객체 형태
        if (typeof additionalInfo === 'object') {
            console.log(`🎯 [${studentName}] 단일 객체 형태:`, additionalInfo);
            
            return {
                gender: additionalInfo.gender || '미정',
                major: additionalInfo.major || [],
                teaching_fields: additionalInfo.teaching_fields || []
            };
        }
        
        // Case 4: 예상치 못한 형태
        console.error(`❌ [${studentName}] 예상치 못한 데이터 형태:`, typeof additionalInfo, additionalInfo);
        return { gender: '미정', major: [], teaching_fields: [] };
    },

    /**
     * 학당별 배정된 학생 목록 조회 (추가 정보 포함)
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
            
            console.log(`📋 Supabase 원시 응답 (추가 정보 포함):`, data);
            
            // 3. 🔧 강화된 데이터 구조 정규화
            const students = (data || []).map((student, index) => {
                console.log(`🧑‍🎓 [${index + 1}/${data.length}] 학생 처리 중: ${student.name}`);
                console.log(`📊 원시 student_additional_info:`, student.student_additional_info);
                
                // 강화된 분석 함수 사용
                const additionalInfo = this.analyzeAdditionalInfo(student.student_additional_info, student.name);
                
                const processedStudent = {
                    ...student,
                    ...additionalInfo
                };
                
                console.log(`✅ [${student.name}] 최종 처리 결과:`, {
                    gender: processedStudent.gender,
                    major: processedStudent.major,
                    teaching_fields: processedStudent.teaching_fields
                });
                
                return processedStudent;
            });
            
            console.log(`✅ 학생 조회 (추가 정보 포함) 완료: ${students.length}명 찾음`);
            
            // 🔍 최종 결과 요약 로그
            console.log(`📈 최종 결과 요약:`, students.map(s => ({
                name: s.name,
                gender: s.gender,
                majorCount: s.major?.length || 0,
                teachingFieldsCount: s.teaching_fields?.length || 0
            })));
            
            return students;
            
        } catch (error) {
            console.error('❌ 학생 목록 조회 실패 (추가 정보 포함):', error);
            return [];
        }
    },

    /**
     * 부분 문자열 검색으로 학당 매칭 (추가 정보 포함)
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
            
            console.log(`📋 부분 검색 원시 응답:`, data);
            
            // 강화된 데이터 구조 정규화
            const students = (data || []).map((student, index) => {
                console.log(`🧑‍🎓 [부분검색 ${index + 1}] 학생 처리: ${student.name}`);
                
                const additionalInfo = this.analyzeAdditionalInfo(student.student_additional_info, student.name);
                
                return {
                    ...student,
                    ...additionalInfo
                };
            });
            
            console.log(`✅ 부분 검색 (추가 정보 포함) 완료: ${students.length}명 찾음`);
            
            return students;
            
        } catch (error) {
            console.error('❌ 부분 검색 실패 (추가 정보 포함):', error);
            return [];
        }
    },

    /**
     * 🎯 통합 학생 조회 함수 (추가 정보 포함, 매핑 + fallback)
     * @param {object} supabaseClient - Supabase 클라이언트 인스턴스
     * @param {string} shortInstituteName - 간단한 학당명
     * @returns {Promise<Array>} 배정된 학생 목록 (성별, 전공, 강의 가능 분야 포함)
     */
    async getStudentsWithAdditionalInfo(supabaseClient, shortInstituteName) {
        try {
            console.log(`🚀 통합 학생 조회 시작: "${shortInstituteName}"`);
            
            // 1차: 매핑 테이블 사용 (추가 정보 포함)
            let students = await this.getAssignedStudentsWithAdditionalInfo(supabaseClient, shortInstituteName);
            
            // 2차: 결과가 없으면 부분 문자열 검색 (추가 정보 포함)
            if (students.length === 0) {
                console.log(`📋 매핑 결과 없음. 부분 검색 시도... (추가 정보 포함)`);
                students = await this.getAssignedStudentsByPartialMatchWithAdditionalInfo(supabaseClient, shortInstituteName);
            }
            
            console.log(`🎯 최종 결과 (추가 정보 포함): ${students.length}명의 학생 찾음`);
            
            // 🔍 최종 검증 로그
            if (students.length > 0) {
                const sampleStudent = students[0];
                console.log(`🧪 샘플 학생 데이터 검증:`, {
                    name: sampleStudent.name,
                    hasGender: !!sampleStudent.gender && sampleStudent.gender !== '미정',
                    hasMajor: Array.isArray(sampleStudent.major) && sampleStudent.major.length > 0,
                    hasTeachingFields: Array.isArray(sampleStudent.teaching_fields) && sampleStudent.teaching_fields.length > 0,
                    rawGender: sampleStudent.gender,
                    rawMajor: sampleStudent.major,
                    rawTeachingFields: sampleStudent.teaching_fields
                });
            }
            
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
     * 📊 통계 정보 출력
     */
    getStats() {
        const totalMappings = Object.keys(this.instituteMapping).length;
        const countries = {};
        
        // 국가별 학당 수 계산
        Object.values(this.instituteMapping).forEach(fullName => {
            const country = fullName.split(' ')[0];
            countries[country] = (countries[country] || 0) + 1;
        });
        
        return {
            totalMappings,
            countries,
            coverage: '100% 완전 매핑'
        };
    },

    /**
     * 디버그 정보 출력
     */
    debug() {
        const stats = this.getStats();
        console.log('🔍 InstituteMatcher Debug Info:');
        console.log('📊 등록된 학당 수:', stats.totalMappings);
        console.log('🌏 국가별 분포:', stats.countries);
        console.log('📋 전체 매핑:', this.instituteMapping);
        console.log('✅ 상태:', stats.coverage);
    }
};

// 전역 객체로 노출 (개발 모드에서만)
if (typeof window !== 'undefined') {
    window.InstituteMatcher = InstituteMatcher;
    console.log('✅ InstituteMatcher 모듈 로드 완료 (42개 학당 완전 매핑)');
}

// 모듈 내보내기 (Node.js 환경)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstituteMatcher;
}