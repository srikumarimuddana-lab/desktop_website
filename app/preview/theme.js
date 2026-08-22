/* The /preview design system. One scoped stylesheet under .sp shared by every
 * page in the sample, so the pages stay visually one product while each keeps
 * its own motion. */

export const CSS = `
.sp{
  --ink:#0B0B0B; --ink-6:#4A4A4A; --ink-5:#757370; --ink-4:#9C9890;
  --paper:#F3EEE2; --paper-50:#FAF7EF; --paper-3:#E6DCC9; --white:#fff;
  --red:#DC3848; --red-7:#B41E31; --red-1:#FFE7EA;
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

/* ── hero: type on mint, a yellow shelf under it, phones straddling both ── */
.sp-hero{position:relative;margin:clamp(12px,2vw,28px);border-radius:clamp(24px,2.8vw,40px);
  overflow:hidden;border:2px solid var(--ink);background:var(--sky);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(108px,15vh,166px) clamp(18px,4vw,44px) 0;text-align:center}
.sp-hero-shelf{position:absolute;left:-2px;right:-2px;bottom:-2px;height:clamp(132px,19vw,250px);
  background:#FFF6AE;border:2px solid var(--ink);border-bottom:0;
  border-radius:clamp(26px,3vw,44px) clamp(26px,3vw,44px) 0 0}
.sp-hero-copy{position:relative;z-index:2;max-width:1020px;margin:0 auto}
.sp-hero-badge{display:inline-flex;align-items:center;background:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:8px 17px;font-size:11.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;box-shadow:var(--hard-sm)}
.sp-hero-h{font-size:clamp(40px,8vw,102px);color:var(--ink);text-wrap:balance;
  margin:clamp(16px,2.4vw,26px) 0 clamp(20px,3vw,30px)}
.sp-hero-hl{color:var(--red)}
.sp-hero-btns{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}

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
.sp-foot-in{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:clamp(20px,3vw,40px);padding-block:clamp(38px,5vw,64px)}
.sp-foot-logo{height:30px;width:auto;filter:brightness(0) invert(1)}
.sp-foot-lock{margin:14px 0 8px;font-family:var(--sp-display),sans-serif;font-size:clamp(20px,2vw,26px);color:var(--sun)}
.sp-foot-lead p:last-child{margin:0;font-size:15px;line-height:1.5;opacity:.72;max-width:30ch}
.sp-foot h4{margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.2em;opacity:.5}
.sp-foot nav{display:flex;flex-direction:column;gap:9px}
.sp-foot nav a{color:inherit;font-size:14.5px;font-weight:600;opacity:.82;text-decoration:none}
.sp-foot nav a:hover{opacity:1;color:var(--sun)}
.sp-foot nav a{display:inline-block;transition:transform .12s ease}
.sp-foot nav a:active{transform:translateX(3px)}
.sp-foot-base{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;
  padding-block:18px 28px;font-size:12.5px;font-weight:600;opacity:.6;border-top:1px solid rgba(255,255,255,.16)}
.sp-foot-flag{background:rgba(255,255,255,.1);border-radius:999px;padding:5px 12px}
@media(max-width:820px){.sp-foot-in{grid-template-columns:1fr 1fr}}
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
/* cascade finished: back to ordinary inline text so selection paints sanely */
.sp-split.done .sp-split-c{display:inline;transition:none}
.sp-split.done .sp-split-w{display:inline}
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
div.fixed.bottom-6.right-6 > button{
  border:2px solid #0B0B0B !important;background:#DC3848 !important;
  box-shadow:-4px 4px 0 #0B0B0B !important;
  animation:sp-chatin .6s cubic-bezier(.2,1.1,.3,1) backwards .9s;
  transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s !important}
div.fixed.bottom-6.right-6 > button:hover{transform:translate(-2px,2px);box-shadow:-2px 2px 0 #0B0B0B !important}
div.fixed.bottom-6.right-6 > button:active{transform:translate(-4px,4px) scale(.97);box-shadow:0 0 0 #0B0B0B !important}
@keyframes sp-chatin{from{opacity:0;transform:translateY(30px) scale(.5)}to{opacity:1;transform:none}}


/* the OPEN chat window, same treatment — scoped by the widget's fixed shell,
   colors literal because the widget sits outside .sp */
div.fixed.bottom-6.right-6 > div[class*="rounded"]{
  border:2px solid #0B0B0B !important;border-radius:18px !important;
  box-shadow:-7px 7px 0 #0B0B0B !important;background:#FAF7EF !important;
  animation:sp-chatopen .4s cubic-bezier(.2,1.1,.3,1) both}
@keyframes sp-chatopen{from{opacity:0;transform:translateY(22px) scale(.94)}to{opacity:1;transform:none}}
div.fixed.bottom-6.right-6 [class*="border-b"]{border-bottom:2px solid #0B0B0B !important}
div.fixed.bottom-6.right-6 [class*="border-t"]{border-top:2px solid #0B0B0B !important}
div.fixed.bottom-6.right-6 .bg-gray-50{background:#FFF3CF !important}
div.fixed.bottom-6.right-6 [class*="CardTitle"],
div.fixed.bottom-6.right-6 h3{font-weight:800 !important;letter-spacing:.02em}
/* controls inside: pill input, hard-shadow send, bordered select */
div.fixed.bottom-6.right-6 input{
  border:2px solid #0B0B0B !important;border-radius:999px !important;background:#fff !important;
  box-shadow:none !important;padding-left:14px !important}
div.fixed.bottom-6.right-6 input:focus-visible{outline:none !important;box-shadow:2px 2px 0 #0B0B0B !important}
div.fixed.bottom-6.right-6 button[class*="h-10"],
div.fixed.bottom-6.right-6 .flex.gap-2 > button{
  border:2px solid #0B0B0B !important;border-radius:999px !important;background:#DC3848 !important;
  box-shadow:-3px 3px 0 #0B0B0B !important;color:#fff !important;
  transition:transform .13s cubic-bezier(.34,1.56,.64,1),box-shadow .13s !important}
div.fixed.bottom-6.right-6 .flex.gap-2 > button:hover{transform:translate(-1px,1px);box-shadow:-2px 2px 0 #0B0B0B !important}
div.fixed.bottom-6.right-6 .flex.gap-2 > button:active{transform:translate(-3px,3px);box-shadow:0 0 0 #0B0B0B !important}
div.fixed.bottom-6.right-6 .flex.gap-2 > button:disabled{background:#C9C4B8 !important;box-shadow:-3px 3px 0 #0B0B0B !important;transform:none}
div.fixed.bottom-6.right-6 button[role="combobox"]{
  border:2px solid #0B0B0B !important;border-radius:999px !important;background:#fff !important;font-weight:700 !important}
/* message bubbles */
div.fixed.bottom-6.right-6 .bg-primary.text-primary-foreground,
div.fixed.bottom-6.right-6 [class*="bg-primary"][class*="rounded-lg"]{
  background:#DC3848 !important;border:2px solid #0B0B0B !important;border-radius:14px !important}
div.fixed.bottom-6.right-6 .bg-gray-100[class*="rounded-lg"]{
  background:#fff !important;border:2px solid #0B0B0B !important;border-radius:14px !important}
/* header icon buttons stay quiet but press */
div.fixed.bottom-6.right-6 button[class*="h-8"]{transition:transform .1s ease !important}
div.fixed.bottom-6.right-6 button[class*="h-8"]:active{transform:scale(.85)}

@media(prefers-reduced-motion:reduce){
  .sp-nav,.sp-nav-links a{animation:none}
  div.fixed.bottom-6.right-6 > button{animation:none}
  div.fixed.bottom-6.right-6 > div[class*="rounded"]{animation:none}
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
.sp-rhero-road{position:absolute;left:-40px;right:-40px;bottom:22px;height:14px;
  background:var(--ink);transform:rotate(-1.6deg);display:flex;align-items:center;gap:34px;
  padding-left:20px;overflow:hidden}
.sp-rhero-road i{flex:0 0 44px;height:3px;background:var(--sun)}

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
.sp-anat-row{display:flex;align-items:baseline;gap:12px;font-size:clamp(13.5px,1.25vw,15.5px);font-weight:700}
.sp-anat-row i{flex:1;border-bottom:2px dotted rgba(11,11,11,.35);transform:translateY(-4px)}
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
.sp-dhero{position:relative;background:var(--sun);border-bottom:2px solid var(--ink);
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

.sp-ahero{position:relative;background:var(--paper-50);border-bottom:2px solid var(--ink);
  margin-top:calc(-1 * clamp(52px,7vw,74px));padding:clamp(122px,17vh,196px) 0 clamp(52px,7vw,92px);
  text-align:center}
.sp-ahero-h{font-size:clamp(44px,8.4vw,112px);margin:clamp(16px,2.4vw,26px) 0 clamp(16px,2.2vw,22px)}
.sp-ahero-hl{color:var(--red)}
.sp-ahero-p{max-width:640px;margin:0 auto;font-size:clamp(16px,1.5vw,20px);line-height:1.6;color:var(--ink-6)}
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
.sp-split{background:var(--sky);border-bottom:2px solid var(--ink)}
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
`
