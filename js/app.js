    // 🆕 수동 JOIN 방식으로 인턴 정보 조회 (매핑된 학당명 사용) - 강화된 디버깅
    async loadInternsManualJoin(fullInstituteName) {
        console.log(`🎯 수동 JOIN: 매핑된 학당명으로 조회 - "${fullInstituteName}"`);

        // 1단계: user_profiles에서 학생들 조회
        console.log('📊 1단계: user_profiles 테이블 조회 시작...');
        const { data: students, error: studentsError } = await this.supabase
            .from('user_profiles')
            .select('*')
            .eq('sejong_institute', fullInstituteName)
            .eq('user_type', 'student');

        console.log('📊 1단계 결과:', {
            studentsData: students,
            studentsError: studentsError,
            studentsCount: students?.length || 0
        });

        if (studentsError) {
            console.error('❌ 학생 데이터 조회 오류:', studentsError);
            throw studentsError;
        }

        if (!students || students.length === 0) {
            console.log('👥 해당 학당에 배치된 학생이 없습니다.');
            this.assignedInterns = [];
            return;
        }

        console.log(`👥 학생 ${students.length}명 조회됨:`, students.map(s => ({
            id: s.id,
            name: s.name,
            institute: s.sejong_institute
        })));

        // 2단계: student_additional_info에서 추가 정보 조회
        console.log('📊 2단계: student_additional_info 테이블 조회 시작...');
        const studentIds = students.map(s => s.id);
        console.log('🔍 조회할 학생 ID 목록:', studentIds);

        const { data: additionalInfos, error: additionalError } = await this.supabase
            .from('student_additional_info')
            .select('*')
            .in('user_id', studentIds);

        console.log('📊 2단계 결과:', {
            additionalInfosData: additionalInfos,
            additionalError: additionalError,
            additionalInfosCount: additionalInfos?.length || 0
        });

        if (additionalError) {
            console.error('❌ 학생 추가 정보 조회 오류:', additionalError);
            // 추가 정보 조회 실패 시에도 기본 정보는 표시
        }

        console.log(`📋 추가 정보 ${additionalInfos?.length || 0}개 조회됨:`, 
            additionalInfos?.map(info => ({
                user_id: info.user_id,
                gender: info.gender,
                major: info.major,
                teaching_fields: info.teaching_fields
            })) || []
        );

        // 3단계: 데이터 결합
        console.log('🔗 3단계: 데이터 결합 시작...');
        this.assignedInterns = students.map(student => {
            const additionalInfo = additionalInfos?.find(info => info.user_id === student.id);
            
            console.log(`🔗 학생 "${student.name}" (${student.id}) 매핑:`, {
                foundAdditionalInfo: !!additionalInfo,
                additionalInfo: additionalInfo,
                gender: additionalInfo?.gender || '미정',
                major: additionalInfo?.major || [],
                teaching_fields: additionalInfo?.teaching_fields || []
            });
            
            return {
                ...student,
                gender: additionalInfo?.gender || '미정',
                major: additionalInfo?.major || [],
                teaching_fields: additionalInfo?.teaching_fields || []
            };
        });

        console.log(`✅ 수동 JOIN 완료: ${this.assignedInterns.length}명의 인턴 정보 결합됨`);
        console.log('🧑‍🎓 최종 결과 미리보기:', this.assignedInterns.map(intern => ({
            name: intern.name,
            gender: intern.gender,
            major: intern.major,
            teaching_fields: intern.teaching_fields
        })));
    },
