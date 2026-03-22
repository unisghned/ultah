// js/script-intro.js

window.addEventListener('load', () => {
    
    // === 1. SELEKTOR ELEMEN ===
    const giftWrapper = document.getElementById('gift-wrapper');
    const giftBox = document.getElementById('pro-giftbox');
    const giftLid = document.querySelector('.giftbox-lid');
    const instructionText = document.getElementById('initial-instruction');
    const clickPrompt = document.getElementById('click-prompt');
    
    const cakeRevealArea = document.getElementById('cake-reveal-area');
    const surpriseText = document.getElementById('surprise-text');
    const cakeContainer = document.getElementById('cake-container');
    const layer1 = document.getElementById('layer-1');
    const layer2 = document.getElementById('layer-2');
    const layer3 = document.getElementById('layer-3');
    const creamOverlay = document.getElementById('cream-overlay');
    const candle16 = document.getElementById('candle-16');
    const flames = document.querySelectorAll('.flame');
    
    const matchstick = document.getElementById('pro-matchstick');
    const matchFlame = document.getElementById('match-flame');
    const wishText = document.getElementById('wish-text');

    // === 2. INISIALISASI STATE (Force Hidden & Position) ===
    // Pastikan semua elemen kejutan benar-benar tidak terlihat di awal
    gsap.set(cakeRevealArea, { opacity: 0, display: 'none', pointerEvents: 'none' });
    gsap.set([layer1, layer2, layer3], { display: 'none', y: -800 }); 
    // Sembunyikan api lilin
    flames.forEach(f => {
        f.classList.add('hidden');
        gsap.set(f, { scale: 0, opacity: 0 });
    });

    // === 3. TIMELINE UTAMA (Awal) ===
    const tlMain = gsap.timeline({ defaults: { ease: "power2.out" } });

    tlMain
      .to(instructionText, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
      .to(giftBox, { opacity: 1, scale: 1, duration: 1.1, ease: "back.out(1.2)" }, "-=0.5")
      .to(clickPrompt, { opacity: 1, duration: 0.5 });

    // === 4. LOGIKA KLIK KADO & KEJUTAN (Surprise) ===
    giftBox.addEventListener('click', () => {
        giftBox.style.pointerEvents = 'none'; 
        
        const tlSurprise = gsap.timeline();
        
        tlSurprise
          .to(giftLid, { rotation: 110, y: -50, x: 50, opacity: 0, duration: 0.2, ease: "back.in(1.2)", transformOrigin: "bottom right" })
          .to(clickPrompt, { opacity: 0, duration: 0.2 }, "-=0.4")
          
          .call(fireConfetti, null, "+=0.1")
          
          .set(surpriseText, { opacity: 1, scale: 0.2 })
          .to(surpriseText, { scale: 1, duration: 0.8, ease: "back.out(1.7)" })
          
          .to(giftWrapper, { opacity: 0, scale: 0.8, duration: 0.8, delay: 0.5 })
          .set(giftWrapper, { display: 'none' })
          
          // Memunculkan area kue tanpa menampilkan isinya dulu
          .set(cakeRevealArea, { display: 'flex', opacity: 1 })
          .call(startCakeSequence);
    });

    // === 5. EFEK PETASAN (Confetti Function) ===
    function fireConfetti() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF69B4', '#FF85C1', '#F06292', '#FFFFFF']
        });
        
        setTimeout(() => {
            confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
        }, 300);
    }

    // === 6. URUTAN JATUH KUE (Squishy Bounce & Liquid Cream) ===
    function startCakeSequence() {
        const tlCake = gsap.timeline();
        
        tlCake
          // 1. Layer Bawah (Jatuh dari atas banget)
          .set(layer3, { display: 'block' })
          .to(layer3, { opacity: 1, y: 0, duration: 1.2, ease: "bounce.out" })
          .to(layer3, { scaleY: 0.8, duration: 0.2 }, "-=0.1")
          .to(layer3, { scaleY: 1, duration: 0.1 })

          // 2. Layer Tengah
          .set(layer2, { display: 'block' })
          .to(layer2, { opacity: 1, y: 0, duration: 1, ease: "bounce.out" }, "-=0.6")
          .to(layer2, { scaleY: 0.85, duration: 0.2 }, "-=0.1")
          .to(layer2, { scaleY: 1, duration: 0.1 })

          // 3. Layer Atas
          .set(layer1, { display: 'block' })
          .to(layer1, { opacity: 1, y: 0, duration: 0.8, ease: "bounce.out" }, "-=0.5")
          .to(layer1, { scaleY: 0.9, duration: 0.2 }, "-=0.1")
          .to(layer1, { scaleY: 1, duration: 0.1 })

          // 4. Perbaikan Animasi Cream (Dibuat lebih dinamis/meleleh)
          .fromTo(creamOverlay, 
            { scale: 0, opacity: 0, y: -50 }, 
            { 
              opacity: 1, 
              scale: 1, 
              y: -25, 
              duration: 1.3, 
              ease: "elastic.out(1, 0.3)",
              onStart: () => gsap.set(creamOverlay, { transformOrigin: "top center" })
            }
          )
          // Tambahan efek goyang pada cream agar terlihat cair
          .to(creamOverlay, { scaleX: 1.05, duration: 0.8, repeat: 1, yoyo: true, ease: "sine.inOut" }, "-=0.5")

          .call(startIgnitionSequence);
    }

