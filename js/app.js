// Kompendium-app: hash-ruter + innebygd editor. Innhold: data/content.js. Utkast lagres i localStorage.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const REPO=CONFIG.repo,FILE=CONFIG.fil,PASSORD=CONFIG.passord,DK='wb:draft',TK='wb:token',AK='wb:admin';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{return v===undefined?localStorage.getItem(k):v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch{}};
let DB;try{DB=JSON.parse(ls(DK))}catch{}
if(DB&&(DB.v||0)<(window.CONTENT.v||0)){DB=null;ls(DK,null);setTimeout(()=>toast('Nytt innhold er publisert. Gammelt utkast ble forkastet.'),600)}
DB=DB||structuredClone(window.CONTENT);const same=()=>JSON.stringify(DB)===JSON.stringify(window.CONTENT);
let admin=+ls(AK)>Date.now(),IDX={};
const save=()=>{if(same())return ls(DK,null);try{localStorage.setItem(DK,JSON.stringify(DB))}catch{toast('Utkastet er for stort for nettleseren. Eksporter innholdet.')}};
const path=(p,v)=>{const k=p.split('.'),l=k.pop();let o=DB;for(const x of k)o=o[x];if(v===undefined)return o[l];o[l]=v};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600)}
const clean=h=>{const d=new DOMParser().parseFromString('<body>'+h,'text/html').body;d.querySelectorAll('*').forEach(e=>{const t=e.tagName.toLowerCase();if(!/^(b|strong|i|em|a|br)$/.test(t)){e.replaceWith(...e.childNodes);return}
 [...e.attributes].forEach(a=>{if(!(t=='a'&&a.name=='href'&&/^https?:\/\//.test(a.value)))e.removeAttribute(a.name)});if(t=='a'){e.target='_blank';e.rel='noopener'}});return d.innerHTML};
function index(){IDX={};const w=(n,p,par,part)=>{IDX[n.id]={n,p,par,part};(n.k||[]).forEach((c,i)=>w(c,`${p}.k.${i}`,n,part))};DB.parts.forEach((n,i)=>w(n,`parts.${i}`,null,n))}

// ---- byggeklosser ----
const T=(p,h,tag='p',r=1)=>`<${tag}${admin?` contenteditable data-p="${p}"${r?' data-r=1':''}`:''}>${r?clean(h):esc(h)}</${tag}>`;
const X=(p,i)=>admin?`<button class="x" data-a="del" data-p="${p}" data-i="${i}" aria-label="Slett">✕</button>`:'';
const AD=(p,v,l)=>admin?`<button class="g" data-a="add" data-p="${p}" data-v="${esc(JSON.stringify(v))}">${l}</button>`:'';
const yt=u=>{const m=String(u).match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})|^\s*([\w-]{11})\s*$/);return m?`<iframe class="vid" src="https://www.youtube-nocookie.com/embed/${m[1]||m[2]}" title="Video" allowfullscreen loading="lazy"></iframe>`:''};
const CALC={bar:['Styrelengde','Høyde (cm)',h=>Math.round((2*h+410)/10)*10+' mm','høyde i mm × 0,2 + 410, avrundet til nærmeste 10 mm'],reach:['Reach','Rytterhøyde (cm)',h=>2*h+120+' mm','høyde (cm) × 2 + 120. Kan justeres opp eller ned etter preferanse og kroppsbygning.']};
const calc=k=>{const c=CALC[k];return c?`<div class="card calc"><b>${c[0]}-kalkulator</b><label>${c[1]}<input type="number" inputmode="numeric" min="100" max="230" data-k="${k}" placeholder="f.eks. 175"></label><div class="out" id="o-${k}">–</div><small class="mu">${c[3]}</small></div>`:''};
function terms(b,x){const L=b.x.map((r,i)=>[r,i]).sort((a,z)=>a[0][0].localeCompare(z[0][0],'nb'));let h='',c='',ch='';
 for(const[r,i]of L){const k=(r[0][0]||'#').toUpperCase();if(k!=c){c=k;ch+=`<button class="g chip" data-a="jump" data-l="${k}">${k}</button>`;h+=`<h4 id="L${k}">${k}</h4>`}
  h+=`<div class="row" data-s="${esc((r[0]+' '+r[1]).replace(/<[^>]+>/g,'').toLowerCase())}"><div><b>${T(`${x}.${i}.0`,r[0],'span',0)}</b><br>${T(`${x}.${i}.1`,r[1],'span')}</div>${X(x,i)}</div>`}
 return`<input type="search" class="fl" placeholder="Filtrer begreper …" aria-label="Filtrer begreper"><div class="chips">${ch}</div><div class="tl">${h}</div>`+AD(x,['Nytt begrep','Forklaring'],'+ Begrep')}
const rows=(b,x)=>`<div class="sc"><table>${b.x.map((r,i)=>`<tr>${r.map((c,j)=>`<${i?'td':'th'}>${T(`${x}.${i}.${j}`,c,'span',i?1:0)}</${i?'td':'th'}>`).join('')}${i&&admin?`<td>${X(x,i)}</td>`:''}</tr>`).join('')}</table></div>`+AD(x,b.x[0].map(()=>'…'),'+ Rad');
function blk(b,p){const x=p+'.x';switch(b.t){
 case'h':return T(x,b.x,'h3',0);case'h4':return T(x,b.x,'h4',0);case'p':return T(x,b.x);
 case'note':return`<div class="note">${T(x,b.x,'div')}</div>`;
 case'ul':case'ol':return`<${b.t}>${b.x.map((t,i)=>`<li>${T(`${x}.${i}`,t,'span')}${X(x,i)}</li>`).join('')}</${b.t}>`+AD(x,'','+ Punkt');
 case'vid':return yt(b.x)+(admin?`<label>YouTube-lenke (lim inn og trykk Enter)<input type="url" data-f="${x}" value="${esc(b.x)}" placeholder="https://www.youtube.com/watch?v=…"></label>${b.x&&!yt(b.x)?'<div class="note">Ugyldig YouTube-lenke.</div>':''}`:'');
 case'img':return b.x.s?`<figure><img src="${esc(b.x.s)}" alt="${esc(b.x.c)}" loading="lazy">${b.x.c||admin?`<figcaption>${T(x+'.c',b.x.c,'span',0)}</figcaption>`:''}</figure>`+(admin?`<label class="btn g">Bytt bilde<input hidden type="file" accept="image/*" data-a="imgr" data-p="${x}.s"></label>`:''):'';
 case'calc':return calc(b.x);case'terms':return terms(b,x);case'rows':return rows(b,x)}return''}
const LBL={h:'Overskrift',h4:'Delvis overskrift',p:'Tekst',note:'Merknad',ul:'Punktliste',ol:'Nummerert liste',vid:'Video',img:'Bilde',calc:'Kalkulator',terms:'Begreper',rows:'Tabell'};
const blocks=(n,p)=>n.b.map((b,i)=>`<div>${admin?`<div class="bc"><span class="badge">${LBL[b.t]||b.t}</span><button class="g" data-a="mv" data-p="${p}.b" data-i="${i}" data-d="-1" aria-label="Opp">↑</button><button class="g" data-a="mv" data-p="${p}.b" data-i="${i}" data-d="1" aria-label="Ned">↓</button>${X(p+'.b',i)}</div>`:''}${blk(b,`${p}.b.${i}`)}</div>`).join('');

const addbar=(p,o)=>admin?`<div class="addbar">${[['h','Overskrift'],['p','Tekst'],['ul','Punktliste'],['ol','Nummerert'],['note','Merknad'],['vid','YouTube-video'],['rows','Tabell']].map(([t,l])=>`<button class="g" data-a="blk" data-t="${t}" data-p="${p}.b">+ ${l}</button>`).join('')}<label class="btn g">+ Bilde<input hidden type="file" accept="image/*" data-a="img" data-p="${p}.b"></label>${o?`<button data-a="page" data-p="${p}.k">+ Underside</button><button class="g" data-a="mvp" data-p="${o.pp}" data-i="${o.si}" data-d="-1">Side ↑</button><button class="g" data-a="mvp" data-p="${o.pp}" data-i="${o.si}" data-d="1">Side ↓</button><button class="g" data-a="pdel" data-p="${o.pp}" data-i="${o.si}">Slett side</button>`:''}</div>`:'';
// ---- sider ----
const cards=l=>`<div class="cards">${l.map(c=>`<a class="card" href="#/p/${c.id}"><span class="mu">${esc(c.c||c.n||'')}</span><h3>${esc(c.title)}</h3><p class="mu">${esc(c.d||'')}</p></a>`).join('')}</div>`;
function home(){const H=DB.home;return`<section class="hero" style="--im:url(${H.img})"><div><h1>${T('home.title',H.title,'span',0)}</h1><p>${T('home.sub',H.sub,'span',0)}</p><a class="btn" href="#/p/${DB.parts[0].id}">Start med Del 1</a></div></section>
 ${blocks(H,'home')}${addbar('home')}<div class="cards">${DB.parts.map(p=>`<a class="card pc" href="#/p/${p.id}" style="--im:url(${p.img})"><span class="badge">${esc(p.n)}</span><h3>${esc(p.title)}</h3><p class="mu">${p.k.map(k=>esc(k.c+' '+k.title)).join(', ')||'Under arbeid'}</p></a>`).join('')}</div>`}
const toc=(part,cur)=>{const f=(m,d)=>`<a class="d${d}${m===cur?' on':''}" href="#/p/${m.id}">${m.c?`<i>${m.c}</i>`:''}${esc(m.title)}</a>`+(m.k||[]).map(c=>f(c,d+1)).join('');return f(part,0)};
function page(id){const e=IDX[id];if(!e)return home();const{n,p,par,part}=e,flat=[];(function w(m){flat.push(m);(m.k||[]).forEach(w)})(part);
 const i=flat.indexOf(n),pv=flat[i-1],nx=flat[i+1],cr=[];for(let m=n;m;m=IDX[m.id].par)cr.unshift(m);
 const sib=par?par.k:DB.parts,si=sib.indexOf(n),pp=par?IDX[par.id].p+'.k':'parts';
 const empty=!admin&&!n.b.length&&!n.k.length?'<div class="note">Denne siden er ikke ferdig ennå.</div>':'';
 const ctl=addbar(p,{pp,si});
 return`<div class="lay"><aside class="side">${toc(part,n)}</aside><article><details class="mtoc"><summary>☰ Innhold: ${esc(part.title)}</summary>${toc(part,n)}</details>
 <div class="crumb">${cr.map(m=>`<a href="#/p/${m.id}">${esc(m.c||m.n||m.title)}</a>`).join(' / ')}</div>${n===part&&part.img?`<div class="band" style="--im:url(${part.img})"></div>`:''}
 <h1>${n.n?`<span class="code">${esc(n.n)}</span>`:n.c?`<span class="code">${n.c}</span>`:''}${T(p+'.title',n.title,'span',0)}</h1>${admin&&par?`<p class="mu">Kort beskrivelse (vises på kort): ${T(p+'.d',n.d||'','span',0)}</p>`:''}${blocks(n,p)}${empty}${n.k.length?cards(n.k):''}${ctl}
 <nav class="pn">${pv?`<a class="card" href="#/p/${pv.id}">← ${esc(pv.title)}</a>`:'<span></span>'}${nx?`<a class="card" href="#/p/${nx.id}">${esc(nx.title)} →</a>`:'<span></span>'}</nav></article></div>`}
const txt=n=>(n.d||'')+' '+n.b.map(b=>JSON.stringify(b.x)).join(' ').replace(/<[^>]+>|[\[\]"\\]/g,' ').replace(/\s+/g,' ');
function results(q){q=q.trim().toLowerCase();if(q.length<2)return'<p class="mu">Skriv minst to tegn.</p>';let r='';
 for(const id in IDX){const n=IDX[id].n,t=txt(n),i=t.toLowerCase().indexOf(q);if(i>=0||n.title.toLowerCase().includes(q))r+=`<a class="card" href="#/p/${id}"><h3>${esc((n.c||'')+' '+n.title)}</h3><p class="mu">${i>=0?esc('…'+t.slice(Math.max(0,i-50),i+100)+'…'):''}</p></a>`}
 return r||'<p class="mu">Ingen treff.</p>'}
const search=q=>`<h1>Søk</h1><input id="q" type="search" value="${esc(q)}" placeholder="Søk i kompendiet …" aria-label="Søk"><div id="res" class="cards">${q?results(q):''}</div>`;

function render(){if(location.hash=='#/admin'){history.replaceState(null,'','#/');setTimeout(()=>admin?toast('Du er allerede logget inn'):login())}index();const[,r,a]=location.hash.split('/');let h,pid='';
 if(r=='p'){h=page(a);pid=IDX[a]?.part.id}else if(r=='s')h=search(decodeURIComponent(a||''));else h=home();
 $('#nav').innerHTML=`<a href="#/" class="${!r?'on':''}">Hjem</a>`+DB.parts.map(p=>`<a href="#/p/${p.id}" class="${p.id==pid?'on':''}">${esc(p.title.split(' ')[0])}</a>`).join('');
 const cur=r=='p'?IDX[a]?.n:null;$('#mm').innerHTML='<a href="#/">Hjem</a><a href="#/s/">Søk</a>'+DB.parts.map(p=>`<details${p.id==pid?' open':''}><summary>${esc(p.n+' '+p.title)}</summary>${toc(p,cur)}</details>`).join('');$('#brand').innerHTML=esc(CONFIG.navn).replace(/ (\S+)$/,' <b>$1</b>');
 const dirty=same()?'':'<span class="mu">Utkast</span>';
 $('#app').innerHTML=(admin?'<div class="note">Adminmodus: klikk på en tekst for å redigere. Bruk knappene nederst på siden for å legge til tekst, bilder og YouTube-videoer.</div>':'')+h+(admin?`<div class="ab"><span class="badge">Admin</span>${dirty}<button data-a="pub">Publiser</button><button class="g" data-a="fmt" data-c="bold"><b>B</b></button><button class="g" data-a="fmt" data-c="italic"><i>I</i></button><button class="g" data-a="fmt" data-c="link">Lenke</button><button class="g" data-a="exp">Eksporter</button><label class="btn g">Importer<input hidden type="file" accept=".js,.json" data-a="imp"></label><button class="g" data-a="tok">GitHub-token</button><button class="g" data-a="rst">Forkast utkast</button></div>`:'');
 $('#lock').textContent=admin?'🔓':'🔒';$('#lock').setAttribute('aria-label',admin?'Logg ut':'Admin-innlogging');document.body.classList.toggle('ed',admin);
 document.title=(r=='p'&&IDX[a]?IDX[a].n.title+' – ':'')+CONFIG.tittel}
addEventListener('hashchange',()=>{render();toggleMenu(false);scrollTo(0,0)});
function toggleMenu(o){const m=$('#mm');o=o===undefined?m.hidden:o;m.hidden=!o;$('#menu').setAttribute('aria-expanded',o)}

const shrink=(f,cb)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1200/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.82))};im.onerror=()=>toast('Kunne ikke lese bildet');im.src=r.result};r.readAsDataURL(f)};
// ---- hendelser ----
async function pub(){const t=ls(TK);if(!t){tok();return}toast('Publiserer …');
 const u=`https://api.github.com/repos/${REPO}/contents/${FILE}`,H={Authorization:'Bearer '+t,Accept:'application/vnd.github+json'};
 DB.v=Date.now();save();try{const g=await fetch(u,{headers:H}),sha=g.ok?(await g.json()).sha:undefined,body='window.CONTENT='+JSON.stringify(DB,null,1)+';\n';
  const r=await fetch(u,{method:'PUT',headers:H,body:JSON.stringify({message:'Oppdater innhold fra editoren',content:btoa(unescape(encodeURIComponent(body))),sha})});
  if(!r.ok)throw new Error((await r.json()).message);toast('Publisert. Siden oppdateres for alle om ca. 1 minutt.');render()}catch(e){toast('Feilet: '+e.message)}}
function tok(){const t=prompt('Lim inn GitHub-token (fine-grained, Contents: Read and write for '+REPO+'). Lagres kun i denne nettleseren.',ls(TK)||'');if(t!==null){ls(TK,t.trim()||null);toast(t.trim()?'Token lagret':'Token fjernet')}}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-a=fmt]');if(!b)return;e.preventDefault();const c=b.dataset.c;
 if(c=='link'){const g=getSelection(),r=g.rangeCount&&g.getRangeAt(0).cloneRange(),u=prompt('Lenke (https://…)');if(u&&r){g.removeAllRanges();g.addRange(r);document.execCommand('createLink',false,/^https?:\/\//.test(u)?u:'https://'+u)}}else document.execCommand(c)});
document.addEventListener('keydown',e=>{const t=e.target;if(e.key=='Escape')toggleMenu(false);if(e.key=='Enter'&&t.isContentEditable){e.preventDefault();if(t.dataset.r&&/^(P|DIV)$/.test(t.tagName))document.execCommand('insertLineBreak');else t.blur()}});
document.addEventListener('paste',e=>{if(!e.target.isContentEditable)return;e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))});
document.addEventListener('click',e=>{if(!$('#mm').hidden&&(!e.target.closest('#mm,#menu')||e.target.closest('#mm a')))toggleMenu(false);const b=e.target.closest('[data-a]');if(!b||b.tagName=='INPUT')return;const{a,p,i,v,t,d,l}=b.dataset,go=h=>{location.hash=h};
 if(a=='menu'){toggleMenu();return}
 if(a=='jump'){$('#L'+l)?.scrollIntoView({behavior:'smooth'});return}
 if(a=='fmt')return;
 if(a=='pub'){pub();return}if(a=='tok'){tok();return}
 if(a=='exp'){const k=document.createElement('a');k.href=URL.createObjectURL(new Blob(['window.CONTENT='+JSON.stringify(DB,null,1)+';\n'],{type:'text/javascript'}));k.download='content.js';k.click();return}
 if(a=='del'){if(!confirm('Slette dette?'))return;path(p).splice(+i,1)}
 else if(a=='add')path(p).push(JSON.parse(v));
 else if(a=='mv'||a=='mvp'){const A=path(p),j=+i+ +d;if(j<0||j>=A.length)return;[A[+i],A[j]]=[A[j],A[+i]]}
 else if(a=='blk')path(p).push({t,x:{h:'Ny overskrift',p:'Ny tekst',note:'Merknad',ul:['Punkt'],ol:['Punkt'],vid:'',rows:[['Kolonne 1','Kolonne 2'],['','']]}[t]});
 else if(a=='page'){const n=prompt('Tittel på ny side');if(!n)return;const id='n'+Date.now();path(p).push({id,c:'',title:n,d:'',b:[],k:[]});save();go('#/p/'+id);return}
 else if(a=='pdel'){const n=path(p)[+i];if(!confirm(`Slette «${n.title}» og alle undersider?`))return;const par=IDX[n.id].par;path(p).splice(+i,1);save();go(par?'#/p/'+par.id:'#/');render();return}
 else if(a=='rst'){if(!confirm('Forkaste utkastet og gå tilbake til publisert innhold?'))return;ls(DK,null);DB=structuredClone(window.CONTENT)}
 save();render()});
document.addEventListener('focusout',e=>{const t=e.target,p=t.dataset&&t.dataset.p;if(!p||!t.isContentEditable)return;const v=t.dataset.r?clean(t.innerHTML):t.innerText.trim();if(path(p)!==v){path(p,v);save()}});
document.addEventListener('input',e=>{const t=e.target;
 if(t.dataset.k){$('#o-'+t.dataset.k).textContent=t.value?CALC[t.dataset.k][2](+t.value):'–'}
 else if(t.classList.contains('fl')){const q=t.value.toLowerCase();$$('.tl .row').forEach(r=>r.hidden=!r.dataset.s.includes(q));$$('.tl h4').forEach(h=>{let s=h.nextElementSibling,any=false;while(s&&s.tagName!='H4'){if(!s.hidden)any=true;s=s.nextElementSibling}h.hidden=!any})}
 else if(t.id=='q'){$('#res').innerHTML=results(t.value);history.replaceState(null,'','#/s/'+encodeURIComponent(t.value))}});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset,f=t.files&&t.files[0];
 if(d.f){path(d.f,t.value.trim());save();render()}
 else if((d.a=='img'||d.a=='imgr')&&f){shrink(f,u=>{d.a=='img'?path(d.p).push({t:'img',x:{s:u,c:''}}):path(d.p,u);save();render()})}
 else if(d.a=='imp'&&f){const r=new FileReader();r.onload=()=>{try{DB=JSON.parse(r.result.replace(/^[^{]*/,'').replace(/;\s*$/,''));save();render();toast('Importert')}catch{toast('Ugyldig fil')}};r.readAsText(f)}});
function login(){const dl=$('#dlg'),close=()=>dl.close?dl.close():dl.removeAttribute('open');
 dl.innerHTML='<h3>Admin-innlogging</h3><form id="lf"><input id="pw" type="password" placeholder="Passord" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Passord"><p id="le" aria-live="polite"></p><button type="submit">Logg inn</button> <button type="button" class="g" id="cx">Avbryt</button></form>';
 dl.showModal?dl.showModal():dl.setAttribute('open','');$('#pw').focus();
 $('#lf').onsubmit=e=>{e.preventDefault();if($('#pw').value.trim()===PASSORD){admin=true;ls(AK,Date.now()+8*36e5);close();render();toast('Adminmodus på')}else{$('#le').textContent='Feil passord. Prøv igjen.';$('#le').style.color='var(--or)'}};$('#cx').onclick=close}
$('#lock').onclick=()=>{if(admin){admin=false;ls(AK,null);render();toast('Logget ut')}else login()};
render();
