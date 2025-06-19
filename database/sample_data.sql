-- 세종학당 담당자 대시보드 샘플 데이터
-- schema.sql 실행 후 이 파일을 실행하세요

-- 1. 학당 담당자 샘플 데이터 삽입
INSERT INTO institute_managers (institute_name, manager_name, auth_code, phone, email) VALUES
('서울세종학당', '김담당', 'seoul2024', '02-1234-5678', 'kim.manager@seoul.sejong.kr'),
('부산세종학당', '박관리', 'busan2024', '051-1234-5678', 'park.manager@busan.sejong.kr'),
('대구세종학당', '이책임', 'daegu2024', '053-1234-5678', 'lee.manager@daegu.sejong.kr'),
('인천세종학당', '정주임', 'incheon2024', '032-1234-5678', 'jung.manager@incheon.sejong.kr'),
('광주세종학당', '최부장', 'gwangju2024', '062-1234-5678', 'choi.manager@gwangju.sejong.kr'),
('대전세종학당', '한과장', 'daejeon2024', '042-1234-5678', 'han.manager@daejeon.sejong.kr'),
('울산세종학당', '윤팀장', 'ulsan2024', '052-1234-5678', 'yoon.manager@ulsan.sejong.kr'),
('수원세종학당', '장실장', 'suwon2024', '031-1234-5678', 'jang.manager@suwon.sejong.kr'),
('청주세종학당', '오소장', 'cheongju2024', '043-1234-5678', 'oh.manager@cheongju.sejong.kr'),
('전주세종학당', '임원장', 'jeonju2024', '063-1234-5678', 'lim.manager@jeonju.sejong.kr')
ON CONFLICT (institute_name, manager_name, auth_code) DO NOTHING;

-- 2. 재단 담당자 샘플 데이터 삽입
INSERT INTO foundation_managers (institute_name, name, phone, email, role) VALUES
('서울세종학당', '홍길동', '02-1111-2222', 'hong.gildong@sejong.or.kr', '해외 문화인턴 담당'),
('부산세종학당', '이순신', '02-1111-2223', 'lee.sunshin@sejong.or.kr', '지역 협력 담당'),
('대구세종학당', '김유신', '02-1111-2224', 'kim.yushin@sejong.or.kr', '프로그램 기획 담당'),
('인천세종학당', '강감찬', '02-1111-2225', 'kang.gamchan@sejong.or.kr', '국제교류 담당'),
('광주세종학당', '을지문덕', '02-1111-2226', 'eulji.mundeok@sejong.or.kr', '문화사업 담당'),
('대전세종학당', '연개소문', '02-1111-2227', 'yeon.gaesomun@sejong.or.kr', '교육과정 담당'),
('울산세종학당', '계백', '02-1111-2228', 'gyebaek@sejong.or.kr', '행정지원 담당'),
('수원세종학당', '온달', '02-1111-2229', 'ondal@sejong.or.kr', '해외 문화인턴 담당'),
('청주세종학당', '연개소문', '02-1111-2230', 'yeon.gaesomun2@sejong.or.kr', '지역 협력 담당'),
('전주세종학당', '대조영', '02-1111-2231', 'dae.joyeong@sejong.or.kr', '프로그램 기획 담당')
ON CONFLICT (institute_name, name) DO NOTHING;

-- 3. 문화인턴 학생 샘플 데이터 삽입 (기존 CSV 데이터와 통합)
INSERT INTO user_profiles (name, birth_date, sejong_institute, field, user_type, phone, email) VALUES
-- 서울세종학당 배정 인턴
('김철수', '1995-03-15', '서울세종학당', '한국어교육', 'student', '010-1234-5678', 'kim.cs@email.com'),
('박영희', '1994-07-22', '서울세종학당', '문화기획', 'student', '010-1234-5679', 'park.yh@email.com'),
('이민준', '1996-01-08', '서울세종학당', '한국어교육', 'student', '010-1234-5680', 'lee.mj@email.com'),

-- 부산세종학당 배정 인턴
('정수연', '1995-11-30', '부산세종학당', '문화기획', 'student', '010-1234-5681', 'jung.sy@email.com'),
('최지훈', '1995-09-12', '부산세종학당', '한국사', 'student', '010-1234-5682', 'choi.jh@email.com'),
('윤서아', '1996-04-18', '부산세종학당', '문화기획', 'student', '010-1234-5683', 'yoon.sa@email.com'),

