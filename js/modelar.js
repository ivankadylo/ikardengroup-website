/* IKARDEN SIP MODELÁŘ v5.0
   - 2 patra, schody, kolony
   - 8 resize handles
   - preview kursoru
   - plocha se aktualizuje při změně izolace
*/

var M = {
  rooms:[], elements:[], columns:[],
  sc:36, ox:60, oy:60,
  drag:null, resize:null, pan:null,
  selected:null, selEl:null, selCol:null,
  mode:'select',   // select|door|window|delete|column
  pending:null,
  floor:1,         // 1 nebo 2
  colRequired:[],  // id kout rohů kde chybí kolona
  insulation:160,
  mouseX:0, mouseY:0,
  cvs:null, ctx:null, cw:0, ch:0,
  nextId:1, nextElId:1, nextColId:1,
};
var WALL_T=0.20, SNAP_D=0.4, INS_TOL=0.05;
var COLORS=['#3b82f6','#a855f7','#f59e0b','#06b6d4','#4ade80','#f97316','#ec4899','#9ca3af','#6b7280','#84cc16'];

var TEMPLATES_F1=[
  {name:'Obývací pokoj',color:'#3b82f6',w:6,  h:4},
  {name:'Kuchyň',       color:'#f59e0b',w:3,  h:4},
  {name:'Ložnice',      color:'#a855f7',w:4,  h:4},
  {name:'Dětský pokoj', color:'#06b6d4',w:3,  h:3},
  {name:'Koupelna',     color:'#4ade80',w:2.5,h:2},
  {name:'Zádveří',      color:'#9ca3af',w:2,  h:2},
  {name:'Garáž',        color:'#6b7280',w:6,  h:3},
  {name:'Pracovna',     color:'#ec4899',w:3,  h:3},
  {name:'Spíž',         color:'#f97316',w:1.5,h:2},
  {name:'Terasa',       color:'#84cc16',w:5,  h:3},
];
var TEMPLATES_F2=[
  {name:'Ložnice',      color:'#a855f7',w:4,  h:4},
  {name:'Dětský pokoj', color:'#06b6d4',w:3,  h:3},
  {name:'Koupelna',     color:'#4ade80',w:2.5,h:2},
  {name:'Pracovna',     color:'#ec4899',w:3,  h:3},
  {name:'Šatna',        color:'#f97316',w:2,  h:2},
  {name:'Chodba',       color:'#9ca3af',w:3,  h:2},
];

/* ─────────────── HANDLES ─────────────────── */
var HANDLES=[
  {id:'nw',cx:0,  cy:0,  cur:'nwse-resize'},
  {id:'n', cx:.5, cy:0,  cur:'ns-resize'},
  {id:'ne',cx:1,  cy:0,  cur:'nesw-resize'},
  {id:'e', cx:1,  cy:.5, cur:'ew-resize'},
  {id:'se',cx:1,  cy:1,  cur:'nwse-resize'},
  {id:'s', cx:.5, cy:1,  cur:'ns-resize'},
  {id:'sw',cx:0,  cy:1,  cur:'nesw-resize'},
  {id:'w', cx:0,  cy:.5, cur:'ew-resize'},
];

/* ─────────────── INIT ───────────────────── */
function sipMInit(){
  var cvs=document.getElementById('sipC');
  if(!cvs||cvs._mInit)return;
  cvs._mInit=true; M.cvs=cvs; M.ctx=cvs.getContext('2d');
  mResize();
  cvs.addEventListener('mousedown',mMD);
  cvs.addEventListener('mousemove',mMV);
  cvs.addEventListener('mouseup',  mMU);
  cvs.addEventListener('mouseleave',mMU);
  cvs.addEventListener('dblclick', mDbl);
  cvs.addEventListener('wheel',function(e){
    e.preventDefault();
    if(e.ctrlKey||e.metaKey){
      var f=e.deltaY<0?1.12:0.9;
      M.ox=M.cw/2+(M.ox-M.cw/2)*f; M.oy=M.ch/2+(M.oy-M.ch/2)*f;
      M.sc=Math.max(12,Math.min(160,M.sc*f));
    } else {M.ox-=e.deltaX*.8; M.oy-=e.deltaY*.8;}
    mDraw();
  },{passive:false});
  window.addEventListener('resize',mResize);
  mBuildPanel(); mDraw(); mCalc();
}
function mResize(){
  var w=document.getElementById('sipCW');
  if(!w||!M.cvs)return;
  M.cw=M.cvs.width=w.clientWidth; M.ch=M.cvs.height=w.clientHeight; mDraw();
}

