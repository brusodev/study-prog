// Global variables
let calendar;
let charts = {};
let statsChartsLoaded = false;

// ============= MOBILE MENU =============
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
};

// ============= SIMPLE MODAL SYSTEM (No Alpine) =============
const modals = {
  event: { open: false, editId: null, form: {}, subjects: [] },
  subject: { open: false, editId: null, form: {} },
  schedule: { open: false, editId: null, form: {}, subjects: [] }
};

window.openModal = function(modalId) {
  const modalKey = modalId.replace('-modal', '');
  const modal = modals[modalKey];

  if (!modal) {
    console.error(`Modal ${modalId} not found`);
    return;
  }

  // Reset form
  modal.editId = null;
  modal.form = modalKey === 'subject' ? { name: '', color: '#3b82f6', description: '' } :
                modalKey === 'schedule' ? { subject_id: '', day_of_week: 0, start_time: '09:00', end_time: '10:00', active: true } :
                { title: '', subject: '', start: '', end: '', color: '#3b82f6', description: '' };

  // Load subjects for event modal
  if (modalKey === 'event') {
    console.log('🔄 Loading subjects for event modal...');

    // Show modal first to ensure DOM is ready
    modal.open = true;
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('hidden');

    // Then load subjects
    axios.get('/api/subjects').then(res => {
      modal.subjects = res.data;
      console.log(`✅ Loaded ${res.data.length} subjects:`, res.data);

      // Wait a tiny bit to ensure DOM is fully rendered
      setTimeout(() => {
        updateEventSelectOptions();
      }, 50);
    }).catch(err => {
      console.error('❌ Error loading subjects:', err);
      alert('Erro ao carregar matérias. Verifique se há matérias cadastradas.');
    });

    console.log(`✅ Opened ${modalId}`);
    return; // Don't continue to the generic show modal code below
  }

  // Load subjects for schedule modal
  if (modalKey === 'schedule') {
    console.log('🔄 Loading subjects for schedule modal...');

    // Show modal first to ensure DOM is ready
    modal.open = true;
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('hidden');

    // Then load subjects
    axios.get('/api/subjects').then(res => {
      modal.subjects = res.data;
      console.log(`✅ Loaded ${res.data.length} subjects:`, res.data);

      // Wait a tiny bit to ensure DOM is fully rendered
      setTimeout(() => {
        updateScheduleSelectOptions();
      }, 50);
    }).catch(err => {
      console.error('❌ Error loading subjects:', err);
      alert('Erro ao carregar matérias. Verifique se há matérias cadastradas.');
    });

    console.log(`✅ Opened ${modalId}`);
    return; // Don't continue to the generic show modal code below
  }

  // Show modal (for non-schedule modals)
  modal.open = true;
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('hidden');

  console.log(`✅ Opened ${modalId}`);
}

window.closeModal = function(modalId) {
  const modalKey = modalId.replace('-modal', '');
  const modal = modals[modalKey];
  
  if (modal) {
    modal.open = false;
    const el = document.getElementById(modalId);
    if (el) el.classList.add('hidden');
  }
}

window.saveSubject = async function() {
  const id = document.getElementById('subject-id').value;
  const name = document.getElementById('subject-name').value;
  const color = document.getElementById('subject-color').value;
  const description = document.getElementById('subject-description').value;
  
  if (!name || name.trim() === '') {
    alert('Por favor, preencha o nome da matéria');
    return;
  }
  
  try {
    const payload = { name, color, description: description || '' };
    
    if (id) {
      await axios.put(`/api/subjects/${id}`, payload);
    } else {
      await axios.post('/api/subjects', payload);
    }
    
    if (window.loadSubjects) window.loadSubjects();
    closeModal('subject-modal');
    
    // Clear form
    document.getElementById('subject-id').value = '';
    document.getElementById('subject-name').value = '';
    document.getElementById('subject-color').value = '#3b82f6';
    document.getElementById('subject-description').value = '';
    document.getElementById('subject-modal-title').textContent = 'Nova Matéria';
    document.getElementById('subject-save-btn').textContent = 'Criar';
    document.getElementById('subject-delete-btn').classList.add('hidden');
    
    console.log('✅ Subject saved successfully!');
  } catch (e) {
    console.error(e);
    alert('Erro ao salvar matéria');
  }
}

