NIGHT SITE REPACKAGE PATCH
==========================

기준
- GitHub NIGHT 저장소 최신 상태 (2026-09-11 확인)
- 기존 상세 페이지와 이미지/오디오 경로 유지

주요 변경
1. contents.html 신규 추가
   - NIGHT ORIGINALS
   - NIGHT VLOG
   - TRAVEL LOG
   - BEHIND LOG
   - FANMEETING ARCHIVE

2. HOME 아카이브 정리
   - DISCOGRAPHY / HISTORY / LISTEN / GALLERY / CONTENTS / NOTICE
   - 개별 콘텐츠 카드를 CONTENTS 허브로 통합

3. 전체 HTML 상단 메뉴 통일
   - GALLERY 다음에 CONTENTS 메뉴 추가

4. 데뷔일 표기 통일
   - HOME / DISCOGRAPHY / HISTORY에 2022.11.15 표기

5. NIGHT 아이덴티티 모션
   - 마우스를 따라오는 은은한 달빛
   - 링크와 버튼 클릭 시 수면 파문
   - 주요 제목의 보랏빛 잔광
   - 페이지 이동 시 어둠으로 이어지는 전환
   - 모바일 및 모션 감소 환경 자동 대응

6. ERA ARCHIVE 확장
   - AFTER MIDNIGHT부터 PHANTOM까지 7개 시대 타임라인
   - 각 시대 카드에서 디스코그래피 상세 위치로 바로 이동
   - HOME 및 DISCOGRAPHY에 ERA ARCHIVE 진입 링크 추가
   - NO SIGNAL은 4인 체제 상징 그래픽, NEW MOON 이후는 TAEHOON 합류 후 현 5인 이미지 사용

7. AWARDS & ACHIEVEMENTS 추가
   - 2022.11.15 데뷔부터 2026년 상반기까지 대표 수상 및 커리어 기록 정리
   - AWARDS와 ACHIEVEMENTS를 분리한 공식 기록 아카이브
   - Billboard 세부 차트명·순위 및 미확정 시상식명·트로피 수량은 임의 표기하지 않음
   - PHANTOM 이후 수상 기록 제외, 2026년 상반기 기준 대상 미수상 상태 명시
   - HOME 및 HISTORY에서 전용 페이지로 연결

적용 방법
- ZIP의 폴더 구조를 유지한 채 GitHub 저장소 최상위에 업로드하고 덮어씁니다.
- 기존 assets/images 폴더는 삭제하지 마세요. 새 페이지가 기존 이미지를 재사용합니다.

참고
- 기존 저장소에서 assets/images/phantom-illusion-official-mv-0914.png 파일이 누락된 상태는
  이번 구조 패치의 변경 범위가 아니므로 그대로 유지했습니다.
