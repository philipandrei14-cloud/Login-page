 // ── Eye toggle ──
    const eyeBtn      = document.getElementById('eye-btn');
    const pwInput     = document.getElementById('password');
    const eyeIcon     = document.getElementById('eye-icon');
    const eyeOffIcon  = document.getElementById('eye-off-icon');
    let pwVisible = false;

    eyeBtn.addEventListener('click', () => {
        pwVisible = !pwVisible;
        pwInput.type = pwVisible ? 'text' : 'password';
        eyeIcon.style.display    = pwVisible ? 'none'  : 'block';
        eyeOffIcon.style.display = pwVisible ? 'block' : 'none';
    });

    // ── Theme toggle ──
    const html = document.documentElement;
    const btnDark  = document.getElementById('btn-dark');
    const btnLight = document.getElementById('btn-light');
    let isDark = true;

    function setTheme(dark) {
        isDark = dark;
        html.setAttribute('data-theme', dark ? 'dark' : 'light');
        btnDark.classList.toggle('active', dark);
        btnLight.classList.toggle('active', !dark);
    }

    btnDark.addEventListener('click',  () => setTheme(true));
    btnLight.addEventListener('click', () => setTheme(false));

    // ── Animated grid ──
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    const CELL = 64;
    let cols, rows, boxes = [], t = 0;
    const btn = document.getElementById('login-btn');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.ceil(canvas.width  / CELL) + 1;
        rows = Math.ceil(canvas.height / CELL) + 1;
        boxes = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                boxes.push({
                    x: c * CELL, y: r * CELL,
                    phase: (c + r) * 0.22 + Math.random() * 1.4,
                    speed: 0.35 + Math.random() * 0.3,
                    baseAlpha: 0.025 + Math.random() * 0.035
                });
            }
        }
    }

    function getBoxColor() {
        // Read from CSS variable to stay in sync with theme
        const style = getComputedStyle(html);
        const r = style.getPropertyValue('--box-r').trim() || '255';
        const g = style.getPropertyValue('--box-g').trim() || '255';
        const b = style.getPropertyValue('--box-b').trim() || '255';
        return { r: +r, g: +g, b: +b };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const globalWave = (Math.sin(t * 0.8) + 1) / 2;
        const { r, g, b } = getBoxColor();

        for (const box of boxes) {
            const wave = (Math.sin(t * box.speed - box.phase) + 1) / 2;
            const alpha       = box.baseAlpha + wave * 0.11;
            const borderAlpha = 0.05 + wave * 0.09;

            ctx.fillStyle   = `rgba(${r},${g},${b},${alpha})`;
            ctx.strokeStyle = `rgba(${r},${g},${b},${borderAlpha})`;
            ctx.lineWidth   = 0.5;

            ctx.beginPath();
            ctx.roundRect(box.x + 1, box.y + 1, CELL - 2, CELL - 2, 3);
            ctx.fill();
            ctx.stroke();
        }

        // ── Sync button glow to wave ──
        const glow   = Math.round(globalWave * 28);
        const spread = Math.round(globalWave * 14);
        const alpha  = (0.1 + globalWave * 0.22).toFixed(3);
        const alpha2 = (0.08 + globalWave * 0.12).toFixed(3);
        btn.style.boxShadow = `0 0 ${glow}px ${spread}px rgba(${r},${g},${b},${alpha}), 0 4px 20px rgba(${r},${g},${b},${alpha2})`;

        // Breathe button bg
        if (isDark) {
            const v = Math.round(255 - globalWave * 18);
            btn.style.background = `rgb(${v},${v},${v})`;
        } else {
            const v = Math.round(10 + globalWave * 18);
            btn.style.background = `rgb(${v},${v},${v})`;
        }

        t += 0.02;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    // ── Ripple ──
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
