document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. FLOATING BACKGROUND GENERATOR
     ========================================================================== */
  const floatingBg = document.getElementById('floating-bg');
  const shapes = ['❤️', '💖', '✨', '🌸', '🐼', '🧸', '🎈', '⭐'];
  
  function createFloatingElement() {
    const el = document.createElement('div');
    el.className = 'floating-element';
    
    // Choose a random shape
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Randomize positioning and size
    const size = Math.random() * (2 - 0.8) + 0.8; // between 0.8rem and 2rem
    el.style.fontSize = `${size}rem`;
    el.style.left = `${Math.random() * 100}%`;
    
    // Randomize animation duration and delay
    const duration = Math.random() * (20 - 10) + 10; // 10s to 20s
    const delay = Math.random() * 5;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    
    // Blur a few background elements for depth of field
    if (Math.random() > 0.7) {
      el.style.filter = 'blur(1px)';
    }
    
    floatingBg.appendChild(el);
    
    // Remove element after animation finishes to prevent DOM bloat
    setTimeout(() => {
      el.remove();
    }, (duration + delay) * 1000);
  }

  // Populate initial floating elements
  for (let i = 0; i < 25; i++) {
    createFloatingElement();
  }
  
  // Continuously spawn floating items
  setInterval(createFloatingElement, 1500);


  /* ==========================================================================
     2. ENVELOPE / WELCOME SCREEN INTERACTION
     ========================================================================== */
  const welcomeScreen = document.getElementById('welcome-screen');
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-btn');
  const bgMusic = document.getElementById('bg-music');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const speakerIcon = document.getElementById('speaker-icon');
  const musicLabel = document.querySelector('.music-label');

  let musicStarted = false;

  function openEnvelopeSequence() {
    if (envelope.classList.contains('open')) return;
    
    // 1. Play envelope animation
    envelope.classList.add('open');
    
    // 2. Play background music (requires user gesture)
    if (!musicStarted) {
      bgMusic.play().then(() => {
        musicStarted = true;
        speakerIcon.classList.add('playing');
        musicLabel.textContent = 'Music On';
      }).catch(err => {
        console.log('Audio autoplay prevented, user interaction required.', err);
      });
    }

    // 3. Fade out welcome screen and show dashboard
    setTimeout(() => {
      welcomeScreen.classList.add('fade-out');
      dashboardScreen.classList.remove('hidden');
      
      // Fire a nice welcoming confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        welcomeScreen.remove(); // Clean up from DOM
      }, 1000);
    }, 1500);
  }

  envelope.addEventListener('click', openEnvelopeSequence);
  openBtn.addEventListener('click', openEnvelopeSequence);


  /* ==========================================================================
     3. MUSIC PLAY/PAUSE CONTROLS
     ========================================================================== */
  const musicToggle = document.getElementById('music-toggle');
  
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      speakerIcon.classList.add('playing');
      musicLabel.textContent = 'Music On';
    } else {
      bgMusic.pause();
      speakerIcon.classList.remove('playing');
      musicLabel.textContent = 'Music Off';
    }
  });


  /* ==========================================================================
     4. MODAL MANAGEMENT (OPEN/CLOSE)
     ========================================================================== */
  const cards = document.querySelectorAll('.card');
  const modals = document.querySelectorAll('.modal');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      
      if (targetModal) {
        targetModal.classList.add('active');
        
        // Custom triggers for specific modals when opened
        if (modalId === 'modal-letter') {
          startTypewriter();
        }
      }
    });
  });

  // Attach close events
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('[data-close]');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    function closeModal() {
      modal.classList.remove('active');
      
      // Stop typewriter logic if letter modal closed
      if (modal.id === 'modal-letter') {
        resetTypewriter();
      }
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
  });


  /* ==========================================================================
     5. MODAL 1: LETTER TYPEWRITER EFFECT
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter-text');
  const letterContent = 
`Happy Birthday to my absolute favorite human, Akshara! 🌸

I want to start by saying how incredibly grateful I am to have you as my bestie. Having a best friend like you is like finding a rare, sparkling gem. We have shared so many laughs, silly jokes, and wonderful conversations.

You are someone I can always count on, and I hope you know that you can always count on me too. No matter where life takes us, we will always be the best of friends! 👫

On your special day, I wish you all the joy, success, and cute panda rolls in the world. May your days be filled with warm teddy bear hugs and endless reasons to smile. Eat lots of cake, take lots of pretty photos, and enjoy your day to the fullest!

Happy Birthday, Akshara! You are the absolute best! 🎂✨`;

  let typingIndex = 0;
  let typingTimer = null;
  const typingSpeed = 35; // milliseconds per character

  function startTypewriter() {
    resetTypewriter();
    typewriterElement.textContent = '';
    
    // Small delay before typing starts
    setTimeout(() => {
      type();
    }, 400);
  }

  function type() {
    if (typingIndex < letterContent.length) {
      typewriterElement.textContent += letterContent.charAt(typingIndex);
      typingIndex++;
      // Auto scroll to bottom of letter paper as it types
      const scrollContent = typewriterElement.closest('.modal-scroll-content');
      if (scrollContent) {
        scrollContent.scrollTop = scrollContent.scrollHeight;
      }
      typingTimer = setTimeout(type, typingSpeed);
    }
  }

  function resetTypewriter() {
    clearTimeout(typingTimer);
    typingIndex = 0;
    typewriterElement.textContent = '';
  }


  /* ==========================================================================
     6. MODAL 2: PANDA & TEDDY CORNER INTERACTION
     ========================================================================== */
  const pandaImg = document.getElementById('img-panda');
  const teddyImg = document.getElementById('img-teddy');
  const pandaBubble = document.getElementById('panda-bubble').querySelector('.speech-bubble');
  const teddyBubble = document.getElementById('teddy-bubble').querySelector('.speech-bubble');
  const sendHugBtn = document.getElementById('send-hug-btn');

  const pandaMessages = [
    "Happy Birthday Akshara! Panda sends you 100 virtual bamboo rolls! 🐼🎋",
    "Pipo says: You are the most pawsome bestie ever! 🐾",
    "Panda roll! *rolls over* Hope your day is super fun! 🌀",
    "Pipo says: Don't forget to eat a giant slice of chocolate cake! 🍰",
    "Panda hugs! *squeeze* 🐼💖"
  ];

  const teddyMessages = [
    "Barni says: You are absolutely bear-y special to us! 🧸",
    "Sending a giant, fluffy virtual teddy hug your way! *squeeze*",
    "Barni says: May your birthday be filled with sweet honey and happiness! 🍯",
    "I promise to guard all your secrets forever in my soft fluff! 🧸🔒",
    "Barni is doing a happy birthday dance for you! 🕺✨"
  ];

  function animateCharacter(imgElement, animationClass) {
    imgElement.classList.add(animationClass);
    setTimeout(() => {
      imgElement.classList.remove(animationClass);
    }, 600);
  }

  // Panda click action
  pandaImg.addEventListener('click', () => {
    const randomMsg = pandaMessages[Math.floor(Math.random() * pandaMessages.length)];
    pandaBubble.textContent = randomMsg;
    animateCharacter(pandaImg, 'wobble');
    
    // Cute single confetti burst over panda
    const rect = pandaImg.getBoundingClientRect();
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { 
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight 
      }
    });
  });

  // Teddy click action
  teddyImg.addEventListener('click', () => {
    const randomMsg = teddyMessages[Math.floor(Math.random() * teddyMessages.length)];
    teddyBubble.textContent = randomMsg;
    animateCharacter(teddyImg, 'bounce');
    
    // Cute single confetti burst over teddy
    const rect = teddyImg.getBoundingClientRect();
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { 
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight 
      }
    });
  });

  // Group Cuddle Button action
  sendHugBtn.addEventListener('click', () => {
    pandaBubble.textContent = "Group cuddle time! Bear hug! 🐼❤️🧸";
    teddyBubble.textContent = "Huuuugs for Akshara! You are the best! 💕";
    
    animateCharacter(pandaImg, 'wobble');
    animateCharacter(teddyImg, 'bounce');

    // Shower of love hearts confetti
    const defaults = { spread: 360, ticks: 50, gravity: 0, decay: 0.94, startVelocity: 30, colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#FFF0F5'] };
    confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['heart'] });
    confetti({ ...defaults, particleCount: 30, scalar: 0.75 });
  });

  // Adding wiggle and bounce CSS animations on the fly
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .wobble {
      animation: charWobble 0.6s ease;
    }
    .bounce {
      animation: charBounce 0.6s ease;
    }
    @keyframes charWobble {
      0%, 100% { transform: rotate(0deg); }
      15% { transform: rotate(-10deg) scale(1.05); }
      30% { transform: rotate(8deg) scale(1.05); }
      45% { transform: rotate(-6deg) scale(1.02); }
      60% { transform: rotate(4deg) scale(1.02); }
      75% { transform: rotate(-2deg); }
    }
    @keyframes charBounce {
      0%, 100% { transform: translateY(0); }
      30% { transform: translateY(-20px) scaleY(0.9) scaleX(1.05); }
      50% { transform: translateY(-25px) scaleY(1.05) scaleX(0.95); }
      65% { transform: translateY(-10px) scaleY(0.98); }
      80% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(styleEl);


  /* ==========================================================================
     7. MODAL 3: CANDLE BLOWING SURPRISE GAME
     ========================================================================== */
  const candles = document.querySelectorAll('.candle');
  const wishRevealBox = document.getElementById('wish-reveal-box');
  let blownCount = 0;

  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      if (candle.classList.contains('blown-out')) return;
      
      // Blow out this candle
      candle.classList.remove('active-candle');
      candle.classList.add('blown-out');
      blownCount++;

      // Trigger smoke or spark confetti at candle flame origin
      const rect = candle.getBoundingClientRect();
      confetti({
        particleCount: 10,
        spread: 30,
        origin: { 
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: rect.top / window.innerHeight 
        },
        colors: ['#cccccc', '#eeeeee']
      });

      // Check if all candles are blown out
      if (blownCount === candles.length) {
        triggerBirthdayCelebration();
      }
    });
  });

  function triggerBirthdayCelebration() {
    setTimeout(() => {
      // 1. Show secret wish box
      wishRevealBox.classList.remove('hidden');

      // 2. Play beautiful burst of confetti (left & right sides of screen)
      const duration = 4 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        // Confetti from left
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 }
        });
        
        // Confetti from right
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Launch some cute heart details
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#FF1493', '#FFB6C1']
      });
    }, 600);
  }

  // Allow resetting the game when modal is closed
  document.querySelector('#modal-cake').addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn') || e.target.classList.contains('modal-backdrop')) {
      setTimeout(() => {
        // Reset candles if game completed
        if (blownCount === candles.length) {
          candles.forEach(candle => {
            candle.classList.remove('blown-out');
            candle.classList.add('active-candle');
          });
          wishRevealBox.classList.add('hidden');
          blownCount = 0;
        }
      }, 500);
    }
  });


  /* ==========================================================================
     8. MODAL 4: POLAROID GALLERY LIGHTBOX
     ========================================================================== */
  const polaroids = document.querySelectorAll('.polaroid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxSubtext = document.getElementById('lightbox-subtext');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

  // Descriptions/Notes of friendship for each photo
  const photoStories = {
    1: {
      title: "Golden Hour Glow 🌅",
      desc: "You look absolutely gorgeous in this sunset sunlight, Akshara! Your hair looks so beautiful. May your life always be illuminated with warm sunshine, joy, and positive vibes."
    },
    2: {
      title: "A Bouquet of Smiles 🌸",
      desc: "A pure and elegant picture! A flower holding flowers. This pink ethnic dress matches you perfectly, and you carry it with such grace and beauty. Keep blooming like a lovely rose, bestie!"
    },
    3: {
      title: "A Divine and Serene Vibe ✨",
      desc: "Holding the peacock feather and pink flute, looking so peaceful and elegant. This photo captures your creative, calm, and artistic side. You look absolutely graceful!"
    },
    4: {
      title: "That Radiant Smile! 💫",
      desc: "Your smile in this beautiful attire can brighten up any room, bestie! Keep smiling like this always because your happiness means the world. Stay happy, positive, and blessed!"
    },
    5: {
      title: "Chasing Blossoms 🌷",
      desc: "Reaching out to touch the beautiful pink flowers. It's a wonderful candid capture of you in a gorgeous garden. May all your dreams be as bright and colorful as these flowers!"
    }
  };

  polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', () => {
      const photoId = polaroid.getAttribute('data-photo');
      const imgSrc = polaroid.querySelector('img').getAttribute('src');
      const story = photoStories[photoId];

      if (story) {
        lightboxImg.setAttribute('src', imgSrc);
        lightboxCaption.textContent = story.title;
        lightboxSubtext.textContent = story.desc;
        lightbox.classList.add('active');
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

});
