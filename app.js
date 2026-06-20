// JavaScript for Jonas' 11.5th Birthday Invitation

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initConfetti();
  initCalendarGenerator();
});

// ==========================================
// 1. COUNTDOWN TIMER
// ==========================================
function initCountdown() {
  // Target date: July 18, 2026, 15:00:00 (CEST is UTC+2)
  const targetDate = new Date('2026-07-18T15:00:00+02:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Event has started or passed
      document.querySelector('.countdown-card h3').innerHTML = '🎉 Das Abenteuer läuft! 🧭';
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Render with leading zero
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  // Initial call and set interval
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ==========================================
// 2. CANVAS CONFETTI SYSTEM (Physics-based)
// ==========================================
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const popSound = document.getElementById('pop-sound');

  let particles = [];
  const colors = [
    '#f43f5e', // rose
    '#3b82f6', // blue
    '#eab308', // yellow
    '#22c55e', // green
    '#a855f7', // purple
    '#ff7849', // orange
    '#00f5ff'  // cyan
  ];

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class ConfettiParticle {
    constructor(x, y, directionAngle = null) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      // Speed and direction
      const angle = directionAngle !== null 
        ? directionAngle + (Math.random() * 0.8 - 0.4) // narrow cone
        : Math.random() * Math.PI * 2; // full circle
        
      const speed = directionAngle !== null
        ? Math.random() * 12 + 10 // faster for targeted shots
        : Math.random() * 6 + 3;

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (directionAngle !== null ? 3 : 2); // upward bias
      
      this.gravity = 0.2;
      this.friction = 0.97;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      this.opacity = 1;
      this.fadeSpeed = Math.random() * 0.01 + 0.005;
      
      // Particle shape type
      this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.rotation += this.rotationSpeed;
      this.opacity -= this.fadeSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      }
      ctx.restore();
    }
  }

  function spawnBurst(x, y, count = 40, angle = null) {
    // Play sound on user interaction
    if (popSound && popSound.paused) {
      popSound.currentTime = 0;
      popSound.play().catch(() => { /* Chrome block ignore */ });
    }
    
    for (let i = 0; i < count; i++) {
      particles.push(new ConfettiParticle(x, y, angle));
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => p.opacity > 0);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  
  animate();

  // Trigger celebration on initial load: Multi-wave spectacular bursts!
  // Wave 1: Massive side cannons at 500ms
  setTimeout(() => {
    spawnBurst(0, canvas.height * 0.8, 120, -Math.PI / 4); // Left corner up-right
    spawnBurst(canvas.width, canvas.height * 0.8, 120, -Math.PI * 3 / 4); // Right corner up-left
  }, 500);

  // Wave 2: Center-bottom fountain at 800ms
  setTimeout(() => {
    spawnBurst(canvas.width / 2, canvas.height, 100, -Math.PI / 2); // Bottom center straight up
  }, 800);

  // Wave 3: Medium side cannons at 1100ms
  setTimeout(() => {
    spawnBurst(0, canvas.height * 0.85, 80, -Math.PI / 4.5);
    spawnBurst(canvas.width, canvas.height * 0.85, 80, -Math.PI * 3.5 / 4.5);
  }, 1100);

  // Wave 4: Small side cannons at 1500ms
  setTimeout(() => {
    spawnBurst(0, canvas.height * 0.9, 60, -Math.PI / 3.8);
    spawnBurst(canvas.width, canvas.height * 0.9, 60, -Math.PI * 2.8 / 3.8);
  }, 1500);

  // Bind click listeners to headings, signatures, and RSVP buttons with boosted counts
  const clickableElements = [
    { id: 'invitation-title', count: 120 },
    { id: 'jonas-signature', count: 120 },
    { class: 'btn-whatsapp', count: 80 },
    { id: 'add-to-calendar', count: 80 }
  ];

  clickableElements.forEach(item => {
    if (item.id) {
      const el = document.getElementById(item.id);
      if (el) {
        el.addEventListener('click', (e) => {
          const rect = el.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          spawnBurst(x, y, item.count);
        });
      }
    } else if (item.class) {
      const els = document.getElementsByClassName(item.class);
      Array.from(els).forEach(el => {
        el.addEventListener('click', (e) => {
          const rect = el.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          spawnBurst(x, y, item.count);
        });
      });
    }
  });

  // Clicking anywhere on empty canvas space sprouts more confetti (boosted to 45)
  window.addEventListener('click', (e) => {
    // Only spawn if clicking outside interactive elements
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !e.target.closest('.btn') && e.target.id !== 'invitation-title' && e.target.id !== 'jonas-signature') {
      spawnBurst(e.clientX, e.clientY, 45);
    }
  });

}

// ==========================================
// 3. ICS CALENDAR FILE GENERATION
// ==========================================
function initCalendarGenerator() {
  const btn = document.getElementById('add-to-calendar');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Format the date/time string for iCal (YYYYMMDDTHHMMSSZ)
    // Event: July 18, 2026, 15:00 to 19:30 local time (Germany, CEST = UTC+2)
    // 15:00 CEST = 13:00 UTC
    // 19:30 CEST = 17:30 UTC
    const startDate = '20260718T130000Z'; 
    const endDate = '20260718T173000Z'; 

    const calendarContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jonas Geburtstag Einladung//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:jonas-11-5-geburtstag@schwetzingen-2026',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:' + startDate,
      'DTEND:' + endDate,
      'SUMMARY:Jonas\' 11,5. Geburtstag! 🎂🚴',
      'DESCRIPTION:Einladung zu Jonas\' 11\\,5. Geburtstag!\\n\\nTREFFPUNKT:\\n18.07.2026 ab 15:00 Uhr\\nPápa-Straße 27\\n68723 Schwetzingen\\n\\n**WICHTIG**:\\nBring bitte unbedingt Dein Fahrrad mit! Wir machen eine Geocaching-Tour (Schnitzeljagd) durch den Dossenwald.\\n\\nENDE:\\nVoraussichtlich ab 18:30 Uhr / 19:00 Uhr bei Stockbrot und Würstchen vom Feuer.\\n\\nRÜCKMELDUNG:\\nBitte Bescheid geben unter 0176-62801551 (Mama Nina).\\n\\nIch freue mich auf Dich!\\nDein Jonas',
      'LOCATION:Pápa-Straße 27\\, 68723 Schwetzingen',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D', // Alarm 1 day before
      'DESCRIPTION:Morgen feiert Jonas seinen 11,5. Geburtstag!',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create file blob and trigger download
    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'Jonas_11_Halb_Geburtstag.ics';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Revoke URL to release resources
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  });
}
