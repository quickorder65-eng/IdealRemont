/* ============================================================
   HEADER SCROLL
   ============================================================ */
const header = document.getElementById('header');
const scrollHandler = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', scrollHandler, { passive: true });

/* ============================================================
   BURGER MENU
   ============================================================ */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   FAQ
   ============================================================ */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq__question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

/* ============================================================
   QUIZ
   ============================================================ */
const TOTAL_STEPS = 6;
let currentStep = 1;
const answers = {};

const quizProgress = document.getElementById('quizProgress');
const quizStepIndicator = document.getElementById('quizStepIndicator');
const quizBack = document.getElementById('quizBack');
const quizDots = document.getElementById('quizDots');
const quizNav = document.getElementById('quizNav');

function buildDots() {
  quizDots.innerHTML = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.createElement('div');
    dot.className = 'quiz__dot' + (i === currentStep ? ' active' : '');
    quizDots.appendChild(dot);
  }
}

function updateUI() {
  const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
  quizProgress.style.width = pct + '%';
  quizStepIndicator.textContent = `Шаг ${currentStep} из ${TOTAL_STEPS}`;
  buildDots();
  quizBack.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
  quizNav.style.display = currentStep <= TOTAL_STEPS ? 'flex' : 'none';
}

function showStep(step) {
  document.querySelectorAll('.quiz__step').forEach(s => {
    s.classList.remove('active');
  });
  const target = document.querySelector(`.quiz__step[data-step="${step}"]`);
  if (target) {
    target.classList.add('active');
  }
}

function goToStep(step) {
  const current = document.querySelector(`.quiz__step[data-step="${currentStep}"]`);
  if (current) {
    current.style.animation = 'none';
    current.classList.remove('active');
  }
  currentStep = step;
  updateUI();
  showStep(step);
}

function showResult() {
  quizNav.style.display = 'none';
  quizProgress.style.width = '100%';
  quizStepIndicator.textContent = 'Готово!';
  document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
  const result = document.getElementById('quizResult');
  result.classList.add('active');
  sendToWhatsApp();
}

function sendToWhatsApp() {
  const name  = document.getElementById('quizName').value;
  const phone = document.getElementById('quizPhone').value;
  const a1 = answers[1] || '';
  const a2 = answers[2] || '';
  const a3 = answers[3] || '';
  const a4 = answers[4] || '';
  const a5 = answers[5] || '';

  const msg = encodeURIComponent(
    `Новая заявка с сайта IdealRemont\n\n` +
    `Имя: ${name}\nТелефон: ${phone}\n\n` +
    `Объект: ${a1}\nПлощадь: ${a2}\nВид ремонта: ${a3}\n` +
    `Дизайн-проект: ${a4}\nСроки: ${a5}`
  );

  const waLink = document.querySelector('.quiz__result a[href*="wa.me"]');
  if (waLink) waLink.href = `https://wa.me/77000000000?text=${msg}`;
}

// Option selection
document.querySelectorAll('.quiz__opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const step = opt.closest('.quiz__step');
    const stepNum = parseInt(step.dataset.step);

    step.querySelectorAll('.quiz__opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    answers[stepNum] = opt.dataset.value;

    setTimeout(() => {
      if (stepNum < TOTAL_STEPS) {
        goToStep(stepNum + 1);
      }
    }, 320);
  });
});

// Back button
quizBack.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

let _crmSent = false;

function sendToCRM(name, phone) {
  if (_crmSent) return;
  _crmSent = true;
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phone:         String(phone).replace(/[^\d]/g, ''),
      objectType:    answers[1] || '',
      area:          answers[2] || '',
      repairType:    answers[3] || '',
      designProject: answers[4] || '',
      startTime:     answers[5] || '',
      source:        'quiz'
    })
  }).catch(() => {});
}

/* ============================================================
   PHONE MASK
   ============================================================ */