/* ─────────────── DRAW ───────────────────── */
function mDraw(){
  if(!M.ctx)return;
  var c=M.ctx;
  c.clearRect(0,0,M.cw,M.ch);

  // grid
  c.strokeStyle='rgba(255,255,255,.05)'; c.lineWidth=1;
  for(var x=M.ox%M.sc;x<M.cw;x+=M.sc){c.beginPath();c.moveTo(x,0);c.lineTo(x,M.ch);c.stroke();}
  for(var y=M.oy%M.sc;y<M.ch;y+=M.sc){c.beginPath();c.moveTo(0,y);c.lineTo(M.cw,y);c.stroke();}
  c.strokeStyle='rgba(74,222,128,.2)'; c.lineWidth=1.5;
  c.beginPath();c.moveTo(M.ox,0);c.lineTo(M.ox,M.ch);c.stroke();
  c.beginPath();c.moveTo(0,M.oy);c.lineTo(M.cw,M.oy);c.stroke();

  var f1rooms=M.rooms.filter(function(r){return r.floor===1;});
  var f2rooms=M.rooms.filter(function(r){return r.floor===2;});

  if(!M.rooms.length&&!M.pending){
    c.save();c.globalAlpha=.3;c.fillStyle='#fff';
    c.font='14px Arial';c.textAlign='center';
    c.fillText('Klikněte na místnost vlevo → umístěte na plán',M.cw/2,M.ch/2-8);
    c.font='12px Arial';
    c.fillText('Poté přidejte dveře 🚪 a okna 🪟 z levého panelu',M.cw/2,M.ch/2+14);
    c.restore();
  }

  if(M.rooms.length) mDrawIns(c);

  // 1. patro
  f1rooms.forEach(function(r){
    var dim=(M.floor===2); // na 2. patru ztmavíme 1. patro
    mDrawRoom(c,r,dim);
  });

  // 2. patro – footprint šedě pod pokoji
  if(M.floor===2 && f1rooms.length){
    c.save();
    c.fillStyle='rgba(255,255,255,.04)';
    c.strokeStyle='rgba(255,255,255,.15)';
    c.lineWidth=1; c.setLineDash([5,5]);
    var bb=mFootprint(f1rooms);
    var bpx=M.ox+bb.x*M.sc, bpy=M.oy+bb.y*M.sc;
    c.strokeRect(bpx,bpy,bb.w*M.sc,bb.h*M.sc);
    c.setLineDash([]);
    c.restore();
  }

  // 2. patro místnosti
  f2rooms.forEach(function(r){mDrawRoom(c,r,false);});

  // kolonky
  M.columns.forEach(function(col){mDrawColumn(c,col);});

  // dveře + okna (jen aktuálního patra)
  M.elements.forEach(function(el){
    var room=M.rooms.find(function(r){return r.id===el.roomId;});
    if(room&&room.floor===M.floor) mDrawEl(c,el,false);
  });

  // preview pending room
  if(M.pending){
    var wx2=mSnap((M.mouseX-M.ox)/M.sc-M.pending.w/2);
    var wy2=mSnap((M.mouseY-M.oy)/M.sc-M.pending.h/2);
    var ppx=M.ox+wx2*M.sc, ppy=M.oy+wy2*M.sc;
    var ppw=M.pending.w*M.sc, pph=M.pending.h*M.sc;
    c.save();
    // 2. patro: ukáže i varování pokud vychází z footprintu
    var outOfFootprint=false;
    if(M.floor===2){
      var bb2=mFootprint(f1rooms);
      outOfFootprint=!(wx2>=bb2.x&&wx2+M.pending.w<=bb2.x+bb2.w&&wy2>=bb2.y&&wy2+M.pending.h<=bb2.y+bb2.h);
      if(outOfFootprint){
        c.strokeStyle='#ef4444'; c.fillStyle='rgba(239,68,68,.25)';
      } else {
        c.strokeStyle=M.pending.color; c.fillStyle=M.pending.color.replace(')',',0.3)').replace('rgb','rgba');
      }
    } else {
      c.strokeStyle=M.pending.color; c.fillStyle=M.pending.color.replace(')',',0.3)').replace('rgb','rgba');
    }
    c.globalAlpha=.35; c.fillStyle=M.pending.color; c.fillRect(ppx,ppy,ppw,pph);
    c.globalAlpha=1; c.lineWidth=2; c.setLineDash([6,4]);
    c.strokeRect(ppx+1,ppy+1,ppw-2,pph-2); c.setLineDash([]);
    c.fillStyle='#fff'; c.font='bold 11px Arial'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText(M.pending.name,ppx+ppw/2,ppy+pph/2-6);
    c.fillStyle='#fff'; c.font='9px Arial';
    c.fillText(M.pending.w+'×'+M.pending.h+' m',ppx+ppw/2,ppy+pph/2+8);
    if(outOfFootprint){
      c.fillStyle='#ef4444'; c.font='bold 10px Arial';
      c.fillText('⚠ Vyžaduje kolony!',ppx+ppw/2,ppy-10);
    }
    c.restore();
    M.cvs.style.cursor='crosshair';
    return;
  }

  // preview column
  if(M.mode==='column'){
    var cpx=M.ox+mSnap((M.mouseX-M.ox)/M.sc)*M.sc;
    var cpy=M.oy+mSnap((M.mouseY-M.oy)/M.sc)*M.sc;
    c.save(); c.fillStyle='rgba(251,191,36,.7)';
    c.beginPath(); c.arc(cpx,cpy,8,0,Math.PI*2); c.fill();
    c.restore();
    M.cvs.style.cursor='crosshair';
    return;
  }

  // preview door/window
  if(M.mode==='door'||M.mode==='window'){
    mDrawElPreview(c); M.cvs.style.cursor='cell'; return;
  }

  // cursor na handle
  if(M.selected&&M.mode==='select'){
    var hRoom=M.rooms.find(function(r){return r.id===M.selected;});
    if(hRoom){
      var hh=mHandleAt(hRoom,M.mouseX,M.mouseY);
      if(hh){var hdef=HANDLES.find(function(h){return h.id===hh;});if(hdef){M.cvs.style.cursor=hdef.cur;return;}}
    }
  }
  var cur='default';
  if(M.mode==='delete')cur='not-allowed';
  else if(M.pan)cur='grabbing';
  M.cvs.style.cursor=cur;
}

function mDrawRoom(c,r,dimmed){
  var px=M.ox+r.x*M.sc, py=M.oy+r.y*M.sc, pw=r.w*M.sc, ph=r.h*M.sc;
  var sel=(r.id===M.selected);
  var isStairs=(r.isStairs===true);
  var alpha=dimmed?0.25:1;

  c.save(); c.globalAlpha=dimmed?0.15:0.18;
  c.fillStyle=isStairs?'#78350f':r.color;
  c.fillRect(px,py,pw,ph);
  c.globalAlpha=alpha;

  if(isStairs){
    // Schodiště – šrafování
    c.strokeStyle='rgba(251,191,36,.7)'; c.lineWidth=1; c.setLineDash([3,3]);
    for(var i=0;i<Math.ceil(ph/8);i++){
      c.beginPath();c.moveTo(px,py+i*8);c.lineTo(px+pw,py+i*8);c.stroke();
    }
    c.setLineDash([]);
  }

  c.strokeStyle=sel?'#4ade80':(isStairs?'#f59e0b':r.color);
  c.lineWidth=sel?2.5:(isStairs?2:1.8);
  c.strokeRect(px+.5,py+.5,pw-1,ph-1);

  // Etiketa
  c.fillStyle=dimmed?'rgba(255,255,255,.4)':'#fff';
  c.textAlign='center'; c.textBaseline='middle';
  var fs=Math.max(8,Math.min(13,pw/(r.name.length*.65)));
  c.font='bold '+fs+'px Arial';
  c.fillText(isStairs?'🪜 '+r.name:r.name,px+pw/2,py+ph/2-7);
  c.fillStyle=dimmed?'rgba(255,255,255,.3)':(isStairs?'#f59e0b':r.color);
  c.font='9px Arial';
  c.fillText(r.w.toFixed(1)+'×'+r.h.toFixed(1)+' m',px+pw/2,py+ph/2+7);

  // 2. patro badge
  if(r.floor===2){
    c.fillStyle='rgba(168,85,247,.8)'; c.font='bold 8px Arial';
    c.fillText('2F',px+pw-12,py+10);
  }

  if(sel) mDrawHandles(c,px,py,pw,ph);
  c.restore();
}

function mDrawColumn(c,col){
  var cpx=M.ox+col.x*M.sc, cpy=M.oy+col.y*M.sc;
  var sel=(col.id===M.selCol);
  c.save();
  c.fillStyle=sel?'#f59e0b':'#fbbf24';
  c.strokeStyle=sel?'#fff':'rgba(251,191,36,.5)';
  c.lineWidth=sel?2:1;
  c.beginPath(); c.arc(cpx,cpy,7,0,Math.PI*2); c.fill(); c.stroke();
  c.fillStyle='#000'; c.font='bold 8px Arial'; c.textAlign='center'; c.textBaseline='middle';
  c.fillText('K',cpx,cpy);
  c.restore();
}