window.deleteSubject = async function() {
  const id = document.getElementById('subject-id').value;
  if (!id) return;
  
  if (!confirm('Excluir matéria?')) return;
  
  try {
    await axios.delete(`/api/subjects/${id}`);
    if (window.loadSubjects) window.loadSubjects();
    closeModal('subject-modal');
    console.log('✅ Subject deleted!');
  } catch (e) {
    console.error(e);
    alert('Erro ao excluir matéria');
  }
}

window.saveEvent = async function() {
  const id = document.getElementById('event-id').value;
  const title = document.getElementById('event-title').value;
  const subject = document.getElementById('event-subject').value;
  const start = document.getElementById('event-start').value;
  const end = document.getElementById('event-end').value;
  const color = document.getElementById('event-color').value;
  const description = document.getElementById('event-description').value;
  
  if (!title || title.trim() === '') {
    alert('Por favor, preencha o título do evento');
    return;
  }
  
  if (!start) {
    alert('Por favor, preencha a data/hora de início');
    return;
  }
  
  try {
    // Enviar datas diretamente como strings ISO sem conversão extra
    const payload = {
      title,
      start: start, // Já vem como string do input datetime-local
      end: end || null, // Já vem como string do input datetime-local
      allDay: false,
      color,
      description: description || ''
    };
    
    // Só incluir subject se não estiver vazio
    if (subject && subject.trim() !== '') {
      payload.subject = subject.trim();
    }
    
    console.log('📤 Enviando payload:', payload);
    console.log('🔗 URL:', id ? `/api/events/${id}` : '/api/events');
    
    if (id) {
      await axios.put(`/api/events/${id}`, payload);
    } else {
      await axios.post('/api/events', payload);
    }
    
    if (window.calendar) window.calendar.refetchEvents();
    if (window.loadDailyChart) window.loadDailyChart();
    if (window.loadQuickStats) window.loadQuickStats();
    closeModal('event-modal');
    
    // Clear form
    document.getElementById('event-id').value = '';
    document.getElementById('event-title').value = '';
    document.getElementById('event-subject').value = '';
    document.getElementById('event-start').value = '';
    document.getElementById('event-end').value = '';
    document.getElementById('event-color').value = '#3b82f6';
    document.getElementById('event-description').value = '';
    document.getElementById('event-modal-title').textContent = 'Novo Evento';
    document.getElementById('event-save-btn').textContent = 'Criar';
    document.getElementById('event-delete-btn').classList.add('hidden');
    
    console.log('✅ Event saved successfully!');
  } catch (e) {
    console.error(e);
    alert('Erro ao salvar evento');
  }
}

window.deleteEvent = async function() {
  const id = document.getElementById('event-id').value;
  if (!id) return;
  
  if (!confirm('Excluir evento?')) return;
  
  try {
    await axios.delete(`/api/events/${id}`);
    if (window.calendar) window.calendar.refetchEvents();
    if (window.loadDailyChart) window.loadDailyChart();
    if (window.loadQuickStats) window.loadQuickStats();
    closeModal('event-modal');
    console.log('✅ Event deleted!');
  } catch (e) {
    console.error(e);
    alert('Erro ao excluir evento');
  }
}