function initPhoneMask(el) {
  function applyMask(raw) {
    let d = raw.replace(/\D/g, '');
    if (!d) return '';
    if (d[0] === '8') d = '7' + d.slice(1);
    else if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    let v = '+7';
    if (d.length > 1)  v += ' (' + d.slice(1, Math.min(d.length, 4));
    if (d.length >= 4) v += ') ' + d.slice(4, Math.min(d.length, 7));
    if (d.length >= 7) v += '-' + d.slice(7, Math.min(d.length, 9));
    if (d.length >= 9) v += '-' + d.slice(9, 11);
    return v;
  }

  el.setAttribute('placeholder', '+7 (___) ___-__-__');
  el.setAttribute('maxlength', '18');

  el.addEventListener('focus', () => {
    if (!el.value) el.value = '+7 (';
  });

  el.addEventListener('input', () => {
    const pos = el.selectionStart;
    const prev = el.value;
    const masked = applyMask(prev);
    el.value = masked;
    // попытка вернуть курсор на нужное место
    const delta = masked.length - prev.length;
    try { el.setSelectionRange(pos + delta, pos + delta); } catch (_) {}
    el.classList.toggle('input--error', masked.length > 0 && masked.replace(/\D/g,'').length < 11);
  });

  el.addEventListener('keydown', e => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && el.value.length <= 4) {
      e.preventDefault();
      el.value = '';
    }
  });

  el.addEventListener('blur', () => {
    if (el.value === '+7 (' || el.value === '+7') el.value = '';
    el.classList.toggle('input--error', el.value.length > 0 && el.value.replace(/\D/g,'').length < 11);
  });
}

initPhoneMask(document.getElementById('quizPhone'));

// Form submit
document.getElementById('quizForm').addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('quizName').value.trim();
  const phone = document.getElementById('quizPhone').value.trim();
  if (!name) return;
  if (phone.replace(/\D/g, '').length < 11) {
    const phoneEl = document.getElementById('quizPhone');
    phoneEl.classList.add('input--error');
    phoneEl.focus();
    return;
  }
  sendToCRM(name, phone);
  showResult();
});

// Init
updateUI();
showStep(1);

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
const revealElements = document.querySelectorAll(
  '.trust__item, .service-card, .process__step, .advantage-item, .portfolio__item, .pain__item, .faq__item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.revealed, [style*="opacity: 0"]').forEach(el => {});
});

// Add CSS for revealed state
const style = document.createElement('style');
style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

/* ============================================================
   CHATBOT
   ============================================================ */