/* ─────────────── IZOLACE ────────────────── */
function mDrawIns(c){
  var f1=M.rooms.filter(function(r){return r.floor===1&&!r.isStairs;});
  if(!f1.length)return;
  var ins=M.insulation/1000*M.sc, wt=WALL_T*M.sc;
  c.save();

  // Vnútřní stěny
  c.strokeStyle='rgba(200,200,200,.4)'; c.lineWidth=wt;
  f1.forEach(function(r){
    f1.forEach(function(o){
      if(o.id<=r.id)return;
      if(Math.abs((r.x+r.w)-o.x)<INS_TOL||Math.abs(r.x-(o.x+o.w))<INS_TOL){
        var wx2=Math.abs((r.x+r.w)-o.x)<INS_TOL?r.x+r.w:r.x;
        var t=Math.max(r.y,o.y),b=Math.min(r.y+r.h,o.y+o.h);
        if(b>t){c.beginPath();c.moveTo(M.ox+wx2*M.sc,M.oy+t*M.sc);c.lineTo(M.ox+wx2*M.sc,M.oy+b*M.sc);c.stroke();}
      }
      if(Math.abs((r.y+r.h)-o.y)<INS_TOL||Math.abs(r.y-(o.y+o.h))<INS_TOL){
        var wy2=Math.abs((r.y+r.h)-o.y)<INS_TOL?r.y+r.h:r.y;
        var l=Math.max(r.x,o.x),rt=Math.min(r.x+r.w,o.x+o.w);
        if(rt>l){c.beginPath();c.moveTo(M.ox+l*M.sc,M.oy+wy2*M.sc);c.lineTo(M.ox+rt*M.sc,M.oy+wy2*M.sc);c.stroke();}
      }
    });
  });

  // Zovnišní kontůr
  var segs=[];
  f1.forEach(function(r){
    function ext(coord,from,to,isV){
      var blocked=[];
      f1.forEach(function(o){
        if(o.id===r.id)return;
        var a,b;
        if(isV){
          if(Math.abs(o.x-coord)<INS_TOL||Math.abs(o.x+o.w-coord)<INS_TOL||(o.x<coord-INS_TOL&&o.x+o.w>coord+INS_TOL)){
            a=Math.max(from,o.y);b=Math.min(to,o.y+o.h);if(b>a)blocked.push([a,b]);
          }
        } else {
          if(Math.abs(o.y-coord)<INS_TOL||Math.abs(o.y+o.h-coord)<INS_TOL||(o.y<coord-INS_TOL&&o.y+o.h>coord+INS_TOL)){
            a=Math.max(from,o.x);b=Math.min(to,o.x+o.w);if(b>a)blocked.push([a,b]);
          }
        }
      });
      blocked.sort(function(a,b){return a[0]-b[0];});
      var res=[],cur=from;
      blocked.forEach(function(bl){if(bl[0]>cur+INS_TOL)res.push([cur,bl[0]]);cur=Math.max(cur,bl[1]);});
      if(cur<to-INS_TOL)res.push([cur,to]);
      return res;
    }
    ext(r.y,r.x,r.x+r.w,false).forEach(function(s){segs.push({x1:s[0],y1:r.y,x2:s[1],y2:r.y});});
    ext(r.y+r.h,r.x,r.x+r.w,false).forEach(function(s){segs.push({x1:s[0],y1:r.y+r.h,x2:s[1],y2:r.y+r.h});});
    ext(r.x,r.y,r.y+r.h,true).forEach(function(s){segs.push({x1:r.x,y1:s[0],x2:r.x,y2:s[1]});});
    ext(r.x+r.w,r.y,r.y+r.h,true).forEach(function(s){segs.push({x1:r.x+r.w,y1:s[0],x2:r.x+r.w,y2:s[1]});});
  });

  c.strokeStyle='rgba(74,222,128,.75)';
  c.lineWidth=Math.max(4,ins); c.lineCap='square';
  segs.forEach(function(s){
    c.beginPath();c.moveTo(M.ox+s.x1*M.sc,M.oy+s.y1*M.sc);c.lineTo(M.ox+s.x2*M.sc,M.oy+s.y2*M.sc);c.stroke();
  });

  var minX2=Infinity,minY2=Infinity;
  f1.forEach(function(r){minX2=Math.min(minX2,r.x);minY2=Math.min(minY2,r.y);});
  c.fillStyle='rgba(74,222,128,.8)'; c.font='9px Arial'; c.textAlign='left';
  c.fillText('izolace '+M.insulation+' mm  |  stěna '+Math.round(WALL_T*100)+' cm',
    M.ox+minX2*M.sc-ins/2, M.oy+minY2*M.sc-ins/2-6);
  c.restore();
}

function mDrawHandles(c,px,py,pw,ph){
  var hs=8;
  HANDLES.forEach(function(h){
    var hx=px+h.cx*pw-hs/2, hy=py+h.cy*ph-hs/2;
    c.fillStyle='#4ade80'; c.fillRect(hx,hy,hs,hs);
    c.strokeStyle='#0d1f1a'; c.lineWidth=1; c.strokeRect(hx+.5,hy+.5,hs-1,hs-1);
  });
}

/* ─────────────── DVERE/OKNA ─────────────── */
function mDrawEl(c,el,isPreview){
  var room=M.rooms.find(function(r){return r.id===el.roomId;});
  if(!room)return;
  var px=M.ox+room.x*M.sc,py=M.oy+room.y*M.sc,pw=room.w*M.sc,ph=room.h*M.sc;
  var ew=el.width*M.sc,sel=(el.id===M.selEl);
  c.save();
  if(isPreview){c.strokeStyle='rgba(255,255,255,.7)';c.fillStyle='rgba(255,255,255,.7)';c.lineWidth=2;c.setLineDash([4,3]);}
  else{c.strokeStyle=sel?'#f59e0b':(el.type==='door'?'#fff':'#60a5fa');c.fillStyle=c.strokeStyle;c.lineWidth=sel?2.5:2;}
  var x1,y1,x2,y2;
  if(el.wall==='top')   {x1=px+el.pos*pw;y1=py;   x2=x1+ew;y2=y1;}
  if(el.wall==='bottom'){x1=px+el.pos*pw;y1=py+ph;x2=x1+ew;y2=y1;}
  if(el.wall==='left')  {x1=px;   y1=py+el.pos*ph;x2=x1;  y2=y1+ew;}
  if(el.wall==='right') {x1=px+pw;y1=py+el.pos*ph;x2=x1;  y2=y1+ew;}
  c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
  if(el.type==='window'){
    var off=(el.wall==='top'?-5:el.wall==='bottom'?5:0);
    var off2=(el.wall==='left'?-5:el.wall==='right'?5:0);
    c.globalAlpha=.5;
    for(var i=1;i<=2;i++){c.beginPath();c.moveTo(x1+off2*i,y1+off*i);c.lineTo(x2+off2*i,y2+off*i);c.stroke();}
    c.globalAlpha=1;
    c.font='10px Arial';c.textAlign='center';c.textBaseline='middle';
    c.fillText('⊞',(x1+x2)/2+(off2?off2*3:0),(y1+y2)/2+(off?off*3:0));
  } else {
    var hx=el.doorSide==='left'?x1:x2,hy=el.doorSide==='left'?y1:y2;
    var inside=el.doorDir==='in',arcR=ew;
    c.beginPath();
    if(el.wall==='top'||el.wall==='bottom'){
      var dy=(el.wall==='top')?(inside?arcR:-arcR):(inside?-arcR:arcR);
      c.moveTo(hx,hy);c.lineTo(hx,hy+dy);c.moveTo(hx,hy);
      var aS=el.doorSide==='left'?0:Math.PI,aE=el.doorSide==='left'?(inside?Math.PI/2:-Math.PI/2):(inside?-Math.PI/2:Math.PI/2);
      c.arc(hx,hy,arcR,aS+(el.wall==='bottom'?Math.PI:0),aE+(el.wall==='bottom'?Math.PI:0),el.doorSide==='right');
    } else {
      var dx2=(el.wall==='left')?(inside?arcR:-arcR):(inside?-arcR:arcR);
      c.moveTo(hx,hy);c.lineTo(hx+dx2,hy);c.moveTo(hx,hy);
      var bS=el.doorSide==='left'?Math.PI/2:-Math.PI/2,bE=el.doorSide==='left'?(inside?0:Math.PI):(inside?Math.PI:0);
      c.arc(hx,hy,arcR,bS+(el.wall==='right'?Math.PI:0),bE+(el.wall==='right'?Math.PI:0),el.doorSide==='right');
    }
    c.stroke();
    c.font='bold 10px Arial';c.textAlign='center';c.textBaseline='middle';
    c.fillText('D',(x1+x2)/2,(y1+y2)/2);
  }
  c.setLineDash([]);c.restore();
}

