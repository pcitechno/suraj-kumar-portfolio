// =========================================================
// Scrub bar: fills as the page scrolls, like a playhead
// moving across a timeline.
// =========================================================
const scrubFill = document.getElementById('scrubFill');
function updateScrub(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrubFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrub, { passive: true });
window.addEventListener('resize', updateScrub);
updateScrub();

// =========================================================
// Mobile nav toggle
// =========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// Video data — add a new object here any time you have a
// new Google Drive link. driveId is the long ID from the
// share URL: drive.google.com/file/d/THIS_PART/view
// group is one of: "educational", "promotional"
// =========================================================
const VIDEOS = [
  { driveId: '1rN57JP5mVA3a79FZfacTSD-c3VH3wvce', title: 'Goal Seek in Excel',
    desc: 'Reverse-engineering a target result by varying one input.', group: 'educational' },
  { driveId: '1E3zohLT5HYZOx8QKuR-MfjiRvsID2U3P', title: 'XLOOKUP — Complete Tutorial',
    desc: 'A full walkthrough of XLOOKUP, start to finish.', group: 'educational' },
  { driveId: '1Qvqkz5LkbKxQg3e1gelsg9BRGAgMdWKv', title: 'Picture-in-Cell Trick',
    desc: 'Inserting live picture previews inside Excel cells.', group: 'educational' },
  { driveId: '1wUtszV_HOTpkFW3Er9l_yf42OLSm2_9U', title: 'Excel for Finance — NPV, IRR, ROI & DCF',
    desc: 'Four core finance formulas explained in one sitting.', group: 'educational' },
  { driveId: '1CSuPYwMFY_cMF41RHsBFOGBndx6rhpCN', title: '15 Text Formulas to Speed Up Excel',
    desc: 'TEXTJOIN, TEXTSPLIT, LEFT, RIGHT and MID, back to back.', group: 'educational' },
  { driveId: '1RUQHwuL17iO1WO5pHcP5ZIDP-cPhXiUh', title: 'Lookup & Reference — Every Function',
    desc: 'VLOOKUP, HLOOKUP, INDEX-MATCH and ROW/COLUMN in one video.', group: 'educational' },

  { driveId: '1NktgpeUMzVOvnbsWGEVmGeZQ-xk5Uq_T', title: 'Maklife — Combo Promo',
    desc: 'A product combo promo edited for Maklife.', group: 'promotional' },
  { driveId: '10V_yafubdyxSIcCIl0xGjx2QWsAdMMey', title: 'Wireless New', group: 'promotional' },
  { driveId: '1uj67rGzpC0pwvwu2oz4UGIeol4Zwn30U', title: 'IMG_6945', group: 'promotional' },
  { driveId: '18W5NGKEVkllqsndO6Njyg00K0uradpCf', title: 'IMG_7003', group: 'promotional' },
  { driveId: '1C0g541O4EwHNWo9QSKrKgrDABg-VRkFC', title: 'IMG_7023', group: 'promotional' },
  { driveId: '1W0Sem4CgtQMQHvpq3cE5nYpJTmTDg7F6', title: 'IMG_7123', group: 'promotional' },
  { driveId: '1c0KU6RE7tmRaNfNBOYf8dCb_ZHPTpZHU', title: 'IMG_7258', group: 'promotional' },
  { driveId: '1ctEgP93p237lJj_cKgoRgTnY9OlgctHM', title: 'IMG_7830', group: 'promotional' },
];

const THUMB = id => `https://drive.google.com/thumbnail?id=${id}&sz=w640`;

const PLAY_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5-9-5.5z" fill="currentColor"/></svg>`;

function buildReelCard(video){
  const article = document.createElement('article');
  article.className = 'reel';

  const frame = document.createElement('button');
  frame.type = 'button';
  frame.className = 'reel__frame';
  frame.setAttribute('aria-label', `Play ${video.title}`);
  frame.innerHTML = `
    <img class="reel__thumb" src="${THUMB(video.driveId)}" alt="" loading="lazy" />
    <span class="reel__play">${PLAY_ICON}</span>
  `;
  frame.addEventListener('click', () => openVideo(video.driveId, video.title));

  const h3 = document.createElement('h3');
  h3.textContent = video.title;

  article.appendChild(frame);
  article.appendChild(h3);

  if (video.desc){
    const p = document.createElement('p');
    p.textContent = video.desc;
    article.appendChild(p);
  }

  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'reel__link';
  link.textContent = 'Watch sample';
  link.addEventListener('click', () => openVideo(video.driveId, video.title));
  article.appendChild(link);

  return article;
}

const gridEducational = document.getElementById('gridEducational');
const gridPromotional = document.getElementById('gridPromotional');

VIDEOS.forEach(video => {
  if (video.group === 'educational') gridEducational.appendChild(buildReelCard(video));
  else if (video.group === 'promotional') gridPromotional.appendChild(buildReelCard(video));
});

// =========================================================
// Video modal player
// =========================================================
const modal = document.getElementById('videoModal');
const modalIframe = document.getElementById('modalIframe');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

function openVideo(driveId, title){
  modalIframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
  modalTitle.textContent = title;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeVideo(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalIframe.src = ''; // stop playback
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeVideo);
modalBackdrop.addEventListener('click', closeVideo);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeVideo();
});
