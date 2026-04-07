/* ============================================
   CONSTELLATION.JS — Interactive Skill Map
   ============================================ */

const constellationCanvas = document.getElementById('constellationCanvas');
if (constellationCanvas) {
    const ctx = constellationCanvas.getContext('2d');
    const tooltip = document.getElementById('constellationTooltip');
    const wrapper = constellationCanvas.parentElement;

    const skills = [
        { name: 'React.js', category: 'frontend', level: 'Expert', years: '3+' },
        { name: 'JavaScript', category: 'frontend', level: 'Expert', years: '3+' },
        { name: 'HTML/CSS', category: 'frontend', level: 'Expert', years: '3+' },
        { name: 'Next.js', category: 'frontend', level: 'Advanced', years: '2+' },
        { name: 'TypeScript', category: 'frontend', level: 'Advanced', years: '2+' },
        { name: 'Node.js', category: 'backend', level: 'Expert', years: '3+' },
        { name: 'Express.js', category: 'backend', level: 'Expert', years: '3+' },
        { name: 'MongoDB', category: 'backend', level: 'Expert', years: '3+' },
        { name: 'REST APIs', category: 'backend', level: 'Expert', years: '3+' },
        { name: 'PostgreSQL', category: 'backend', level: 'Intermediate', years: '1+' },
        { name: 'OpenAI APIs', category: 'ai', level: 'Advanced', years: '2+' },
        { name: 'AI Agents', category: 'ai', level: 'Advanced', years: '2+' },
        { name: 'Langchain', category: 'ai', level: 'Intermediate', years: '1+' },
        { name: 'Git', category: 'tools', level: 'Expert', years: '3+' },
        { name: 'Docker', category: 'tools', level: 'Intermediate', years: '1+' },
        { name: 'AWS', category: 'tools', level: 'Intermediate', years: '1+' },
    ];

    const categoryColors = {
        frontend: { r: 124, g: 58, b: 237 },
        backend: { r: 6, g: 182, b: 212 },
        ai: { r: 139, g: 92, b: 246 },
        tools: { r: 34, g: 197, b: 94 },
    };

    let nodes = [];
    let mouseX = -1000, mouseY = -1000;
    let hoveredNode = null;
    let animId;

    function resize() {
        const rect = wrapper.getBoundingClientRect();
        constellationCanvas.width = rect.width * window.devicePixelRatio;
        constellationCanvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        initNodes(rect.width, rect.height);
    }

    function initNodes(w, h) {
        const padding = 60;
        nodes = skills.map((skill, i) => {
            const existing = nodes[i];
            return {
                ...skill,
                x: existing ? existing.x : padding + Math.random() * (w - padding * 2),
                y: existing ? existing.y : padding + Math.random() * (h - padding * 2),
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: skill.level === 'Expert' ? 28 : skill.level === 'Advanced' ? 22 : 18,
                baseRadius: skill.level === 'Expert' ? 28 : skill.level === 'Advanced' ? 22 : 18,
                color: categoryColors[skill.category],
            };
        });
    }

    function update() {
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        hoveredNode = null;

        nodes.forEach(node => {
            // Mouse interaction
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < node.radius + 10) {
                hoveredNode = node;
                node.radius += (node.baseRadius * 1.4 - node.radius) * 0.1;
            } else if (dist < 150) {
                // Gentle attraction
                node.vx += dx * 0.0001;
                node.vy += dy * 0.0001;
                node.radius += (node.baseRadius - node.radius) * 0.1;
            } else {
                node.radius += (node.baseRadius - node.radius) * 0.1;
            }

            node.x += node.vx;
            node.y += node.vy;

            // Damping
            node.vx *= 0.995;
            node.vy *= 0.995;

            // Boundary bounce
            if (node.x < node.radius) { node.x = node.radius; node.vx *= -0.5; }
            if (node.x > w - node.radius) { node.x = w - node.radius; node.vx *= -0.5; }
            if (node.y < node.radius) { node.y = node.radius; node.vy *= -0.5; }
            if (node.y > h - node.radius) { node.y = h - node.radius; node.vy *= -0.5; }
        });

        // Tooltip
        if (hoveredNode && tooltip) {
            tooltip.innerHTML = `<strong>${hoveredNode.name}</strong><span>${hoveredNode.level} · ${hoveredNode.years} years</span>`;
            tooltip.style.left = (hoveredNode.x + hoveredNode.radius + 12) + 'px';
            tooltip.style.top = (hoveredNode.y - 20) + 'px';
            tooltip.classList.add('visible');
        } else if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    function draw() {
        const rect = wrapper.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].category === nodes[j].category) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        const opacity = (1 - dist / 200) * 0.15;
                        const c = nodes[i].color;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw nodes
        nodes.forEach(node => {
            const isHovered = node === hoveredNode;
            const c = node.color;

            // Glow
            if (isHovered) {
                const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2);
                glow.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.2)`);
                glow.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            }

            // Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = isHovered
                ? `rgba(${c.r}, ${c.g}, ${c.b}, 0.2)`
                : `rgba(${c.r}, ${c.g}, ${c.b}, 0.08)`;
            ctx.fill();
            ctx.strokeStyle = isHovered
                ? `rgba(${c.r}, ${c.g}, ${c.b}, 0.6)`
                : `rgba(${c.r}, ${c.g}, ${c.b}, 0.2)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Text
            ctx.fillStyle = isHovered ? '#f0f0f5' : `rgba(${c.r}, ${c.g}, ${c.b}, 0.8)`;
            ctx.font = `${isHovered ? '600' : '500'} ${node.baseRadius > 24 ? 11 : 10}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, node.x, node.y);
        });
    }

    function animate() {
        update();
        draw();
        animId = requestAnimationFrame(animate);
    }

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    wrapper.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    resize();
    animate();
    window.addEventListener('resize', resize);

    // Pause when not visible
    const constObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animId) animate();
            } else {
                cancelAnimationFrame(animId);
                animId = null;
            }
        });
    }, { threshold: 0.1 });

    constObserver.observe(wrapper);
}