function mDrawElPreview(c){
  var ex=M.mouseX,ey=M.mouseY,best=null,bestD=20;
  var curRooms=M.rooms.filter(function(r){return r.floor===M.floor;});
  curRooms.forEach(function(room){
    var px=M.ox+room.x*M.sc,py=M.oy+room.y*M.sc,pw=room.w*M.sc,ph=room.h*M.sc;
    [{id:'top',d:Math.abs(ey-py),pos:(ex-px)/pw,ok:ex>=px&&ex<=px+pw},
     {id:'bottom',d:Math.abs(ey-py-ph),pos:(ex-px)/pw,ok:ex>=px&&ex<=px+pw},
     {id:'left',d:Math.abs(ex-px),pos:(ey-py)/ph,ok:ey>=py&&ey<=py+ph},
     {id:'right',d:Math.abs(ex-px-pw),pos:(ey-py)/ph,ok:ey>=py&&ey<=py+ph}
    ].forEach(function(w){
      if(w.ok&&w.d<bestD&&w.pos>=0&&w.pos<=1){bestD=w.d;best={room:room,wall:w.id,pos:Math.max(0,Math.min(0.8,w.pos-.1))};}
    });
  });
  if(!best)return;
  mDrawEl(c,{id:-1,type:M.mode,roomId:best.room.id,wall:best.wall,pos:best.pos,width:M.mode==='door'?.9:1.2,doorDir:'in',doorSide:'left'},true);
}

/* ─────────────── FOOTPRINT ──────────────── */
function mFootprint(rooms){
  if(!rooms||!rooms.length)return{x:0,y:0,w:0,h:0};
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  rooms.forEach(function(r){minX=Math.min(minX,r.x);minY=Math.min(minY,r.y);maxX=Math.max(maxX,r.x+r.w);maxY=Math.max(maxY,r.y+r.h);});
  return{x:minX,y:minY,w:maxX-minX,h:maxY-minY};
}

function mRoomInFootprint(r,bb){
  return r.x>=bb.x-INS_TOL&&r.x+r.w<=bb.x+bb.w+INS_TOL&&r.y>=bb.y-INS_TOL&&r.y+r.h<=bb.y+bb.h+INS_TOL;
}

/* ─────────────── KOLONY CHECK ───────────── */
function mCheckColumns(room){
  // Zjistit rohy místnosti co vyčnívají z footprintu 1.p.
  var f1=M.rooms.filter(function(r){return r.floor===1&&!r.isStairs;});
  if(!f1.length)return[];
  var bb=mFootprint(f1);
  // Rohové body místnosti
  var corners=[
    {x:room.x,     y:room.y},
    {x:room.x+room.w,y:room.y},
    {x:room.x,     y:room.y+room.h},
    {x:room.x+room.w,y:room.y+room.h},
  ];
  var needed=[];
  corners.forEach(function(pt){
    var inFP=pt.x>=bb.x-INS_TOL&&pt.x<=bb.x+bb.w+INS_TOL&&pt.y>=bb.y-INS_TOL&&pt.y<=bb.y+bb.h+INS_TOL;
    if(!inFP){
      // Má kolonu v tomto rohu?
      var hasCol=M.columns.some(function(col){return Math.abs(col.x-pt.x)<0.2&&Math.abs(col.y-pt.y)<0.2;});
      if(!hasCol)needed.push(pt);
    }
  });
  return needed;
}

/* ─────────────── MOUSE ──────────────────── */
function mMD(e){
  M.mouseX=e.offsetX; M.mouseY=e.offsetY;
  var wx=(e.offsetX-M.ox)/M.sc, wy=(e.offsetY-M.oy)/M.sc;

  // Kolona
  if(M.mode==='column'){
    M.columns.push({id:M.nextColId++,x:mSnap(wx),y:mSnap(wy)});
    mDraw(); mUpdateColBtn(); return;
  }

  // Pending room
  if(M.pending){
    // 2. patro: kontrola footprintu + kolony
    if(M.floor===2){
      var f1=M.rooms.filter(function(r){return r.floor===1&&!r.isStairs;});
      var bb=mFootprint(f1);
      var rx=mSnap(wx-M.pending.w/2),ry=mSnap(wy-M.pending.h/2);
      var newR={x:rx,y:ry,w:M.pending.w,h:M.pending.h};
      if(!mRoomInFootprint(newR,bb)){
        var needed=mCheckColumns(newR);
        if(needed.length){
          mShowColWarning(needed); return; // zablokujeme dokud nejsou kolony
        }
      }
    }
    var r={id:M.nextId++,name:M.pending.name,color:M.pending.color,
      x:mSnap(wx-M.pending.w/2),y:mSnap(wy-M.pending.h/2),
      w:M.pending.w,h:M.pending.h,floor:M.floor,
      isStairs:M.pending.isStairs||false};
    M.rooms.push(r); M.pending=null; M.selected=r.id;
    mUpdateColBtn(); mDraw(); mCalc(); mShowProps(r.id);
    // Schodiště → nabídneme přechod na 2. patro
    if(r.isStairs&&M.floor===1) mShowStairsPrompt();
    return;
  }

  if(M.mode==='door'||M.mode==='window'){mPlaceEl(e.offsetX,e.offsetY);return;}
  if(M.mode==='delete'){mDeleteAt(e.offsetX,e.offsetY);return;}
  if(e.button===1||e.altKey){M.pan={startX:e.clientX,startY:e.clientY,origOX:M.ox,origOY:M.oy};return;}

  // Kolona select
  for(var ci=0;ci<M.columns.length;ci++){
    var col=M.columns[ci];
    var cpx=M.ox+col.x*M.sc,cpy=M.oy+col.y*M.sc;
    if(Math.abs(e.offsetX-cpx)<10&&Math.abs(e.offsetY-cpy)<10){
      M.selCol=col.id; M.selected=null; mDraw(); return;
    }
  }

  var el=mElAt(e.offsetX,e.offsetY);
  if(el){M.selEl=el.id;M.selected=null;mShowElProps(el.id);mDraw();return;}

  if(M.selected){
    var room2=M.rooms.find(function(r){return r.id===M.selected;});
    if(room2){var h=mHandleAt(room2,e.offsetX,e.offsetY);
      if(h){M.resize={room:room2,handle:h,startX:wx,startY:wy,origW:room2.w,origH:room2.h,origX:room2.x,origY:room2.y};return;}
    }
  }

  var hit=null;
  var curRooms=M.rooms.filter(function(r){return r.floor===M.floor;});
  // Také lze kliknout na dim místnosti 1.p. z 2.p. pro info
  if(M.floor===2){
    var allRooms=M.rooms.slice();
    for(var i=allRooms.length-1;i>=0;i--){
      var r3=allRooms[i];
      if(wx>=r3.x&&wx<=r3.x+r3.w&&wy>=r3.y&&wy<=r3.y+r3.h){hit=r3;break;}
    }
  } else {
    for(var j=curRooms.length-1;j>=0;j--){
      var r4=curRooms[j];
      if(wx>=r4.x&&wx<=r4.x+r4.w&&wy>=r4.y&&wy<=r4.y+r4.h){hit=r4;break;}
    }
  }
  M.selEl=null; M.selCol=null;
  if(hit){M.selected=hit.id;M.drag={room:hit,dx:wx-hit.x,dy:wy-hit.y};mShowProps(hit.id);}
  else{M.selected=null;mHideProps();M.pan={startX:e.clientX,startY:e.clientY,origOX:M.ox,origOY:M.oy};}
  mDraw();
}

