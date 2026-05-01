// ================================================================
// PAVIT SINGH — LEGENDARY DEVELOPER PORTFOLIO
// Main Application — All Features + Working Projects
// ================================================================

// ============ PRELOADER ============
const jokes = [
    "Compiling awesomeness...", "Teaching bugs to behave...", "Converting coffee to code...",
    "Downloading more RAM...", "Asking Stack Overflow...", "Deleting node_modules...",
    "Convincing CSS to work...", "Loading sarcasm module...", "Counting semicolons...",
    "Debugging the debugger...", "Reticulating splines...", "Warming up GPU..."
];
let plProgress=0, jIdx=0;
const plBar=document.getElementById('preloaderBar'), plPct=document.getElementById('preloaderPercent'), plJ=document.getElementById('preloaderJoke');
const plI=setInterval(()=>{
    plProgress+=Math.random()*12+3;
    if(plProgress>100)plProgress=100;
    plBar.style.width=plProgress+'%';
    plPct.textContent=Math.floor(plProgress)+'%';
    if(Math.random()>0.4){jIdx=(jIdx+1)%jokes.length;plJ.style.opacity=0;setTimeout(()=>{plJ.textContent=jokes[jIdx];plJ.style.opacity=1},200)}
    if(plProgress>=100){clearInterval(plI);setTimeout(()=>{document.getElementById('preloader').classList.add('hidden');setTimeout(initEverything,500)},600)}
},180);

// ============ INIT ============
function initEverything(){
    initThreeJS(); initMatrixRain(); initWaveCanvas(); initFloatingParticles();
    initCursor(); initTypingEffect(); initSpeechBubble(); initNavScroll(); initBackToTop();
    initGSAPAnimations(); initKonamiCode(); initMagnetic(); animateProfileCounters();
    initPixelCanvas(); generatePalette();
    setTimeout(()=>{showAchievement('🎮','Welcome to the Matrix!');addXP(10)},1000);
}

// ============ FLOATING PARTICLES ============
function initFloatingParticles(){
    const c=document.getElementById('floatingParticles'); if(!c) return;
    const n=window.innerWidth<768?12:30;
    const colors=['var(--accent)','var(--accent2)','var(--accent3)'];
    for(let i=0;i<n;i++){
        const p=document.createElement('div'); p.className='floating-particle';
        p.style.left=Math.random()*100+'vw';
        p.style.setProperty('--dur',(Math.random()*8+6)+'s');
        p.style.setProperty('--delay',(Math.random()*10)+'s');
        const s=(Math.random()*3+1)+'px'; p.style.width=s; p.style.height=s;
        p.style.background=colors[Math.floor(Math.random()*colors.length)];
        c.appendChild(p);
    }
}

// ============ CURSOR ============
function initCursor(){
    if(window.innerWidth<768) return;
    const dot=document.getElementById('cursorDot'),outline=document.getElementById('cursorOutline'),glow=document.getElementById('cursorGlow');
    const emojis=['✨','⚡','🔥','💫','🌟','💎'];
    let tc=0,mx=0,my=0,ox=0,oy=0,gx=0,gy=0;
    document.addEventListener('mousemove',e=>{
        mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';
        tc++;if(tc%8===0){const t=document.createElement('div');t.className='cursor-trail';t.textContent=emojis[Math.floor(Math.random()*emojis.length)];t.style.left=mx+'px';t.style.top=my+'px';document.body.appendChild(t);setTimeout(()=>t.remove(),800)}
    });
    (function anim(){ox+=(mx-ox)*.15;oy+=(my-oy)*.15;outline.style.left=ox+'px';outline.style.top=oy+'px';gx+=(mx-gx)*.08;gy+=(my-gy)*.08;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(anim)})();
    document.querySelectorAll('a,button,.bento-item,.stat-card,.project-card,.fun-card,.testimonial-card,.product,.fun-fact,.p-stat,.contact-card,.social-icon,.nav-btn,.filter-btn,.profile-card').forEach(el=>{
        el.addEventListener('mouseenter',()=>{outline.classList.add('hover');dot.classList.add('expanded')});
        el.addEventListener('mouseleave',()=>{outline.classList.remove('hover');dot.classList.remove('expanded')});
    });
    document.addEventListener('mousedown',()=>outline.classList.add('click'));
    document.addEventListener('mouseup',()=>outline.classList.remove('click'));
}

