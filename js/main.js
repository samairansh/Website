document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.mobile-toggle'); const nav=document.querySelector('.navlinks');
  if(toggle&&nav){toggle.addEventListener('click',()=>nav.classList.toggle('open'));}
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}}));
});
