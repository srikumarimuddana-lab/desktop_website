/* The /preview design system. One scoped stylesheet under .sp shared by every
 * page in the sample, so the pages stay visually one product while each keeps
 * its own motion. */

export const CSS = `
.sp{
  --ink:#0B0B0B; --ink-6:#4A4A4A; --ink-5:#757370; --ink-4:#9C9890;
  --paper:#F3EEE2; --paper-50:#FAF7EF; --paper-3:#E6DCC9; --white:#fff;
  --red:#DB3344; --red-7:#B41E31; --red-1:#FFE7EA;
  --sky:#A8E1DE; --sun:#FFC60B;
  --hard:5px 5px 0 var(--ink);
  --hard-sm:3px 3px 0 var(--ink);
  --hard-lg:8px 8px 0 var(--ink);
  --snap:cubic-bezier(.34,1.56,.64,1);
  --spring:cubic-bezier(.2,1.1,.3,1);
  background:#FEFEFE; color:var(--ink);
  font-family:var(--font-inter,system-ui),system-ui,sans-serif;
}
.sp *{box-sizing:border-box}
/* readable to assistive tech, invisible on screen — used where the visible
   markup is decorative (split headlines paint per-character spans) */
.sp-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
  clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
.sp img{max-width:100%}
.sp-display{font-family:var(--sp-display),"Arial Narrow",sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.005em;line-height:.92}
.sp-editorial{font-family:var(--sp-serif),Georgia,serif;font-style:italic;text-transform:none;letter-spacing:0}
.sp-wrap{max-width:1180px;margin:0 auto;padding:0 clamp(18px,4vw,44px)}
.sp-sec{padding-block:clamp(56px,7vw,104px)}
.sp-stage [id]{scroll-margin-top:clamp(92px,12vh,120px)}
.sp-h2{font-size:clamp(30px,5vw,58px);margin:0 0 clamp(24px,3vw,42px);text-wrap:balance}
.sp-accent{color:var(--red)}
.sp-kick{display:inline-block;font-family:var(--sp-display),sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:13px;color:var(--red);margin-bottom:14px}
.sp-lede{margin:0;font-size:clamp(15px,1.25vw,18px);line-height:1.6;color:var(--ink-6);max-width:48ch}

/* buttons — the hard-shadow signature */
.sp-btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:999px;
  border:2px solid var(--ink);background:var(--red);color:#fff;font-weight:700;font-size:15px;
  box-shadow:-4px 4px 0 var(--ink);text-decoration:none;cursor:pointer;
  transition:transform .14s,box-shadow .14s}
.sp-btn:hover{transform:translate(-2px,2px);box-shadow:-2px 2px 0 var(--ink);color:#fff}
.sp-btn:active{transform:translate(-4px,4px);box-shadow:none}
.sp-btn-ghost{display:inline-flex;align-items:center;padding:13px 22px;border-radius:999px;
  border:2px solid var(--ink);background:#fff;color:var(--ink);font-weight:700;font-size:15px;text-decoration:none;
  transition:transform .14s}
.sp-btn-ghost:hover{transform:translateY(-2px);color:var(--ink)}
.sp-btn-ghost:active{transform:translateY(1px) scale(.96)}
.sp-btn-ghost-dark{background:transparent;color:#fff;border-color:#fff}

/* ── nav ── */
@keyframes sp-navin{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
.sp-nav{animation:sp-navin .65s var(--spring) backwards .1s;
  position:sticky;top:clamp(12px,2.4vw,24px);z-index:60;width:min(1180px,calc(100% - clamp(24px,5vw,56px)));
  margin:clamp(12px,2.4vw,24px) auto 0;display:flex;align-items:center;gap:14px;
  padding:9px 10px 9px 24px;border-radius:999px;border:2px solid var(--ink);
  background:rgba(251,249,243,.86);backdrop-filter:blur(14px) saturate(1.2);
  box-shadow:var(--hard-sm)}
.sp-nav-logo{display:flex;align-items:center;flex:0 0 auto}
.sp-nav-logo img{height:26px;width:auto;transition:transform .2s var(--snap)}
.sp-nav-logo:hover img{transform:rotate(-5deg) scale(1.07)}
.sp-nav-logo:active img{transform:scale(.92)}
.sp-nav-links{display:none;gap:22px;margin-left:auto;font-size:14.5px;font-weight:600}
.sp-nav-links a{color:var(--ink);opacity:.72;text-decoration:none;display:inline-block}
/* menu items walk in behind the bar, then get an underline that sweeps on hover
   and a press you can feel */
.sp-nav-links a{animation:sp-navitem .5s ease backwards}
.sp-nav-links a:nth-child(1){animation-delay:.28s}
.sp-nav-links a:nth-child(2){animation-delay:.36s}
.sp-nav-links a:nth-child(3){animation-delay:.44s}
.sp-nav-links a:nth-child(4){animation-delay:.52s}
@keyframes sp-navitem{from{opacity:0;transform:translateY(-9px)}to{opacity:1;transform:none}}
.sp-nav-links a:not(.sp-nav-ai){padding-bottom:3px;
  background:linear-gradient(var(--red),var(--red)) no-repeat left 100%/0 2.5px;
  transition:opacity .15s ease,background-size .3s var(--snap),transform .12s ease}
.sp-nav-links a:not(.sp-nav-ai):hover{opacity:1;background-size:100% 2.5px}
.sp-nav-links a:not(.sp-nav-ai):active{transform:translateY(1px) scale(.97)}
.sp-nav-links a.is-here{opacity:1;background-size:100% 2.5px}
.sp-nav-links a.sp-nav-ai{display:inline-flex;align-items:center;gap:7px;opacity:1;font-weight:800;
  background:var(--sun);border:2px solid var(--ink);border-radius:999px;padding:5px 13px;
  box-shadow:-2px 2px 0 var(--ink);transition:transform .16s var(--snap),box-shadow .16s}
.sp-nav-links a.sp-nav-ai:hover{transform:translateY(-1px)}
.sp-nav-links a.sp-nav-ai:active{transform:translate(-2px,2px);box-shadow:0 0 0 var(--ink)}
.sp-nav-links a.sp-nav-ai span{display:inline-block;transition:transform .25s var(--snap)}
.sp-nav-links a.sp-nav-ai:hover span{transform:rotate(20deg) scale(1.2)}
.sp-nav-cta{display:flex;align-items:center;gap:9px;margin-left:auto}
.sp-nav-cta .sp-btn,.sp-nav-cta .sp-btn-ghost{padding:11px 20px;font-size:14px;box-shadow:-3px 3px 0 var(--ink)}
.sp-nav-cta .sp-btn-ghost{box-shadow:none}
@media(min-width:900px){.sp-nav-links{display:flex}.sp-nav-cta{margin-left:0}}
@media(max-width:600px){.sp-nav-cta .sp-btn-ghost{display:none}}

/* ── mobile menu ──
   Below 900px the bar has no room for the links, so they move into a panel
   that drops out of the pill. Same vocabulary as everything else: 2px ink
   border, hard offset shadow, display type, a press you can feel. */
.sp-burger{display:inline-grid;place-items:center;width:42px;height:42px;flex:0 0 auto;
  padding:0;border-radius:14px;border:2px solid var(--ink);background:var(--white);
  color:var(--ink);cursor:pointer;box-shadow:-3px 3px 0 var(--ink);
  transition:transform .14s,box-shadow .14s,background .2s ease}
.sp-burger:hover{transform:translate(-1px,1px);box-shadow:-2px 2px 0 var(--ink)}
.sp-burger:active{transform:translate(-3px,3px);box-shadow:none}
.sp-burger.is-open{background:var(--sun)}
.sp-burger-box{display:block;position:relative;width:19px;height:14px}
.sp-burger-box i{position:absolute;left:0;right:0;height:2.5px;border-radius:2px;background:currentColor;
  transition:transform .28s var(--snap),opacity .16s ease}
.sp-burger-box i:nth-child(1){top:0}
.sp-burger-box i:nth-child(2){top:50%;margin-top:-1.25px}
.sp-burger-box i:nth-child(3){bottom:0}
/* three bars fold into a cross */
.sp-burger.is-open i:nth-child(1){transform:translateY(5.75px) rotate(45deg)}
.sp-burger.is-open i:nth-child(2){opacity:0;transform:scaleX(.2)}
.sp-burger.is-open i:nth-child(3){transform:translateY(-5.75px) rotate(-45deg)}

.sp-menu{position:absolute;top:calc(100% + 12px);left:0;right:0;z-index:2;
  display:flex;flex-direction:column;gap:2px;padding:16px 18px 18px;
  border-radius:26px;border:2px solid var(--ink);background:var(--paper-50);
  box-shadow:var(--hard);max-height:calc(100vh - 120px);overflow-y:auto;
  transform-origin:top center;animation:sp-menuin .34s var(--spring) backwards}
@keyframes sp-menuin{from{opacity:0;transform:translateY(-14px) scale(.97)}to{opacity:1;transform:none}}
.sp-menu-kick{font-family:var(--sp-display),sans-serif;text-transform:uppercase;letter-spacing:.16em;
  font-size:11.5px;color:var(--ink-5);padding:0 4px 8px}
.sp-menu-row{display:flex;align-items:center;justify-content:space-between;gap:14px;
  padding:11px 4px;color:var(--ink);text-decoration:none;
  border-bottom:2px solid rgba(11,11,11,.08);
  animation:sp-menurow .34s var(--spring) backwards;
  animation-delay:calc(.04s + var(--i,0) * .05s);
  transition:transform .14s var(--snap),padding-left .18s var(--snap),color .16s ease}
@keyframes sp-menurow{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none}}
.sp-menu-row .sp-display{font-size:clamp(27px,8vw,34px);line-height:1}
.sp-menu-row b{font-size:20px;color:var(--ink-4);transition:transform .22s var(--snap),color .16s ease}
.sp-menu-row:hover{color:var(--ink);padding-left:10px}
.sp-menu-row:hover b{transform:translateX(5px);color:var(--red)}
.sp-menu-row:active{transform:scale(.98)}
.sp-menu-row[aria-current="page"]{color:var(--red)}
.sp-menu-row[aria-current="page"] b{color:var(--red);transform:translateX(3px)}
.sp-menu-ai{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:16px;
  padding:13px 18px;border-radius:999px;border:2px solid var(--ink);background:var(--sun);
  color:var(--ink);font-weight:800;font-size:15px;text-decoration:none;
  box-shadow:-3px 3px 0 var(--ink);
  animation:sp-menurow .34s var(--spring) backwards;
  animation-delay:calc(.04s + var(--i,0) * .05s);
  transition:transform .14s,box-shadow .14s}
.sp-menu-ai:hover{transform:translate(-1px,1px);box-shadow:-2px 2px 0 var(--ink);color:var(--ink)}
.sp-menu-ai:active{transform:translate(-3px,3px);box-shadow:none}
.sp-menu-scrim{position:fixed;inset:0;z-index:50;background:rgba(11,11,11,.34);
  animation:sp-scrimin .28s ease backwards}
@keyframes sp-scrimin{from{opacity:0}to{opacity:1}}
/* the docked CTA lives outside the nav's stacking context, so it would float
   over an open panel — park it while the menu is up */
.sp-menu-open .sp-dock{opacity:0;pointer-events:none}
/* same for the assistant: it is the thing the visitor just opened, so the app
   CTA gets out of its way rather than sitting over the input row */
body:has([data-chat="open"]) .sp-dock{opacity:0;pointer-events:none}
@media(min-width:900px){.sp-burger{display:none}}

/* ── hero: type on mint, a yellow shelf under it, phones straddling both ── */
.sp-hero{position:relative;margin:clamp(12px,2vw,28px);border-radius:clamp(24px,2.8vw,40px);
  overflow:hidden;border:2px solid var(--ink);background:var(--sky);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(108px,15vh,166px) clamp(18px,4vw,44px) 0;text-align:center}
.sp-hero-shelf{position:absolute;left:-2px;right:-2px;bottom:-2px;height:clamp(132px,19vw,250px);
  background:#FFF6AE;border:2px solid var(--ink);border-bottom:0;
  border-radius:clamp(26px,3vw,44px) clamp(26px,3vw,44px) 0 0}
.sp-hero-copy{position:relative;z-index:2;max-width:1020px;margin:0 auto}
/* dotted Canada backdrop — soft texture, never competes with the copy */
.sp-canmap{position:absolute;left:50%;top:clamp(48px,8vh,88px);transform:translateX(-50%);
  width:min(94%,1120px);pointer-events:none}
.sp-cd-l1,.sp-cd-l2,.sp-cd-l3{opacity:.16;fill:#0B0B0B}
.sp-cd-outline{opacity:.34}
.sp-cd-lbl{font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
  fill:#0B0B0B;opacity:.78}
.sp-cd-lbl-e{display:none}
.sp-cd-ring{opacity:.4}
.sp-cd-l1{animation:sp-cd-tw 4.8s ease-in-out infinite}
.sp-cd-l2{animation:sp-cd-tw 4.8s ease-in-out -1.6s infinite}
.sp-cd-l3{animation:sp-cd-tw 4.8s ease-in-out -3.2s infinite}
@keyframes sp-cd-tw{0%,100%{opacity:.05}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.sp-cd-l1,.sp-cd-l2,.sp-cd-l3{animation:none}}
@media (max-width:720px){.sp-canmap{width:1000px;top:-52px;left:-244px;transform:none}
.sp-cd-lbl-w{display:none}.sp-cd-lbl-e{display:block}}
.sp-hero-badge{display:inline-flex;align-items:center;background:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:8px 17px;font-size:11.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;box-shadow:var(--hard-sm)}
.sp-hero-h{font-size:clamp(40px,8vw,102px);color:var(--ink);text-wrap:balance;
  margin:clamp(16px,2.4vw,26px) 0 clamp(20px,3vw,30px)}
.sp-hero-hl{color:var(--red)}
.sp-hero-loc{display:block;margin:11px 0 0;font-size:12.5px;font-weight:800;
  letter-spacing:.14em;text-transform:uppercase;color:rgba(11,11,11,.62)}
.sp-hero-loc::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;
  background:var(--red);margin-right:7px;vertical-align:1px}
.sp-hero-chips{list-style:none;display:flex;justify-content:center;flex-wrap:wrap;
  gap:9px 10px;margin:0 0 clamp(22px,3vw,30px);padding:0}
.sp-hero-chips li{border:2px solid var(--ink);background:#fff;border-radius:999px;
  padding:7px 15px;font-size:13px;font-weight:700;box-shadow:var(--hard-sm)}
.sp-hero-btns{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}
.sp-hero-alt{margin:clamp(14px,2vw,18px) 0 0;font-size:14px}
.sp-hero-alt a{display:inline-block;font-weight:800;color:var(--ink);opacity:.72;
  text-decoration:none;padding-bottom:2px;
  background:linear-gradient(var(--ink),var(--ink)) no-repeat left 100%/100% 2px;
  transition:opacity .15s ease,transform .14s var(--snap)}
.sp-hero-alt a:hover{opacity:1;transform:translateX(3px)}
.sp-hero-alt a:active{transform:translateX(1px) scale(.98)}

/* ── the phone fan ── */
.sp-fan{position:relative;z-index:3;display:flex;justify-content:center;
  height:clamp(292px,36vw,486px);margin-top:clamp(20px,3.4vw,42px)}
.sp-fan-p{position:absolute;top:0;width:clamp(146px,15.5vw,214px);aspect-ratio:9/19;
  border:3px solid var(--ink);border-radius:clamp(18px,2vw,28px);background:var(--paper-50);
  box-shadow:6px 6px 0 var(--ink);overflow:hidden;transform-origin:50% 92%;
  display:flex;flex-direction:column;
  opacity:0;transition:opacity .55s ease var(--ap-delay,0ms)}
.sp-fan.ready .sp-fan-p{opacity:1}
.sp-fan-notch{position:absolute;top:7px;left:50%;margin-left:-17%;width:34%;height:8px;
  background:var(--ink);border-radius:999px;z-index:5}
.sp-fan-tag{position:absolute;z-index:6;right:clamp(2px,4vw,88px);top:clamp(-6px,1vw,18px);
  background:var(--sun);color:var(--ink);border:2px solid var(--ink);
  border-radius:999px;padding:9px 16px;font-size:15px;letter-spacing:.03em;box-shadow:4px 4px 0 var(--ink);
  opacity:0;transform:rotate(-9deg) scale(.55);
  transition:opacity .4s ease 1120ms,transform .5s var(--spring) 1120ms}
.sp-fan.ready .sp-fan-tag{opacity:1;transform:rotate(-9deg) scale(1)}

/* ── the little screens inside the fan ── */
.sp-fs{flex:1;min-height:0;display:flex;flex-direction:column;gap:6px;padding:22px 9px 10px}
.sp-fs-hi{margin:0;font-size:12px;letter-spacing:.05em;color:var(--red)}
.sp-fs-field{display:flex;align-items:center;gap:6px;background:#fff;border:2px solid var(--ink);
  border-radius:9px;padding:7px 8px;font-size:9.5px;font-weight:700}
.sp-fs-pin{width:7px;height:7px;border-radius:999px;background:var(--red);flex:0 0 auto}
.sp-fs-chips{display:flex;gap:5px}
.sp-fs-chips span{flex:1;text-align:center;background:var(--sun);border:2px solid var(--ink);
  border-radius:999px;padding:4px 0;font-size:8.5px;font-weight:800}
.sp-fs-map{flex:1;min-height:34px;border:2px solid var(--ink);border-radius:10px;overflow:hidden}
.sp-fs-go{text-align:center;background:var(--red);color:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:7px;font-weight:800;font-size:9.5px}
.sp-fs-go-ghost{background:#fff;color:var(--ink)}
.sp-fs-card{background:#fff;border:2px solid var(--ink);border-radius:10px;padding:8px}
.sp-fs-card-sun{background:var(--sun)}
.sp-fs-k{font-size:7.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-5)}
.sp-fs-big{display:block;font-size:22px;line-height:1;margin:3px 0 5px}
.sp-fs-row{display:flex;align-items:center;font-size:9px;font-weight:600;color:var(--ink-6);padding:2px 0}
.sp-fs-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:10.5px;color:var(--ink)}
.sp-fs-row-red b{color:var(--red)}
.sp-fs-tot{display:flex;align-items:center;margin-top:5px;padding-top:5px;
  border-top:1.5px dashed rgba(11,11,11,.3);font-size:7.5px;font-weight:800;letter-spacing:.08em;
  text-transform:uppercase;color:var(--ink-5)}
.sp-fs-tot b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:14px;
  color:var(--ink);letter-spacing:0}
.sp-fs-keep{background:var(--sun);border:2px solid var(--ink);border-radius:10px;padding:7px 8px}
.sp-fs-keep span{display:block;font-size:7.5px;font-weight:800;letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink-6)}
.sp-fs-keep b{display:block;font-size:19px;line-height:1;margin-top:2px}
.sp-fs-thread{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;
  gap:5px;overflow:hidden}
.sp-fs-bub{max-width:90%;border:2px solid var(--ink);border-radius:9px;padding:5px 7px;
  font-size:8.5px;line-height:1.35}
.sp-fs-bub-you{align-self:flex-end;background:var(--red);color:#fff}
.sp-fs-bub-ai{align-self:flex-start;background:#fff}
.sp-fs-typing{display:flex;gap:3px;padding:7px}
.sp-fs-typing i{width:4px;height:4px;border-radius:999px;background:var(--ink-4);animation:sp-typ 1.1s infinite}
.sp-fs-typing i:nth-child(2){animation-delay:.18s}
.sp-fs-typing i:nth-child(3){animation-delay:.36s}
.sp-fs-input{background:#fff;border:2px solid var(--ink);border-radius:999px;padding:6px 9px;
  font-size:8.5px;color:var(--ink-4)}
.sp-fs-toggle{display:flex;align-items:center;gap:6px;background:#D7F5E2;border:2px solid var(--ink);
  border-radius:999px;padding:6px 9px;font-size:9px;font-weight:800}
.sp-fs-toggle i{width:9px;height:9px;border-radius:999px;background:#12B76A;
  border:1.5px solid var(--ink);flex:0 0 auto}
.sp-fs-bars{display:flex;align-items:flex-end;gap:3px;height:34px;margin-top:6px}
.sp-fs-bars i{flex:1;background:var(--red);border:1.5px solid var(--ink);border-radius:3px 3px 0 0}
@media(max-width:700px){
  /* no room beside the phones down here — the sticker sits above them */
  .sp-fan-tag{top:-12px;right:4px;font-size:12.5px;padding:7px 12px}
}
@media(prefers-reduced-motion:reduce){
  .sp-fs-typing{display:none}
  .sp-fan-p,.sp-fan-tag{transition:none}
}

/* ── trust band: the numbers on one ledger row, the screening on its own ── */
.sp-band{border-block:2px solid var(--ink);background:var(--paper-50)}
.sp-band-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));
  gap:clamp(16px,2.6vw,34px);padding-block:clamp(26px,3.2vw,40px)}
.sp-stat{display:flex;flex-direction:column;gap:5px;padding-left:14px;border-left:3px solid var(--ink)}
.sp-stat b{font-size:clamp(30px,3.4vw,46px);line-height:.88}
.sp-stat > span{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-5)}
.sp-band-foot{display:flex;align-items:center;flex-wrap:wrap;gap:12px clamp(14px,2vw,22px);
  padding-block:clamp(16px,2vw,22px) clamp(22px,2.8vw,30px);border-top:2px dashed rgba(11,11,11,.25)}
.sp-band-lbl{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.18em;color:var(--ink-5)}
.sp-band-names{display:flex;gap:9px;flex-wrap:wrap}
.sp-band-names i{font-style:normal;font-weight:700;font-size:12.5px;color:var(--ink);
  background:#fff;border:2px solid var(--ink);border-radius:999px;padding:7px 14px;
  box-shadow:2px 2px 0 var(--ink)}

/* ── sticky stacking cards ── */
.sp-roll{display:flex;flex-direction:column;gap:clamp(36px,6vh,72px);padding-bottom:clamp(30px,9vh,110px)}
.sp-rcard{position:sticky;top:calc(clamp(88px,11vh,124px) + var(--i) * 16px);
  display:grid;grid-template-columns:1.05fr .95fr;min-height:clamp(300px,34vw,400px);
  border:2px solid var(--bd);border-radius:24px;overflow:hidden;background:var(--pc);color:var(--tc);
  box-shadow:0 22px 44px -20px rgba(11,11,11,.42)}
.sp-rcard-copy{display:flex;flex-direction:column;justify-content:center;gap:14px;padding:clamp(26px,3.4vw,52px)}
.sp-rcard-n{font-size:clamp(30px,3vw,44px);opacity:.42;line-height:1}
.sp-rcard-h{font-size:clamp(26px,3.2vw,46px);margin:0;text-wrap:balance}
.sp-rcard-p{margin:0;font-size:clamp(15px,1.1vw,17.5px);line-height:1.55;max-width:38ch;opacity:.9}
.sp-rcard-art{position:relative;display:flex;align-items:center;justify-content:center;padding:clamp(20px,3vw,40px);background:rgba(255,255,255,.28)}
.sp-tickets{display:flex;flex-direction:column;gap:10px;width:100%;max-width:330px}
.sp-ticket{display:flex;align-items:center;gap:12px;background:#fff;border:2px solid var(--ink);border-radius:13px;
  padding:11px 15px;box-shadow:-4px 4px 0 var(--ink);font-size:13.5px;color:var(--ink)}
.sp-ticket b{font-weight:700}
.sp-ticket i{margin-left:auto;font-style:normal;font-family:var(--sp-display),sans-serif;font-size:16px}
.sp-ticket-win{background:var(--sun)}
.sp-ticket-check i{color:#1F8A4C;font-family:inherit;font-size:17px;font-weight:900}
@media(max-width:760px){
  .sp-roll{gap:22px;padding-bottom:18px}
  .sp-rcard{grid-template-columns:1fr;min-height:0;top:clamp(74px,10vh,96px);border-radius:18px}
  .sp-rcard-art{order:-1;padding:20px}
}
@media(prefers-reduced-motion:reduce){.sp-rcard{position:static}}

/* ── how it works: pinned route + phone ── */
.sp-hiw{background:var(--paper-50);border-block:2px solid var(--ink);position:relative}
.sp-hiw.is-pinned{min-height:300vh;padding-block:0}
.sp-hiw-stage{display:flex;align-items:center}
.sp-hiw.is-pinned .sp-hiw-stage{position:sticky;top:0;height:100vh}
.sp-hiw-g{display:grid;gap:clamp(28px,5vw,64px);align-items:center;width:100%}
@media(min-width:900px){.sp-hiw-g{grid-template-columns:1.05fr .95fr}}

/* route rail */
.sp-route{position:relative;list-style:none;margin:clamp(22px,3vw,32px) 0 clamp(26px,3.2vw,38px);padding:0 0 0 46px;
  display:flex;flex-direction:column;gap:clamp(18px,2.4vw,30px)}
.sp-route-line{position:absolute;left:15px;top:10px;bottom:10px;width:3px;border-radius:999px;background:rgba(11,11,11,.14);overflow:hidden}
.sp-route-fill{position:absolute;left:0;top:0;width:100%;border-radius:999px;background:var(--red);
  height:calc(var(--p,0) * 100%);transition:height .18s linear}
.sp-route li{position:relative;display:flex;gap:14px;align-items:flex-start;opacity:.42;transition:opacity .35s ease}
.sp-route li.is-on,.sp-route li.is-done{opacity:1}
.sp-route-dot{position:absolute;left:-46px;top:2px;width:32px;height:32px;border-radius:999px;
  border:2px solid var(--ink);background:#fff;display:grid;place-items:center;
  transition:background .3s ease,transform .3s var(--snap)}
.sp-route-dot::after{content:"";width:10px;height:10px;border-radius:999px;background:rgba(11,11,11,.2);transition:background .3s ease}
.sp-route li.is-done .sp-route-dot{background:var(--sun)}
.sp-route li.is-done .sp-route-dot::after{background:var(--ink)}
.sp-route li.is-on .sp-route-dot{background:var(--red);transform:scale(1.14)}
.sp-route li.is-on .sp-route-dot::after{background:#fff}
.sp-route-n{display:block;font-size:14px;color:var(--red);line-height:1;margin-bottom:4px}
.sp-route-tx b{display:block;font-size:clamp(17px,1.6vw,20px);font-weight:800}
.sp-route-tx p{margin:5px 0 0;font-size:14.5px;line-height:1.55;color:var(--ink-6);max-width:40ch}

/* phone */
.sp-hiw-phone{display:flex;justify-content:center}
.sp-hiw-frame{position:relative;width:clamp(230px,25vw,300px);aspect-ratio:9/19;
  border:3px solid var(--ink);border-radius:clamp(30px,3vw,42px);overflow:hidden;
  background:var(--paper-50);box-shadow:var(--hard-lg)}
.sp-hiw-notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:32%;height:18px;
  background:var(--ink);border-radius:999px;z-index:5}
.sp-hiw-screens{position:absolute;inset:0}
.sp-scr{position:absolute;inset:0;padding:46px 16px 18px;display:flex;flex-direction:column;gap:11px;
  opacity:0;transform:translateY(10px);transition:opacity .32s ease,transform .38s var(--snap);pointer-events:none}
.sp-scr.on{opacity:1;transform:none}
.sp-scr-k{margin:0;font-family:var(--sp-display),sans-serif;text-transform:uppercase;letter-spacing:.12em;
  font-size:11px;color:var(--red)}
.sp-scr-field{display:flex;align-items:center;gap:9px;background:#fff;border:2px solid var(--ink);border-radius:12px;
  padding:12px 13px;font-size:14px;font-weight:700;box-shadow:var(--hard-sm)}
.sp-scr-pin{width:10px;height:10px;border-radius:999px;background:var(--red);flex:0 0 auto}
.sp-scr-list{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}
.sp-scr-list li{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--ink);
  border-radius:12px;padding:9px 11px}
.sp-scr-ic{width:26px;height:26px;flex:0 0 auto;border-radius:8px;border:2px solid var(--ink);background:var(--sun);
  display:grid;place-items:center;font-size:12px}
.sp-scr-list b{display:block;font-size:13px;line-height:1.15}
.sp-scr-list i{display:block;font-style:normal;font-size:11px;color:var(--ink-5)}
.sp-scr-card{background:#fff;border:2px solid var(--ink);border-radius:14px;padding:12px 13px;box-shadow:var(--hard-sm)}
.sp-scr-row{display:flex;align-items:center;font-size:12.5px;font-weight:600;color:var(--ink-6);padding:4px 0}
.sp-scr-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:14px;color:var(--ink)}
.sp-scr-row-flat b{color:var(--red)}
.sp-scr-total{display:flex;align-items:center;margin-top:7px;padding-top:8px;border-top:1.5px dashed rgba(11,11,11,.3);
  font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-5)}
.sp-scr-total b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:19px;color:var(--ink);letter-spacing:0}
.sp-scr-go{margin-top:auto;text-align:center;background:var(--red);color:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:12px;font-weight:800;font-size:13.5px}
.sp-scr-go-ghost{background:#fff;color:var(--ink)}
.sp-scr-mapwrap{position:relative;flex:1;min-height:0;border:2px solid var(--ink);border-radius:14px;overflow:hidden}
.sp-scr-mapwrap-sm{flex:0 0 auto;height:38%}
.sp-map{display:block;width:100%;height:100%}

/* the phone reacts as you scroll through a step, not just between steps */
.sp-caret{display:inline-block;width:2px;height:15px;margin-left:1px;background:var(--red);
  vertical-align:-2px;animation:sp-caret 1s steps(2) infinite}
@keyframes sp-caret{50%{opacity:0}}
.sp-scr-list li,.sp-scr-row,.sp-scr-total{opacity:0;transform:translateY(7px);
  transition:opacity .3s ease,transform .34s var(--snap)}
.sp-scr-list li.in,.sp-scr-row.in,.sp-scr-total.in{opacity:1;transform:none}
.sp-scr-bar{height:7px;border:2px solid var(--ink);border-radius:999px;background:#fff;overflow:hidden}
.sp-scr-bar i{display:block;height:100%;background:var(--red);transform-origin:0 50%;transition:transform .12s linear}
@media(prefers-reduced-motion:reduce){
  .sp-caret{animation:none}
  .sp-scr-list li,.sp-scr-row,.sp-scr-total{opacity:1;transform:none;transition:none}
}
.sp-scr-driver{display:flex;align-items:center;gap:10px}
.sp-scr-avatar{width:34px;height:34px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);background:var(--sky)}
.sp-scr-driver b{display:block;font-size:12.5px;line-height:1.2}
.sp-scr-driver i{display:block;font-style:normal;font-size:11px;color:var(--ink-5);margin-top:2px}
.sp-hiw-cta{margin-top:4px}

/* unpinned: normal layout, but scroll still picks the step */
.sp-hiw:not(.is-pinned) .sp-route li{opacity:1}
.sp-hiw:not(.is-pinned) .sp-scr{position:absolute;transform:none}
.sp-hiw:not(.is-pinned) .sp-hiw-stage{padding-block:clamp(56px,7vw,104px)}

/* reduced motion: the whole trip is shown at rest, scrolling changes nothing */
.sp-hiw.is-still .sp-route-fill{height:100%}
.sp-hiw.is-still .sp-route-dot{background:var(--sun)}
.sp-hiw.is-still .sp-route-dot::after{background:var(--ink)}
.sp-hiw.is-still .sp-scr{transition:none}

/* ── calculator ── */
.sp-calc{background:#FFF3CF;border-bottom:2px solid var(--ink)}
.sp-calcwrap{display:grid;gap:clamp(30px,5vw,72px);align-items:center}
@media(min-width:900px){.sp-calcwrap{grid-template-columns:1.02fr .98fr}}
.sp-readout{margin-top:clamp(22px,3vw,32px);background:var(--paper-50);border:2px solid var(--ink);
  border-radius:18px;padding:clamp(18px,2.2vw,26px);box-shadow:var(--hard)}
.sp-readout-k{font-size:11.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-5)}
.sp-readout-n{display:block;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:clamp(40px,4.6vw,66px);line-height:.9;color:var(--red);margin-top:6px}
.sp-readout-row{display:flex;align-items:baseline;gap:12px;font-size:14px;font-weight:600;color:var(--ink-6);
  border-top:1.5px dotted rgba(11,11,11,.26);padding-top:11px;margin-top:11px}
.sp-readout-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:20px;color:var(--ink)}
.sp-readout-win b{color:var(--red)}
.sp-readout-fine{margin:14px 0 0;font-size:12.5px;font-weight:600;color:var(--ink-5)}
.sp-calcvis{display:flex;justify-content:center}
.sp-machine{position:relative;width:min(340px,100%);display:flex;flex-direction:column;gap:14px;
  background:linear-gradient(#FDF7E8,#F3EAD5 60%,#EADFC2);border:3px solid var(--ink);border-radius:22px;
  padding:clamp(18px,1.9vw,24px);
  box-shadow:10px 12px 0 rgba(11,11,11,.82),inset 0 3px 0 rgba(255,255,255,.75),inset 0 -8px 0 rgba(11,11,11,.09)}
.sp-screw{position:absolute;width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink);
  background:radial-gradient(circle at 35% 30%,#FFF8E4 0 25%,#C9B98F 60%,#8F7F58)}
.sp-screw-1{top:9px;left:9px}.sp-screw-2{top:9px;right:9px}.sp-screw-3{bottom:9px;left:9px}.sp-screw-4{bottom:9px;right:9px}
.sp-machine-top{display:flex;align-items:center;justify-content:space-between}
.sp-machine-brand{font-family:var(--sp-display),sans-serif;font-size:17px;letter-spacing:.1em;color:var(--red)}
.sp-leds{display:flex;gap:7px}
.sp-leds i{width:11px;height:11px;border-radius:999px;border:1.5px solid rgba(11,11,11,.55);background:#C9B98F}
.sp-leds i.on{background:#3ADB76}
.sp-lcd{background:linear-gradient(#140A10,#241626 70%,#2E1B30);border:2.5px solid var(--ink);border-radius:10px;
  padding:14px 16px;box-shadow:inset 0 4px 10px rgba(0,0,0,.75),0 2px 0 rgba(255,255,255,.55)}
.sp-lcd-k{display:block;font-family:var(--sp-display),sans-serif;letter-spacing:.14em;font-size:11px;color:var(--sun)}
.sp-lcd-amt{display:flex;align-items:baseline;gap:8px;margin-top:6px}
.sp-lcd-amt b{font-family:var(--sp-display),sans-serif;font-weight:400;font-size:clamp(32px,3.2vw,44px);line-height:.9;
  color:var(--sun);font-variant-numeric:tabular-nums;text-shadow:0 0 14px rgba(255,198,11,.45);overflow-wrap:anywhere}
.sp-lcd-amt span{font-size:12px;font-weight:800;color:rgba(255,255,255,.5)}
.sp-modes{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.sp-modes button{appearance:none;border:2px solid var(--ink);border-radius:999px;background:var(--paper-3);
  min-height:44px;padding:9px 8px;font:inherit;font-weight:800;font-size:13px;color:var(--ink);cursor:pointer;
  transition:transform .18s var(--snap),box-shadow .18s,background .15s,color .15s}
.sp-modes button:hover{transform:translateY(-2px);box-shadow:var(--hard-sm)}
.sp-modes button.on{background:var(--red);color:#fff;transform:translateY(-2px);box-shadow:var(--hard-sm)}
.sp-modes button:active,.sp-modes button.on:active{transform:translateY(1px);box-shadow:none}
.sp-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.sp-keys button{appearance:none;display:grid;place-items:center;min-height:48px;border-radius:10px;
  background:linear-gradient(#FFFBEE,#FBF4E2 55%,#EFE3C6);border:2px solid var(--ink);
  box-shadow:0 4px 0 #C9B98F,0 4px 0 2px var(--ink),inset 0 2px 0 rgba(255,255,255,.8);
  font-family:var(--sp-display),sans-serif;font-weight:400;font-size:18px;color:var(--ink);cursor:pointer;
  transition:transform .12s var(--snap),box-shadow .12s,filter .15s;margin-bottom:6px}
.sp-keys button:hover{filter:brightness(1.05)}
.sp-keys button.kp,.sp-keys button:active{transform:translateY(4px);
  box-shadow:0 0 0 #C9B98F,0 0 0 2px var(--ink),inset 0 2px 4px rgba(0,0,0,.16)}
.sp-keys .sp-k-fn{background:linear-gradient(#F6C7BD,#E9A99C)}
.sp-keys .sp-k-zero{grid-column:span 2}
.sp-keys .sp-k-go{grid-column:span 2;background:linear-gradient(#E9566A,var(--red) 55%,var(--red-7));color:#fff;
  box-shadow:0 4px 0 #8E1626,0 4px 0 2px var(--ink),inset 0 2px 0 rgba(255,255,255,.3);
  text-transform:uppercase;letter-spacing:.04em;font-size:16px}

/* ── drivers teaser: a drawn week of earnings, no stock photography ── */
.sp-drive{background:var(--sky);border-block:2px solid var(--ink)}
.sp-drive-g{display:grid;gap:clamp(30px,5vw,72px);align-items:center}
@media(min-width:900px){.sp-drive-g{grid-template-columns:.95fr 1.05fr}}
.sp-drive-p{margin:0 0 18px;max-width:520px;font-size:clamp(15px,1.3vw,17.5px);line-height:1.6;color:var(--ink-6)}
.sp-drive-art{position:relative;min-height:340px}
.sp-dt-week{position:relative;z-index:1;width:min(400px,92%);background:var(--paper-50);
  border:2px solid var(--ink);border-radius:20px;padding:22px 24px;box-shadow:var(--hard-lg);
  transform:rotate(-2deg)}
.sp-dt-k{display:block;font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-5)}
.sp-dt-big{display:block;font-size:clamp(44px,4.6vw,62px);line-height:.9;margin:6px 0 14px}
.sp-dt-bars{display:flex;align-items:flex-end;gap:7px;height:86px}
.sp-dt-bars i{flex:1;background:var(--red);border:2px solid var(--ink);border-radius:6px 6px 0 0;
  height:var(--h,50%);transform:scaleY(.08);transform-origin:bottom;
  transition:transform .6s var(--spring) var(--bd,0ms)}
.sp-rv.in .sp-dt-bars i{transform:scaleY(1)}
.sp-dt-row{display:flex;margin-top:12px;padding-top:10px;border-top:2px dashed rgba(11,11,11,.25);
  font-size:12.5px;font-weight:700;color:var(--ink-6)}
.sp-dt-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;color:var(--ink)}
.sp-dt-offer{position:absolute;z-index:2;right:clamp(0px,4vw,30px);top:-16px;background:var(--sun);
  border:2px solid var(--ink);border-radius:16px;padding:12px 16px;box-shadow:var(--hard-sm);
  transform:rotate(4deg)}
.sp-dt-offer b{display:block;font-size:26px;line-height:.95;margin-top:3px}
.sp-dt-stamp{position:absolute;z-index:2;left:clamp(8px,3vw,34px);bottom:-14px;background:var(--red);
  color:#fff;border:2px solid var(--ink);border-radius:999px;padding:10px 18px;font-size:16px;
  letter-spacing:.03em;box-shadow:4px 4px 0 var(--ink);transform:rotate(-5deg)}
@media(prefers-reduced-motion:reduce){.sp-dt-bars i{transform:scaleY(1);transition:none}}
.sp-ticks{list-style:none;margin:0 0 clamp(26px,3vw,34px);padding:0;display:flex;flex-direction:column;gap:12px}
.sp-ticks li{position:relative;padding-left:32px;font-size:15.5px;font-weight:600;line-height:1.45;color:var(--ink-6)}
.sp-ticks li::before{content:"✓";position:absolute;left:0;top:0;width:22px;height:22px;border-radius:999px;
  border:2px solid var(--ink);background:var(--sun);color:var(--ink);display:grid;place-items:center;font-size:12px;font-weight:900}

/* ── FAQ ── */
.sp-faqwrap{max-width:1000px}
.sp-faq-head{display:flex;align-items:center;gap:18px;margin-bottom:clamp(22px,3vw,38px)}
.sp-faq-h{font-size:clamp(38px,6vw,72px);margin:0}
.sp-faq-arrow{width:clamp(44px,4vw,58px);height:clamp(44px,4vw,58px);border-radius:999px;border:2px solid var(--ink);
  background:var(--sun);display:grid;place-items:center;font-size:22px;font-weight:900;box-shadow:var(--hard-sm)}
.sp-faq{display:flex;flex-direction:column;gap:12px}
.sp-faq details{background:var(--paper-50);border:2px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:var(--hard-sm)}
.sp-faq details[open]{background:#fff}
.sp-faq summary{list-style:none;display:flex;align-items:center;gap:18px;cursor:pointer;
  padding:clamp(18px,2.4vw,28px) clamp(18px,2.6vw,32px);font-size:clamp(17px,1.9vw,26px)}
.sp-faq summary::-webkit-details-marker{display:none}
.sp-faq summary{transition:transform .1s ease}
.sp-faq summary:active{transform:translateY(1px)}
.sp-faq-ic{margin-left:auto;flex:0 0 auto;position:relative;width:clamp(34px,3.2vw,44px);height:clamp(34px,3.2vw,44px);
  border-radius:999px;border:2px solid var(--red);background:var(--red);transition:transform .28s var(--snap),background .2s}
.sp-faq-ic::before,.sp-faq-ic::after{content:"";position:absolute;top:50%;left:50%;background:#fff;border-radius:2px;transform:translate(-50%,-50%)}
.sp-faq-ic::before{width:42%;height:2.5px}
.sp-faq-ic::after{width:2.5px;height:42%}
.sp-faq details[open] .sp-faq-ic{transform:rotate(135deg);background:var(--sun);border-color:var(--ink)}
.sp-faq details[open] .sp-faq-ic::before,.sp-faq details[open] .sp-faq-ic::after{background:var(--ink)}
.sp-faq-a{padding:0 clamp(18px,2.6vw,32px) clamp(20px,2.8vw,30px);max-width:74ch;font-size:15.5px;line-height:1.62;color:var(--ink-6)}
/* answers written in the admin dashboard come through as rich text, so the
   tags it emits need styling — otherwise a CMS answer looks nothing like a
   hardcoded one */
.sp-faq-a > :first-child{margin-top:0}
.sp-faq-a > :last-child{margin-bottom:0}
.sp-faq-a p{margin:0 0 .7em}
.sp-faq-a ul{list-style:disc;margin:.5em 0 .7em;padding-left:1.35em}
.sp-faq-a ol{list-style:decimal;margin:.5em 0 .7em;padding-left:1.5em}
.sp-faq-a li{margin:.25em 0}
.sp-faq-a strong,.sp-faq-a b{font-weight:800;color:var(--ink)}
.sp-faq-a a{color:var(--red);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.sp-faq-a h1,.sp-faq-a h2,.sp-faq-a h3,.sp-faq-a h4{margin:.9em 0 .4em;font-size:1.05em;font-weight:800;color:var(--ink)}
.sp-faq-a blockquote{margin:.6em 0;padding-left:14px;border-left:3px solid var(--paper-3)}
.sp-faq-a code{font-size:.92em;background:var(--paper-3);padding:1px 5px;border-radius:5px}

/* ── final CTA ── */
.sp-final{background:var(--red);color:#fff;border-block:2px solid var(--ink)}
.sp-final-in{display:flex;flex-wrap:wrap;gap:34px;align-items:center;justify-content:space-between}
.sp-final-h{font-size:clamp(32px,5.4vw,72px);margin:0 0 16px}
.sp-final-p{margin:0 0 28px;font-size:clamp(16px,1.4vw,20px);color:rgba(255,255,255,.86)}
.sp-final-btns{display:flex;gap:12px;flex-wrap:wrap}
.sp-final .sp-btn{background:#fff;color:var(--ink)}
.sp-final .sp-btn:hover{color:var(--ink)}
.sp-qr{background:#fff;border:2px solid var(--ink);border-radius:18px;padding:14px;box-shadow:var(--hard)}
.sp-qr img{display:block}

/* ── footer ── */
.sp-foot{background:var(--ink);color:var(--paper)}
.sp-foot-in{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:clamp(20px,3vw,40px);padding-block:clamp(38px,5vw,64px)}
.sp-foot-logo{height:30px;width:auto;filter:brightness(0) invert(1)}
.sp-foot-lock{margin:14px 0 8px;font-family:var(--sp-display),sans-serif;font-size:clamp(20px,2vw,26px);color:var(--sun)}
.sp-foot-lead p:last-child{margin:0;font-size:15px;line-height:1.5;opacity:.72;max-width:30ch}
.sp-foot h3{margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.2em;opacity:.5}
.sp-foot nav{display:flex;flex-direction:column;gap:9px}
.sp-foot nav a{color:inherit;font-size:14.5px;font-weight:600;opacity:.82;text-decoration:none}
.sp-foot nav a:hover{opacity:1;color:var(--sun)}
.sp-foot nav a{display:inline-block;transition:transform .12s ease}
.sp-foot nav a:active{transform:translateX(3px)}
.sp-foot-base{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;
  padding-block:18px 28px;font-size:12.5px;font-weight:600;opacity:.6;border-top:1px solid rgba(255,255,255,.16)}
.sp-foot-flag{background:rgba(255,255,255,.1);border-radius:999px;padding:5px 12px}
/* stacked 22px links 9px apart are a 31px pitch — too tight to tap reliably
   on a phone, where a mis-tap loads the wrong page */
@media(max-width:820px){
  .sp-foot-in{grid-template-columns:1fr 1fr}
  .sp-foot nav{gap:0}
  .sp-foot nav a{display:flex;align-items:center;min-height:42px}
}
@media(max-width:480px){.sp-foot-in{grid-template-columns:1fr}}

/* ── scroll primitives ── */
.sp-rv{opacity:0;transform:translateY(26px);
  transition:opacity .6s ease var(--rv-delay,0ms),transform .7s var(--snap) var(--rv-delay,0ms)}
.sp-rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.sp-rv{opacity:1;transform:none;transition:none}}

/* ── letter-by-letter headline reveal; words stay whole so lines wrap ── */
.sp-split{display:inline;line-height:1.05}
.sp-split-w{display:inline-block;white-space:nowrap}
.sp-split-c{display:inline-block;transform:translateY(26px);opacity:.001;
  transition:transform .66s var(--spring) var(--c-delay,0ms),opacity .36s ease var(--c-delay,0ms)}
.sp-split.in .sp-split-c{transform:none;opacity:1}
@media(prefers-reduced-motion:reduce){
  .sp-split-c{transform:none;opacity:1;transition:none}
}

/* ── on-load entrance ladder: each piece springs in behind the last ── */
.sp-ap{animation:sp-ap .8s var(--spring) both;animation-delay:var(--ap-delay,0ms)}
@keyframes sp-ap{
  from{opacity:.001;transform:translateY(var(--ap-y,60px)) scale(var(--ap-s,1)) rotate(var(--ap-r,0deg))}
  to{opacity:1;transform:none}
}
@media(prefers-reduced-motion:reduce){.sp-ap{animation:none}}

/* ── scroll progress ── */
.sp-progress{position:fixed;top:0;left:0;right:0;height:7px;z-index:90;
  background:var(--paper-3);border-bottom:2px solid var(--ink);pointer-events:none}
.sp-progress i{display:block;height:100%;background:var(--red);transform-origin:0 50%;
  transform:scaleX(0);transition:transform .08s linear}

/* ── ticker: outlined wood-type, the neobrutalist staple ── */
.sp-mq{overflow:hidden;background:var(--ink);border-bottom:2px solid var(--ink);padding-block:clamp(8px,1.2vw,14px)}
.sp-mq-track{display:inline-flex;white-space:nowrap;animation:sp-mq 34s linear infinite;will-change:transform}
.sp-mq-track.rev{animation-direction:reverse}
.sp-mq:hover .sp-mq-track{animation-play-state:paused}
.sp-mq-track span{display:inline-flex;align-items:center;font-size:clamp(26px,4vw,54px);line-height:1;
  color:transparent;-webkit-text-stroke:2px var(--paper);padding-right:.35em}
.sp-mq-track span:nth-child(even){color:var(--sun);-webkit-text-stroke:0}
.sp-mq-dot{display:inline-block;width:.22em;height:.22em;border-radius:999px;background:var(--red);margin-left:.35em}
@keyframes sp-mq{to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.sp-mq-track{animation:none}}

/* ── AI assistant ── */
.sp-ai{background:var(--ink);color:var(--paper);border-block:2px solid var(--ink);position:relative}
.sp-ai.is-pinned{min-height:300vh;padding-block:0}
.sp-ai-stage{display:flex;align-items:center}
.sp-ai-stage > .sp-wrap{width:100%}
.sp-ai.is-pinned .sp-ai-stage{position:sticky;top:0;height:100vh}
.sp-ai:not(.is-pinned) .sp-ai-stage{padding-block:clamp(56px,7vw,104px)}
.sp-ai-g{display:grid;gap:clamp(30px,5vw,72px);align-items:center}
@media(min-width:900px){.sp-ai-g{grid-template-columns:1.05fr .95fr}}
.sp-kick-light{color:var(--sun)}
.sp-ai-h{font-size:clamp(30px,5vw,58px);margin:0 0 18px;color:#fff}
.sp-ai-hl{color:var(--sun)}
.sp-ai-lede{margin:0 0 clamp(22px,2.6vw,30px);font-size:clamp(15px,1.25vw,18px);line-height:1.6;
  color:rgba(255,255,255,.78);max-width:46ch}
.sp-ai-groups{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2vw,26px);
  margin:0 0 clamp(20px,2.4vw,28px)}
@media(max-width:620px){.sp-ai-groups{grid-template-columns:1fr}}
.sp-ai-group{border:2px solid rgba(255,255,255,.22);border-radius:16px;padding:15px 16px;background:rgba(255,255,255,.04)}
.sp-ai-gk{margin:0 0 10px;font-size:13px;letter-spacing:.1em;color:var(--sun)}
.sp-ai-group ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.sp-ai-group li{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;line-height:1.4;
  font-weight:600;color:rgba(255,255,255,.88)}
.sp-ai-group li span{flex:0 0 auto;margin-top:1px;width:19px;height:19px;border-radius:999px;background:var(--sun);
  color:var(--ink);border:2px solid var(--ink);display:grid;place-items:center;font-size:10px;font-weight:900}
.sp-ai-fine{margin:0;font-size:12.5px;line-height:1.55;color:rgba(255,255,255,.5);max-width:44ch}

.sp-ai-phone{position:relative;display:flex;justify-content:center}
.sp-ai-sticker{position:absolute;top:-18px;right:clamp(0px,3vw,22px);z-index:4;transform:rotate(-9deg);
  background:var(--sun);color:var(--ink);border:2px solid var(--ink);border-radius:999px;
  padding:10px 17px;font-size:14.5px;letter-spacing:.03em;box-shadow:4px 4px 0 var(--ink)}
.sp-ai-frame{position:relative;width:clamp(250px,26vw,310px);aspect-ratio:9/18.5;display:flex;flex-direction:column;
  border:3px solid var(--ink);border-radius:clamp(30px,3vw,42px);background:var(--paper-50);overflow:hidden;
  box-shadow:10px 12px 0 var(--sun)}
.sp-ai-notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:32%;height:18px;
  background:var(--ink);border-radius:999px;z-index:5}
.sp-ai-head{display:flex;align-items:center;gap:9px;padding:40px 16px 12px;font-size:13px;font-weight:800;
  color:var(--ink);border-bottom:2px solid var(--ink)}
.sp-eyes{width:26px;height:26px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);
  background:var(--sky);display:inline-flex;align-items:center;justify-content:center;gap:3px}
.sp-eyes i{width:8px;height:9px;border-radius:999px;background:#fff;border:1.5px solid var(--ink);
  display:grid;place-items:center}
.sp-eyes b{width:4px;height:4px;border-radius:999px;background:var(--ink);transition:transform .1s linear}
.sp-ai-thread{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;
  gap:9px;padding:14px 13px;overflow:hidden}
.sp-caret-ai{background:var(--ink);height:12px;vertical-align:-1px}
.sp-bub{max-width:88%;border:2px solid var(--ink);border-radius:14px;padding:9px 12px;font-size:12.5px;line-height:1.4;
  opacity:0;transform:translateY(10px) scale(.97);
  transition:opacity .32s ease,transform .4s var(--snap)}
.sp-bub.in{opacity:1;transform:none}
.sp-bub-you{align-self:flex-end;background:var(--red);color:#fff;border-bottom-right-radius:5px}
.sp-bub-ai{align-self:flex-start;background:#fff;color:var(--ink);border-bottom-left-radius:5px;box-shadow:var(--hard-sm)}
.sp-bub-tool{display:block;font-family:var(--sp-display),monospace;font-size:9.5px;letter-spacing:.06em;
  color:var(--red);background:var(--red-1);border:1px solid var(--ink);border-radius:5px;
  padding:2px 6px;margin-bottom:6px;width:fit-content}
.sp-bub-typing{display:flex;gap:4px;padding:12px}
.sp-bub-typing i{width:6px;height:6px;border-radius:999px;background:var(--ink-4);animation:sp-typ 1.1s infinite}
.sp-bub-typing i:nth-child(2){animation-delay:.18s}
.sp-bub-typing i:nth-child(3){animation-delay:.36s}
@keyframes sp-typ{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
@media(prefers-reduced-motion:reduce){.sp-bub-typing{display:none}.sp-bub{opacity:1;transform:none}}
.sp-ai-input{display:flex;align-items:center;margin:0 13px 14px;padding:10px 12px;background:#fff;
  border:2px solid var(--ink);border-radius:999px;font-size:12.5px;color:var(--ink-4);font-weight:600}
.sp-ai-send{margin-left:auto;width:24px;height:24px;border-radius:999px;background:var(--red);color:#fff;
  display:grid;place-items:center;font-size:12px;font-weight:900}

/* QR sticker rotates with scroll */
.sp-qr{transition:transform .12s linear}

/* ── docked CTA: rides up out of the page once the hero is behind you,
      and drops back down when the real CTA arrives ── */
.sp-dock{position:fixed;left:50%;bottom:calc(clamp(14px,3vh,26px) + var(--dock-lift,0px));z-index:70;
  display:inline-flex;align-items:center;gap:11px;padding:8px 10px;max-width:calc(100vw - 20px);
  border:2px solid var(--ink);border-radius:999px;background:var(--paper-50);
  box-shadow:5px 5px 0 var(--ink);
  transform:translate(-50%,130px);opacity:0;pointer-events:none;
  transition:transform .62s var(--spring),opacity .3s ease}
.sp-dock.up{transform:translate(-50%,0);opacity:1;pointer-events:auto}
.sp-dock-ai{display:flex;align-items:center;gap:10px;padding:5px 14px 5px 6px;border-radius:999px;
  color:var(--ink);text-decoration:none;transition:background .16s ease,transform .12s var(--snap)}
.sp-dock-ai:active{transform:scale(.95)}
.sp-dock-ai:hover{background:var(--red-1);color:var(--ink)}
.sp-dock-spark{width:31px;height:31px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);
  background:var(--sky);display:grid;place-items:center;font-size:14px}
.sp-dock-ai b{display:block;font-size:13px;line-height:1.15;white-space:nowrap}
.sp-dock-ai i{display:block;font-style:normal;font-size:11px;color:var(--ink-5);white-space:nowrap}
.sp-dock-rule{width:2px;height:30px;flex:0 0 auto;background:rgba(11,11,11,.15)}
.sp-dock-note{font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;
  color:var(--ink-5);white-space:nowrap}
.sp-dock-btn{padding:11px 18px;font-size:13px;box-shadow:-3px 3px 0 var(--ink);white-space:nowrap}
.sp-dock .sp-btn-ghost.sp-dock-btn{box-shadow:none}
@media(max-width:860px){
  .sp-dock-note,.sp-dock-rule{display:none}
  .sp-dock-ai i{display:none}
  .sp-dock-ai{padding:4px 10px 4px 4px}
}
@media(max-width:560px){
  .sp-dock{gap:7px;padding:6px}
  .sp-dock-ai b{display:none}
  .sp-dock-ai{padding:2px}
  .sp-dock-btn{padding:11px 14px;font-size:12.5px}
}
@media(prefers-reduced-motion:reduce){.sp-dock{transition:none}}

/* ── pointer: a drawn arrow with the tip on the hotspot ── */
.sp-cursor-on,.sp-cursor-on *{cursor:none !important}
.sp-cur{position:fixed;inset:0;z-index:200;pointer-events:none;opacity:0;transition:opacity .2s ease}
.sp-cursor-live .sp-cur{opacity:1}
.sp-cur-arrow{position:absolute;top:0;left:0;display:block;margin:-3px 0 0 -3px}
.sp-cur-arrow svg{display:block;transform-origin:4px 3px;
  transition:transform .18s var(--snap)}
.sp-cur-arrow svg path{transition:fill .18s ease}
.sp-cur-arrow.hot svg{transform:rotate(-10deg) scale(1.28)}
.sp-cur-arrow.hot svg path{fill:var(--sun)}
.sp-cur-arrow.down svg path{fill:var(--red)}
.sp-cur-arrow.down svg{transform:scale(.82)}
.sp-cur-arrow.hot.down svg{transform:rotate(-10deg) scale(1.05)}

/* ── the page rides over a footer pinned to the bottom of the viewport;
      RevealFooter drops back to a normal in-flow footer when it can't ── */
.sp-stage{position:relative;z-index:1;background:#FEFEFE}
.sp-footlayer.pinned{position:fixed;left:0;right:0;bottom:0;z-index:0}

/* ── the chat bubble: same hard-shadow language, same press ── */
[data-chat] > button{
  border:2px solid #0B0B0B !important;background:#DB3344 !important;
  box-shadow:-4px 4px 0 #0B0B0B !important;
  animation:sp-chatin .6s cubic-bezier(.2,1.1,.3,1) backwards .9s;
  transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s !important}
[data-chat] > button:hover{transform:translate(-2px,2px);box-shadow:-2px 2px 0 #0B0B0B !important}
[data-chat] > button:active{transform:translate(-4px,4px) scale(.97);box-shadow:0 0 0 #0B0B0B !important}
@keyframes sp-chatin{from{opacity:0;transform:translateY(30px) scale(.5)}to{opacity:1;transform:none}}


/* the OPEN chat window, same treatment — scoped by the widget's fixed shell,
   colors literal because the widget sits outside .sp */
[data-chat] > div[class*="rounded"]{
  border:2px solid #0B0B0B !important;border-radius:18px !important;
  box-shadow:-7px 7px 0 #0B0B0B !important;background:#FAF7EF !important;
  animation:sp-chatopen .4s cubic-bezier(.2,1.1,.3,1) both}
@keyframes sp-chatopen{from{opacity:0;transform:translateY(22px) scale(.94)}to{opacity:1;transform:none}}
[data-chat] [class*="border-b"]{border-bottom:2px solid #0B0B0B !important}
[data-chat] [class*="border-t"]{border-top:2px solid #0B0B0B !important}
[data-chat] .bg-gray-50{background:#FFF3CF !important}
[data-chat] [class*="CardTitle"],
[data-chat] h3{font-weight:800 !important;letter-spacing:.02em}
/* controls inside: pill input, hard-shadow send, bordered select */
[data-chat] input{
  border:2px solid #0B0B0B !important;border-radius:999px !important;background:#fff !important;
  box-shadow:none !important;padding-left:14px !important}
[data-chat] input:focus-visible{outline:none !important;box-shadow:2px 2px 0 #0B0B0B !important}
[data-chat] button[class*="h-10"],
[data-chat] .flex.gap-2 > button{
  border:2px solid #0B0B0B !important;border-radius:999px !important;background:#DB3344 !important;
  box-shadow:-3px 3px 0 #0B0B0B !important;color:#fff !important;
  transition:transform .13s cubic-bezier(.34,1.56,.64,1),box-shadow .13s !important}
[data-chat] .flex.gap-2 > button:hover{transform:translate(-1px,1px);box-shadow:-2px 2px 0 #0B0B0B !important}
[data-chat] .flex.gap-2 > button:active{transform:translate(-3px,3px);box-shadow:0 0 0 #0B0B0B !important}
[data-chat] .flex.gap-2 > button:disabled{background:#C9C4B8 !important;box-shadow:-3px 3px 0 #0B0B0B !important;transform:none}
[data-chat] button[role="combobox"]{
  border:2px solid #0B0B0B !important;border-radius:999px !important;background:#fff !important;font-weight:700 !important}
/* message bubbles */
[data-chat] .bg-primary.text-primary-foreground,
[data-chat] [class*="bg-primary"][class*="rounded-lg"]{
  background:#DB3344 !important;border:2px solid #0B0B0B !important;border-radius:14px !important}
[data-chat] .bg-gray-100[class*="rounded-lg"]{
  background:#fff !important;border:2px solid #0B0B0B !important;border-radius:14px !important}
/* header icon buttons stay quiet but press */
[data-chat] button[class*="h-8"]{transition:transform .1s ease !important}
[data-chat] button[class*="h-8"]:active{transform:scale(.85)}

@media(prefers-reduced-motion:reduce){
  .sp-nav,.sp-nav-links a{animation:none}
  .sp-menu,.sp-menu-row,.sp-menu-ai,.sp-menu-scrim{animation:none}
  .sp-burger,.sp-burger-box i,.sp-menu-row,.sp-menu-row b,.sp-menu-ai{transition:none}
  [data-chat] > button{animation:none}
  [data-chat] > div[class*="rounded"]{animation:none}
}

/* text selection carries the brand instead of browser blue */
.sp ::selection{background:rgba(255,198,11,.55);color:var(--ink)}
.sp ::-moz-selection{background:rgba(255,198,11,.55);color:var(--ink)}

/* ════════════════ ride page ════════════════ */

/* hero: paper, type-forward, a road strip running off the bottom edge */
.sp-rhero{position:relative;text-align:center;padding:clamp(120px,17vh,190px) 0 clamp(64px,8vw,110px);
  margin-top:calc(-1 * clamp(52px,7vw,74px));background:var(--paper-50);
  border-bottom:2px solid var(--ink);overflow:hidden}
.sp-rhero-h{font-size:clamp(42px,8vw,104px);margin:clamp(16px,2.4vw,26px) 0 clamp(14px,2vw,20px)}
.sp-rhero-hl{color:var(--red)}
.sp-rhero-p{max-width:620px;margin:0 auto clamp(22px,3vw,30px);font-size:clamp(15.5px,1.4vw,18.5px);
  line-height:1.6;color:var(--ink-6)}
/* ride hero backdrop: beaded streets, river, flowing route */
.sp-rroute{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.sp-rr-grid{stroke:#0B0B0B;opacity:.12}
.sp-rr-water{stroke:var(--sky);opacity:.45}
.sp-rr-bridge{stroke:#0B0B0B;opacity:.3}
.sp-rr-path{stroke:#DB3344;opacity:.5;animation:sp-rr-flow 1.2s linear infinite}
@keyframes sp-rr-flow{to{stroke-dashoffset:-11.1}}
.sp-rr-ring{opacity:.4}
@media (prefers-reduced-motion:reduce){.sp-rr-path{animation:none}
}

/* the trip: pinned full-bleed canvas */
.sp-jn{position:relative;min-height:400vh;background:var(--paper-3)}
.sp-jn-stage{position:sticky;top:0;height:100vh;overflow:hidden}
.sp-jn-canvas{position:absolute;left:0;right:0;top:0;height:240vh;
  transition:transform 1.1s cubic-bezier(.25,.8,.3,1);will-change:transform}
.sp-jn-canvas .sp-map{width:100%;height:100%}
.sp-jn-grain{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 50% 46%,transparent 55%,rgba(11,11,11,.16) 100%)}
.sp-jn-head{position:absolute;top:clamp(86px,12vh,120px);left:0;right:0;text-align:center;pointer-events:none}
.sp-jn-head h2{font-size:clamp(26px,3.4vw,44px);margin:6px 0 0;
  display:inline-block;background:var(--paper-50);border:2px solid var(--ink);border-radius:14px;
  padding:10px 22px;box-shadow:var(--hard-sm)}
.sp-jn-head .sp-kick{display:inline-block;background:var(--ink);color:var(--sun);border-radius:999px;
  padding:6px 14px;transform:rotate(-2deg)}
.sp-jn-rail{position:absolute;left:clamp(16px,5vw,84px);top:50%;transform:translateY(-42%);
  width:min(370px,86vw)}
.sp-jn-card{background:var(--paper-50);border:2px solid var(--ink);border-radius:18px;
  padding:20px 22px 22px;box-shadow:var(--hard);position:absolute;left:0;right:0;top:0;
  opacity:0;transform:translateY(26px) rotate(-1deg);
  transition:opacity .38s ease,transform .5s var(--spring);pointer-events:none}
.sp-jn-card.is-on{opacity:1;transform:none;pointer-events:auto}
.sp-jn-flat .sp-jn-card{position:relative;opacity:1;transform:none;pointer-events:auto}
.sp-jn-n{display:inline-block;font-size:13px;background:var(--sun);border:2px solid var(--ink);
  border-radius:999px;padding:4px 11px;margin-bottom:10px}
.sp-jn-card h3{margin:0 0 8px;font-size:clamp(20px,1.9vw,26px);line-height:1}
.sp-jn-card p{margin:0 0 12px;font-size:14px;line-height:1.55;color:var(--ink-6)}
.sp-jn-dots{display:flex;justify-content:center;gap:8px;margin-top:14px;pointer-events:none}
.sp-jn-dots span{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
  border:2px solid var(--ink);border-radius:999px;padding:5px 12px;background:var(--paper-50);
  color:var(--ink-5);transition:background .25s ease,color .25s ease}
.sp-jn-dots span.on{background:var(--red);color:#fff}
.sp-jn-dots span.done{background:var(--ink);color:var(--paper)}

/* stage extras */
.sp-jn-field{display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--ink);
  border-radius:11px;padding:10px 12px;font-size:13.5px;font-weight:700;box-shadow:var(--hard-sm)}
.sp-jn-pin{width:9px;height:9px;border-radius:999px;background:var(--red);flex:0 0 auto}
.sp-jn-receipt{background:#fff;border:2px solid var(--ink);border-radius:12px;padding:10px 12px}
.sp-jn-row{display:flex;align-items:center;font-size:12.5px;font-weight:600;color:var(--ink-6);
  padding:3px 0;opacity:0;transform:translateY(6px);transition:opacity .3s ease,transform .34s var(--snap)}
.sp-jn-row.in{opacity:1;transform:none}
.sp-jn-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:14px;color:var(--ink)}
.sp-jn-tot{margin-top:5px;padding-top:7px;border-top:1.5px dashed rgba(11,11,11,.3);
  font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-5)}
.sp-jn-tot b{font-size:17px}
.sp-jn-driver{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--ink);
  border-radius:12px;padding:9px 11px}
.sp-jn-avatar{width:32px;height:32px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);background:var(--sky)}
.sp-jn-driver b{display:block;font-size:13px}
.sp-jn-driver i{display:block;font-style:normal;font-size:11px;color:var(--ink-5)}
.sp-jn-stamp{display:inline-block;background:var(--sun);border:2px solid var(--ink);border-radius:12px;
  padding:9px 15px;font-size:21px;transform:rotate(-3deg) scale(.6);opacity:0;
  transition:opacity .3s ease,transform .45s var(--spring)}
.sp-jn-stamp.in{opacity:1;transform:rotate(-3deg) scale(1)}
.sp-jn-stamp span{display:block;font-size:9px;letter-spacing:.14em;font-family:var(--font-inter,system-ui);
  font-weight:800;text-transform:uppercase;margin-top:2px}
@media(prefers-reduced-motion:reduce){
  .sp-jn-canvas,.sp-jn-card,.sp-jn-row,.sp-jn-stamp{transition:none}
}

/* flat fallback */
.sp-jn-flat{background:var(--paper-3);border-bottom:2px solid var(--ink)}
.sp-jn-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.sp-jn-grid .sp-jn-card{box-shadow:var(--hard-sm)}
.sp-jn-map{height:150px;border:2px solid var(--ink);border-radius:12px;overflow:hidden;margin-bottom:12px}
.sp-jn-map .sp-map{width:100%;height:100%}

/* anatomy of a fare */
.sp-anat{background:var(--paper-50);border-bottom:2px solid var(--ink)}
.sp-anat-g{display:flex;justify-content:center}
.sp-anat-paper{position:relative;width:min(680px,100%);background:#fff;border:2px solid var(--ink);
  border-radius:18px 18px 0 0;box-shadow:var(--hard-lg);padding:clamp(22px,3.4vw,40px) clamp(20px,3.4vw,44px) clamp(30px,4vw,48px)}
.sp-anat-head{font-size:clamp(19px,2.2vw,27px);margin:0 0 clamp(16px,2.4vw,26px);
  padding-bottom:14px;border-bottom:2px solid var(--ink)}
.sp-anat-line{display:block;margin-bottom:clamp(14px,2vw,20px)}
/* a receipt line is label + pill + leader + amount; on a narrow phone that is
   more than one line's worth, so let it wrap rather than push the page wide */
.sp-anat-row{display:flex;flex-wrap:wrap;align-items:baseline;gap:12px;row-gap:2px;
  font-size:clamp(13.5px,1.25vw,15.5px);font-weight:700}
.sp-anat-row>span{min-width:0}
.sp-anat-row i{flex:1;min-width:18px;border-bottom:2px dotted rgba(11,11,11,.35);transform:translateY(-4px)}
.sp-anat-row b{font-size:clamp(19px,2vw,26px);font-weight:400}
.sp-anat-row.is-red b{color:var(--red)}
.sp-anat-to{flex:0 0 auto;font-style:normal;font-size:10.5px;font-weight:800;letter-spacing:.07em;
  text-transform:uppercase;border:2px solid var(--ink);border-radius:999px;padding:3px 9px;
  white-space:nowrap}
.sp-anat-to.drv{background:var(--red);color:#fff}
.sp-anat-to.us{background:var(--sun);color:var(--ink)}
.sp-anat-to.thru{background:var(--paper-50);color:var(--ink-6)}
.sp-anat-row.is-dim .sp-anat-to{opacity:.55}
.sp-anat-keep{display:flex;align-items:center;gap:14px;margin-top:6px;background:var(--sun);
  border:2px solid var(--ink);border-radius:14px;padding:12px 18px;box-shadow:var(--hard-sm);
  transform:rotate(-1deg)}
.sp-anat-keep span{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.sp-anat-keep b{margin-left:auto;font-size:clamp(24px,2.6vw,34px);line-height:.9}
.sp-anat-row.is-dim{color:var(--ink-4)}
.sp-anat-row.is-dim b{color:var(--ink-4);font-size:clamp(16px,1.6vw,20px)}
.sp-anat-vow{max-width:680px;margin:clamp(22px,3vw,32px) auto 0;text-align:center;
  font-size:clamp(14px,1.3vw,16.5px);line-height:1.7;color:var(--ink-6)}
.sp-anat-vow .sp-editorial{color:var(--ink)}
.sp-anat-total{padding-top:12px;border-top:2px solid var(--ink)}
.sp-anat-total b{font-size:clamp(24px,2.6vw,34px)}
.sp-anat-note{margin:5px 0 0;font-size:clamp(14px,1.3vw,17px);color:var(--ink-5)}
.sp-anat-tear{position:absolute;left:-2px;right:-2px;bottom:-12px;height:12px;
  background:linear-gradient(-45deg,transparent 8px,#fff 0) 0 0/16px 100% repeat-x,
             linear-gradient(45deg,transparent 8px,#fff 0) 8px 0/16px 100% repeat-x}

/* safety */
.sp-safe{background:var(--ink);color:var(--paper);border-bottom:2px solid var(--ink)}
.sp-safe-h{color:var(--paper-50)}
.sp-safe-g{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.sp-safe-card{background:#161616;border:2px solid #2e2e2e;border-radius:16px;padding:20px;
  box-shadow:4px 4px 0 #000}
.sp-safe-n{display:inline-block;font-size:12px;color:var(--sun);border:2px solid var(--sun);
  border-radius:999px;padding:3px 10px;margin-bottom:12px}
.sp-safe-card h3{margin:0 0 8px;font-size:20px;color:var(--paper-50)}
.sp-safe-card p{margin:0;font-size:13.5px;line-height:1.6;color:#B9B4AA}

/* ════════════════ drive page ════════════════ */

/* hero: the sun room */
.sp-dhero{position:relative;border-bottom:2px solid var(--ink);
  background:radial-gradient(rgba(11,11,11,.13) 1.7px,transparent 2.1px) 0 0/17px 17px,var(--sun);
  margin-top:calc(-1 * clamp(52px,7vw,74px));padding:clamp(118px,16vh,180px) 0 0;overflow:hidden}
.sp-dhero-in{display:grid;gap:clamp(20px,3vw,48px);align-items:end}
@media(min-width:980px){.sp-dhero-in{grid-template-columns:1.05fr .95fr}}
.sp-dhero-h{font-size:clamp(44px,7.2vw,98px);margin:clamp(16px,2.4vw,26px) 0 clamp(14px,2vw,20px)}
.sp-dhero-hl{color:#fff;-webkit-text-stroke:2px var(--ink);text-shadow:4px 4px 0 var(--ink)}
.sp-dhero-p{max-width:520px;margin:0 0 clamp(20px,2.6vw,28px);font-size:clamp(15.5px,1.4vw,18px);
  line-height:1.6;color:rgba(11,11,11,.75)}
.sp-dhero-btns{justify-content:flex-start;margin-bottom:clamp(30px,4vw,52px)}
.sp-dhero-fan .sp-fan{height:clamp(280px,30vw,420px);margin-top:0}

/* the payday ledger */
.sp-pd{position:relative;background:var(--paper-50);border-bottom:2px solid var(--ink)}
.sp-pd.is-pinned{min-height:340vh}
.sp-pd-stage{display:flex;align-items:center}
.sp-pd.is-pinned .sp-pd-stage{position:sticky;top:0;height:100vh}
.sp-pd:not(.is-pinned) .sp-pd-stage{padding-block:clamp(56px,7vw,104px)}
.sp-pd-in{display:grid;gap:clamp(28px,4vw,64px);align-items:center;width:100%}
/* grid items default to min-width:auto, so the ledger's own min-content (its
   route lines) was widening the whole track past the viewport on a 320px
   screen. Let them shrink; the ledger's rows already truncate. */
.sp-pd-in>*{min-width:0}
@media(min-width:900px){.sp-pd-in{grid-template-columns:.9fr 1.1fr}}
.sp-pd-lede{max-width:420px;margin:0 0 22px;font-size:clamp(15px,1.3vw,17.5px);line-height:1.6;color:var(--ink-6)}
.sp-pd-keep{display:inline-block;background:var(--sun);border:2px solid var(--ink);border-radius:16px;
  padding:14px 20px;box-shadow:var(--hard-sm);transform:rotate(-3deg) scale(.6);opacity:0;
  transition:opacity .3s ease,transform .5s var(--spring)}
.sp-pd-keep.in{opacity:1;transform:rotate(-3deg) scale(1)}
.sp-pd-keep b{display:block;font-size:clamp(26px,2.6vw,36px);line-height:.95}
.sp-pd-keep span{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.sp-pd-ledger{background:#fff;border:2px solid var(--ink);border-radius:20px;box-shadow:var(--hard-lg);
  padding:clamp(18px,2.4vw,28px) clamp(18px,2.6vw,30px);max-width:560px;justify-self:center;width:100%}
.sp-pd-head{display:flex;align-items:baseline;gap:12px;padding-bottom:12px;border-bottom:2px solid var(--ink)}
.sp-pd-head span{font-size:clamp(22px,2.2vw,30px)}
.sp-pd-head i{font-style:normal;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-4);margin-left:auto}
.sp-pd-rows{display:flex;flex-direction:column}
.sp-pd-row{display:flex;align-items:baseline;gap:12px;padding:9px 0;border-bottom:1.5px dashed rgba(11,11,11,.18);
  opacity:0;transform:translateX(26px);transition:opacity .3s ease,transform .42s var(--spring)}
.sp-pd-row.in{opacity:1;transform:none}
.sp-pd-t{font-size:11px;font-weight:800;letter-spacing:.06em;color:var(--ink-4);flex:0 0 44px}
.sp-pd-r{font-size:13.5px;font-weight:600;color:var(--ink-6);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-pd-row b{font-size:17px}
.sp-pd-cut{display:flex;align-items:baseline;gap:10px;padding:12px 0 4px;font-size:12px;font-weight:800;
  letter-spacing:.1em;text-transform:uppercase;color:var(--ink-5)}
.sp-pd-cut i{flex:1;border-bottom:2px dotted rgba(11,11,11,.3)}
.sp-pd-cut b{font-size:17px;color:var(--red);animation:sp-restamp .45s var(--spring)}
@keyframes sp-restamp{from{transform:scale(1.45) rotate(-4deg)}to{transform:none}}
.sp-pd-total{display:flex;align-items:baseline;gap:10px;margin-top:8px;padding-top:12px;border-top:2px solid var(--ink)}
.sp-pd-total span{font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.sp-pd-total b{margin-left:auto;font-size:clamp(28px,3vw,40px);line-height:.9}
@media(prefers-reduced-motion:reduce){
  .sp-pd-row,.sp-pd-keep{transition:none}
  .sp-pd-cut b{animation:none}
}

/* comparison receipts */
.sp-cmp{background:var(--paper-3);border-bottom:2px solid var(--ink)}
.sp-cmp-g{display:grid;gap:clamp(16px,2.6vw,28px);grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  max-width:900px}
.sp-cmp-card{position:relative;background:#fff;border:2px solid var(--ink);border-radius:18px;
  padding:clamp(18px,2.4vw,28px);box-shadow:var(--hard)}
.sp-cmp-them{transform:rotate(-1.2deg);opacity:.92}
.sp-cmp-us{transform:rotate(1deg);background:var(--paper-50)}
.sp-cmp-card h3{margin:0 0 14px;font-size:clamp(19px,1.9vw,24px);padding-bottom:10px;border-bottom:2px solid var(--ink)}
.sp-cmp-row{display:flex;align-items:baseline;gap:10px;padding:7px 0;font-size:14px;font-weight:600;color:var(--ink-6)}
.sp-cmp-row b{margin-left:auto;font-size:18px;font-weight:400;color:var(--ink)}
.sp-cmp-them .sp-cmp-row:nth-child(3) b{color:var(--red)}
.sp-cmp-us .sp-cmp-row:last-child b{font-size:24px}
.sp-cmp-badge{position:absolute;top:-15px;right:16px;background:var(--sun);border:2px solid var(--ink);
  border-radius:999px;padding:7px 14px;font-size:14px;box-shadow:3px 3px 0 var(--ink);transform:rotate(5deg)}
.sp-cmp-fine{margin:18px 0 0;font-size:12.5px;color:var(--ink-5);max-width:640px}

/* requirements */
.sp-req{background:var(--paper-50);border-bottom:2px solid var(--ink)}
.sp-req-g{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.sp-req-card{background:#fff;border:2px solid var(--ink);border-radius:16px;padding:20px;box-shadow:var(--hard-sm)}
.sp-req-check{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:999px;
  border:2px solid var(--ink);background:var(--sun);font-size:14px;font-weight:900;margin-bottom:12px}
.sp-req-card h3{margin:0 0 8px;font-size:19px}
.sp-req-card p{margin:0;font-size:13.5px;line-height:1.55;color:var(--ink-6)}

/* three steps */
.sp-steps{background:var(--ink);color:var(--paper);border-bottom:2px solid var(--ink)}
.sp-steps-h{color:var(--paper-50)}
.sp-steps-g{list-style:none;margin:0;padding:0;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));counter-reset:none}
.sp-steps-card{background:#161616;border:2px solid #2e2e2e;border-radius:16px;padding:22px;box-shadow:4px 4px 0 #000}
.sp-steps-n{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:999px;
  background:var(--red);color:#fff;border:2px solid #000;font-size:18px;margin-bottom:12px}
.sp-steps-card h3{margin:0 0 8px;font-size:20px;color:var(--paper-50)}
.sp-steps-card p{margin:0;font-size:13.5px;line-height:1.6;color:#B9B4AA}

/* ════════════════ about page ════════════════ */

.sp-ahero{position:relative;overflow:hidden;background:var(--paper-50);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));padding:clamp(122px,17vh,196px) 0 clamp(52px,7vw,92px);
  text-align:center}
.sp-ahero-h{font-size:clamp(44px,8.4vw,112px);margin:clamp(16px,2.4vw,26px) 0 clamp(16px,2.2vw,22px)}
.sp-ahero-hl{color:var(--red)}
.sp-ahero-p{max-width:640px;margin:0 auto;font-size:clamp(16px,1.5vw,20px);line-height:1.6;color:var(--ink-6)}
/* the same dotted Canada as the home hero, dialled back for cream */
.sp-ahero .sp-canmap{left:50%;top:-6%;width:min(90%,1060px);opacity:.66}
/* no pin here - the home hero carries the Saskatoon marker, and at this
   crop it would land on the hero's closing rule */
.sp-ahero .sp-cd-pin{display:none}
@media(max-width:720px){.sp-ahero .sp-canmap{left:-38%;top:-8%;width:1000px;transform:none;opacity:.6}}
.sp-ahero-rule{position:absolute;left:12%;right:12%;bottom:26px;height:3px;background:var(--ink);
  transform:rotate(-.5deg)}

/* manifesto: a marker pen sweeping through each belief */
.sp-man{background:var(--paper);border-bottom:2px solid var(--ink)}
.sp-man-in{max-width:940px}
.sp-man-line{position:relative;margin:0 0 clamp(22px,3.2vw,40px);font-size:clamp(20px,2.6vw,34px);
  line-height:1.42;color:var(--ink)}
.sp-man-line strong{font-weight:400;position:relative;z-index:1;
  -webkit-box-decoration-break:clone;box-decoration-break:clone;
  background-image:linear-gradient(var(--sun),var(--sun));background-repeat:no-repeat;
  background-position:0 88%;background-size:0 42%;
  transition:background-size .62s cubic-bezier(.4,0,.2,1)}
.sp-man-line.lit strong{background-size:100% 42%}
.sp-man-line span{color:var(--ink-6)}
@media(prefers-reduced-motion:reduce){
  .sp-man-line strong{background-size:100% 42%;transition:none}
}

/* the refusals rail */
.sp-ref{position:relative;background:var(--ink);color:var(--paper);border-bottom:2px solid var(--ink)}
.sp-ref.is-pinned{min-height:340vh}
.sp-ref-stage{display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,3vw,36px)}
.sp-ref.is-pinned .sp-ref-stage{position:sticky;top:0;height:100vh;overflow:hidden}
.sp-ref:not(.is-pinned) .sp-ref-stage{padding-block:clamp(56px,7vw,104px)}
.sp-ref-h{color:var(--paper-50);margin-bottom:0}
.sp-ref-track{display:flex;gap:clamp(14px,2vw,24px);padding-inline:clamp(18px,4vw,44px);
  will-change:transform;transition:transform .18s linear}
.sp-ref:not(.is-pinned) .sp-ref-track{flex-direction:column;transform:none !important;transition:none}
.sp-ref-card{position:relative;flex:0 0 min(420px,84vw);background:#161616;border:2px solid #2f2f2f;
  border-radius:20px;padding:clamp(20px,2.4vw,30px);box-shadow:6px 6px 0 #000}
.sp-ref-n{display:inline-block;font-size:13px;color:var(--sun);border:2px solid var(--sun);
  border-radius:999px;padding:4px 11px;margin-bottom:14px}
.sp-ref-card h3{margin:0 0 12px;font-size:clamp(24px,2.4vw,34px);color:var(--paper-50)}
.sp-ref-card p{margin:0;font-size:14.5px;line-height:1.65;color:#B9B4AA}
.sp-ref-no{position:absolute;top:-14px;right:18px;background:var(--red);color:#fff;
  border:2px solid #000;border-radius:999px;padding:7px 15px;font-size:15px;transform:rotate(6deg)}
.sp-ref-end{flex:0 0 min(340px,80vw);display:flex;flex-direction:column;justify-content:center;
  padding-inline:clamp(10px,2vw,24px)}
.sp-ref-end b{font-size:clamp(26px,2.8vw,40px);color:var(--sun);line-height:1}
.sp-ref-end span{margin-top:8px;font-size:14px;color:#B9B4AA}

/* dollar split */
.sp-dsplit{background:var(--sky);border-bottom:2px solid var(--ink)}
.sp-split-bar{position:relative;height:clamp(64px,7vw,92px);background:#fff;border:2px solid var(--ink);
  border-radius:16px;box-shadow:var(--hard);overflow:hidden;margin:clamp(8px,1.4vw,16px) 0 clamp(18px,2.4vw,26px)}
.sp-split-fill{position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:0 50%;
  transition:transform 1.15s var(--spring)}
.sp-split-bar.in .sp-split-fill{transform:scaleX(1)}
.sp-split-bar b{position:absolute;left:clamp(16px,2vw,26px);top:50%;transform:translateY(-50%);z-index:1;
  color:#fff;font-size:clamp(26px,3vw,40px)}
.sp-split-legend{display:flex;flex-wrap:wrap;gap:clamp(12px,2vw,22px);margin:0 0 clamp(20px,2.6vw,28px)}
.sp-split-item{background:var(--paper-50);border:2px solid var(--ink);border-radius:14px;
  padding:12px 18px;box-shadow:var(--hard-sm);min-width:180px}
.sp-split-item dt{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-5)}
.sp-split-item dd{margin:4px 0 0;font-size:clamp(28px,3vw,40px);line-height:.92}
.sp-split-item.drv dd{color:var(--red)}
.sp-split-note{max-width:640px;margin:0;font-size:clamp(14.5px,1.3vw,17px);line-height:1.65;color:var(--ink-6)}
.sp-split-note strong{color:var(--ink)}
@media(prefers-reduced-motion:reduce){.sp-split-fill{transition:none}}

/* home ground */
.sp-home{background:var(--paper-50)}
.sp-home-g{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.sp-home-card{background:#fff;border:2px solid var(--ink);border-radius:16px;padding:22px;box-shadow:var(--hard-sm)}
.sp-home-card h3{margin:0 0 10px;font-size:21px}
.sp-home-card p{margin:0;font-size:14px;line-height:1.6;color:var(--ink-6)}

/* ════════════════ legal pages ════════════════ */

.sp-legal-hero{position:relative;background:var(--paper-3);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));padding:clamp(118px,16vh,170px) 0 clamp(36px,5vw,56px)}
.sp-legal-h{font-size:clamp(34px,5.6vw,72px);margin:clamp(14px,2vw,22px) 0 10px;text-wrap:balance}
.sp-legal-updated{margin:0 0 18px;font-size:14px;font-weight:600;color:var(--ink-5)}
.sp-legal-draft{display:inline-block;background:var(--red);color:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:8px 16px;font-size:14px;letter-spacing:.04em;
  box-shadow:3px 3px 0 var(--ink);transform:rotate(-2deg)}
.sp-legal-g{display:grid;gap:clamp(24px,4vw,64px);padding-block:clamp(36px,5vw,64px);align-items:start}
@media(min-width:980px){.sp-legal-g{grid-template-columns:250px minmax(0,1fr)}}
.sp-legal-rail{position:sticky;top:clamp(86px,12vh,110px);display:none;flex-direction:column;gap:2px;
  border-left:3px solid var(--ink);padding-left:0;max-height:calc(100vh - 140px);overflow-y:auto}
@media(min-width:980px){.sp-legal-rail{display:flex}}
.sp-legal-rail-k{font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink-4);padding:0 0 8px 14px}
.sp-legal-rail a{font-size:13px;font-weight:600;color:var(--ink-6);text-decoration:none;
  padding:5px 10px 5px 14px;border-left:3px solid transparent;margin-left:-3px;
  text-transform:capitalize;transition:color .15s ease,border-color .15s ease,background .15s ease}
.sp-legal-rail a:hover{color:var(--ink)}
.sp-legal-rail a.is-on{color:var(--ink);border-left-color:var(--red);background:var(--red-1)}
.sp-legal-body{max-width:70ch}
.sp-legal-lede{font-size:clamp(15.5px,1.35vw,18px);line-height:1.75;color:var(--ink)}
.sp-legal-body section{margin-top:clamp(26px,3.4vw,40px)}
.sp-legal-body h2{font-size:clamp(20px,2.1vw,27px);margin:0 0 12px;text-transform:capitalize;
  scroll-margin-top:clamp(96px,13vh,124px);padding-bottom:8px;border-bottom:2px solid var(--ink)}
.sp-legal-body p{margin:0 0 14px;font-size:15px;line-height:1.75;color:var(--ink-6)}
.sp-legal-next{display:flex;gap:12px;flex-wrap:wrap;margin-top:clamp(30px,4vw,44px);
  padding-top:22px;border-top:2px dashed rgba(11,11,11,.3)}

/* ════════════════ help page ════════════════ */

.sp-help-hero{position:relative;overflow:hidden;border-bottom:2px solid var(--ink);
  background:radial-gradient(rgba(11,11,11,.13) 1.7px,transparent 2.1px) 0 0/17px 17px,var(--sky);
  margin-top:calc(-1 * clamp(52px,7vw,74px));padding:clamp(118px,16vh,170px) 0 clamp(40px,5vw,60px)}
.sp-help-h{font-size:clamp(40px,6.4vw,84px);margin:clamp(14px,2vw,22px) 0 10px}
/* one quiet question mark in the hero's open right-hand space */
.sp-help-mark{position:absolute;right:2%;bottom:-16%;line-height:.72;
  font-size:clamp(300px,34vw,470px);color:var(--ink);opacity:.055;pointer-events:none;user-select:none}
@media(max-width:979px){.sp-help-mark{right:-19%;bottom:-30%;font-size:330px;opacity:.045}}
.sp-help-lede{margin:0;font-size:clamp(15.5px,1.4vw,18.5px);color:rgba(11,11,11,.72);font-weight:600}
.sp-help-g{display:grid;gap:clamp(24px,4vw,64px);padding-block:clamp(36px,5vw,64px);align-items:start}
@media(min-width:980px){.sp-help-g{grid-template-columns:250px minmax(0,1fr)}}
.sp-help-body{max-width:780px;display:flex;flex-direction:column;gap:clamp(34px,4.6vw,56px)}
.sp-help-body h2{font-size:clamp(23px,2.6vw,34px);margin:0 0 10px;
  scroll-margin-top:clamp(96px,13vh,124px)}
.sp-help-ai-card{display:flex;gap:16px;align-items:flex-start;background:var(--sun);
  border:2px solid var(--ink);border-radius:18px;padding:clamp(16px,2.2vw,24px);
  box-shadow:var(--hard)}
.sp-help-ai-spark{display:grid;place-items:center;width:42px;height:42px;flex:0 0 auto;
  border-radius:999px;border:2px solid var(--ink);background:var(--sky);font-size:19px}
.sp-help-ai-card b{display:block;font-size:17px;margin-bottom:6px}
.sp-help-ai-card p{margin:0;font-size:14.5px;line-height:1.6;color:rgba(11,11,11,.75)}
.sp-help-cat-p{margin:0 0 16px;font-size:14.5px;color:var(--ink-5)}
.sp-help-art{background:var(--paper-50);border:2px solid var(--ink);border-radius:16px;
  overflow:hidden;box-shadow:var(--hard-sm);margin-bottom:10px}
.sp-help-art[open]{background:#fff}
.sp-help-art summary{list-style:none;display:flex;align-items:center;gap:16px;cursor:pointer;
  padding:15px 18px;transition:transform .1s ease}
.sp-help-art summary::-webkit-details-marker{display:none}
.sp-help-art summary:active{transform:translateY(1px)}
.sp-help-art summary .sp-display{font-size:clamp(15px,1.5vw,19px)}
.sp-help-art summary .sp-faq-ic{margin-left:auto}
.sp-help-art[open] .sp-faq-ic{transform:rotate(135deg);background:var(--sun)}
.sp-help-art-body{padding:0 18px 18px;font-size:14.5px;line-height:1.7;color:var(--ink-6)}
.sp-help-art-body h2,.sp-help-art-body h3{font-family:var(--sp-display),sans-serif;font-weight:400;
  text-transform:uppercase;letter-spacing:.01em;color:var(--ink);margin:16px 0 6px;font-size:16px}
.sp-help-art-body h2{font-size:18px}
.sp-help-art-body ol,.sp-help-art-body ul{padding-left:20px;margin:8px 0}
.sp-help-art-body li{margin-bottom:5px}
.sp-help-links{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:7px 18px;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.sp-help-links a{display:inline-block;font-size:14px;font-weight:600;color:var(--ink-6);
  text-decoration:none;padding:3px 0;
  background:linear-gradient(var(--red),var(--red)) no-repeat left 100%/0 2px;
  transition:color .15s ease,background-size .25s var(--snap)}
.sp-help-links a:hover{color:var(--ink);background-size:100% 2px}
.sp-faq-perma{display:inline-flex;align-items:center;min-height:40px;
  margin:0 clamp(18px,2.6vw,32px) clamp(14px,2vw,20px);font-size:13px;font-weight:800;
  letter-spacing:.04em;text-transform:uppercase;color:var(--red);text-decoration:none;
  transition:transform .14s var(--snap)}
.sp-faq-perma:hover{transform:translateX(3px)}
.sp-faq-perma:active{transform:translateX(1px) scale(.98)}

/* ════════════ safety ════════════ */
.sp-sfhero{background:var(--sky);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(112px,15vh,170px) 0 clamp(44px,6vw,74px);text-align:center}
.sp-sfhero-h{font-size:clamp(42px,8vw,100px);margin:clamp(16px,2.4vw,26px) 0 clamp(14px,2vw,20px)}
.sp-sfhero-hl{color:var(--red)}
.sp-sfhero-p{max-width:600px;margin:0 auto;font-size:clamp(15.5px,1.4vw,18.5px);
  line-height:1.6;color:rgba(11,11,11,.72)}
.sp-sf-alt{background:var(--paper-50);border-block:2px solid var(--ink)}
.sp-sf-g{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(238px,1fr))}
.sp-sf-g>*{min-width:0}
.sp-sf-card{position:relative;background:#fff;border:2px solid var(--ink);border-radius:18px;
  padding:22px 20px 20px;box-shadow:var(--hard-sm)}
.sp-sf-n{display:block;margin-bottom:10px;font-size:13px;letter-spacing:.1em;color:var(--red)}
.sp-sf-card h3{margin:0 0 9px;font-size:clamp(17px,1.8vw,21px);line-height:1.05}
.sp-sf-card p{margin:0;font-size:14px;line-height:1.62;color:var(--ink-6)}
.sp-sf-more{margin:clamp(24px,3vw,34px) 0 0;font-size:15px;line-height:1.65;color:var(--ink-6)}
.sp-sf-more a{color:var(--red);font-weight:700;text-decoration:underline;text-underline-offset:2px}

.sp-sos{background:var(--ink);color:var(--paper);border-block:2px solid var(--ink)}
.sp-sos-h{color:var(--paper-50)}
.sp-sos-g{display:grid;gap:16px}
@media(min-width:820px){.sp-sos-g{grid-template-columns:1.15fr 1fr}}
.sp-sos-g>*{min-width:0}
.sp-sos-does,.sp-sos-not{border:2px solid #2e2e2e;border-radius:18px;padding:22px}
.sp-sos-does{background:#161616}
.sp-sos-not{background:var(--red-7);border-color:var(--red)}
.sp-sos-lbl{display:inline-block;margin-bottom:14px;font-family:var(--sp-display),sans-serif;
  text-transform:uppercase;letter-spacing:.14em;font-size:12px;
  border:2px solid currentColor;border-radius:999px;padding:4px 12px}
.sp-sos-does .sp-sos-lbl{color:var(--sun)}
.sp-sos-not .sp-sos-lbl{color:#fff}
.sp-sos-g ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}
.sp-sos-g li{position:relative;padding-left:24px;font-size:14.5px;line-height:1.55}
.sp-sos-does li{color:#CFCAC0}
.sp-sos-does li::before{content:"✓";position:absolute;left:0;color:var(--sun);font-weight:800}
.sp-sos-not li{color:#FFE7EA}
.sp-sos-not li::before{content:"×";position:absolute;left:0;color:#fff;font-weight:800;font-size:17px;line-height:1.3}
.sp-sos-not p{margin:16px 0 0;padding-top:14px;border-top:2px solid rgba(255,255,255,.28);
  font-size:14px;line-height:1.6;color:#FFE7EA}

/* ════════════ driver requirements ════════════ */
.sp-rqhero{background:var(--paper-50);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(112px,15vh,168px) 0 clamp(30px,4vw,46px)}
.sp-rqhero-here{color:rgba(11,11,11,.44)}
.sp-rqhero-h{font-size:clamp(36px,6vw,74px);margin:0 0 14px}
.sp-rqhero-p{margin:0;max-width:52ch;font-size:clamp(15px,1.35vw,17.5px);line-height:1.65;color:var(--ink-6)}
.sp-rq-alt{background:var(--paper-50);border-block:2px solid var(--ink)}
.sp-rq-lede{margin-bottom:clamp(22px,3vw,30px)}
.sp-rq-list{margin:0;max-width:760px;display:flex;flex-direction:column}
.sp-rq-list>div{padding:clamp(16px,2.2vw,22px) 0;border-bottom:2px dashed rgba(11,11,11,.18)}
.sp-rq-list>div:last-child{border-bottom:0}
.sp-rq-list dt{margin:0 0 8px;font-size:clamp(18px,2vw,25px);line-height:1.05}
.sp-rq-list dd{margin:0;font-size:14.5px;line-height:1.66;color:var(--ink-6);max-width:62ch}
.sp-rq-docs{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(258px,1fr))}
.sp-rq-docs>*{min-width:0}
.sp-rq-doc{display:flex;gap:13px;align-items:flex-start;background:#fff;
  border:2px solid var(--ink);border-radius:16px;padding:16px;box-shadow:var(--hard-sm)}
.sp-rq-doc-n{display:grid;place-items:center;width:28px;height:28px;flex:0 0 auto;
  border-radius:999px;background:var(--sun);border:2px solid var(--ink);font-size:14px}
.sp-rq-doc b{display:block;margin-bottom:4px;font-size:14.5px;color:var(--ink)}
.sp-rq-doc span{display:block;font-size:13px;line-height:1.55;color:var(--ink-5)}
.sp-req-more{margin:clamp(20px,2.6vw,28px) 0 0}
.sp-req-more a{font-size:14.5px;font-weight:800;color:var(--red);text-decoration:none;
  display:inline-block;transition:transform .14s var(--snap)}
.sp-req-more a:hover{transform:translateX(3px)}
.sp-req-more a:active{transform:translateX(1px) scale(.98)}
.sp-rq-more{margin:clamp(22px,3vw,32px) 0 0;font-size:15px;line-height:1.65;color:var(--ink-6);max-width:64ch}
.sp-rq-more a{color:var(--red);font-weight:700;text-decoration:underline;text-underline-offset:2px}

/* ════════════ account deletion ════════════ */
.sp-adhero{background:var(--paper-50);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(112px,15vh,168px) 0 clamp(30px,4vw,46px)}
.sp-adhero-h{font-size:clamp(34px,5.6vw,68px);margin:0 0 14px}
.sp-adhero-p{margin:0;max-width:58ch;font-size:clamp(15px,1.35vw,17.5px);line-height:1.65;color:var(--ink-6)}
.sp-ad{display:flex;flex-direction:column;gap:clamp(20px,3vw,32px);
  padding-block:clamp(30px,4.4vw,56px);max-width:840px}
.sp-ad h2{margin:0 0 12px;font-size:clamp(21px,2.4vw,30px);line-height:1.02}
.sp-ad-how,.sp-ad-block{background:#fff;border:2px solid var(--ink);border-radius:20px;
  padding:clamp(20px,2.8vw,30px);box-shadow:var(--hard-sm)}
.sp-ad p{margin:0 0 10px;font-size:15px;line-height:1.65;color:var(--ink-6)}
.sp-ad a{color:var(--red);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.sp-ad-steps{list-style:decimal;margin:0 0 4px;padding-left:1.35em;display:flex;flex-direction:column;gap:8px;
  font-size:15px;line-height:1.6;color:var(--ink-6)}
.sp-ad-steps b{color:var(--ink);font-weight:800}
.sp-ad-list{list-style:disc;margin:0 0 10px;padding-left:1.35em;font-size:15px;line-height:1.6;color:var(--ink-6)}
.sp-ad-list li{margin:5px 0}
.sp-ad-note{margin:12px 0 0;font-size:13.5px;line-height:1.6;color:var(--ink-5)}
.sp-ad-lede{margin:0 0 16px}
.sp-ad-g{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(215px,1fr))}
.sp-ad-g>*{min-width:0}
.sp-ad-card{background:var(--paper-50);border:2px solid var(--ink);border-radius:14px;padding:16px}
.sp-ad-tick{display:grid;place-items:center;width:26px;height:26px;margin-bottom:9px;
  border-radius:999px;background:var(--sky);border:2px solid var(--ink);font-size:13px;font-weight:800}
.sp-ad-card h3{margin:0 0 5px;font-size:15px;font-weight:800;color:var(--ink)}
.sp-ad-card p{margin:0;font-size:13px;line-height:1.55}
.sp-ad-keep{margin:0;display:flex;flex-direction:column;gap:2px}
.sp-ad-keep>div{padding:14px 0;border-bottom:2px dashed rgba(11,11,11,.16)}
.sp-ad-keep>div:last-child{border-bottom:0}
.sp-ad-keep dt{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:5px;
  font-size:15px;font-weight:800;color:var(--ink)}
.sp-ad-keep dt b{margin-left:auto;font-size:clamp(18px,2vw,24px);color:var(--red);line-height:1}
.sp-ad-keep dd{margin:0;font-size:13.5px;line-height:1.6;color:var(--ink-6)}
.sp-ad-foot{text-align:center}
.sp-ad-foot p{margin:0;font-size:14.5px;color:var(--ink-5)}

/* ════════════ live trip estimator ════════════ */
.sp-estsec{background:var(--paper-50);border-block:2px solid var(--ink)}
.sp-estsec-lede{margin-bottom:clamp(22px,3vw,32px)}
.sp-est{position:relative;max-width:620px;background:#fff;border:2px solid var(--ink);
  border-radius:22px;box-shadow:var(--hard);padding:clamp(18px,2.6vw,28px)}
.sp-est-fields{position:relative;display:grid;gap:10px}
.sp-est-field{display:block}
.sp-est-field span{display:block;margin-bottom:6px;font-size:11px;font-weight:800;
  letter-spacing:.12em;text-transform:uppercase;color:var(--ink-5)}
.sp-est-field input{width:100%;padding:13px 15px;font:inherit;font-size:15px;
  border:2px solid var(--ink);border-radius:12px;background:var(--paper-50);color:var(--ink);
  transition:box-shadow .14s,transform .14s}
.sp-est-field input::placeholder{color:var(--ink-4)}
.sp-est-field input:focus{outline:none;background:#fff;box-shadow:-3px 3px 0 var(--ink)}
.sp-est-swap{justify-self:start;display:grid;place-items:center;width:38px;height:38px;
  border:2px solid var(--ink);border-radius:12px;background:var(--sun);cursor:pointer;
  font-size:16px;line-height:1;box-shadow:-2px 2px 0 var(--ink);
  transition:transform .14s,box-shadow .14s}
.sp-est-swap:hover{transform:translate(-1px,1px);box-shadow:-1px 1px 0 var(--ink)}
.sp-est-swap:active{transform:translate(-2px,2px);box-shadow:none}
.sp-est-list{position:absolute;left:0;right:0;top:100%;z-index:5;list-style:none;margin:6px 0 0;
  padding:5px;max-height:250px;overflow-y:auto;background:#fff;border:2px solid var(--ink);
  border-radius:14px;box-shadow:var(--hard-sm)}
.sp-est-list button{display:block;width:100%;padding:10px 12px;border:0;border-radius:9px;
  background:none;font:inherit;font-size:13.5px;line-height:1.45;text-align:left;color:var(--ink-6);
  cursor:pointer;transition:background .12s}
.sp-est-list button:hover{background:var(--paper-50);color:var(--ink)}
.sp-est-list button:active{background:var(--sun)}
.sp-est-go{margin-top:16px;width:100%;justify-content:center}
.sp-est-go:disabled{background:var(--ink-4);cursor:progress}
.sp-est-err{margin:12px 0 0;font-size:13.5px;font-weight:700;color:var(--red-7)}
.sp-est-out{margin-top:18px;padding-top:16px;border-top:2px dashed rgba(11,11,11,.22)}
.sp-est-headline{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.sp-est-k{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-5)}
.sp-est-headline b{margin-left:auto;font-size:clamp(26px,3.4vw,40px);line-height:.95}
.sp-est-rows{margin:0;display:flex;flex-direction:column;gap:0}
.sp-est-rows>div{display:flex;align-items:baseline;gap:10px;padding:7px 0;
  border-bottom:1.5px dashed rgba(11,11,11,.14);font-size:13.5px}
.sp-est-rows dt{margin:0;color:var(--ink-5);font-weight:600}
.sp-est-rows dd{margin:0 0 0 auto;font-weight:800;color:var(--ink)}
.sp-est-fine{margin:14px 0 0;font-size:12.5px;line-height:1.6;color:var(--ink-5)}

/* ════════════ one help answer, /help/[slug] ════════════ */
.sp-ans-hero{background:var(--sky);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(112px,15vh,168px) 0 clamp(30px,4vw,48px)}
.sp-ans-crumb{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin-bottom:14px;
  font-size:12.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.sp-ans-crumb a{color:rgba(11,11,11,.66);text-decoration:none;display:inline-block;
  padding-bottom:2px;background:linear-gradient(var(--ink),var(--ink)) no-repeat left 100%/0 2px;
  transition:color .15s ease,background-size .3s var(--snap),transform .12s ease}
.sp-ans-crumb a:hover{color:var(--ink);background-size:100% 2px}
.sp-ans-crumb a:active{transform:translateY(1px) scale(.97)}
.sp-ans-crumb span{color:rgba(11,11,11,.35)}
.sp-ans-h{font-size:clamp(31px,5.2vw,64px);max-width:19ch;text-wrap:balance}
.sp-ans-wrap{display:grid;gap:clamp(22px,3.4vw,44px);align-items:start;
  padding-block:clamp(34px,5vw,64px)}
@media(min-width:980px){.sp-ans-wrap{grid-template-columns:minmax(0,1fr) 296px}}
.sp-ans-wrap>*{min-width:0}
.sp-ans-card{background:#fff;border:2px solid var(--ink);border-radius:22px;
  box-shadow:var(--hard);padding:clamp(22px,3.2vw,44px)}
.sp-ans-body{font-size:16px;line-height:1.72;color:var(--ink-6)}
.sp-ans-body>:first-child{margin-top:0}
.sp-ans-body>:last-child{margin-bottom:0}
.sp-ans-body h2,.sp-ans-body h3,.sp-ans-body h4{font-family:var(--sp-display),sans-serif;
  font-weight:400;text-transform:uppercase;letter-spacing:.005em;line-height:1.02;
  color:var(--ink);margin:1.5em 0 .5em}
.sp-ans-body h2{font-size:clamp(21px,2.3vw,29px)}
.sp-ans-body h3{font-size:clamp(17px,1.8vw,22px)}
.sp-ans-body h4{font-size:16px}
.sp-ans-body p{margin:0 0 1em}
.sp-ans-body ul{list-style:disc;margin:.7em 0 1.1em;padding-left:1.4em}
.sp-ans-body ol{list-style:decimal;margin:.7em 0 1.1em;padding-left:1.55em}
.sp-ans-body li{margin:.35em 0}
.sp-ans-body strong,.sp-ans-body b{font-weight:800;color:var(--ink)}
.sp-ans-body a{color:var(--red);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.sp-ans-body blockquote{margin:1.1em 0;padding:2px 0 2px 16px;border-left:3px solid var(--paper-3);
  font-family:var(--sp-serif),Georgia,serif;font-style:italic}
.sp-ans-body code{font-size:.92em;background:var(--paper-3);padding:1px 6px;border-radius:6px}
.sp-ans-body img{border:2px solid var(--ink);border-radius:14px;margin:.6em 0}
.sp-ans-body hr{border:0;border-top:2px dashed rgba(11,11,11,.2);margin:1.6em 0}

.sp-ans-todo span.sp-display{display:block;font-size:clamp(21px,2.4vw,30px);margin-bottom:12px}
.sp-ans-todo p{margin:0 0 20px;font-size:15.5px;line-height:1.65;color:var(--ink-6);max-width:52ch}
.sp-ans-todo-btns{display:flex;flex-wrap:wrap;gap:10px}

.sp-ans-side{display:flex;flex-direction:column;gap:16px;position:sticky;top:clamp(88px,11vh,116px)}
@media(max-width:979px){.sp-ans-side{position:static}}
.sp-ans-ai{background:var(--sun);border:2px solid var(--ink);border-radius:18px;
  box-shadow:var(--hard-sm);padding:18px}
.sp-ans-spark{display:grid;place-items:center;width:36px;height:36px;margin-bottom:10px;
  border-radius:999px;border:2px solid var(--ink);background:var(--sky);font-size:16px}
.sp-ans-ai b{display:block;font-size:17px;margin-bottom:6px}
.sp-ans-ai p{margin:0 0 14px;font-size:13.5px;line-height:1.6;color:rgba(11,11,11,.74)}
.sp-ans-ai-btn{padding:11px 18px;font-size:14px;box-shadow:-3px 3px 0 var(--ink)}
.sp-ans-rel{background:var(--paper-50);border:2px solid var(--ink);border-radius:18px;padding:18px}
.sp-ans-rel h2{margin:0 0 12px;font-size:15px;letter-spacing:.05em}
.sp-ans-rel ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.sp-ans-rel a{display:flex;align-items:center;min-height:40px;font-size:14px;font-weight:600;
  line-height:1.4;color:var(--ink-6);text-decoration:none;
  transition:color .15s ease,transform .12s ease}
.sp-ans-rel a:hover{color:var(--red)}
.sp-ans-rel a:active{transform:translateX(3px)}
.sp-ans-mail{margin:0;font-size:13px;color:var(--ink-5);text-align:center}
.sp-ans-mail a{color:var(--red);font-weight:700}

.sp-help-contact-g{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));margin-bottom:18px}
.sp-help-contact-card{display:block;background:#fff;border:2px solid var(--ink);border-radius:16px;
  padding:18px;box-shadow:var(--hard-sm);color:var(--ink);text-decoration:none;
  transition:transform .15s var(--snap),box-shadow .15s}
a.sp-help-contact-card:hover{transform:translate(-2px,2px);box-shadow:1px 1px 0 var(--ink)}
.sp-help-contact-card .sp-display{display:block;font-size:18px;margin-bottom:6px}
.sp-help-contact-card p{margin:0;font-size:13.5px;line-height:1.55;color:var(--ink-6)}
.sp-help-legal-links{margin:0;font-size:14px;color:var(--ink-5)}
.sp-help-legal-links a{color:var(--ink);font-weight:700}

/* ── help: ask the AI assistant ── */
.sp-ask{margin-top:clamp(20px,2.6vw,30px);max-width:680px}
.sp-ask-who{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12px;
  font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(11,11,11,.65)}
.sp-ask-who button{appearance:none;font:inherit;text-transform:uppercase;cursor:pointer;
  border:2px solid var(--ink);border-radius:999px;padding:5px 13px;background:#fff;color:var(--ink);
  transition:transform .14s var(--snap),background .14s ease,box-shadow .14s}
.sp-ask-who button:hover{transform:translateY(-1px);box-shadow:2px 2px 0 var(--ink)}
.sp-ask-who button:active{transform:translateY(1px);box-shadow:none}
.sp-ask-who button.on{background:var(--ink);color:var(--sun)}
.sp-ask-row{display:flex;gap:10px}
.sp-ask-row input{flex:1;min-width:0;font:inherit;font-weight:600;font-size:15px;
  border:2px solid var(--ink);border-radius:999px;padding:13px 20px;background:#fff;color:var(--ink);
  box-shadow:var(--hard-sm)}
.sp-ask-row input::placeholder{color:var(--ink-4)}
.sp-ask-row input:focus-visible{outline:none;box-shadow:var(--hard)}
.sp-ask-row .sp-btn:disabled{background:var(--ink-4);cursor:not-allowed;transform:none;
  box-shadow:-4px 4px 0 var(--ink)}
.sp-ask-out{margin-top:14px;background:#fff;border:2px solid var(--ink);border-radius:16px;
  padding:16px 18px;box-shadow:var(--hard-sm)}
.sp-ask-out p{margin:0;font-size:15px;line-height:1.65;color:var(--ink)}
.sp-ask-src{margin-top:10px !important;font-size:11.5px !important;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;color:var(--ink-4) !important}
.sp-ask-err{background:var(--red-1)}

/* ── the Spinr Pass: subscription vs commission ── */
.sp-pass{background:var(--paper-3);border-bottom:2px solid var(--ink)}
.sp-pass-lede{max-width:640px;margin:0 0 clamp(22px,3vw,30px);font-size:clamp(15px,1.35vw,17.5px);
  line-height:1.65;color:var(--ink-6)}
.sp-pass-price{display:inline-flex;flex-direction:column;background:var(--sun);border:2px solid var(--ink);
  border-radius:18px;padding:clamp(16px,2vw,22px) clamp(20px,2.6vw,30px);box-shadow:var(--hard);
  transform:rotate(-1deg);margin-bottom:clamp(30px,4vw,46px)}
.sp-pass-k{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(11,11,11,.6)}
.sp-pass-offer{display:inline-block;background:var(--ink);color:var(--sun);border-radius:999px;
  padding:5px 13px;font-size:12.5px;letter-spacing:.06em;align-self:flex-start}
.sp-pass-free{font-size:clamp(34px,4.4vw,56px);line-height:1;margin:10px 0 6px}
.sp-pass-tiers{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  max-width:620px;margin-bottom:clamp(30px,4vw,46px)}
.sp-pass-blurb{display:block;margin-top:8px;font-size:12.5px;line-height:1.5;color:var(--ink-5)}
.sp-pass-limit{display:block;margin-top:9px;padding:8px 10px;border:2px solid var(--ink);
  border-radius:9px;background:var(--red-1);font-size:12px;font-weight:700;line-height:1.45;color:var(--red-7)}
.sp-pass-name{display:block;font-size:15px;letter-spacing:.08em;color:var(--ink-5);margin-bottom:6px}
.sp-pass-tier{position:relative;display:flex;flex-direction:column;align-items:flex-start;
  background:#fff;border:2px solid var(--ink);border-radius:16px;
  padding:clamp(18px,2.2vw,24px);box-shadow:var(--hard-sm)}
.sp-pass-tier.is-intro{background:var(--paper-50);box-shadow:var(--hard);padding-top:clamp(26px,3vw,32px)}
.sp-pass-badge{position:absolute;top:-13px;left:16px;background:var(--red);color:#fff;
  border:2px solid var(--ink);border-radius:999px;padding:5px 12px;font-size:12px;letter-spacing:.05em;
  box-shadow:2px 2px 0 var(--ink)}
.sp-pass-tier b{display:flex;align-items:baseline;gap:3px;font-size:clamp(30px,3.4vw,42px);line-height:1}
.sp-pass-tier b i{font-style:normal;font-size:15px;opacity:.7}
.sp-pass-rides{display:block;margin-top:9px;font-size:13.5px;font-weight:700;color:var(--ink-6)}
.sp-pass-after{display:block;align-self:stretch;margin-top:auto;padding-top:8px;
  border-top:1.5px dashed rgba(11,11,11,.25);
  font-size:11.5px;font-weight:700;color:var(--ink-5)}
.sp-pass-note{font-size:12.5px;font-weight:700;color:rgba(11,11,11,.7)}
.sp-pass-switch{margin:14px 0 0;font-size:13px;line-height:1.55;color:var(--ink-5)}
/* an unfilled fact, marked so it can never be mistaken for a real number */
.sp-todo{background:repeating-linear-gradient(45deg,#fff,#fff 5px,#FFE7EA 5px,#FFE7EA 10px);
  color:var(--red-7);border:2px dashed var(--red);border-radius:8px;padding:0 8px;font-family:inherit}
.sp-pass-h3{font-size:clamp(18px,2vw,26px);margin:0 0 clamp(14px,2vw,20px)}
.sp-pass-bars{display:flex;flex-direction:column;gap:clamp(16px,2.2vw,24px);max-width:720px}
.sp-pass-row-head{display:flex;align-items:baseline;gap:12px;font-size:13px;font-weight:700;color:var(--ink-6);margin-bottom:6px}
.sp-pass-row-head b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;
  font-size:17px;color:var(--ink)}
.sp-pass-track{position:relative;height:40px;background:#fff;border:2px solid var(--ink);border-radius:10px;
  overflow:hidden;display:flex;align-items:center}
.sp-pass-fill{position:absolute;left:0;top:0;bottom:0;width:var(--w,0%);background:var(--red);
  transform:scaleX(0);transform-origin:0 50%;transition:transform .75s var(--spring) var(--d,0ms)}
.sp-pass-bars.in .sp-pass-fill{transform:scaleX(1)}
.sp-pass-take{position:relative;z-index:1;margin-left:12px;font-family:var(--sp-display),sans-serif;
  font-size:18px;color:#fff;text-shadow:0 1px 0 rgba(0,0,0,.35)}
.sp-pass-vs{display:flex;align-items:center;gap:8px;margin-top:7px;font-size:12.5px;font-weight:700;color:var(--ink-6)}
.sp-pass-flat{width:16px;height:4px;border-radius:2px;background:var(--ink);flex:0 0 auto}
.sp-pass-fine{max-width:640px;margin:clamp(22px,3vw,30px) 0 0;font-size:12.5px;line-height:1.6;color:var(--ink-5)}
@media(prefers-reduced-motion:reduce){.sp-pass-fill{transition:none}}

/* ── /drive/apply — the driver application ────────────────────────────── */
.sp-ap-sec{padding-top:clamp(96px,12vw,150px)}
.sp-ap-wrap{max-width:760px}
.sp-ap-lede{margin:0 0 clamp(24px,3vw,34px);font-size:clamp(15px,1.2vw,17px);line-height:1.65;color:var(--ink-6)}
.sp-ap-lede a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}

/* progress rail — numbered, current step carries the red */
.sp-ap-steps{display:flex;flex-wrap:wrap;gap:8px 18px;list-style:none;margin:0 0 clamp(18px,2.4vw,26px);padding:0}
.sp-ap-steps li{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;color:var(--ink-4)}
.sp-ap-steps li.is-on{color:var(--ink)}
.sp-ap-steps li.is-done{color:var(--ink-6)}
.sp-ap-stepn{display:grid;place-items:center;width:26px;height:26px;flex:0 0 auto;border:2px solid var(--ink-4);
  border-radius:999px;font-size:13px;background:#fff;color:var(--ink-4)}
.sp-ap-steps li.is-on .sp-ap-stepn{border-color:var(--ink);background:var(--red);color:#fff;box-shadow:-2px 2px 0 var(--ink)}
.sp-ap-steps li.is-done .sp-ap-stepn{border-color:var(--ink);background:var(--paper-3);color:var(--ink)}

.sp-ap-card{background:#fff;border:2px solid var(--ink);border-radius:22px;box-shadow:var(--hard);
  padding:clamp(20px,3vw,32px)}
.sp-ap-grid{display:grid;gap:16px}
@media(min-width:620px){.sp-ap-grid{grid-template-columns:1fr 1fr}
  .sp-ap-grid>.sp-ap-consent,.sp-ap-grid>.sp-ap-note,.sp-ap-grid>button,.sp-ap-grid>.sp-ap-link,.sp-ap-grid>.sp-ap-err{grid-column:1/-1}}

.sp-ap-field{display:block}
.sp-ap-label{display:block;margin-bottom:6px;font-size:11px;font-weight:800;letter-spacing:.12em;
  text-transform:uppercase;color:var(--ink-5)}
.sp-ap-field input,.sp-ap-field select{width:100%;padding:13px 15px;font:inherit;font-size:15px;
  border:2px solid var(--ink);border-radius:12px;background:var(--paper-50);color:var(--ink);
  transition:box-shadow .14s,background .14s}
.sp-ap-field select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--ink) 50%),
  linear-gradient(135deg,var(--ink) 50%,transparent 50%);
  background-position:calc(100% - 19px) calc(50% + 1px),calc(100% - 14px) calc(50% + 1px);
  background-size:5px 5px,5px 5px;background-repeat:no-repeat;padding-right:38px}
.sp-ap-field input:focus,.sp-ap-field select:focus{outline:none;background:#fff;box-shadow:-3px 3px 0 var(--ink)}
.sp-ap-field input:disabled{background:var(--paper-3);color:var(--ink-5)}
.sp-ap-hint,.sp-ap-err{display:block;margin-top:6px;font-style:normal;font-size:12.5px;line-height:1.5}
.sp-ap-hint{color:var(--ink-5)}
.sp-ap-err{color:var(--red-7);font-weight:700}

.sp-ap-note{margin:0;font-size:13.5px;line-height:1.6;color:var(--ink-6);
  background:var(--paper-50);border:2px solid var(--paper-3);border-radius:12px;padding:13px 15px}

.sp-ap-consent{display:flex;gap:11px;align-items:flex-start;font-size:14px;line-height:1.55;color:var(--ink-6)}
.sp-ap-consent input{flex:0 0 auto;width:20px;height:20px;margin-top:1px;accent-color:var(--red)}
.sp-ap-consent a{color:var(--ink);text-decoration:underline;text-underline-offset:3px}

.sp-ap-link{justify-self:start;background:none;border:0;padding:0;font:inherit;font-size:13.5px;font-weight:700;
  color:var(--ink-6);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.sp-ap-link:disabled{color:var(--ink-4);cursor:default;text-decoration:none}

.sp-ap-notice{margin:16px 0 0;padding:12px 15px;border:2px solid var(--ink);border-radius:12px;
  font-size:14px;line-height:1.55;font-weight:600}
.sp-ap-notice.is-ok{background:var(--paper-50);color:var(--ink)}
.sp-ap-notice.is-bad{background:var(--red-1);color:var(--red-7);border-color:var(--red-7)}

.sp-ap-nav{display:flex;flex-wrap:wrap;gap:12px;margin-top:clamp(18px,2.4vw,26px)}
.sp-ap-card button:disabled{opacity:.55;cursor:default;transform:none;box-shadow:-4px 4px 0 var(--ink)}

.sp-ap-next{margin-top:clamp(22px,3vw,30px);background:#fff;border:2px solid var(--ink);border-radius:22px;
  box-shadow:var(--hard);padding:clamp(20px,3vw,30px)}
.sp-ap-next h2{margin:0 0 10px;font-size:clamp(20px,2.2vw,26px)}
.sp-ap-next p{margin:0;font-size:15px;line-height:1.65;color:var(--ink-6)}
.sp-ap-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}

.sp-ap-fine{max-width:640px;margin:clamp(20px,2.6vw,28px) 0 0;font-size:12.5px;line-height:1.6;color:var(--ink-5)}
.sp-ap-fine a{color:var(--ink-6)}

.sp-steps-cta{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;margin-top:clamp(26px,3.4vw,38px)}
.sp-steps-cta span{font-size:13.5px;line-height:1.6;color:rgba(255,255,255,.72);max-width:38ch}
`
