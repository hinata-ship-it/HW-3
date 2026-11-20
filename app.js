// Готовая защитная механика. Не изменяйте эту функцию.
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function selectAttempts(filter) {
  const attempts = window.reportData.attempts;

  if (filter === 'all') {
    return attempts;
  } else if (filter === 'passed') {
    return attempts.filter(attempt => attempt.passed);
  } else if (filter === 'failed') {
    return attempts.filter(attempt => !attempt.passed);
  }

  return [];
}

function renderAttempts(attempts) {
  let html = '';
  const listElement = document.querySelector('#result-list');
  const countElement = document.querySelector('#result-count');


  // Проверка существования элементов
  if (!listElement || !countElement) {
    console.error('Элементы списка или счётчика не найдены');
    return;
  }

  if (attempts.length === 0) {
    html = '<li class="result-item">По выбранным критериям участники не найдены</li>';
  } else {
    attempts.forEach(attempt => {
      const status = attempt.passed ? 'Порог пройден' : 'Порог не пройден';
      html += `<li class="result-item">
        <span class="result-name">${escapeHtml(attempt.name)}</span>
        <span>${attempt.score} из ${window.reportData.questionCount} (${attempt.percentage}%) — ${status}</span>
      </li>`;
    });
  }

  listElement.innerHTML = html;
  countElement.textContent = `Показано: ${attempts.length} из ${window.reportData.attempts.length}`;
}

function startFilter() {
  const form = document.querySelector('#filter-form');
  const select = document.querySelector('#filter');

  if (!form || !select) {
    console.error('Форма фильтра или селектор не найдены');
    return;
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const filterValue = select.value;
    const filteredAttempts = selectAttempts(filterValue);
    renderAttempts(filteredAttempts);
  });

  // Инициализация: показываем все результаты при загрузке
  renderAttempts(selectAttempts('all'));
}

document.addEventListener('DOMContentLoaded', function() {
  startFilter();
});