function mMV(e){
  M.mouseX=e.offsetX; M.mouseY=e.offsetY;
  var wx=(e.offsetX-M.ox)/M.sc,wy=(e.offsetY-M.oy)/M.sc;
  if(M.pending||M.mode==='door'||M.mode==='window'||M.mode==='column'){mDraw();return;}
  if(M.pan){M.ox=M.pan.origOX+(e.clientX-M.pan.startX);M.oy=M.pan.origOY+(e.clientY-M.pan.startY);mDraw();return;}
  if(M.drag){
    M.drag.room.x=mSnap(wx-M.drag.dx);M.drag.room.y=mSnap(wy-M.drag.dy);
    mMagnet(M.drag.room);mDraw();mCalc();mUpdatePropsLive(M.drag.room.id);return;
  }
  if(M.resize){
    var r=M.resize.room,dw=wx-M.resize.startX,dh=wy-M.resize.startY,h=M.resize.handle;
    if(h==='e'||h==='se'||h==='ne')r.w=Math.max(.5,mSnap(M.resize.origW+dw));
    if(h==='s'||h==='se'||h==='sw')r.h=Math.max(.5,mSnap(M.resize.origH+dh));
    if(h==='w'||h==='nw'||h==='sw'){var nw=Math.max(.5,mSnap(M.resize.origW-dw));r.x=mSnap(M.resize.origX+(M.resize.origW-nw));r.w=nw;}
    if(h==='n'||h==='nw'||h==='ne'){var nh=Math.max(.5,mSnap(M.resize.origH-dh));r.y=mSnap(M.resize.origY+(M.resize.origH-nh));r.h=nh;}
    mDraw();mCalc();mUpdatePropsLive(r.id);
    // Po resize 2.p. zkontroluj kolony
    if(r.floor===2){var need=mCheckColumns(r);mUpdateColBtn(need.length>0);}
  }
}

function mMU(e){M.drag=null;M.resize=null;M.pan=null;}

function mDbl(e){
  var wx=(e.offsetX-M.ox)/M.sc,wy=(e.offsetY-M.oy)/M.sc;
  for(var i=M.rooms.length-1;i>=0;i--){
    var r=M.rooms[i];
    if(wx>=r.x&&wx<=r.x+r.w&&wy>=r.y&&wy<=r.y+r.h){
      var name=prompt('Přejmenovat místnost:',r.name);
      if(name!==null&&name.trim()){r.name=name.trim();mDraw();mShowProps(r.id);}
      return;
    }
  }
}

/* ─────────────── HELPERS ───────────────── */
function mSnap(v){return Math.round(v*10)/10;}

function mMagnet(room){
  M.rooms.forEach(function(o){
    if(o.id===room.id)return;
    var dx1=Math.abs(room.x-(o.x+o.w)),dx2=Math.abs((room.x+room.w)-o.x),dx3=Math.abs(room.x-o.x),dx4=Math.abs((room.x+room.w)-(o.x+o.w));
    if(dx1<SNAP_D)room.x=mSnap(o.x+o.w);else if(dx2<SNAP_D)room.x=mSnap(o.x-room.w);else if(dx3<SNAP_D)room.x=mSnap(o.x);else if(dx4<SNAP_D)room.x=mSnap(o.x+o.w-room.w);
    var dy1=Math.abs(room.y-(o.y+o.h)),dy2=Math.abs((room.y+room.h)-o.y),dy3=Math.abs(room.y-o.y),dy4=Math.abs((room.y+room.h)-(o.y+o.h));
    if(dy1<SNAP_D)room.y=mSnap(o.y+o.h);else if(dy2<SNAP_D)room.y=mSnap(o.y-room.h);else if(dy3<SNAP_D)room.y=mSnap(o.y);else if(dy4<SNAP_D)room.y=mSnap(o.y+o.h-room.h);
  });
}

function mHandleAt(room,ex,ey){
  var px=M.ox+room.x*M.sc,py=M.oy+room.y*M.sc,pw=room.w*M.sc,ph=room.h*M.sc,hs=12;
  for(var i=0;i<HANDLES.length;i++){var h=HANDLES[i],hx=px+h.cx*pw,hy=py+h.cy*ph;if(Math.abs(ex-hx)<hs&&Math.abs(ey-hy)<hs)return h.id;}
  return null;
}

function mElAt(ex,ey){
  var curRooms=M.rooms.filter(function(r){return r.floor===M.floor;});
  for(var i=0;i<M.elements.length;i++){
    var el=M.elements[i];
    var room=curRooms.find(function(r){return r.id===el.roomId;});
    if(!room)continue;
    var pt=mElCenter(el,room);
    if(Math.abs(ex-pt.x)<14&&Math.abs(ey-pt.y)<14)return el;
  }
  return null;
}

function mElCenter(el,room){
  var px=M.ox+room.x*M.sc,py=M.oy+room.y*M.sc,pw=room.w*M.sc,ph=room.h*M.sc,ew=el.width*M.sc,p=el.pos;
  if(el.wall==='top')   return{x:px+p*pw+ew/2,y:py};
  if(el.wall==='bottom')return{x:px+p*pw+ew/2,y:py+ph};
  if(el.wall==='left')  return{x:px,y:py+p*ph+ew/2};
  return{x:px+pw,y:py+p*ph+ew/2};
}

function mPlaceEl(ex,ey){
  var best=null,bestD=16;
  var curRooms=M.rooms.filter(function(r){return r.floor===M.floor;});
  curRooms.forEach(function(room){
    var px=M.ox+room.x*M.sc,py=M.oy+room.y*M.sc,pw=room.w*M.sc,ph=room.h*M.sc;
    [{id:'top',d:Math.abs(ey-py),pos:(ex-px)/pw,ok:ex>=px&&ex<=px+pw},
     {id:'bottom',d:Math.abs(ey-py-ph),pos:(ex-px)/pw,ok:ex>=px&&ex<=px+pw},
     {id:'left',d:Math.abs(ex-px),pos:(ey-py)/ph,ok:ey>=py&&ey<=py+ph},
     {id:'right',d:Math.abs(ex-px-pw),pos:(ey-py)/ph,ok:ey>=py&&ey<=py+ph}
    ].forEach(function(w){if(w.ok&&w.d<bestD&&w.pos>=0&&w.pos<=1){bestD=w.d;best={room:room,wall:w.id,pos:Math.max(0,Math.min(0.8,w.pos-.1))};}});
  });
  if(!best)return;
  var el={id:M.nextElId++,type:M.mode,roomId:best.room.id,wall:best.wall,pos:best.pos,width:M.mode==='door'?.9:1.2,doorDir:'in',doorSide:'left'};
  M.elements.push(el);M.selEl=el.id;M.selected=null;mDraw();mShowElProps(el.id);
}

