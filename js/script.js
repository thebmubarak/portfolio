//BMubarak script.js August 2025 by Mubarak Balogun.
// Year
document.getElementById('year').textContent = new Date().getFullYear();

// IntersectionObserver reveal
const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, {threshold:.12}) : null;
document.querySelectorAll('.reveal, .card, .project, .brand-item, .step').forEach(el=>{
  if(io) io.observe(el); else el.classList.add('show');
});

// Subtle tilt on project cards
const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);
document.querySelectorAll('.project').forEach(card=>{
  let rect=null;
  const reset=()=>{ card.style.transform='translateY(-2px) scale(1.01) rotateX(0) rotateY(0)'; }
  card.addEventListener('mouseenter',()=>{ rect=card.getBoundingClientRect(); });
  card.addEventListener('mousemove',(e)=>{
    if(!rect) rect=card.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width, y=(e.clientY-rect.top)/rect.height;
    const rx = clamp((.5-y)*6,-6,6);
    const ry = clamp((x-.5)*6,-6,6);
    card.style.transform=`translateY(-2px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave',reset,{passive:true});
});

// Modal logic
const backdrop = document.getElementById('backdrop');
const modals = [...document.querySelectorAll('.modal')];
const openModal = id => {
  backdrop.classList.add('show');
  const m = document.getElementById(id);
  m.classList.add('show');
  m.setAttribute('aria-hidden','false');
};
const closeModals = () => {
  backdrop.classList.remove('show');
  modals.forEach(m=>{ m.classList.remove('show'); m.setAttribute('aria-hidden','true'); });
};
backdrop.addEventListener('click', closeModals);
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModals(); });
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click', closeModals));
document.querySelectorAll('[data-modal]').forEach(card=>{
  card.querySelector('button.btn')?.addEventListener('click', ()=> openModal(card.dataset.modal));
});

// Filter logic
const filterButtons = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('#gallery .project');
filterButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    items.forEach(it=>{
      const cats = (it.dataset.cats || '').split(',').map(s=>s.trim());
      const show = f === 'all' ? true : cats.includes(f);
      it.style.display = show ? '' : 'none';
    });
  });
});

// Back to top
const topBtn = document.getElementById('backToTop');
topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior: 'smooth'}));

// Respect reduced motion for video autoplay
try{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('video[autoplay]').forEach(v=>{ v.removeAttribute('autoplay'); v.pause(); });
  }
}catch(e){}
