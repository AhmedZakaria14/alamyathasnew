(() => {
  'use strict';
  const directory = document.querySelector('.coverage-directory');
  if (!directory) return;
  const search = directory.querySelector('#coverage-search');
  const filters = [...directory.querySelectorAll('[data-governorate][type="button"]')];
  const groups = [...directory.querySelectorAll('.coverage-group')];
  const normalize = value => value.normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[٠-٩]/g, char => String('٠١٢٣٤٥٦٧٨٩'.indexOf(char))).toLowerCase().trim();
  const cards = [...directory.querySelectorAll('.coverage-card')].map(element => ({element, text:normalize(element.textContent), governorate:element.dataset.governorate}));
  let governorate = 'all';
  const render = () => {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const visible = (governorate === 'all' || card.governorate === governorate) && terms.every(term => card.text.includes(term));
      card.element.hidden = !visible;
      if (visible) count++;
    });
    groups.forEach(group => {
      const visible = group.querySelectorAll('.coverage-card:not([hidden])').length;
      group.hidden = visible === 0;
      group.querySelector('.coverage-group-heading > span').textContent = `${visible} منطقة`;
    });
    directory.querySelector('.coverage-results').textContent = `عرض ${count} من ${cards.length} منطقة`;
    directory.querySelector('.coverage-empty').hidden = count !== 0;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.governorate === governorate)));
  };
  filters.forEach(button => button.addEventListener('click', () => {governorate = button.dataset.governorate; render();}));
  search.addEventListener('input', render);
  directory.querySelector('.coverage-tools').hidden = false;
  render();
})();
