/*The Last Ruin JavaScript */

// --- 1. NAVBAR SCROLL EFFECT ---
        window.onscroll = function() {
            const nav = document.getElementById('navbar');
            if (window.pageYOffset > 100) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };

        // --- UPDATE PARTICLE SYSTEM ---
        const canvasHero = document.getElementById('sparks');
        const canvasFooter = document.getElementById('sparks-footer');
        const ctxHero = canvasHero.getContext('2d');
        const ctxFooter = canvasFooter.getContext('2d');

        let particlesHero = [];
        let particlesFooter = [];

        function initCanvases() {
            canvasHero.width = window.innerWidth;
            canvasHero.height = canvasHero.parentElement.offsetHeight;
            canvasFooter.width = window.innerWidth;
            canvasFooter.height = canvasFooter.parentElement.offsetHeight;
        }
        initCanvases();
        window.addEventListener('resize', initCanvases);

        class Particle {
            constructor(canvas) {
                this.canvas = canvas;
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.5;
                this.color = Math.random() > 0.5 ? '#ff9933' : '#ff4400';
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.opacity -= 0.003;
            }
            draw(ctx) {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function handleParticles(particleArray, canvas, ctx) {
            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].update();
                particleArray[i].draw(ctx);
                if (particleArray[i].opacity <= 0) {
                    particleArray.splice(i, 1);
                    i--;
                }
            }
            if (particleArray.length < 60) {
                particleArray.push(new Particle(canvas));
            }
        }

        function animate() {
            ctxHero.clearRect(0, 0, canvasHero.width, canvasHero.height);
            ctxFooter.clearRect(0, 0, canvasFooter.width, canvasFooter.height);
            
            handleParticles(particlesHero, canvasHero, ctxHero);
            handleParticles(particlesFooter, canvasFooter, ctxFooter);
            
            requestAnimationFrame(animate);
        }
        animate();

        // --- 3. INTERSECTION OBSERVER (REVEAL ANIMATIONS) ---
        const observerOptions = {
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.story-line, .scroll-reveal').forEach(el => {
            observer.observe(el);
        });

        // --- 4. SMOOTH SCROLL ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // --- 5. AUDIO CONTROLS ---
        const storyAudio = document.getElementById('story-audio');
        const audioBtn = document.getElementById('audio-btn');
        const audioIcon = document.getElementById('audio-icon');
        let isPlaying = false;

        audioBtn.addEventListener('click', function() {
            if (isPlaying) {
                storyAudio.pause();
                audioIcon.innerHTML = '▶';
                audioBtn.innerHTML = '<span id="audio-icon">▶</span> Play Narration';
                audioBtn.classList.remove('playing');
            } else {
                storyAudio.play();
                audioIcon.innerHTML = '⏸';
                audioBtn.innerHTML = '<span id="audio-icon">⏸</span> Pause Narration';
                audioBtn.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });

        // Reset tombol jika audio sudah selesai (sampai akhir)
        storyAudio.addEventListener('ended', function() {
            isPlaying = false;
            audioBtn.innerHTML = '<span id="audio-icon">▶</span> Play Narration';
            audioBtn.classList.remove('playing');
        });

        const themeSong = document.getElementById('theme-song');
        const musicToggle = document.getElementById('music-toggle');
        const musicIcon = document.getElementById('music-icon');
        const beginBtn = document.querySelector('.btn-cinematic'); // Tombol di Hero Section

        let isMuted = true;

        // Fungsi untuk memutar musik
        function playMusic() {
            themeSong.play().then(() => {
                isMuted = false;
                musicIcon.innerHTML = '🔊';
                musicToggle.classList.add('active');
            }).catch(error => {
                console.log("Autoplay dicegah oleh browser, menunggu interaksi.");
            });
        }

        // Pemicu 1: Klik tombol "Begin Journey"
        beginBtn.addEventListener('click', () => {
            if (isMuted) playMusic();
        });

        // Pemicu 2: Tombol Manual Toggle (Mute/Unmute)
        musicToggle.addEventListener('click', () => {
            if (themeSong.paused) {
                playMusic();
            } else {
                if (themeSong.muted) {
                    themeSong.muted = false;
                    musicIcon.innerHTML = '🔊';
                    musicToggle.classList.add('active');
                } else {
                    themeSong.muted = true;
                    musicIcon.innerHTML = '🔇';
                    musicToggle.classList.remove('active');
                }
            }
        });

        // Opsional: Kecilkan volume agar tidak terlalu keras (0.0 sampai 1.0)
        themeSong.volume = 0.5;

        const notifyBtn = document.getElementById('notify-btn');

        notifyBtn.addEventListener('click', async () => {

            const email =
                document.getElementById('email-input').value.trim();

            if (!email) {
                showToast('Please enter an email address.');
                return;
            }

            if (!email.includes('@')) {
                showToast('Please enter a valid email.');
                return;
            }

            try {

                await fetch(
                    'https://script.google.com/macros/s/AKfycbywXQ3yy6GYoKAjeOc139YHR3VxRQYFyXtE3DcIjQOxArlyFYIqp6aChN6p6zZ4Ew1S/exec',
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            email: email
                        })
                    }
                );

                showToast('Your journey begins. We will notify you when the ruins awaken.');

                document.getElementById('email-input').value = '';

            }

            catch (error) {

                showToast('Something went wrong.');

                console.error(error);
            }
        });

        function showToast(message) {

            const toast =
                document.getElementById('toast');

            const toastMessage =
                document.getElementById('toast-message');

            toastMessage.textContent = message;

            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }