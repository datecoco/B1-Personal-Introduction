// ================================
// 💡 1. 모바일 메뉴
// ================================

// HTML에서 메뉴 버튼과 메뉴 상자를 선택
const menuBtn = document.querySelector('#menuBtn');
const menu = document.querySelector('#menu');

// 메뉴 버튼을 클릭하면 active class를 붙이거나 제거
menuBtn.addEventListener('click', () => {
  // active가 붙으면 true, 제거되면 false를 반환
  const opened = menu.classList.toggle('active');

  // 화면 읽기 도구에 메뉴가 열렸는지 알려 줌
  menuBtn.setAttribute('aria-expanded', String(opened));
});

// 메뉴 링크를 클릭하면 모바일 메뉴를 닫기
document.querySelectorAll('#menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});


// ================================
// 💡 2. 다크 모드
// ================================

// 다크 모드 버튼을 선택
const themeBtn = document.querySelector('#themeBtn');

// 저장된 테마가 있으면 사용하고, 없으면 light를 기본값으로 사용
let theme = localStorage.getItem('theme') || 'light';

// 현재 theme 값에 맞게 화면과 버튼 글자를 변경
const renderTheme = () => {
  // HTML에 data-theme="light" 또는 data-theme="dark"를 설정
  document.documentElement.dataset.theme = theme;

  // 현재 다크 모드라면 밝은 모드 버튼을, 아니면 다크 모드 버튼을 표시
  themeBtn.textContent = theme === 'dark'
    ? '밝은 모드로'
    : '다크 모드로';
};

// 다크 모드 버튼을 클릭하면 테마를 반대로 변경
themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';

  // 새 테마를 브라우저에 저장해서 다음 접속에도 유지
  localStorage.setItem('theme', theme);

  // 바뀐 theme 값으로 화면을 다시 표시
  renderTheme();
});

// 페이지가 처음 열릴 때 저장된 테마를 화면에 적용
renderTheme();


// ================================
// 💡 3. 스크롤 기능
// ================================

// 상단 메뉴와 맨 위로 버튼을 선택
const header = document.querySelector('header');
const topBtn = document.querySelector('#topBtn');

// 스크롤 위치에 따라 header와 맨 위로 버튼의 모습을 변경
const updateScroll = () => {
  // 아래로 300px 이상 내렸을 때만 맨 위로 버튼 표시
  topBtn.hidden = window.scrollY < 300;

  // 아래로 60px 이상 내렸을 때 header에 scrolled class 추가
  header.classList.toggle('scrolled', window.scrollY >= 60);
};

// 사용자가 스크롤할 때마다 실행
window.addEventListener('scroll', updateScroll);

// 페이지가 처음 열렸을 때도 현재 스크롤 위치를 확인
updateScroll();

// 맨 위로 버튼을 누르면 부드럽게 페이지 맨 위로 이동
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ================================
// 💡 4. 섹션 제목 등장 애니메이션
// ================================