// === 7. KOREK & MENYALAKAN LILIN (Fix Chaining & Interaction) ===
function startIgnitionSequence() {
    const tlIgnite = gsap.timeline();
    
    tlIgnite
        // A. Munculkan lilin (Naik sedikit dari atas kue)
        .to(candle16, { opacity: 1, y: -150, duration: 0.8, ease: "back.out(1.7)" })
        
        // B. Animasi Korek (Koordinat disesuaikan agar aman di layar kecil)
        .set(matchstick, { opacity: 1, x: -100, y: -10, rotate: 30 })
        .to(matchstick, { x: -50, y: -5, duration: 1.2, ease: "power2.inOut" })
        .call(() => {
            matchFlame.classList.add('ignited');
        })
        .delay(0.5)
        .call(() => {
            flames[0].classList.remove('hidden');
            gsap.to(flames[0], { opacity: 1, scale: 1, duration: 0.6 });
        })
        .to(matchstick, { x: -10, duration: 0.6 }) // Geser ke angka 6
        .call(() => {
            flames[1].classList.remove('hidden');
            gsap.to(flames[1], { opacity: 1, scale: 1, duration: 0.6 });
        })
        
        // C. Korek hilang ke atas
        .to(matchstick, { y: -100, opacity: 0, duration: 0.8 })
        
        .call(() => {
            const revealArea = document.getElementById('cake-reveal-area');
            if (revealArea) {
                revealArea.style.pointerEvents = "auto";
                revealArea.style.cursor = "pointer";
            }
        })
        
        // D. Teks Harapan muncul lebih halus
        .to(wishText, { opacity: 1, y: -10, duration: 1 });
}

// === 8. TIUP LILIN & PINDAH HALAMAN ===
// Kita gunakan document listener jika id masih sulit dideteksi
document.addEventListener('click', function(e) {
    // Cek apakah yang diklik adalah area kue atau elemen di dalamnya
    const isCakeArea = e.target.closest('#cake-reveal-area');
    
    if (isCakeArea) {
        // Cek apakah lilin sudah menyala
        if (gsap.getProperty(candle16, "opacity") < 0.5) return;

        console.log("Lilin ditiup!");

        // Matikan api
        gsap.to(flames, { 
            opacity: 0, 
            scale: 0, 
            duration: 0.4, 
            stagger: 0.1,
            onComplete: () => {
                // Transisi ke main.html
                gsap.to("#scene-container", {
                    opacity: 0,
                    duration: 1,
                    delay: 0.5,
                    onComplete: () => {
                        window.location.href = "main.html";
                    }
                });
            }
        });
    }
});
});