// ============ TYPING ============
function initTypingEffect(){
    const phrases=["Full-Stack Developer 🚀","Python Wizard 🐍","C++ Enthusiast ⚡","Bug Exterminator 🐛💀","Future CTO 👑","3 AM Coder 🌙","Coffee Machine ☕","Animation Addict 🎭"];
    const el=document.getElementById('typingText'); if(!el)return;
    let pi=0,ci=0,del=false;
    (function type(){
        const cur=phrases[pi];
        el.textContent=del?cur.substring(0,ci-1):cur.substring(0,ci+1);
        ci=del?ci-1:ci+1;
        let sp=del?40:80;
        if(!del&&ci===cur.length){sp=2500;del=true}
        else if(del&&ci===0){del=false;pi=(pi+1)%phrases.length;sp=400}
        setTimeout(type,sp);
    })();
}

// ============ SPEECH BUBBLE ============
function initSpeechBubble(){
    const msgs=["Currently turning caffeine into code... ☕","My code works and I have no idea why 🤷","It's not a bug, it's a feature! 🐛✨","Sleep is for the weak... right? 😴","I speak fluent Python 🐍","404: Social life not found 💀","git commit -m 'fixed everything' 🙃","console.log('hire me') 💼"];
    const b=document.getElementById('speechBubble'); if(!b)return;
    const t=b.querySelector('.speech-text');let i=0;
    setInterval(()=>{i=(i+1)%msgs.length;b.style.opacity=0;b.style.transform='translateY(5px)';setTimeout(()=>{t.textContent='"'+msgs[i]+'"';b.style.opacity=1;b.style.transform='translateY(0)'},300)},4000);
}

// ============ NAV ============
function initNavScroll(){window.addEventListener('scroll',()=>{document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50)},{passive:true})}
function toggleNav(){const h=document.getElementById('hamburger'),o=document.getElementById('mobileNavOverlay');h.classList.toggle('active');o.classList.toggle('open');document.body.style.overflow=o.classList.contains('open')?'hidden':''}
function closeNav(){document.getElementById('hamburger').classList.remove('active');document.getElementById('mobileNavOverlay').classList.remove('open');document.body.style.overflow=''}
function scrollToSection(s){const e=document.querySelector(s);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})}
function initBackToTop(){window.addEventListener('scroll',()=>{document.getElementById('backToTop').classList.toggle('visible',window.scrollY>600)},{passive:true})}

