(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'lang';
  var titles = {
    zh: root.getAttribute('data-title-zh') || document.title,
    en: root.getAttribute('data-title-en') || document.title
  };

  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.lang = l === 'zh' ? 'zh-CN' : 'en';
    document.title = titles[l];
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = l === 'zh' ? 'EN' : '中文';
      btns[i].setAttribute('aria-label', l === 'zh' ? 'Switch to English' : '切换到中文');
    }
    // translate placeholders
    var ph = document.querySelectorAll('[data-ph-zh]');
    for (var j = 0; j < ph.length; j++) {
      ph[j].setAttribute('placeholder', ph[j].getAttribute('data-ph-' + l));
    }
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'zh');

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-lang-toggle]');
    if (t) setLang(root.getAttribute('data-lang') === 'zh' ? 'en' : 'zh');
  });

  // Mobile nav
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    var close = function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Contact form -> mailto
  var form = document.getElementById('contact-form');
  if (!form) return;
  var TO = 'contact@hezgobot.top';
  var msgs = {
    name: { zh: '请填写您的称呼。', en: 'Please enter your name.' },
    emailEmpty: { zh: '请填写邮箱地址。', en: 'Please enter your email address.' },
    emailBad: { zh: '邮箱格式似乎不正确。', en: 'That email address looks invalid.' },
    message: { zh: '请填写留言内容（至少 10 个字符）。', en: 'Please enter a message (at least 10 characters).' },
    ok: { zh: '已为您打开邮件客户端，请在邮件中确认并发送。若未弹出，请直接发送邮件至 ' + TO + '。', en: 'Your mail app should now open with the message prefilled — please review and send it. If nothing opens, email ' + TO + ' directly.' },
    fix: { zh: '请修正标出的字段后再提交。', en: 'Please fix the highlighted fields.' }
  };
  var status = document.getElementById('form-status');
  function lang() { return root.getAttribute('data-lang') === 'en' ? 'en' : 'zh'; }
  function setErr(field, key) {
    var el = form.elements[field];
    var err = document.getElementById(field + '-error');
    if (key) {
      el.setAttribute('aria-invalid', 'true');
      err.textContent = msgs[key][lang()];
    } else {
      el.removeAttribute('aria-invalid');
      err.textContent = '';
    }
    return !key;
  }
  function validate() {
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();
    var ok = true, first = null;
    if (!setErr('name', name ? null : 'name')) { ok = false; first = first || 'name'; }
    var eKey = !email ? 'emailEmpty' : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? null : 'emailBad');
    if (!setErr('email', eKey)) { ok = false; first = first || 'email'; }
    if (!setErr('message', message.length >= 10 ? null : 'message')) { ok = false; first = first || 'message'; }
    return { ok: ok, first: first, name: name, email: email, message: message };
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var r = validate();
    if (!r.ok) {
      status.className = 'form-status error';
      status.textContent = msgs.fix[lang()];
      form.elements[r.first].focus();
      return;
    }
    var l = lang();
    var subject = (l === 'zh' ? '网站咨询 - ' : 'Website enquiry - ') + r.name;
    var body = (l === 'zh'
      ? '称呼：' + r.name + '\n邮箱：' + r.email + '\n\n留言：\n'
      : 'Name: ' + r.name + '\nEmail: ' + r.email + '\n\nMessage:\n') + r.message + '\n';
    var href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.className = 'form-status ok';
    status.textContent = msgs.ok[l];
    window.location.href = href;
  });
  ['name', 'email', 'message'].forEach(function (f) {
    form.elements[f].addEventListener('input', function () {
      if (form.elements[f].getAttribute('aria-invalid')) validate();
    });
  });
})();