function mDeleteAt(ex,ey){
  // Kolona?
  for(var ci=0;ci<M.columns.length;ci++){
    var col=M.columns[ci];
    if(Math.abs(ex-(M.ox+col.x*M.sc))<12&&Math.abs(ey-(M.oy+col.y*M.sc))<12){
      M.columns.splice(ci,1);mDraw();mUpdateColBtn();return;
    }
  }
  var el=mElAt(ex,ey);
  if(el){M.elements=M.elements.filter(function(e){return e.id!==el.id;});M.selEl=null;mHideProps();mDraw();return;}
  var wx=(ex-M.ox)/M.sc,wy=(ey-M.oy)/M.sc;
  for(var i=M.rooms.length-1;i>=0;i--){
    var r=M.rooms[i];
    if(wx>=r.x&&wx<=r.x+r.w&&wy>=r.y&&wy<=r.y+r.h){
      M.elements=M.elements.filter(function(e){return e.roomId!==r.id;});
      M.rooms.splice(i,1);M.selected=null;mHideProps();mDraw();mCalc();return;
    }
  }
}

/* ─────────────── PANEL LEVÝ ─────────────── */
function mBuildPanel(){
  var el=document.getElementById('mRoomList');
  if(!el)return;
  var templates=M.floor===1?TEMPLATES_F1:TEMPLATES_F2;
  var stairsActive=M.floor===1||(M.rooms.some(function(r){return r.isStairs&&r.floor===1;}));

  var html='';

  // Tlačítko 2. patro (jen pokud jsou schody)
  var hasStairs=M.rooms.some(function(r){return r.isStairs&&r.floor===1;});
  html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px;">';
  html+='<button onclick="mSetFloor(1)" style="padding:6px 4px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(M.floor===1?'#4ade80':'#3a3a3a')+';background:'+(M.floor===1?'rgba(74,222,128,.2)':'transparent')+';color:'+(M.floor===1?'#4ade80':'#888')+';font-family:Arial;">🏠 1. patro</button>';
  html+='<button onclick="mSetFloor(2)" '+(hasStairs?'':'disabled title="Nejprve přidejte schody"')+' style="padding:6px 4px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(M.floor===2?'#a855f7':'#3a3a3a')+';background:'+(M.floor===2?'rgba(168,85,247,.2)':'transparent')+';color:'+(M.floor===2?'#a855f7':(hasStairs?'#888':'#555'))+';font-family:Arial;'+(hasStairs?'':'opacity:.5;')+'">'+(M.floor===2?'🔼 2. patro':'⬜ 2. patro')+'</button>';
  html+='</div>';

  // Schody + Kolona tlačítka (jen 1. patro)
  if(M.floor===1){
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:6px;">';
    html+='<button onclick="mAddStairs()" style="padding:6px 4px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid #f59e0b;background:rgba(245,158,11,.15);color:#f59e0b;font-family:Arial;">🪜 Schody</button>';
    html+='<button id="mBtnCol" onclick="mSetMode(\'column\')" style="padding:6px 4px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid #3a3a3a;background:transparent;color:#888;font-family:Arial;">🏛 Kolona</button>';
    html+='</div>';
  }

  html+='<div style="height:1px;background:#3a3a3a;margin-bottom:4px;"></div>';

  // Místnosti
  if(M.floor===2){
    html+='<div style="font-size:9px;color:#a855f7;font-weight:700;margin-bottom:4px;">📐 Místnosti 2. patra</div>';
    html+='<div style="font-size:9px;color:#888;margin-bottom:6px;">Umístění pouze na plochu 1. patra (nebo s kolonami)</div>';
  }

  templates.forEach(function(t){
    html+='<div onclick="sipMAdd(\''+t.name+'\',\''+t.color+'\','+t.w+','+t.h+')"'+
      ' style="display:flex;align-items:center;gap:7px;padding:7px 8px;border-radius:5px;background:#1a2520;border:1px solid #3a3a3a;cursor:pointer;margin-bottom:4px;transition:border-color .2s;"'+
      ' onmouseover="this.style.borderColor=\'#4ade80\'" onmouseout="this.style.borderColor=\'#3a3a3a\'">'+
      '<div style="width:8px;height:8px;border-radius:2px;background:'+t.color+';flex-shrink:0;"></div>'+
      '<span style="font-size:11px;font-weight:600;color:#fff;flex:1;">'+t.name+'</span>'+
      '<span style="font-size:9px;color:#666;">'+t.w+'×'+t.h+'</span></div>';
  });

  el.innerHTML=html;
}

/* ─────────────── SCHODY ─────────────────── */
function mAddStairs(){
  M.pending={name:'Schody',color:'#f59e0b',w:3,h:1.5,isStairs:true};
  M.mode='select';
  ['mBtnSelect','mBtnDoor','mBtnWin','mBtnDel'].forEach(function(id){
    var b=document.getElementById(id);if(b){b.style.background='transparent';b.style.color='#ccc';b.style.borderColor='#3a3a3a';}
  });
  if(M.cvs)M.cvs.style.cursor='crosshair';
  mDraw();
}

function mShowStairsPrompt(){
  // Po umístění schodů nabídneme tlačítko 2. patra
  mBuildPanel(); // přestavíme panel – tlačítko 2.p. se aktivuje
}

/* ─────────────── KOLONY ─────────────────── */
function mUpdateColBtn(warn){
  var btn=document.getElementById('mBtnCol');
  if(!btn)return;
  if(warn){
    btn.style.borderColor='#ef4444';btn.style.color='#ef4444';btn.style.background='rgba(239,68,68,.15)';
    btn.style.animation='pulse 1s infinite';
  } else {
    var isActive=(M.mode==='column');
    btn.style.borderColor=isActive?'#fbbf24':'#3a3a3a';
    btn.style.color=isActive?'#fbbf24':'#888';
    btn.style.background=isActive?'rgba(251,191,36,.2)':'transparent';
    btn.style.animation='';
  }
}

function mShowColWarning(needed){
  var warn=document.getElementById('mColWarn');
  if(!warn)return;
  warn.style.display='block';
  warn.innerHTML='⚠ Místnost přesahuje 1. patro!<br>Umístěte <b>'+needed.length+'</b> kolonu(y) 🏛 pod vyčnívající rohy, pak umístěte místnost znovu.';
  mSetMode('column'); // automaticky přepneme na kolony
  mUpdateColBtn(true);
}

/* ─────────────── FLOOR SWITCH ───────────── */
function mSetFloor(f){
  var hasStairs=M.rooms.some(function(r){return r.isStairs&&r.floor===1;});
  if(f===2&&!hasStairs){alert('Nejprve přidejte schodiště na 1. patro!');return;}
  M.floor=f; M.selected=null; M.selEl=null; M.pending=null;
  M.mode='select';
  var warn=document.getElementById('mColWarn');if(warn)warn.style.display='none';
  mBuildPanel(); mDraw(); mCalc();
}

/* ─────────────── ADD ROOM ───────────────── */
function sipMAdd(name,color,w,h){
  M.pending={name:name,color:color,w:parseFloat(w),h:parseFloat(h),isStairs:false,floor:M.floor};
  M.mode='select';
  ['mBtnSelect','mBtnDoor','mBtnWin','mBtnDel'].forEach(function(id){
    var b=document.getElementById(id);if(b){b.style.background='transparent';b.style.color='#ccc';b.style.borderColor='#3a3a3a';}
  });
  var ab=document.getElementById('mBtnSelect');
  if(ab){ab.style.background='rgba(74,222,128,.2)';ab.style.color='#4ade80';ab.style.borderColor='#4ade80';}
  if(M.cvs)M.cvs.style.cursor='crosshair';
  mDraw();
}