// ============ MAGNETIC ============
function initMagnetic(){
    if(window.innerWidth<768)return;
    document.querySelectorAll('.magnetic').forEach(el=>{
        el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*0.12}px,${y*0.12}px)`});
        el.addEventListener('mouseleave',()=>{el.style.transform=''});
    });
}

// ============ XP & ACHIEVEMENTS ============
let totalXP=0,currentLevel=1;const xpPerLevel=100;const ach={};
function addXP(a){totalXP+=a;const nl=Math.floor(totalXP/xpPerLevel)+1;if(nl>currentLevel){currentLevel=nl;showAchievement('⬆️',`Level ${currentLevel}!`);spawnConfetti(30)}updateXP()}
function updateXP(){const p=(totalXP%xpPerLevel)/xpPerLevel*100;const b=document.getElementById('xpBar'),l=document.getElementById('xpLevel'),t=document.getElementById('xpText');if(b)b.style.width=p+'%';if(l)l.textContent=`LVL ${currentLevel}`;if(t)t.textContent=`${totalXP} XP`}
function showAchievement(icon,text){if(ach[text])return;ach[text]=true;const p=document.getElementById('achievementPopup');document.getElementById('achIcon').textContent=icon;document.getElementById('achText').textContent=text;p.classList.add('show');setTimeout(()=>p.classList.remove('show'),3500)}

// ============ PROFILE COUNTERS ============
function animateProfileCounters(){document.querySelectorAll('.profile-card .counter').forEach(el=>{const t=parseInt(el.dataset.target);if(isNaN(t))return;let c=0;const s=t/40;const ti=setInterval(()=>{c+=s;if(c>=t){el.textContent=t;clearInterval(ti)}else el.textContent=Math.floor(c)},50)})}

// ============ GSAP ============
function initGSAPAnimations(){
    gsap.registerPlugin(ScrollTrigger);
    const tl=gsap.timeline({delay:0.2});
    tl.from('.hero-badge',{y:30,opacity:0,duration:.8,ease:'power3.out'})
      .from('.eyebrow',{y:30,opacity:0,duration:.8},'<0.2')
      .from('.title-line-1',{y:100,opacity:0,duration:1.2,ease:'power4.out'},'<0.2')
      .from('.title-line-2',{y:100,opacity:0,duration:1.2,ease:'power4.out'},'<0.3')
      .from('.typing-container',{y:30,opacity:0,duration:.8},'<0.2')
      .from('.hero-description',{y:30,opacity:0,duration:.8},'<0.2')
      .from('.hero-btns',{y:30,opacity:0,duration:.8},'<0.2')
      .from('.hero-social',{y:20,opacity:0,duration:.6},'<0.2')
      .from('.profile-card',{x:80,opacity:0,duration:1.2,ease:'power4.out',rotation:5},'<0.5')
      .from('.scroll-indicator',{y:20,opacity:0,duration:.6},'<0.3');

    if(particlesMesh){
        gsap.to(particlesMesh.scale,{x:2.5,y:2.5,z:2.5,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:3}});
        gsap.to(particlesMesh.rotation,{z:Math.PI*0.5,scrollTrigger:{trigger:'.contact',start:'top bottom',end:'bottom top',scrub:5}});
    }

    document.querySelectorAll('section:not(.hero):not(.marquee-section)').forEach(s=>{
        const c=s.querySelector('.container');if(!c)return;
        gsap.from(c,{opacity:0,y:60,duration:1,ease:'power3.out',scrollTrigger:{trigger:s,start:'top 80%',toggleActions:'play none none reverse'}});
    });

    gsap.from('.stat-card',{y:60,opacity:0,stagger:.1,duration:.8,scrollTrigger:{trigger:'.mega-stats',start:'top 75%'}});
    ScrollTrigger.create({trigger:'.mega-stats',start:'top 70%',onEnter:()=>animateStatCounters(),once:true});
    gsap.from('.manifesto-quote',{opacity:0,y:40,scale:.95,duration:1.5,scrollTrigger:{trigger:'.manifesto',start:'top 60%'}});
    gsap.from('.thoughts p',{opacity:0,x:-50,stagger:.25,duration:1,scrollTrigger:{trigger:'.manifesto',start:'top 55%'}});
    gsap.from('.fun-fact',{x:-50,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.about',start:'top 60%'}});
    ScrollTrigger.create({trigger:'.personality-section',start:'top 75%',onEnter:()=>{document.querySelectorAll('.meter-bar-inner').forEach(b=>{b.style.width=b.dataset.width+'%'})},once:true});
    ScrollTrigger.create({trigger:'.skills',start:'top 70%',onEnter:()=>{document.querySelectorAll('.skill-bar-inner').forEach(b=>{b.style.width=b.dataset.width+'%'})},once:true});
    gsap.from('.bento-item',{y:50,opacity:0,stagger:{each:.08,from:'random'},duration:.8,scrollTrigger:{trigger:'.skills',start:'top 65%'}});
    gsap.from('.project-card',{y:70,opacity:0,stagger:.12,duration:.9,scrollTrigger:{trigger:'.projects',start:'top 70%'}});
    gsap.from('.product',{x:-70,opacity:0,stagger:.2,duration:1,scrollTrigger:{trigger:'.store',start:'top 70%'}});
    gsap.from('.fun-card',{y:50,opacity:0,stagger:.1,duration:.8,ease:'back.out(1.4)',scrollTrigger:{trigger:'.funzone',start:'top 70%'}});
    gsap.from('.testimonial-card',{y:50,opacity:0,rotation:3,stagger:.1,duration:.8,scrollTrigger:{trigger:'.testimonials',start:'top 70%'}});
    gsap.from('.contact-title',{scale:.85,opacity:0,duration:1.2,scrollTrigger:{trigger:'.contact',start:'top 70%'}});
    gsap.from('.contact-card',{y:30,opacity:0,stagger:.1,duration:.8,scrollTrigger:{trigger:'.contact',start:'top 65%'}});
    gsap.from('.big-mail',{y:40,opacity:0,duration:1,scrollTrigger:{trigger:'.contact',start:'top 60%'}});
    document.querySelectorAll('.section-num').forEach(n=>{gsap.to(n,{y:-30,scrollTrigger:{trigger:n,start:'top bottom',end:'bottom top',scrub:2}})});
}

// ============ STAT COUNTERS ============
function animateStatCounters(){
    document.querySelectorAll('.stat-number').forEach(el=>{
        const t=parseInt(el.dataset.count);if(isNaN(t)||el.dataset.done)return;el.dataset.done='1';
        let c=0;const st=performance.now();
        (function up(now){const p=Math.min((now-st)/2000,1);const e=1-Math.pow(1-p,3);el.textContent=Math.floor(e*t).toLocaleString();if(p<1)requestAnimationFrame(up);else el.textContent=t.toLocaleString()})(performance.now());
    });
}
function incrementStat(el){const n=el.querySelector('.stat-number');if(!n)return;n.textContent=(parseInt(n.textContent.replace(/,/g,''))+1).toLocaleString();gsap.fromTo(el,{scale:.95},{scale:1,duration:.3,ease:'back.out(3)'})}

// ============ THEMES (no light) ============
const themes=['retro','dark','neon'];
const tLabels={retro:'🕹️ Retro',dark:'🌙 Dark',neon:'💜 Neon'};
let tIdx=0;
function cycleTheme(){tIdx=(tIdx+1)%themes.length;const t=themes[tIdx];document.body.setAttribute('data-theme',t);const b=document.getElementById('themeBtn');if(b){b.querySelector('.btn-icon').textContent=tLabels[t].split(' ')[0];b.querySelector('.btn-text').textContent=tLabels[t].split(' ')[1]}addXP(10);showAchievement('🎨',t.charAt(0).toUpperCase()+t.slice(1)+' Theme!')}

// ============ PARTY ============
let partyOn=false;
function toggleParty(){partyOn=!partyOn;document.body.classList.toggle('party-mode',partyOn);const b=document.getElementById('partyBtn');if(b){b.classList.toggle('party-active',partyOn);b.querySelector('.btn-icon').textContent=partyOn?'🛑':'🎉';b.querySelector('.btn-text').textContent=partyOn?'Stop':'Party'}if(partyOn){spawnConfetti(50);addXP(20);showAchievement('🎉','Party Mode!')}}

function spawnConfetti(n=40){const c=['#e94560','#f5a623','#00d2ff','#ff00ff','#00ffaa','#ffd93d'];for(let i=0;i<n;i++){const e=document.createElement('div');e.className='confetti-piece';e.style.left=Math.random()*100+'vw';e.style.top='-5vh';e.style.background=c[Math.floor(Math.random()*c.length)];e.style.setProperty('--fall-dur',(Math.random()*2+2)+'s');e.style.setProperty('--fall-delay',(Math.random()*.8)+'s');e.style.setProperty('--rot',(Math.random()*1080-540)+'deg');const s=(Math.random()*10+5)+'px';e.style.width=s;e.style.height=s;e.style.borderRadius=Math.random()>.5?'50%':'2px';document.body.appendChild(e);setTimeout(()=>e.remove(),4000)}}

// ============ SKILLS FILTER ============
function filterSkills(cat,btn){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.bento-item').forEach(item=>{const show=cat==='all'||item.dataset.cat===cat;item.style.display=show?'':'none';if(show)gsap.from(item,{opacity:0,y:20,duration:.5})});addXP(5)}

// ============ FUN ZONE ============
function moveImpossibleBtn(){const b=document.getElementById('impossibleBtn');if(!b)return;const c=b.closest('.fun-card'),r=c.getBoundingClientRect();b.style.transform=`translate(${Math.random()*150-75}px,${Math.random()*60-30}px)`}
function caughtImpossibleBtn(){document.getElementById('impossibleOutput').textContent="HOW?! You're a legend! 🏆";addXP(50);showAchievement('🎯','Impossible Caught!');spawnConfetti(40)}
function vibeCheck(){const v=["🔥 LEGENDARY","😎 Cooler than nitrogen","🤓 Peak nerd energy","💀 Dead inside but productive","🎭 Main character energy","⚡ Electric chaos","🌈 Unicorn developer","🧊 Ice cold coder"];const o=document.getElementById('vibeOutput');o.textContent=v[Math.floor(Math.random()*v.length)];gsap.from(o,{scale:.5,opacity:0,duration:.5,ease:'back.out(2)'});addXP(10)}
function generateExcuse(){const e=["Code was working in my dream.","Compiler is biased against me.","Cosmic rays flipped my bits.","Works on my machine ¯\\_(ツ)_/¯","My rubber duck was on vacation.","Mercury was in retrograde.","Code is correct, reality is wrong.","Cat walked on keyboard.","Wi-Fi was downloading creativity.","I was solving P=NP."];const o=document.getElementById('excuseOutput');o.textContent=e[Math.floor(Math.random()*e.length)];gsap.from(o,{x:-20,opacity:0,duration:.4});addXP(10)}
function randomCompliment(){const c=["Your code is cleaner than a fresh OS! 🧹","You debug faster than light! ⚡","Stack Overflow learns from you! 📚","Your algorithms are *chef's kiss* 🤌","NASA wants you for their next mission 🚀","Your GitHub radiates big brain energy 🧠","Legends speak of your commit history ✨"];const o=document.getElementById('complimentOutput');o.textContent=c[Math.floor(Math.random()*c.length)];gsap.from(o,{scale:1.2,opacity:0,duration:.5,ease:'elastic.out(1,0.5)'});addXP(10)}
function wouldYouRather(){const w=["Perfect code but no dark mode 🌞 OR dark mode with Comic Sans? 🤡","Infinite RAM + 1mbps 🐌 OR 1GB RAM + 10Gbps? ⚡","Debug CSS forever 😵 OR Java without IDE? 📝","No Stack Overflow 😱 OR no Google? 🔍","Only Python forever 🐍 OR new language weekly? 📚"];const o=document.getElementById('wyrOutput');o.textContent=w[Math.floor(Math.random()*w.length)];gsap.from(o,{y:10,opacity:0,duration:.4});addXP(10)}
function codeFortune(){const f=["🔮 Next project goes viral!","🔮 A senior dev will compliment your code!","🔮 Beware of null pointers Thursday...","🔮 Open source will change your career!","🔮 CSS works first try! (jk 😂)","🔮 10x productivity hack incoming!","🔮 Rubber duck holds the key!"];const o=document.getElementById('fortuneOutput');o.textContent=f[Math.floor(Math.random()*f.length)];gsap.from(o,{rotation:10,opacity:0,duration:.6});addXP(10)}

// ============ CHATBOT ============
let chatIsOpen=false;
function toggleChat(){chatIsOpen=!chatIsOpen;document.getElementById('chatWindow').classList.toggle('open',chatIsOpen);const n=document.getElementById('chatNotif');if(n)n.style.display='none';if(chatIsOpen)addXP(5)}
function sendChat(){const i=document.getElementById('chatInput');const m=i.value.trim();if(!m)return;appendMsg(m,'user');i.value='';setTimeout(()=>{appendMsg(getReply(m),'bot');addXP(5)},800+Math.random()*500)}
function appendMsg(t,type){const c=document.getElementById('chatMessages');const w=document.createElement('div');w.className=`chat-msg ${type}`;w.innerHTML=`<div class="msg-avatar">${type==='bot'?'🤖':'👤'}</div><div class="msg-content">${t}</div>`;c.appendChild(w);c.scrollTop=c.scrollHeight}
function getReply(m){const l=m.toLowerCase();const r=[{k:['hello','hi','hey','yo'],r:"Hey legend! Welcome to Pavit's empire! 🚀"},{k:['name','who'],r:"I'm the Pavit Singh Bot! More sarcasm than RAM. 😏"},{k:['age','old','14'],r:"Pavit is 14. FOURTEEN. Codes better than most adults. 💪"},{k:['skill','code','language'],r:"Python 🐍, C++ ⚡, Java ☕, JS 🌐, Three.js 🎨... everything except dating. 😂"},{k:['project'],r:"Check Projects section! Each built with love and bad sleep schedules. 🌙"},{k:['hire','work','freelance'],r:"Yes! Hit up the contact section — let's build something epic! 💼"},{k:['bug'],r:"Bugs fear Pavit. They've filed a restraining order. 🐛💀"},{k:['coffee'],r:"Coffee isn't a beverage for Pavit. It's an IV drip. ☕"},{k:['game','snake'],r:"Press F2 or click 🐍 Snake in the navbar! 🎮"},{k:['secret','konami'],r:"Try ↑↑↓↓←→←→BA on your keyboard... 🤫"},{k:['joke','funny'],r:"Why do programmers prefer dark mode? Light attracts bugs! 🐛😂"}];
for(const x of r)if(x.k.some(k=>l.includes(k)))return x.r;
const fb=["Interesting... tell me more! 🤔","That's above my pay grade. Email Pavit! 📧","Error: Brain.exe stopped. 🧠💥","I understood. I just chose to ignore it. 😏","My neural network crashed. JK, I'm pure if-else. 🤖"];return fb[Math.floor(Math.random()*fb.length)]}

// ============ SNAKE GAME ============
let snakeRAF=null;
function openSnakeGame(){document.getElementById('snakeModal').classList.add('open');document.body.style.overflow='hidden';startSnake();addXP(10);showAchievement('🐍','Snake Activated!')}
function closeSnakeGame(){document.getElementById('snakeModal').classList.remove('open');document.body.style.overflow='';if(snakeRAF)cancelAnimationFrame(snakeRAF)}
function startSnake(){const cv=document.getElementById('snakeCanvas');if(!cv)return;const ctx=cv.getContext('2d');const g=20;let s=[{x:10,y:10}],f=nf(),d={x:1,y:0},nd={x:1,y:0},sc=0,lt=0;
function nf(){return{x:Math.floor(Math.random()*(cv.width/g)),y:Math.floor(Math.random()*(cv.height/g))}}
const kh=e=>{if(e.key==='Escape'){closeSnakeGame();return}if(e.key==='ArrowUp'&&d.y!==1)nd={x:0,y:-1};if(e.key==='ArrowDown'&&d.y!==-1)nd={x:0,y:1};if(e.key==='ArrowLeft'&&d.x!==1)nd={x:-1,y:0};if(e.key==='ArrowRight'&&d.x!==-1)nd={x:1,y:0}};document.addEventListener('keydown',kh);
function loop(t){snakeRAF=requestAnimationFrame(loop);if(t-lt<110)return;lt=t;d={...nd};const h={x:s[0].x+d.x,y:s[0].y+d.y};
if(h.x<0||h.x>=cv.width/g||h.y<0||h.y>=cv.height/g||s.some(p=>p.x===h.x&&p.y===h.y)){cancelAnimationFrame(snakeRAF);document.removeEventListener('keydown',kh);addXP(sc*3);if(sc>=5)showAchievement('🐍',`Score: ${sc}!`);ctx.fillStyle='rgba(233,69,96,0.3)';ctx.fillRect(0,0,cv.width,cv.height);ctx.fillStyle='#fff';ctx.font='bold 24px Space Grotesk';ctx.textAlign='center';ctx.fillText('GAME OVER',cv.width/2,cv.height/2-10);ctx.font='16px Space Grotesk';ctx.fillText(`Score: ${sc}`,cv.width/2,cv.height/2+20);return}
s.unshift(h);if(h.x===f.x&&h.y===f.y){sc++;document.getElementById('snakeScore').textContent=`SCORE: ${sc}`;f=nf()}else s.pop();
ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,cv.width,cv.height);
s.forEach((p,i)=>{const a=1-(i/s.length)*.6;ctx.fillStyle=`rgba(233,69,96,${a})`;ctx.shadowColor='#e94560';ctx.shadowBlur=i===0?15:0;ctx.beginPath();ctx.roundRect(p.x*g+1,p.y*g+1,g-2,g-2,4);ctx.fill();ctx.shadowBlur=0});
ctx.fillStyle='#f5a623';ctx.shadowColor='#f5a623';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(f.x*g+g/2,f.y*g+g/2,g/2-2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
snakeRAF=requestAnimationFrame(loop)}
document.addEventListener('keydown',e=>{if(e.key==='F2'){e.preventDefault();openSnakeGame()}});

// ============ KONAMI ============
function initKonamiCode(){const c=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let i=0;document.addEventListener('keydown',e=>{if(e.key===c[i]){i++;if(i===c.length){document.getElementById('konamiReward').classList.add('open');addXP(500);showAchievement('🎊','KONAMI MASTER!');spawnConfetti(80);i=0}}else i=e.key===c[0]?1:0})}
function closeKonami(){document.getElementById('konamiReward').classList.remove('open');spawnConfetti(60)}

// ================================================================
// WORKING PROJECT LOGIC
// ================================================================

// === CALCULATOR ===
let calcVal='0',calcOp='',calcPrev='';
function calcInput(v){
    const d=document.getElementById('calcDisplay');
    if(v==='C'){calcVal='0';calcOp='';calcPrev='';d.textContent='0';return}
    if(v==='±'){calcVal=String(-parseFloat(calcVal));d.textContent=calcVal;return}
    if(v==='%'){calcVal=String(parseFloat(calcVal)/100);d.textContent=calcVal;return}
    if(['+','-','*','/'].includes(v)){calcOp=v;calcPrev=calcVal;calcVal='0';return}
    if(v==='='){if(!calcOp||!calcPrev)return;let r;const a=parseFloat(calcPrev),b=parseFloat(calcVal);
        if(calcOp==='+')r=a+b;else if(calcOp==='-')r=a-b;else if(calcOp==='*')r=a*b;else if(calcOp==='/')r=b!==0?a/b:'Error';
        calcVal=String(r);calcOp='';calcPrev='';d.textContent=calcVal;addXP(3);return}
    if(v==='.'&&calcVal.includes('.'))return;
    calcVal=calcVal==='0'&&v!=='.'?v:calcVal+v;d.textContent=calcVal;
}

// === COLOR PALETTE ===
function generatePalette(){
    const c=document.getElementById('colorPalette');if(!c)return;c.innerHTML='';
    for(let i=0;i<5;i++){
        const hex='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
        const s=document.createElement('div');s.className='color-swatch';s.style.background=hex;s.textContent=hex;
        s.onclick=()=>{navigator.clipboard.writeText(hex);document.getElementById('colorCopied').textContent=`Copied ${hex}!`;addXP(3)};
        c.appendChild(s);
    }
    addXP(5);
}

// === STOPWATCH ===
let swInterval=null,swTime=0,swRunning=false,swLapCount=0;
function toggleStopwatch(){const b=document.getElementById('swStartBtn');if(swRunning){clearInterval(swInterval);swRunning=false;b.textContent='▶ Start'}else{swRunning=true;b.textContent='⏸ Pause';swInterval=setInterval(()=>{swTime+=10;updateSWDisplay()},10)}}
function resetStopwatch(){clearInterval(swInterval);swTime=0;swRunning=false;swLapCount=0;updateSWDisplay();document.getElementById('swStartBtn').textContent='▶ Start';document.getElementById('swLaps').innerHTML=''}
function lapStopwatch(){if(!swRunning)return;swLapCount++;const l=document.getElementById('swLaps');l.innerHTML=`<div>Lap ${swLapCount}: ${formatSW(swTime)}</div>`+l.innerHTML;addXP(3)}
function updateSWDisplay(){document.getElementById('stopwatchDisplay').textContent=formatSW(swTime)}
function formatSW(ms){const m=Math.floor(ms/60000);const s=Math.floor((ms%60000)/1000);const cs=Math.floor((ms%1000)/10);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(cs).padStart(2,'0')}`}

