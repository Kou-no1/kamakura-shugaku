(function(root){
  'use strict';
  const bounds={west:139.475,east:139.575,north:35.343,south:35.293};
  const merc=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
  function project(lat,lng){return {x:(lng-bounds.west)/(bounds.east-bounds.west)*1200,y:(merc(bounds.north)-merc(lat))/(merc(bounds.north)-merc(bounds.south))*730};}
  function distance(a,b){const r=Math.PI/180; const z=Math.sin((b.lat-a.lat)*r/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin((b.lng-a.lng)*r/2)**2;return 6371000*2*Math.atan2(Math.sqrt(z),Math.sqrt(1-z));}
  function shortestPath(lesson,from,to,mode='walk'){
    const dist=new Map(lesson.places.map(p=>[p.id,Infinity])), prev=new Map(),todo=new Set(dist.keys());dist.set(from,0);
    while(todo.size){let u=[...todo].reduce((a,b)=>dist.get(a)<dist.get(b)?a:b);if(!Number.isFinite(dist.get(u)))break;todo.delete(u);if(u===to)break;
      for(const e of lesson.edges.filter(e=>e.mode===mode&&(e.a===u||e.b===u))){const v=e.a===u?e.b:e.a; const alt=dist.get(u)+distance(lesson.places.find(p=>p.id===u),lesson.places.find(p=>p.id===v));if(alt<dist.get(v)){dist.set(v,alt);prev.set(v,u);}}
    }
    if(!Number.isFinite(dist.get(to)))return null;const ids=[to];while(ids[0]!==from){const p=prev.get(ids[0]);if(!p)return null;ids.unshift(p);}return {ids};
  }
  const cleanText=(s,n=5000)=>{if(typeof s!=='string'||s.length>n)throw Error('文章が長すぎるか、形式が正しくありません。');return s;};
  function validateLesson(input){
    if(!input||input.schema!=='kamakura-quest/1')throw Error('鎌倉たびクエストの教材ファイルではありません。');
    const l=JSON.parse(JSON.stringify(input));cleanText(l.id,100);if(!/^[a-zA-Z0-9_-]+$/.test(l.id))throw Error('教材IDを確認してください。');cleanText(l.title,100);
    if(!Array.isArray(l.places)||l.places.length<2||l.places.length>80)throw Error('見学場所は2〜80か所にしてください。');
    const ids=new Set();let bytes=0;
    for(const p of l.places){cleanText(p.id,80);if(ids.has(p.id)||!/^[a-zA-Z0-9_-]+$/.test(p.id))throw Error('場所のIDが重複しています。');ids.add(p.id);cleanText(p.name,80);cleanText(p.headline||'',100);cleanText(p.story);cleanText(p.question,1000);cleanText(p.tip,1000);if(p.mapName!==undefined)cleanText(p.mapName,80);p.chapters=p.chapters||[];if(!Array.isArray(p.chapters)||p.chapters.length>20)throw Error('学習項目は20件までです。');const chapterIds=new Set();for(const c of p.chapters){cleanText(c.id,80);if(!/^[a-zA-Z0-9_-]+$/.test(c.id)||['__proto__','constructor','prototype'].includes(c.id)||chapterIds.has(c.id))throw Error('学習項目のIDを確認してください。');chapterIds.add(c.id);cleanText(c.title,160);cleanText(c.location,200);cleanText(c.body,5000);cleanText(c.detail||'',3000);cleanText(c.question,1000);if(typeof c.source!=='string'||!/^https:\/\//.test(c.source))throw Error('学習項目の資料URLを確認してください。');}if(!['history','nature','town','station'].includes(p.category))throw Error('場所の種類を確認してください。');if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng)||p.lat<bounds.south||p.lat>bounds.north||p.lng<bounds.west||p.lng>bounds.east)throw Error('地図の範囲内の緯度・経度を指定してください。');
      if(['__proto__','constructor','prototype'].includes(p.id))throw Error('場所のIDを確認してください。');if(p.fee===undefined)p.fee=null;if(p.fee!==null&&(!Number.isFinite(p.fee)||p.fee<0||p.fee>100000))throw Error('場所の料金を確認してください。');if(p.itemName!==undefined)cleanText(p.itemName,80);if(p.itemDescription!==undefined)cleanText(p.itemDescription,300);p.photos=p.photos||[];if(p.photos.length>4)throw Error('写真は各地点4枚までです。');for(const photo of p.photos){if(typeof photo!=='string'||!/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(photo))throw Error('写真の形式を確認してください。');bytes+=photo.length;}if(p.source&&!/^https:\/\//.test(p.source))throw Error('参考URLはhttpsで指定してください。');
    }
    if(bytes>12000000)throw Error('写真の合計が大きすぎます。枚数を減らしてください。');
    if(!Array.isArray(l.edges)||l.edges.length>400)throw Error('道の形式を確認してください。');for(const e of l.edges){if(!ids.has(e.a)||!ids.has(e.b)||e.a===e.b||!['walk','train'].includes(e.mode))throw Error('道のつなぎ方を確認してください。');}
    l.routes=l.routes||[];if(!Array.isArray(l.routes)||l.routes.length>10)throw Error('紹介コースは10件までです。');const routeIds=new Set();for(const r of l.routes){cleanText(r.id,80);if(!/^[a-zA-Z0-9_-]+$/.test(r.id)||['__proto__','constructor','prototype'].includes(r.id)||routeIds.has(r.id))throw Error('紹介コースのIDを確認してください。');routeIds.add(r.id);cleanText(r.title,160);cleanText(r.intro,3000);cleanText(r.inquiry,1000);cleanText(r.notice,2000);cleanText(r.terrain,100);if(!Array.isArray(r.stops)||r.stops.length<2||r.stops.length>20||r.stops.some(id=>!ids.has(id)))throw Error('紹介コースの場所を確認してください。');if(typeof r.source!=='string'||!/^https:\/\//.test(r.source))throw Error('紹介コースのURLを確認してください。');}const m=l.mission;if(!m||!ids.has(m.start)||!ids.has(m.goal)||m.start===m.goal)throw Error('出発地点とゴールは別の場所にしてください。');if(!Array.isArray(m.checkpoints)||m.checkpoints.length>80||m.checkpoints.some(id=>!ids.has(id))||new Set(m.checkpoints).size!==m.checkpoints.length)throw Error('チェックポイントを確認してください。');
    cleanText(m.prompt,2000);if(!/^\d{2}:\d{2}$/.test(m.startTime)||!/^\d{2}:\d{2}$/.test(m.endTime))throw Error('時刻を確認してください。');for(const v of [m.startTime,m.endTime]){const [h,min]=v.split(':').map(Number);if(h>23||min>59)throw Error('時刻を確認してください。');}if(timeMinutes(m.endTime)<=timeMinutes(m.startTime))throw Error('終了時刻は出発時刻より後にしてください。');if(!Number.isFinite(m.budget)||m.budget<0||m.budget>100000||!Number.isFinite(m.ticketMinutes)||m.ticketMinutes<0||m.ticketMinutes>60)throw Error('予算・切符購入の時間を確認してください。');m.requireNote=!!m.requireNote;m.allowanceMode=!!m.allowanceMode;if(m.allowance===undefined)m.allowance=3000;if(!Number.isFinite(m.allowance)||m.allowance<0||m.allowance>100000)throw Error('持ち金を確認してください。');
    for(const p of l.places){if(!shortestPath(l,m.start,p.id))throw Error('出発地点から歩いて行けない場所があります。');}
    return l;
  }
  function timeMinutes(t){const[h,m]=t.split(':').map(Number);return h*60+m;}
  function formatTime(n){return `${String(Math.floor(n/60)%24).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
  function reviewLeg(leg,ticketMinutes=0){const notes=[];const dep=timeMinutes(leg.depart),arr=timeMinutes(leg.arrive);if(arr<dep)notes.push('出発より前に到着していないか、時刻を確かめよう。');if(arr-dep!==Number(leg.duration))notes.push('出発・到着時刻の差と、自分で計算した移動時間を比べよう。');if(leg.mode==='train'){const ready=timeMinutes(leg.ready),board=timeMinutes(leg.board);if(board<dep)notes.push('電車の出発は、駅に着く時刻より後になっているかな？');if(ready-dep<ticketMinutes)notes.push('切符を買うために先生が設定した時間を確保できているかな？');if(board<ready)notes.push('切符を買い終える前の電車を選んでいないかな？');if(arr<board)notes.push('時刻表の発車と到着を、同じ電車の欄で確かめよう。');}return notes;}
  function chapterProgress(lesson,state,pid){const chapters=lesson.places.find(p=>p.id===pid)?.chapters||[],total=chapters.length,done=chapters.filter(c=>state.learning?.[pid]?.[c.id]?.done===true).length;return {done,total,percent:total?Math.floor(done/total*100):100,complete:done===total};}
  root.KQ={chapterProgress,bounds,merc,project,distance,shortestPath,validateLesson,timeMinutes,formatTime,reviewLeg};
})(globalThis);
