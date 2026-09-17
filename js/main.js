const menuBtn = document.querySelector('#menuBtn');
const menu = document.querySelector('#menu');
menuBtn.addEventListener('click', () => {
  const opened = menu.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', String(opened));
});
document.querySelectorAll('#menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

const themeBtn = document.querySelector('#themeBtn');
let theme = localStorage.getItem('theme') || 'light';
const renderTheme = () => {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === 'dark'
    ? '밝은 모드로' : '다크 모드로';
};
themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  renderTheme();
});
renderTheme();
const header = document.querySelector('header');
const topBtn = document.querySelector('#topBtn');
const updateScroll = () => {
  topBtn.hidden = window.scrollY < 300;
  header.classList.toggle('scrolled', window.scrollY >= 60);
};
window.addEventListener('scroll', updateScroll);
updateScroll();
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('section > h2').forEach(title => {
  title.classList.add('reveal');
  observer.observe(title);
});
const form = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const fields = [...form.querySelectorAll('input, textarea')];
const validate = field => {
  let error = '';
  if (!field.value.trim()) error = '필수 입력입니다.';
  else if (field.type === 'email' && field.validity.typeMismatch)
    error = '이메일 형식을 확인하세요.';
  document.querySelector(`#${field.id}Error`).textContent = error;
  field.setAttribute('aria-invalid', String(Boolean(error)));
  return error === '';
};
fields.forEach(field => field.addEventListener('input', () => {
  validate(field);
  formStatus.textContent = '';
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const results = fields.map(validate);
  formStatus.textContent = results.every(Boolean)
    ? '입력 확인 완료! 실제 전송은 하지 않습니다.' : '';
});
const user = 'datecoco';
const cards = document.querySelector('#cards');
const statusText = document.querySelector('#projectStatus');
const retry = document.querySelector('#retry');
let projectState = { status: 'loading', repos: [] };


const renderProjects = () => {
  const { status, repos } = projectState;
  cards.innerHTML = '';
  retry.hidden = status !== 'error';
  const messages = {
    loading: '로딩 중...', success: '',
    error: '프로젝트를 불러올 수 없습니다.',
    empty: '표시할 프로젝트가 없습니다.'
  };
  statusText.textContent = messages[status];

  
  if (status !== 'success') return;
  const items = repos.map(({ name, description }) => {
    const card = document.createElement('article');
    const repoUrl = `https://github.com/${encodeURIComponent(user)}`
      + `/${encodeURIComponent(name)}`;
    card.innerHTML = `<h3><a href="${repoUrl}"></a></h3><p></p>`;
    card.querySelector('a').textContent = name;
    card.querySelector('p').textContent = description || '설명 없음';
    return card;
  });
  cards.replaceChildren(...items);
};
const loadProjects = async () => {
  projectState = { status: 'loading', repos: [] };
  renderProjects();
  try {
    const url = `https://api.github.com/users/${user}/repos`;
    const response = await fetch(url + '?sort=updated&per_page=100');
    if (!response.ok) throw new Error('요청 실패');
    const repos = await response.json();
    projectState = { status: repos.length ? 'success' : 'empty', repos };
  } catch (error) {
    projectState = { status: 'error', repos: [] };
  }
  renderProjects();
};
retry.addEventListener('click', loadProjects);
loadProjects();