const BOT = {
  welcome: {
    msg: 'Добрый день! Отвечу на вопросы по ремонту — быстро и по делу.',
    qr: ['Стоимость ремонта', 'Сроки работ', 'Как вы работаете?', 'Гарантия и договор']
  },
  price: {
    msg: 'Стоимость зависит от вида работ и площади:\n\n• Косметический — от 2 500 ₸/м²\n• Комплексный — от 5 000 ₸/м²\n• Под ключ с нуля — от 8 000 ₸/м²\n\nТочные цифры — только после бесплатного замера. Он ни к чему не обязывает.',
    qr: ['Записаться на замер', 'Что входит в стоимость?', 'Есть рассрочка?']
  },
  timing: {
    msg: 'Сроки зависят от объёма:\n\n• Косметический ремонт — 3–4 недели\n• Комплексный 60–80 м² — 2–3 месяца\n• Большой объект — по согласованию\n\nВсе сроки фиксируем в договоре. За нарушение — неустойка на нашей стороне.',
    qr: ['Записаться на замер', 'Стоимость ремонта', 'Гарантия и договор']
  },
  process: {
    msg: 'Работаем по понятной схеме:\n\n1. Замер — бесплатно\n2. Смета с точными цифрами\n3. Договор — фиксируем всё\n4. Закупаем материалы сами\n5. Ремонт с фото-отчётами\n6. Сдача объекта + гарантийный акт\n\nВы не координируете мастеров — это наша работа.',
    qr: ['Стоимость ремонта', 'Гарантия и договор', 'Записаться на замер']
  },
  guarantee: {
    msg: 'Работаем только по официальному договору:\n\n• Фиксированная смета — никаких доплат\n• Дата сдачи прописана\n• Поэтапная оплата по факту работ\n• Гарантия 5 лет на все работы\n\nЕсли что-то не так по нашей вине — устраним бесплатно.',
    qr: ['Записаться на замер', 'Стоимость ремонта', 'Написать в WhatsApp']
  },
  measurement: {
    msg: 'Замер бесплатный и ни к чему не обязывает. Приезжаем, смотрим объект, отвечаем на вопросы. Смету пришлём через 1–2 дня.\n\nДля записи напишите нам — согласуем удобное время.',
    qr: ['Написать в WhatsApp', 'Рассчитать онлайн']
  },
  includes: {
    msg: 'В комплексный ремонт входит:\n\n• Демонтаж и вывоз мусора\n• Электрика и сантехника\n• Стяжка, штукатурка\n• Потолки, полы, стены\n• Двери и плинтусы\n• Финальная уборка\n\nМатериалы закупаем сами — по оптовым ценам.',
    qr: ['Стоимость ремонта', 'Записаться на замер']
  },
  payment: {
    msg: 'Да, работаем с поэтапной оплатой. Никакого 100% аванса — платите по факту каждого выполненного этапа. Всё прописано в договоре.',
    qr: ['Стоимость ремонта', 'Записаться на замер']
  },
  design: {
    msg: 'Да, делаем дизайн-проекты:\n\n• Планировки и зонирование\n• 3D-визуализация\n• Подбор материалов и отделки\n\nМожно заказать отдельно или в комплексе с ремонтом.',
    qr: ['Стоимость ремонта', 'Записаться на замер', 'Написать в WhatsApp']
  },
  delay: {
    msg: 'В договоре прописана неустойка за каждый день просрочки. Это наша ответственность, а не ваша проблема.',
    qr: ['Записаться на замер', 'Написать в WhatsApp']
  },
  whatsapp: {
    msg: 'Напишите нам — менеджер ответит в течение 10 минут и запишет вас на удобное время.',
    qr: [],
    wa: true
  }
};

const KEYWORDS = [
  { k: ['стоимость','цена','сколько стоит','расценки','прайс','ценник','бюджет'], r: 'price' },
  { k: ['сроки','долго','срок','сколько времени','когда'], r: 'timing' },
  { k: ['как работаете','процесс','этапы','схема','порядок'], r: 'process' },
  { k: ['гарантия','договор','официально','бумага','юридически'], r: 'guarantee' },
  { k: ['замер','выезд','записаться','приехать','запись','записать'], r: 'measurement' },
  { k: ['входит','состав','включает','перечень','список'], r: 'includes' },
  { k: ['рассрочка','оплата','аванс','платить','взнос'], r: 'payment' },
  { k: ['дизайн','3d','визуализация','проект интерьера'], r: 'design' },
  { k: ['опоздаете','нарушите','просрочка','не успеете'], r: 'delay' },
  { k: ['whatsapp','написать','ватсап','позвонить','связаться','менеджер'], r: 'whatsapp' }
];

const QR_KEY = {
  'Стоимость ремонта': 'price',
  'Сроки работ': 'timing',
  'Как вы работаете?': 'process',
  'Гарантия и договор': 'guarantee',
  'Записаться на замер': 'measurement',
  'Что входит в стоимость?': 'includes',
  'Есть рассрочка?': 'payment',
  'Написать в WhatsApp': 'whatsapp',
  'Рассчитать онлайн': '__quiz',
  'Стоимость ремонта': 'price'
};

const cbToggle  = document.getElementById('chatbotToggle');
const cbPanel   = document.getElementById('chatbotPanel');
const cbClose   = document.getElementById('chatbotClose');
const cbMsgs    = document.getElementById('chatbotMessages');
const cbQR      = document.getElementById('chatbotQR');
const cbInput   = document.getElementById('chatbotInput');
const cbForm    = document.getElementById('chatbotForm');
const cbBadge   = document.getElementById('chatbotBadge');

let cbOpen = false, cbInited = false, cbCount = 0;