// 제목이 화면에 들어왔는지 감시하는 도구
const observer = new IntersectionObserver(entries => {
  // 감시 중인 제목들을 하나씩 확인
  entries.forEach(entry => {
    // 제목이 화면에 보이면
    if (entry.isIntersecting) {
      // visible class를 붙여 CSS 애니메이션 실행
      entry.target.classList.add('visible');

      // 한 번 보인 제목은 더 이상 감시하지 않음
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2 // 제목의 20%가 보이면 실행
});

// 모든 section 안의 h2 제목을 찾아 애니메이션 준비
document.querySelectorAll('section > h2').forEach(title => {
  title.classList.add('reveal');
  observer.observe(title);
});


// ================================
// 💡 5. 문의 폼 입력값 검사
// ================================

// HTML에서 문의 폼과 결과 문구 영역을 선택
const form = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

// form 안의 input과 textarea를 배열로 선택
const fields = [...form.querySelectorAll('input, textarea')];

// 입력칸 하나를 검사하는 함수
const validate = field => {
  let error = '';

  // 입력값이 비어 있으면 오류 문구 저장
  if (!field.value.trim()) {
    error = '필수 입력입니다.';
  }

  // 이메일 입력칸인데 이메일 형식이 아니면 오류 문구 저장
  else if (field.type === 'email' && field.validity.typeMismatch) {
    error = '이메일 형식을 확인하세요.';
  }

  // 예: email 입력칸이면 #emailError 영역에 오류 문구 표시
  document.querySelector(`#${field.id}Error`).textContent = error;

  // 화면 읽기 도구에 오류 여부를 알려 줌
  field.setAttribute('aria-invalid', String(Boolean(error)));

  // 오류가 없으면 true, 있으면 false 반환
  return error === '';
};

// 각 입력칸에 글자를 입력할 때마다 검사
fields.forEach(field => {
  field.addEventListener('input', () => {
    validate(field);

    // 입력 중에는 이전 완료 문구를 지움
    formStatus.textContent = '';
  });
});

// 폼 제출 버튼을 클릭했을 때 실행
form.addEventListener('submit', event => {
  // 실제 페이지 이동·전송을 막음
  event.preventDefault();

  // 모든 입력칸을 검사해서 결과를 배열로 저장
  const results = fields.map(validate);

  // 모든 결과가 true면 완료 문구 표시
  formStatus.textContent = results.every(Boolean)
    ? '입력 확인 완료! 실제 전송은 하지 않습니다.'
    : '';
});


// ================================
// 💡 6. GitHub API 프로젝트 카드
// ================================

// GitHub 사용자 아이디
const user = 'datecoco';

// HTML에서 카드 영역, 상태 문구, 다시 시도 버튼을 선택
const cards = document.querySelector('#cards');
const statusText = document.querySelector('#projectStatus');
const retry = document.querySelector('#retry');

// 언어별 보기 선택 상자와 제목을 선택
const languageFilter = document.querySelector('#languageFilter');
const languageFilterLabel = document.querySelector('#languageFilterLabel');

// 프로젝트 화면의 현재 상태를 저장
let projectState = {
  status: 'loading', // loading / success / error / empty
  repos: [],         // GitHub에서 받은 저장소 목록
  language: 'all'    // 현재 선택한 언어
};

// 현재 projectState를 기준으로 프로젝트 화면을 그리는 함수
const renderProjects = () => {
  // 객체 구조분해 할당으로 필요한 값만 꺼냄
  const { status, repos, language } = projectState;

  // 기존 프로젝트 카드를 먼저 모두 비움
  cards.innerHTML = '';

  // 오류 상태일 때만 다시 시도 버튼을 표시
  retry.hidden = status !== 'error';

  // 성공 상태일 때만 언어 선택 상자를 표시
  languageFilter.hidden = status !== 'success';
  languageFilterLabel.hidden = status !== 'success';
  languageFilter.disabled = status !== 'success';

  // 상태별로 보여 줄 안내 문구
  const messages = {
    loading: '로딩 중...',
    success: '',
    error: '프로젝트를 불러올 수 없습니다.',
    empty: '표시할 프로젝트가 없습니다.'
  };

  // 현재 상태에 맞는 문구를 화면에 표시
  statusText.textContent = messages[status];

  // 성공 상태가 아니면 카드 생성 없이 함수 끝
  if (status !== 'success') return;

  // 저장소 목록에서 언어만 모으고, 중복·빈 값 제거 후 가나다순 정렬
  const languages = [...new Set(
    repos.map(({ language }) => language).filter(Boolean)
  )].sort();

  // 언어 선택 상자에 '모든 언어'와 실제 언어 목록을 넣기
  languageFilter.replaceChildren(
    new Option('모든 언어', 'all'),
    ...languages.map(languageName => new Option(languageName, languageName))
  );

  // 기존에 선택한 언어를 선택 상자에도 유지
  languageFilter.value = language;

  // 💡 filter(): 선택한 언어에 맞는 저장소만 남김
  const filteredRepos = repos.filter(repo => {
    return language === 'all' || repo.language === language;
  });

  // 💡 map(): 필터링된 저장소 하나당 카드 하나를 만듦
  const items = filteredRepos.map(({ name, description }) => {
    // article 태그로 프로젝트 카드 생성
    const card = document.createElement('article');

    // 저장소 이름을 이용해 GitHub 주소 생성
    const repoUrl = `https://github.com/${encodeURIComponent(user)}`
      + `/${encodeURIComponent(name)}`;

    // 카드 안에 제목 링크와 설명 영역을 생성
    card.innerHTML = `<h3><a href="${repoUrl}"></a></h3><p></p>`;

    // 저장소 이름과 설명을 카드에 넣기
    card.querySelector('a').textContent = name;
    card.querySelector('p').textContent = description || '설명 없음';

    return card;
  });

  // 만들어 둔 카드들을 #cards 영역에 한 번에 표시
  cards.replaceChildren(...items);
};

// GitHub API에 저장소 목록을 요청하는 비동기 함수
const loadProjects = async () => {
  // 요청 시작: 로딩 상태로 변경하고 화면에 표시
  projectState = {
    status: 'loading',
    repos: [],
    language: 'all'
  };
  renderProjects();

  try {
    // GitHub API 요청 주소 생성
    const url = `https://api.github.com/users/${user}/repos`;

    // GitHub에 저장소 목록 요청 후 응답이 올 때까지 기다림
    const response = await fetch(url + '?sort=updated&per_page=100');

    // HTTP 요청이 실패했다면 오류로 처리
    if (!response.ok) throw new Error('요청 실패');

    // 응답 데이터를 JavaScript 배열로 변환
    const repos = await response.json();

    // 저장소가 있으면 success, 없으면 empty 상태로 변경
    projectState = {
      status: repos.length ? 'success' : 'empty',
      repos,
      language: 'all'
    };
  } catch (error) {
    // 인터넷 또는 API 오류가 나면 error 상태로 변경
    projectState = {
      status: 'error',
      repos: [],
      language: 'all'
    };
  }

  // 변경된 상태를 기준으로 화면을 다시 그림
  renderProjects();
};

// 다시 시도 버튼을 누르면 API 요청을 다시 실행
retry.addEventListener('click', loadProjects);

// 언어 선택을 바꾸면 현재 언어 상태만 바꾸고 카드 다시 표시
languageFilter.addEventListener('change', event => {
  projectState = {
    ...projectState,
    language: event.target.value
  };
  renderProjects();
});

// 페이지가 열리면 GitHub 저장소 목록을 처음 한 번 불러옴
loadProjects();