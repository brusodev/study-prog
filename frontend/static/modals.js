// ============= MODAL SYSTEM (Pure JS - No Alpine) =============
class Modal {
  constructor(id) {
    this.id = id;
    this.element = document.getElementById(id);
    this.isOpen = false;
    this.editId = null;
    this.form = {};
    
    if (!this.element) {
      console.error(`Modal ${id} not found`);
      return;
    }
    
    // Setup close on background click
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }
  
  open() {
    this.isOpen = true;
    this.element.classList.remove('hidden');
    this.render();
  }
  
  close() {
    this.isOpen = false;
    this.element.classList.add('hidden');
    this.reset();
  }
  
  reset() {
    this.editId = null;
    this.form = {};
  }
  
  render() {
    // Override in subclasses
  }
}

class EventModal extends Modal {
  constructor() {
    super('event-modal');
    this.form = {
      title: '',
      subject: '',
      start: '',
      end: '',
      color: '#3b82f6',
      description: ''
    };
  }
  
  openFor(dateStr) {
    this.reset();
    if (dateStr && dateStr.includes('T')) {
      const d = new Date(dateStr);
      this.form.start = d.toISOString().slice(0, 16);
      const d2 = new Date(d.getTime() + 60 * 60 * 1000);
      this.form.end = d2.toISOString().slice(0, 16);
    } else if (dateStr) {
      this.form.start = dateStr + "T09:00";
      this.form.end = dateStr + "T10:00";
    }
    this.open();
  }
  
  async save() {
    try {
      const payload = {
        title: this.form.title,
        subject: this.form.subject,
        start: new Date(this.form.start).toISOString(),
        end: this.form.end ? new Date(this.form.end).toISOString() : null,
        color: this.form.color,
        description: this.form.description
      };
      
      if (this.editId) {
        await axios.put(`/api/events/${this.editId}`, payload);
      } else {
        await axios.post('/api/events', payload);
      }
      
      if (window.calendar) window.calendar.refetchEvents();
      if (window.loadDailyChart) window.loadDailyChart();
      if (window.loadQuickStats) window.loadQuickStats();
      this.close();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar evento');
    }
  }
  
  async remove() {
    if (!this.editId) return;
    if (!confirm('Excluir evento?')) return;
    
    await axios.delete(`/api/events/${this.editId}`);
    if (window.calendar) window.calendar.refetchEvents();
    this.close();
  }
}

class SubjectModal extends Modal {
  constructor() {
    super('subject-modal');
    this.form = {
      name: '',
      color: '#3b82f6',
      description: ''
    };
  }
  
  async save() {
    try {
      if (!this.form.name || this.form.name.trim() === '') {
        alert('Por favor, preencha o nome da matéria');
        return;
      }
      
      const payload = {
        name: this.form.name,
        color: this.form.color,
        description: this.form.description || ''
      };
      
      if (this.editId) {
        await axios.put(`/api/subjects/${this.editId}`, payload);
      } else {
        await axios.post('/api/subjects', payload);
      }
      
      if (window.loadSubjects) window.loadSubjects();
      this.close();
    } catch (e) {
      console.error('Error saving subject:', e);
      alert('Erro ao salvar matéria');
    }
  }
  
  async remove() {
    if (!this.editId) return;
    if (!confirm('Excluir matéria?')) return;
    
    try {
      await axios.delete(`/api/subjects/${this.editId}`);
      if (window.loadSubjects) window.loadSubjects();
      this.close();
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir matéria');
    }
  }
}

class ScheduleModal extends Modal {
  constructor() {
    super('schedule-modal');
    this.subjects = [];
    this.form = {
      subject_id: '',
      day_of_week: 0,
      start_time: '09:00',
      end_time: '10:00',
      active: true
    };
  }
  
  async init() {
    const res = await axios.get('/api/subjects');
    this.subjects = res.data;
    this.render();
  }
  
  async save() {
    try {
      const payload = {
        subject_id: parseInt(this.form.subject_id),
        day_of_week: parseInt(this.form.day_of_week),
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        active: this.form.active
      };
      
      if (this.editId) {
        await axios.put(`/api/schedules/${this.editId}`, payload);
      } else {
        await axios.post('/api/schedules', payload);
      }
      
      if (window.loadSchedules) window.loadSchedules();
      this.close();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar horário');
    }
  }
  
  async remove() {
    if (!this.editId) return;
    if (!confirm('Excluir horário?')) return;
    
    await axios.delete(`/api/schedules/${this.editId}`);
    if (window.loadSchedules) window.loadSchedules();
    this.close();
  }
}

// Initialize modals
let eventModal, subjectModal, scheduleModal;

document.addEventListener('DOMContentLoaded', () => {
  eventModal = new EventModal();
  subjectModal = new SubjectModal();
  scheduleModal = new ScheduleModal();
  
  console.log('Modals initialized:', {eventModal, subjectModal, scheduleModal});
});