window.openEventModal = function(dateStr) {
  // openModal will now load subjects automatically
  openModal('event-modal');

  // Set dates based on dateStr
  if (!dateStr) {
    const now = new Date();
    const startStr = now.getFullYear() + '-' +
                     String(now.getMonth() + 1).padStart(2, '0') + '-' +
                     String(now.getDate()).padStart(2, '0') + 'T' +
                     String(now.getHours()).padStart(2, '0') + ':' +
                     String(now.getMinutes()).padStart(2, '0');
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endStr = endTime.getFullYear() + '-' +
                   String(endTime.getMonth() + 1).padStart(2, '0') + '-' +
                   String(endTime.getDate()).padStart(2, '0') + 'T' +
                   String(endTime.getHours()).padStart(2, '0') + ':' +
                   String(endTime.getMinutes()).padStart(2, '0');
    document.getElementById('event-start').value = startStr;
    document.getElementById('event-end').value = endStr;
  } else if (dateStr.includes('T')) {
    // Already has time
    const d = new Date(dateStr);
    if (!isNaN(d)) {
      const startStr = d.getFullYear() + '-' +
                       String(d.getMonth() + 1).padStart(2, '0') + '-' +
                       String(d.getDate()).padStart(2, '0') + 'T' +
                       String(d.getHours()).padStart(2, '0') + ':' +
                       String(d.getMinutes()).padStart(2, '0');
      const d2 = new Date(d.getTime() + 60 * 60 * 1000);
      const endStr = d2.getFullYear() + '-' +
                     String(d2.getMonth() + 1).padStart(2, '0') + '-' +
                     String(d2.getDate()).padStart(2, '0') + 'T' +
                     String(d2.getHours()).padStart(2, '0') + ':' +
                     String(d2.getMinutes()).padStart(2, '0');
      document.getElementById('event-start').value = startStr;
      document.getElementById('event-end').value = endStr;
    } else {
      // Fallback to current time
      const now = new Date();
      const startStr = now.getFullYear() + '-' +
                       String(now.getMonth() + 1).padStart(2, '0') + '-' +
                       String(now.getDate()).padStart(2, '0') + 'T' +
                       String(now.getHours()).padStart(2, '0') + ':' +
                       String(now.getMinutes()).padStart(2, '0');
      const endTime = new Date(now.getTime() + 60 * 60 * 1000);
      const endStr = endTime.getFullYear() + '-' +
                     String(endTime.getMonth() + 1).padStart(2, '0') + '-' +
                     String(endTime.getDate()).padStart(2, '0') + 'T' +
                     String(endTime.getHours()).padStart(2, '0') + ':' +
                     String(endTime.getMinutes()).padStart(2, '0');
      document.getElementById('event-start').value = startStr;
      document.getElementById('event-end').value = endStr;
    }
  } else {
    // Only date, add default time
    const startStr = dateStr + "T09:00";
    const endStr = dateStr + "T10:00";
    document.getElementById('event-start').value = startStr;
    document.getElementById('event-end').value = endStr;
  }

  console.log('🗓️ Event modal opened with start:', document.getElementById('event-start').value);
}

window.openEventModalForEdit = function(event) {
  openModal('event-modal');
  
  document.getElementById('event-id').value = event.id;
  document.getElementById('event-title').value = event.extendedProps?.originalTitle || event.title || '';
  document.getElementById('event-subject').value = event.extendedProps?.subject || '';
  
  // Formatar datas locais sem conversão para UTC
  if (event.start) {
    const startDate = new Date(event.start);
    const startStr = startDate.getFullYear() + '-' + 
                     String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(startDate.getDate()).padStart(2, '0') + 'T' + 
                     String(startDate.getHours()).padStart(2, '0') + ':' + 
                     String(startDate.getMinutes()).padStart(2, '0');
    document.getElementById('event-start').value = startStr;
  }
  
  if (event.end) {
    const endDate = new Date(event.end);
    const endStr = endDate.getFullYear() + '-' + 
                   String(endDate.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(endDate.getDate()).padStart(2, '0') + 'T' + 
                   String(endDate.getHours()).padStart(2, '0') + ':' + 
                   String(endDate.getMinutes()).padStart(2, '0');
    document.getElementById('event-end').value = endStr;
  }
  
  document.getElementById('event-color').value = event.extendedProps?.color || event.backgroundColor || '#3b82f6';
  document.getElementById('event-description').value = event.extendedProps?.description || '';
  
  document.getElementById('event-modal-title').textContent = 'Editar Evento';
  document.getElementById('event-save-btn').textContent = 'Salvar';
  document.getElementById('event-delete-btn').classList.remove('hidden');
}

window.saveSchedule = async function() {
  const id = document.getElementById('schedule-id').value;
  const subject_id = document.getElementById('schedule-subject').value;
  const day_of_week = document.getElementById('schedule-day').value;
  const start_time = document.getElementById('schedule-start').value;
  const end_time = document.getElementById('schedule-end').value;
  const active = document.getElementById('schedule-active').checked;
  
  if (!subject_id) {
    alert('Por favor, selecione uma matéria');
    return;
  }
  
  if (!start_time || !end_time) {
    alert('Por favor, preencha horário de início e fim');
    return;
  }
  
  try {
    const payload = {
      subject_id: parseInt(subject_id),
      day_of_week: parseInt(day_of_week),
      start_time,
      end_time,
      active
    };
    
    if (id) {
      await axios.put(`/api/schedules/${id}`, payload);
    } else {
      await axios.post('/api/schedules', payload);
    }
    
    if (window.loadSchedules) window.loadSchedules();
    closeModal('schedule-modal');
    
    // Clear form
    document.getElementById('schedule-id').value = '';
    document.getElementById('schedule-subject').value = '';
    document.getElementById('schedule-day').value = '0';
    document.getElementById('schedule-start').value = '09:00';
    document.getElementById('schedule-end').value = '10:00';
    document.getElementById('schedule-active').checked = true;
    document.getElementById('schedule-modal-title').textContent = 'Novo Horário';
    document.getElementById('schedule-save-btn').textContent = 'Criar';
    document.getElementById('schedule-delete-btn').classList.add('hidden');
    
    console.log('✅ Schedule saved successfully!');
  } catch (e) {
    console.error(e);
    alert('Erro ao salvar horário');
  }
}

window.deleteSchedule = async function() {
  const id = document.getElementById('schedule-id').value;
  if (!id) return;
  
  if (!confirm('Excluir horário?')) return;
  
  try {
    await axios.delete(`/api/schedules/${id}`);
    if (window.loadSchedules) window.loadSchedules();
    closeModal('schedule-modal');
    console.log('✅ Schedule deleted!');
  } catch (e) {
    console.error(e);
    alert('Erro ao excluir horário');
  }
}

function updateScheduleSelectOptions() {
  const select = document.getElementById('schedule-subject');
  if (!select) {
    console.error('❌ Select schedule-subject not found!');
    return;
  }

  console.log(`📋 Updating schedule select with ${modals.schedule.subjects.length} subjects`);

  select.innerHTML = '<option value="">Selecione uma matéria</option>';
  modals.schedule.subjects.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    select.appendChild(opt);
  });

  console.log('✅ Schedule select updated');
}