function mAddCustomRoom(){
  var name=(document.getElementById('mCustName')||{}).value||'Místnost';
  var w=parseFloat((document.getElementById('mCustW')||{}).value)||3;
  var h=parseFloat((document.getElementById('mCustH')||{}).value)||3;
  sipMAdd(name.trim()||'Místnost',COLORS[Math.floor(Math.random()*COLORS.length)],w,h);
}

function mSetMode(mode){
  M.mode=mode; M.pending=null;
  var map={select:'mBtnSelect',door:'mBtnDoor',window:'mBtnWin',delete:'mBtnDel'};
  ['mBtnSelect','mBtnDoor','mBtnWin','mBtnDel'].forEach(function(id){
    var b=document.getElementById(id);if(b){b.style.background='transparent';b.style.color='#ccc';b.style.borderColor='#3a3a3a';}
  });
  var ab=document.getElementById(map[mode]);
  if(ab){ab.style.background='rgba(74,222,128,.2)';ab.style.color='#4ade80';ab.style.borderColor='#4ade80';}
  mUpdateColBtn(false);
  if(mode==='column') mUpdateColBtn(false);
  mDraw();
}

function mSetInsulation(mm){
  M.insulation=mm;
  document.querySelectorAll('.mInsBt').forEach(function(b){
    var a=parseInt(b.dataset.mm)===mm;
    b.style.background=a?'#4ade80':'transparent';b.style.color=a?'#000':'#888';b.style.borderColor=a?'#4ade80':'#3a3a3a';
  });
  mDraw(); mCalc();
}

/* ─────────────── PROPS ──────────────────── */
function mShowProps(id){
  var r=M.rooms.find(function(r){return r.id===id;});if(!r)return;
  var p=document.getElementById('mPropsPanel');if(!p)return;
  var floorBadge=r.floor===2?'<span style="background:#a855f7;color:#fff;font-size:9px;padding:2px 6px;border-radius:3px;margin-left:6px;">2. patro</span>':'';
  p.innerHTML=
    '<div style="font-size:10px;font-weight:700;color:'+(r.isStairs?'#f59e0b':'#4ade80')+';text-transform:uppercase;margin-bottom:10px;">'+(r.isStairs?'🪜 Schody':'✏️ Místnost')+floorBadge+'</div>'+
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:3px;">Název</div>'+
    '<input id="mRName" value="'+r.name+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;box-sizing:border-box;" oninput="mUpdateRoom('+id+')"></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">'+
    '<div><div style="font-size:11px;color:#888;margin-bottom:3px;">Šířka (m)</div>'+
    '<input id="mRW" type="number" min="0.5" max="30" step="0.1" value="'+r.w.toFixed(1)+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom('+id+')"></div>'+
    '<div><div style="font-size:11px;color:#888;margin-bottom:3px;">Hloubka (m)</div>'+
    '<input id="mRH" type="number" min="0.5" max="30" step="0.1" value="'+r.h.toFixed(1)+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom('+id+')"></div></div>'+
    (!r.isStairs?'<div style="margin-bottom:10px;"><div style="font-size:11px;color:#888;margin-bottom:5px;">Barva</div>'+
    '<div style="display:flex;gap:5px;flex-wrap:wrap;">'+
    COLORS.map(function(c){return '<div onclick="mSetColor('+id+',\''+c+'\')" style="width:20px;height:20px;border-radius:3px;background:'+c+';cursor:pointer;border:2px solid '+(c===r.color?'#fff':'transparent')+'"></div>';}).join('')+
    '</div></div>':'')+
    '<div style="font-size:12px;font-weight:700;color:'+(r.isStairs?'#f59e0b':'#4ade80')+';">'+(r.isStairs?'Plocha schodiště: ':'Plocha: ')+(r.w*r.h).toFixed(1)+' m²</div>'+
    (r.isStairs?'<div style="font-size:10px;color:#888;margin-top:4px;">Odečtena z obytné plochy</div>':'')+
    '<button onclick="mDeleteRoom('+id+')" style="width:100%;margin-top:10px;padding:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:Arial;">🗑 Smazat</button>';
  p.style.display='block';
}

function mShowElProps(id){
  var el=M.elements.find(function(e){return e.id===id;});if(!el)return;
  var p=document.getElementById('mPropsPanel');if(!p)return;
  var tl=el.type==='door'?'🚪 Dveře':'🪟 Okno';
  var doorExtra=el.type==='door'?
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:5px;">Směr otevírání</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">'+
    '<button onclick="mElProp('+id+',\'doorDir\',\'in\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorDir==='in'?'#4ade80':'#3a3a3a')+';background:'+(el.doorDir==='in'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorDir==='in'?'#4ade80':'#888')+';font-family:Arial;">↓ Dovnitř</button>'+
    '<button onclick="mElProp('+id+',\'doorDir\',\'out\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorDir==='out'?'#4ade80':'#3a3a3a')+';background:'+(el.doorDir==='out'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorDir==='out'?'#4ade80':'#888')+';font-family:Arial;">↑ Ven</button>'+
    '</div></div>'+
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:5px;">Strana závěsu</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">'+
    '<button onclick="mElProp('+id+',\'doorSide\',\'left\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorSide==='left'?'#4ade80':'#3a3a3a')+';background:'+(el.doorSide==='left'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorSide==='left'?'#4ade80':'#888')+';font-family:Arial;">◀ Vlevo</button>'+
    '<button onclick="mElProp('+id+',\'doorSide\',\'right\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorSide==='right'?'#4ade80':'#3a3a3a')+';background:'+(el.doorSide==='right'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorSide==='right'?'#4ade80':'#888')+';font-family:Arial;">▶ Vpravo</button>'+
    '</div></div>':'';
  p.innerHTML='<div style="font-size:10px;font-weight:700;color:#f59e0b;text-transform:uppercase;margin-bottom:10px;">'+tl+'</div>'+
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:3px;">Šířka (m)</div>'+
    '<input id="mElW" type="number" min="0.5" max="4" step="0.1" value="'+el.width.toFixed(1)+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateEl('+id+')"></div>'+
    doorExtra+
    '<button onclick="mDeleteEl('+id+')" style="width:100%;margin-top:10px;padding:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:Arial;">🗑 Smazat</button>';
  p.style.display='block';
}

function mHideProps(){
  var p=document.getElementById('mPropsPanel');
  if(p)p.innerHTML='<div style="color:#888;font-size:12px;text-align:center;padding:20px 0;">Vyberte místnost nebo prvek<br><span style="font-size:11px;opacity:.6;">Dvojklik = přejmenovat</span></div>';
}