function cbScrollBottom() {
  requestAnimationFrame(() => { cbMsgs.scrollTop = cbMsgs.scrollHeight; });
}

function cbAddUser(text) {
  const w = document.createElement('div');
  w.className = 'chatbot__msg chatbot__msg--user';
  const b = document.createElement('div');
  b.className = 'chatbot__msg-bubble';
  b.textContent = text;
  w.appendChild(b); cbMsgs.appendChild(w); cbScrollBottom();
}

function cbAddBot(text, wa = false) {
  const w = document.createElement('div');
  w.className = 'chatbot__msg chatbot__msg--bot';
  const b = document.createElement('div');
  b.className = 'chatbot__msg-bubble';
  b.innerHTML = text.replace(/\n/g, '<br>');
  w.appendChild(b);
  if (wa) {
    const wd = document.createElement('div');
    wd.className = 'chatbot__msg-wa';
    wd.innerHTML = `<a href="https://wa.me/77000000000" target="_blank">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      Написать в WhatsApp</a>`;
    w.appendChild(wd);
  }
  cbMsgs.appendChild(w); cbScrollBottom();
}

function cbTypingStart() {
  const t = document.createElement('div');
  t.className = 'chatbot__typing'; t.id = 'cbTyping';
  t.innerHTML = '<span></span><span></span><span></span>';
  cbMsgs.appendChild(t); cbScrollBottom(); return t;
}

function cbRenderQR(items) {
  cbQR.innerHTML = '';
  items.forEach(label => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chatbot__qr-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      cbQR.innerHTML = '';
      cbAddUser(label);
      cbCount++;
      const key = QR_KEY[label];
      if (key === '__quiz') {
        cbClose.click();
        document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (key) setTimeout(() => cbBotReply(key), 220);
    });
    cbQR.appendChild(btn);
  });
}

function cbBotReply(key) {
  const data = BOT[key];
  if (!data) return;
  cbQR.innerHTML = '';
  const typing = cbTypingStart();
  setTimeout(() => {
    typing.remove();
    cbAddBot(data.msg, !!data.wa);
    const qrItems = [...(data.qr || [])];
    if (cbCount >= 2 && key !== 'whatsapp' && !data.wa) {
      if (!qrItems.includes('Написать в WhatsApp')) qrItems.unshift('Написать в WhatsApp');
    }
    if (qrItems.length) cbRenderQR(qrItems);
  }, 500 + Math.random() * 400);
}

cbToggle.addEventListener('click', () => {
  cbOpen = !cbOpen;
  cbPanel.classList.toggle('open', cbOpen);
  const iconChat  = cbToggle.querySelector('.chatbot__toggle-icon--chat');
  const iconClose = cbToggle.querySelector('.chatbot__toggle-icon--close');
  iconChat.style.display  = cbOpen ? 'none' : 'flex';
  iconClose.style.display = cbOpen ? 'flex' : 'none';
  if (cbOpen) {
    cbBadge.style.display = 'none';
    if (!cbInited) {
      cbInited = true;
      const typing = cbTypingStart();
      setTimeout(() => {
        typing.remove();
        cbAddBot(BOT.welcome.msg);
        cbRenderQR(BOT.welcome.qr);
      }, 900);
    }
    setTimeout(cbScrollBottom, 100);
  }
});

cbClose.addEventListener('click', () => {
  cbOpen = false;
  cbPanel.classList.remove('open');
  cbToggle.querySelector('.chatbot__toggle-icon--chat').style.display = 'flex';
  cbToggle.querySelector('.chatbot__toggle-icon--close').style.display = 'none';
});

cbForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = cbInput.value.trim();
  if (!text) return;
  cbInput.value = '';
  cbAddUser(text);
  cbQR.innerHTML = '';
  cbCount++;
  const lower = text.toLowerCase();
  let matched = null;
  for (const entry of KEYWORDS) {
    if (entry.k.some(kw => lower.includes(kw))) { matched = entry.r; break; }
  }
  setTimeout(() => cbBotReply(matched || 'welcome'), 220);
});