function updateEventSelectOptions() {
  const select = document.getElementById('event-subject');
  if (!select) {
    console.error('❌ Select event-subject not found!');
    return;
  }

  console.log(`📋 Updating event select with ${modals.event.subjects.length} subjects`);

  select.innerHTML = '<option value="">Selecione uma matéria</option>';
  modals.event.subjects.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = s.name;
    opt.setAttribute('data-color', s.color);
    select.appendChild(opt);
  });

  // Add event listener to update color when subject is selected
  select.onchange = function() {
    const selectedOption = this.options[this.selectedIndex];
    const color = selectedOption.getAttribute('data-color');
    if (color) {
      document.getElementById('event-color').value = color;
      console.log(`🎨 Color updated to ${color} for subject ${selectedOption.value}`);
    }
  };

  console.log('✅ Event select updated');
}

// ============= TABS =============
window.showTab = function(tabName) {
  // Hide mobile menu
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');
  
  // Hide all content
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'bg-blue-100', 'text-blue-700'));
  
  // Show selected content
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  // Activate selected button
  const btn = document.getElementById(`tab-${tabName}`);
  btn.classList.add('active', 'bg-blue-100', 'text-blue-700');
  
  // Load data when switching tabs (prevent infinite loops by checking if already loaded)
  if (tabName === 'subjects') {
    loadSubjects();
  } else if (tabName === 'schedule') {
    loadSchedules();
  } else if (tabName === 'stats') {
    // Only load stats charts once when tab is first shown
    if (!statsChartsLoaded) {
      setTimeout(() => loadStatsCharts(), 100);
    }
  }
}

// NOTE: Modal functions (eventModal, subjectModal, scheduleModal) are defined in index.html inline script
// to ensure they're available BEFORE Alpine.js initializes

// ============= CALENDAR =============
function initCalendar() {
  console.log('initCalendar called');
  console.log('FullCalendar type:', typeof FullCalendar);
  console.log('FullCalendar object:', FullCalendar);
  
  // Check if FullCalendar is loaded
  if (typeof FullCalendar === 'undefined') {
    console.error('FullCalendar not loaded! Retrying in 100ms...');
    setTimeout(initCalendar, 100);
    return;
  }
  
  console.log('FullCalendar loaded successfully!');
  
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('Calendar element not found!');
    return;
  }
  
  console.log('Calendar element found, creating calendar...');

  window.calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: { 
      left: 'prev,next today', 
      center: 'title', 
      right: 'dayGridMonth,timeGridWeek' // Removido timeGridDay para simplificar
    },
    locale: 'pt-br',
    timeZone: 'local', // Garantir que use timezone local
    dayMaxEvents: 6, // Mostrar até 6 eventos por dia na visão mensal
    moreLinkClick: 'popover', // Mostrar popup com todos os eventos ao clicar em "+X more"
    events: function (info, successCallback, failureCallback) {
      axios.get('/api/events')
        .then(response => {
          const events = response.data.map(e => ({
            id: e.id,
            title: e.subject || e.title, // Mostrar matéria como título principal
            start: e.start,
            end: e.end,
            allDay: e.allDay || false,
            backgroundColor: e.color || '#3b82f6',
            borderColor: e.color || '#3b82f6',
            extendedProps: {
              subject: e.subject,
              originalTitle: e.title, // Guardar título original
              description: e.description,
              color: e.color
            }
          }));
          successCallback(events);
        })
        .catch(error => {
          console.error('Error loading events:', error);
          failureCallback(error);
        });
    },
    dateClick: function (info) {
      openEventModal(info.dateStr);
    },
    eventClick: function (info) {
      openEventModalForEdit(info.event);
    }
  });

  window.calendar.render();
  window.loadDailyChart();
  window.loadQuickStats();
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', initCalendar);