function mUpdateRoom(id){
  var r=M.rooms.find(function(r){return r.id===id;});if(!r)return;
  var n=document.getElementById('mRName'),w=document.getElementById('mRW'),h=document.getElementById('mRH');
  if(n)r.name=n.value||r.name;if(w)r.w=Math.max(.5,parseFloat(w.value)||r.w);if(h)r.h=Math.max(.5,parseFloat(h.value)||r.h);
  mDraw();mCalc();
}
function mUpdatePropsLive(id){
  var r=M.rooms.find(function(r){return r.id===id;});if(!r)return;
  var w=document.getElementById('mRW'),h=document.getElementById('mRH');
  if(w)w.value=r.w.toFixed(1);if(h)h.value=r.h.toFixed(1);
}
function mSetColor(id,color){var r=M.rooms.find(function(r){return r.id===id;});if(r){r.color=color;mDraw();mShowProps(id);}}
function mUpdateEl(id){var el=M.elements.find(function(e){return e.id===id;});if(!el)return;var w=document.getElementById('mElW');if(w)el.width=Math.max(.4,parseFloat(w.value)||el.width);mDraw();}
function mElProp(id,prop,val){var el=M.elements.find(function(e){return e.id===id;});if(el){el[prop]=val;mDraw();mShowElProps(id);}}
function mDeleteRoom(id){
  M.rooms=M.rooms.filter(function(r){return r.id!==id;});
  M.elements=M.elements.filter(function(e){return e.roomId!==id;});
  M.selected=null;mHideProps();mDraw();mCalc();mBuildPanel();
}
function mDeleteEl(id){M.elements=M.elements.filter(function(e){return e.id!==id;});M.selEl=null;mHideProps();mDraw();}

/* ─────────────── KALKULACE ──────────────── */
function mCalcBuildingArea(){
  var f1=M.rooms.filter(function(r){return r.floor===1&&!r.isStairs;});
  var f2=M.rooms.filter(function(r){return r.floor===2&&!r.isStairs;});
  var stairs=M.rooms.filter(function(r){return r.isStairs;});
  if(!f1.length)return{rooms1:0,rooms2:0,stairsA:0,walls:0,ext:0,building:0,innerW:0,innerH:0,outerW:0,outerH:0};
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  f1.forEach(function(r){minX=Math.min(minX,r.x);minY=Math.min(minY,r.y);maxX=Math.max(maxX,r.x+r.w);maxY=Math.max(maxY,r.y+r.h);});
  var rooms1A=f1.reduce(function(s,r){return s+r.w*r.h;},0);
  var rooms2A=f2.reduce(function(s,r){return s+r.w*r.h;},0);
  var stairsA=stairs.reduce(function(s,r){return s+r.w*r.h;},0);
  var innerW=maxX-minX,innerH=maxY-minY,innerArea=innerW*innerH;
  var extWall=M.insulation/1000;
  var outerW=innerW+extWall*2,outerH=innerH+extWall*2;
  var buildingArea=outerW*outerH;
  return{
    rooms1:rooms1A,rooms2:rooms2A,stairsA:stairsA,
    living:rooms1A-stairsA+rooms2A,
    walls:innerArea-rooms1A-stairsA,
    ext:buildingArea-innerArea,
    building:buildingArea,
    innerW:innerW,innerH:innerH,outerW:outerW,outerH:outerH
  };
}

function mCalc(){
  var ba=mCalcBuildingArea();
  var tot=ba.living||0;
  var im={100:.88,160:1,200:1.12,250:1.28};
  var matE=280*(im[M.insulation]||1)*tot;
  var dopE=tot<=80?1200:tot<=150?1500:1800;
  var monE=tot*120;
  var C=25,totE=matE+dopE+monE,rdKc=tot*1200*C,save=rdKc-totE*C;
  var hasR=M.rooms.filter(function(r){return !r.isStairs;}).length>0;

  function s(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
  s('mma',     hasR?ba.building.toFixed(1)+' m²':'—');
  s('mmaDim',  hasR?ba.outerW.toFixed(2)+' × '+ba.outerH.toFixed(2)+' m':'');
  s('mmaRooms',hasR?ba.living.toFixed(1)+' m²':'—');
  s('mmaWalls',hasR?ba.walls.toFixed(1)+' m²':'—');
  s('mmaExt',  hasR?ba.ext.toFixed(1)+' m²':'—');
  s('mmWallT', Math.round(WALL_T*100));
  s('mmInsT',  M.insulation);
  s('mmDims',  hasR?ba.innerW.toFixed(1)+'×'+ba.innerH.toFixed(1)+' m':'—');
  s('mmr', M.rooms.filter(function(r){return !r.isStairs&&r.floor===1;}).length+
          (M.rooms.some(function(r){return r.floor===2;})?'+'+M.rooms.filter(function(r){return r.floor===2;}).length+'(2p)':''));
  s('mmm',hasR?'€ '+Math.round(matE).toLocaleString('cs-CZ'):'—');
  s('mmd',hasR?'€ '+Math.round(dopE).toLocaleString('cs-CZ'):'—');
  s('mmn',hasR?'€ '+Math.round(monE).toLocaleString('cs-CZ'):'—');
  s('mmt',hasR?Math.round(totE*C).toLocaleString('cs-CZ')+' Kč':'—');
  s('mms',hasR?'vs RD: -'+Math.round(save).toLocaleString('cs-CZ')+' Kč':'');

  // Rozpad
  var f1a=ba.rooms1.toFixed(1), f2a=ba.rooms2.toFixed(1), sta=ba.stairsA.toFixed(1);
  var breakdown='';
  if(hasR){
    breakdown='1.p: '+f1a+' m²';
    if(ba.stairsA>0)breakdown+=' (−'+sta+' schody)';
    if(ba.rooms2>0)breakdown+='  +  2.p: '+f2a+' m²';
  }
  s('mmaBreakdown', breakdown);

  var list=document.getElementById('mmlist');
  if(list){
    if(M.rooms.length){
      list.innerHTML=M.rooms.map(function(r){
        return '<div style="display:flex;align-items:center;gap:5px;padding:4px 0;border-bottom:1px solid #3a3a3a;">'+
          '<div style="width:8px;height:8px;border-radius:2px;background:'+(r.isStairs?'#f59e0b':r.color)+';flex-shrink:0;"></div>'+
          '<span style="flex:1;font-size:11px;color:#ccc;">'+(r.floor===2?'[2p] ':'')+r.name+(r.isStairs?' 🪜':'')+'</span>'+
          '<span style="font-size:11px;color:'+(r.isStairs?'#f59e0b':'#4ade80')+';font-weight:700;">'+(r.isStairs?'-':'')+(r.w*r.h).toFixed(1)+' m²</span>'+
          '</div>';
      }).join('');
    } else list.textContent='Zatím prázdné';
  }
}

/* ─────────────── ZOOM ───────────────────── */
function sipMZoom(f){
  if(f===0){M.sc=36;M.ox=60;M.oy=60;}
  else{M.ox=M.cw/2+(M.ox-M.cw/2)*f;M.oy=M.ch/2+(M.oy-M.ch/2)*f;M.sc=Math.max(12,Math.min(160,M.sc*f));}
  mDraw();
}

function sipMCalc(){mCalc();}
window.sipMInit=sipMInit;window.sipMZoom=sipMZoom;window.sipMCalc=sipMCalc;
window.sipMAdd=sipMAdd;window.mSetMode=mSetMode;window.mSetInsulation=mSetInsulation;
window.mAddCustomRoom=mAddCustomRoom;window.mUpdateRoom=mUpdateRoom;
window.mUpdateEl=mUpdateEl;window.mElProp=mElProp;window.mSetColor=mSetColor;
window.mDeleteRoom=mDeleteRoom;window.mDeleteEl=mDeleteEl;window.mSetFloor=mSetFloor;