// === PASSWORD GENERATOR ===
function generatePassword(){const l=document.getElementById('pwdLength').value;const sym=document.getElementById('pwdSymbols').checked;const num=document.getElementById('pwdNumbers').checked;
let chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';if(num)chars+='0123456789';if(sym)chars+='!@#$%^&*()_+-=[]{}|;:,.<>?';
let pwd='';for(let i=0;i<l;i++)pwd+=chars[Math.floor(Math.random()*chars.length)];
document.getElementById('passwordOutput').textContent=pwd;addXP(5)}
function copyPassword(){const p=document.getElementById('passwordOutput').textContent;if(p&&p!=='Click Generate!')navigator.clipboard.writeText(p);addXP(3)}

// === MARKDOWN PREVIEWER ===
function renderMarkdown(){const i=document.getElementById('mdInput').value;const o=document.getElementById('mdPreview');
let h=i.replace(/^### (.*$)/gim,'<h3>$1</h3>').replace(/^## (.*$)/gim,'<h2>$1</h2>').replace(/^# (.*$)/gim,'<h1>$1</h1>')
.replace(/\*\*(.*?)\*\*/gim,'<strong>$1</strong>').replace(/\*(.*?)\*/gim,'<em>$1</em>')
.replace(/`(.*?)`/gim,'<code>$1</code>').replace(/^- (.*$)/gim,'<li>$1</li>')
.replace(/\n/gim,'<br>');
h=h.replace(/(<li>.*<\/li>)/gims,m=>'<ul>'+m+'</ul>');
o.innerHTML=h||'<p style="color:var(--text-dim)">Preview appears here...</p>'}

// === PIXEL ART CANVAS ===
function initPixelCanvas(){const c=document.getElementById('pixelCanvas');if(!c)return;c.innerHTML='';
let isDrawing=false;
for(let i=0;i<256;i++){const cell=document.createElement('div');cell.className='pixel-cell';
cell.addEventListener('mousedown',e=>{e.preventDefault();isDrawing=true;cell.style.background=document.getElementById('pixelColor').value});
cell.addEventListener('mouseover',()=>{if(isDrawing)cell.style.background=document.getElementById('pixelColor').value});
c.appendChild(cell)}
document.addEventListener('mouseup',()=>{isDrawing=false})}
function clearPixelCanvas(){document.querySelectorAll('.pixel-cell').forEach(c=>{c.style.background='var(--glass)'})}
function randomPixelArt(){const colors=['#e94560','#f5a623','#00d2ff','#1a1a2e','#ff00ff','#00ffaa','transparent'];document.querySelectorAll('.pixel-cell').forEach(c=>{c.style.background=Math.random()>0.5?colors[Math.floor(Math.random()*colors.length)]:'var(--glass)'});addXP(5)}