// ============= SUBJECTS =============
window.loadSubjects = async function() {
  try {
    const res = await axios.get('/api/subjects');
    const subjects = res.data;
    const container = document.getElementById('subjects-list');
    
    if (subjects.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-8">Nenhuma matéria cadastrada. Clique em "+ Nova Matéria" para começar.</p>';
      return;
    }
    
    container.innerHTML = subjects.map(s => `
      <div class="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded" style="background-color: ${s.color}"></div>
          <div>
            <div class="font-medium">${s.name}</div>
            ${s.description ? `<div class="text-sm text-gray-500">${s.description}</div>` : ''}
          </div>
        </div>
        <div class="flex gap-2">
          <button 
            onclick="editSubject(${s.id}, '${s.name.replace(/'/g, "\\'")}', '${s.color}', '${(s.description || '').replace(/'/g, "\\'")}')"
            class="btn-small bg-blue-100 text-blue-700 hover:bg-blue-200">
            Editar
          </button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

window.editSubject = function(id, name, color, description) {
  document.getElementById('subject-id').value = id;
  document.getElementById('subject-name').value = name;
  document.getElementById('subject-color').value = color;
  document.getElementById('subject-description').value = description || '';
  
  document.getElementById('subject-modal-title').textContent = 'Editar Matéria';
  document.getElementById('subject-save-btn').textContent = 'Salvar';
  document.getElementById('subject-delete-btn').classList.remove('hidden');
  
  document.getElementById('subject-modal').classList.remove('hidden');
}

// ============= SCHEDULES =============
window.loadSchedules = async function() {
  try {
    const res = await axios.get('/api/schedules');
    const schedules = res.data;
    const tbody = document.getElementById('schedule-list');
    
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    if (schedules.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">Nenhum horário configurado.</td></tr>';
      return;
    }
    
    tbody.innerHTML = schedules.map(s => `
      <tr class="hover:bg-gray-50">
        <td class="border p-2">${days[s.day_of_week]}</td>
        <td class="border p-2">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded" style="background-color: ${s.subject_color}"></div>
            ${s.subject_name}
          </div>
        </td>
        <td class="border p-2">${s.start_time} - ${s.end_time}</td>
        <td class="border p-2 text-center">${s.active ? '✅' : '❌'}</td>
        <td class="border p-2">
          <button 
            onclick="editSchedule(${s.id}, ${s.subject_id}, ${s.day_of_week}, '${s.start_time}', '${s.end_time}', ${s.active})"
            class="btn-small bg-blue-100 text-blue-700 hover:bg-blue-200">
            Editar
          </button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

window.editSchedule = function(id, subject_id, day_of_week, start_time, end_time, active) {
  // Load subjects first, then populate form
  axios.get('/api/subjects').then(res => {
    modals.schedule.subjects = res.data;
    updateScheduleSelectOptions();
    
    // Populate form
    document.getElementById('schedule-id').value = id;
    document.getElementById('schedule-subject').value = subject_id;
    document.getElementById('schedule-day').value = day_of_week;
    document.getElementById('schedule-start').value = start_time;
    document.getElementById('schedule-end').value = end_time;
    document.getElementById('schedule-active').checked = active;
    
    document.getElementById('schedule-modal-title').textContent = 'Editar Horário';
    document.getElementById('schedule-save-btn').textContent = 'Salvar';
    document.getElementById('schedule-delete-btn').classList.remove('hidden');
    
    // Show modal
    document.getElementById('schedule-modal').classList.remove('hidden');
  });
}

window.generateEvents = async function() {
  if (!confirm('Gerar eventos das próximas 4 semanas baseado no cronograma?')) return;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await axios.post(`/api/schedules/generate-events?start_date=${today}&weeks=4`);
    alert(res.data.message);
    calendar.refetchEvents();
    loadDailyChart();
    loadQuickStats();
  } catch (e) {
    console.error(e);
    alert('Erro ao gerar eventos');
  }
}

// ============= CHARTS =============
window.loadDailyChart = async function() {
  // Prevent multiple simultaneous calls
  if (window.loadDailyChart.loading) return;
  window.loadDailyChart.loading = true;
  
  try {
    const canvasEl = document.getElementById('dailyChart');
    if (!canvasEl) {
      console.warn('dailyChart canvas not found');
      return;
    }
    
    const res = await axios.get('/api/stats/daily-hours?days=7');
    const data = res.data;
    const labels = Object.keys(data).map(d => new Date(d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }));
    const values = Object.values(data).map(v => parseFloat(v.toFixed(2)));

    const ctx = canvasEl.getContext('2d');
    if (charts.daily) {
      charts.daily.destroy();
      charts.daily = null;
    }
    
    charts.daily = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Horas',
          data: values,
          backgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  } catch (e) {
    console.error('Error loading daily chart:', e);
  } finally {
    window.loadDailyChart.loading = false;
  }
}

window.loadQuickStats = async function() {
  if (window.loadQuickStats.loading) return;
  window.loadQuickStats.loading = true;
  
  try {
    const eventsRes = await axios.get('/api/events');
    const total = eventsRes.data.length;
    const totalEl = document.getElementById('total-events');
    if (totalEl) totalEl.textContent = total;

    const hoursRes = await axios.get('/api/stats/daily-hours?days=7');
    const weekHours = Object.values(hoursRes.data).reduce((sum, h) => sum + h, 0);
    const hoursEl = document.getElementById('week-hours');
    if (hoursEl) hoursEl.textContent = weekHours.toFixed(1) + 'h';
  } catch (e) {
    console.error('Error loading quick stats:', e);
  } finally {
    window.loadQuickStats.loading = false;
  }
}

window.loadStatsCharts = async function() {
  // Prevent multiple simultaneous calls
  if (loadStatsCharts.loading) return;
  loadStatsCharts.loading = true;
  
  console.log('🔄 Loading stats charts...');
  
  try {
    // Hours by subject
    const hoursRes = await axios.get('/api/stats/subject-hours?days=30');
    const hoursData = hoursRes.data;
    const hoursLabels = Object.keys(hoursData);
    const hoursValues = Object.values(hoursData).map(v => parseFloat(v.toFixed(2)));

    const ctx1 = document.getElementById('subjectHoursChart');
    if (ctx1 && ctx1.getContext) {
      if (charts.subjectHours) {
        charts.subjectHours.destroy();
        charts.subjectHours = null;
      }
      charts.subjectHours = new Chart(ctx1.getContext('2d'), {
        type: 'pie',
        data: {
          labels: hoursLabels,
          datasets: [{
            data: hoursValues,
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: true 
        }
      });
    }

    // Count by subject
    const countRes = await axios.get('/api/stats/subjects');
    const countData = countRes.data;
    const countLabels = Object.keys(countData);
    const countValues = Object.values(countData);

    const ctx2 = document.getElementById('subjectCountChart');
    if (ctx2 && ctx2.getContext) {
      if (charts.subjectCount) {
        charts.subjectCount.destroy();
        charts.subjectCount = null;
      }
      charts.subjectCount = new Chart(ctx2.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: countLabels,
          datasets: [{
            data: countValues,
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: true 
        }
      });
    }

    // 14 days history
    const dailyRes = await axios.get('/api/stats/daily-hours?days=14');
    const dailyData = dailyRes.data;
    const dailyLabels = Object.keys(dailyData).map(d => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    const dailyValues = Object.values(dailyData).map(v => parseFloat(v.toFixed(2)));

    const ctx3 = document.getElementById('daily14Chart');
    if (ctx3 && ctx3.getContext) {
      if (charts.daily14) {
        charts.daily14.destroy();
        charts.daily14 = null;
      }
      charts.daily14 = new Chart(ctx3.getContext('2d'), {
        type: 'line',
        data: {
          labels: dailyLabels,
          datasets: [{
            label: 'Horas de Estudo',
            data: dailyValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
    
    console.log('✅ Stats charts loaded successfully');
    statsChartsLoaded = true;
  } catch (e) {
    console.error('❌ Error loading stats charts:', e);
  } finally {
    loadStatsCharts.loading = false;
  }
}