-- 대구세종학당 배정 인턴
('장민호', '1994-12-03', '대구세종학당', '한국어교육', 'student', '010-1234-5684', 'jang.mh@email.com'),
('한예린', '1995-06-25', '대구세종학당', '전통문화', 'student', '010-1234-5685', 'han.yr@email.com'),

-- 인천세종학당 배정 인턴
('오준석', '1996-02-14', '인천세종학당', '한국어교육', 'student', '010-1234-5686', 'oh.js@email.com'),
('임하늘', '1994-10-07', '인천세종학당', '문화기획', 'student', '010-1234-5687', 'lim.hn@email.com'),

-- 광주세종학당 배정 인턴
('신동엽', '1995-08-19', '광주세종학당', '한국사', 'student', '010-1234-5688', 'shin.dy@email.com'),
('양지원', '1996-05-03', '광주세종학당', '전통문화', 'student', '010-1234-5689', 'yang.jw@email.com'),

-- 대전세종학당 배정 인턴
('노수민', '1994-09-28', '대전세종학당', '문화기획', 'student', '010-1234-5690', 'no.sm@email.com'),
('서태웅', '1995-12-11', '대전세종학당', '한국어교육', 'student', '010-1234-5691', 'seo.tw@email.com'),

-- 울산세종학당 배정 인턴
('유진우', '1996-03-07', '울산세종학당', '한국사', 'student', '010-1234-5692', 'yu.jw@email.com'),
('조미영', '1994-11-15', '울산세종학당', '전통문화', 'student', '010-1234-5693', 'jo.my@email.com'),

-- 수원세종학당 배정 인턴
('백승호', '1995-07-04', '수원세종학당', '문화기획', 'student', '010-1234-5694', 'baek.sh@email.com'),
('안소정', '1996-01-21', '수원세종학당', '한국어교육', 'student', '010-1234-5695', 'an.sj@email.com'),

-- 청주세종학당 배정 인턴
('홍재혁', '1994-08-16', '청주세종학당', '한국사', 'student', '010-1234-5696', 'hong.jh@email.com'),
('김나래', '1995-10-29', '청주세종학당', '전통문화', 'student', '010-1234-5697', 'kim.nr@email.com'),

-- 전주세종학당 배정 인턴
('송민기', '1996-06-12', '전주세종학당', '문화기획', 'student', '010-1234-5698', 'song.mk@email.com'),
('이채린', '1994-04-25', '전주세종학당', '한국어교육', 'student', '010-1234-5699', 'lee.cr@email.com')
ON CONFLICT (name, birth_date, user_type) DO NOTHING;

-- 4. 테스트용 추가 인턴 데이터 (더 많은 데이터를 원할 경우)
INSERT INTO user_profiles (name, birth_date, sejong_institute, field, user_type, phone, email) VALUES
('강민수', '1995-02-18', '서울세종학당', '전통문화', 'student', '010-2234-5678', 'kang.ms@email.com'),
('문지혜', '1996-09-05', '서울세종학당', '한국사', 'student', '010-2234-5679', 'moon.jh@email.com'),
('남궁성', '1994-12-14', '부산세종학당', '한국어교육', 'student', '010-2234-5680', 'namgung.s@email.com'),
('황보라', '1995-05-27', '부산세종학당', '전통문화', 'student', '010-2234-5681', 'hwang.br@email.com'),
('선우진', '1996-11-09', '대구세종학당', '문화기획', 'student', '010-2234-5682', 'sunwoo.j@email.com'),
('제갈량', '1994-07-31', '대구세종학당', '한국사', 'student', '010-2234-5683', 'jegal.r@email.com')
ON CONFLICT (name, birth_date, user_type) DO NOTHING;

-- 완료 메시지
DO $$
DECLARE
    manager_count INTEGER;
    foundation_count INTEGER;
    student_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO manager_count FROM institute_managers;
    SELECT COUNT(*) INTO foundation_count FROM foundation_managers;
    SELECT COUNT(*) INTO student_count FROM user_profiles WHERE user_type = 'student';
    
    RAISE NOTICE '✅ 샘플 데이터 삽입 완료!';
    RAISE NOTICE '📊 학당 담당자: % 명', manager_count;
    RAISE NOTICE '👥 재단 담당자: % 명', foundation_count;
    RAISE NOTICE '🎓 문화인턴: % 명', student_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔑 테스트 로그인 정보:';
    RAISE NOTICE '   학당명: 서울세종학당';
    RAISE NOTICE '   담당자명: 김담당';
    RAISE NOTICE '   인증코드: seoul2024';
END $$;