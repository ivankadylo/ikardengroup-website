/* ═══════════════════════════════════════════════════════════
   IKARDEN SIP MODELÁŘ v3.0
   Fixes: all buttons work, pan, resize with 0.1m snap,
   doors/windows as panel buttons, terrace added
   ═══════════════════════════════════════════════════════════ */

var M = {
  rooms: [], elements: [],
  sc: 36, ox: 60, oy: 60,
  drag: null,       // {room, dx, dy}
  resize: null,     // {room, handle, startX, startY, origW, origH, origX, origY}
  pan: null,        // {startX, startY, origOX, origOY}
  selected: null,
  selEl: null,
  mode: 'select',
  pending: null,
  insulation: 160,
  cvs: null, ctx: null, cw: 0, ch: 0,
  nextId: 1, nextElId: 1,
};

var COLORS = ['#3b82f6','#a855f7','#f59e0b','#06b6d4','#4ade80','#f97316','#ec4899','#9ca3af','#6b7280','#84cc16'];

var TEMPLATES = [
  {name:'Obývací pokoj', color:'#3b82f6', w:6,   h:4},
  {name:'Kuchyň',        color:'#f59e0b', w:3,   h:4},
  {name:'Ložnice',       color:'#a855f7', w:4,   h:4},
  {name:'Dětský pokoj',  color:'#06b6d4', w:3,   h:3},
  {name:'Koupelna',      color:'#4ade80', w:2.5, h:2},
  {name:'Zádveří',       color:'#9ca3af', w:2,   h:2},
  {name:'Garáž',         color:'#6b7280', w:6,   h:3},
  {name:'Pracovna',      color:'#ec4899', w:3,   h:3},
  {name:'Spíž',          color:'#f97316', w:1.5, h:2},
  {name:'Terasa',        color:'#84cc16', w:5,   h:3},
];

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
function sipMInit() {
  var cvs = document.getElementById('sipC');
  if (!cvs || cvs._mInit) return;
  cvs._mInit = true;
  M.cvs = cvs;
  M.ctx = cvs.getContext('2d');
  mResize();
  cvs.addEventListener('mousedown',  mMD);
  cvs.addEventListener('mousemove',  mMV);
  cvs.addEventListener('mouseup',    mMU);
  cvs.addEventListener('mouseleave', mMU);
  cvs.addEventListener('dblclick',   mDbl);
  cvs.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      var f = e.deltaY < 0 ? 1.12 : 0.9;
      M.ox = M.cw/2 + (M.ox - M.cw/2)*f;
      M.oy = M.ch/2 + (M.oy - M.ch/2)*f;
      M.sc = Math.max(12, Math.min(160, M.sc*f));
    } else {
      // Pan
      M.ox -= e.deltaX * 0.8;
      M.oy -= e.deltaY * 0.8;
    }
    mDraw();
  }, {passive:false});
  window.addEventListener('resize', mResize);
  mBuildPanel();
  mDraw();
  mCalc();
}

function mResize() {
  var w = document.getElementById('sipCW');
  if (!w || !M.cvs) return;
  M.cw = M.cvs.width  = w.clientWidth;
  M.ch = M.cvs.height = w.clientHeight;
  mDraw();
}

/* ══════════════════════════════════════════════════════════
   МАЛЮВАННЯ
   ══════════════════════════════════════════════════════════ */
function mDraw() {
  if (!M.ctx) return;
  var c = M.ctx;
  c.clearRect(0, 0, M.cw, M.ch);

  // Сітка
  c.strokeStyle = 'rgba(255,255,255,.05)';
  c.lineWidth = 1;
  for (var x = M.ox % M.sc; x < M.cw; x += M.sc) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, M.ch); c.stroke();
  }
  for (var y = M.oy % M.sc; y < M.ch; y += M.sc) {
    c.beginPath(); c.moveTo(0, y); c.lineTo(M.cw, y); c.stroke();
  }

  // Осі
  c.strokeStyle = 'rgba(74,222,128,.2)'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(M.ox,0); c.lineTo(M.ox,M.ch); c.stroke();
  c.beginPath(); c.moveTo(0,M.oy); c.lineTo(M.cw,M.oy); c.stroke();

  if (!M.rooms.length) {
    c.save(); c.globalAlpha = .3; c.fillStyle = '#fff';
    c.font = '14px Arial'; c.textAlign = 'center';
    c.fillText('Klikněte na místnost vlevo → umístěte na plán', M.cw/2, M.ch/2 - 8);
    c.font = '12px Arial';
    c.fillText('Poté přidejte dveře 🚪 a okna 🪟 z levého panelu', M.cw/2, M.ch/2 + 14);
    c.restore();
    return;
  }

  // Izolace
  mDrawIns(c);

  // Místnosti
  M.rooms.forEach(function(r) {
    var px = M.ox + r.x*M.sc, py = M.oy + r.y*M.sc;
    var pw = r.w*M.sc, ph = r.h*M.sc;
    var sel = (r.id === M.selected);

    c.globalAlpha = .18; c.fillStyle = r.color;
    c.fillRect(px, py, pw, ph); c.globalAlpha = 1;

    c.strokeStyle = sel ? '#4ade80' : r.color;
    c.lineWidth   = sel ? 2.5 : 1.8;
    c.strokeRect(px+.5, py+.5, pw-1, ph-1);

    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    var fs = Math.max(9, Math.min(13, pw / (r.name.length * 0.65)));
    c.font = 'bold ' + fs + 'px Arial';
    c.fillText(r.name, px+pw/2, py+ph/2 - 7);
    c.fillStyle = r.color; c.font = '9px Arial';
    c.fillText(r.w.toFixed(1) + '×' + r.h.toFixed(1) + ' m', px+pw/2, py+ph/2+7);

    if (sel) mDrawHandles(c, px, py, pw, ph);
  });

  // Dvere a okna
  M.elements.forEach(function(el) { mDrawEl(c, el); });

  // Cursor
  var cur = 'default';
  if (M.pending) cur = 'crosshair';
  else if (M.mode === 'door' || M.mode === 'window') cur = 'cell';
  else if (M.mode === 'delete') cur = 'not-allowed';
  else if (M.pan) cur = 'grabbing';
  M.cvs.style.cursor = cur;
}

function mDrawIns(c) {
  if (!M.rooms.length) return;
  var ins = M.insulation / 1000 * M.sc;
  c.save();
  c.strokeStyle = 'rgba(74,222,128,.45)';
  c.lineWidth = Math.max(3, ins);
  M.rooms.forEach(function(r) {
    var h = ins / 2;
    c.strokeRect(
      M.ox + r.x*M.sc - h,
      M.oy + r.y*M.sc - h,
      r.w*M.sc + ins,
      r.h*M.sc + ins
    );
  });
  if (M.rooms.length > 0) {
    var r0 = M.rooms[0];
    c.fillStyle = 'rgba(74,222,128,.6)';
    c.font = '9px Arial'; c.textAlign = 'left';
    c.fillText('izolace ' + M.insulation + ' mm',
      M.ox + r0.x*M.sc - ins/2 - 2,
      M.oy + r0.y*M.sc - ins/2 - 6
    );
  }
  c.restore();
}

function mDrawHandles(c, px, py, pw, ph) {
  var hs = 8;
  [[px+pw-hs/2, py+ph-hs/2],[px+pw/2-hs/2, py+ph-hs/2],[px+pw-hs/2, py+ph/2-hs/2]].forEach(function(h) {
    c.fillStyle = '#4ade80'; c.fillRect(h[0], h[1], hs, hs);
  });
}

function mDrawEl(c, el) {
  var room = M.rooms.find(function(r){ return r.id === el.roomId; });
  if (!room) return;
  var px = M.ox+room.x*M.sc, py = M.oy+room.y*M.sc;
  var pw = room.w*M.sc, ph = room.h*M.sc;
  var ew = el.width * M.sc;
  var sel = (el.id === M.selEl);

  c.save();
  c.strokeStyle = sel ? '#f59e0b' : (el.type==='door' ? '#fff' : '#60a5fa');
  c.fillStyle   = c.strokeStyle;
  c.lineWidth   = sel ? 2.5 : 2;

  var x1, y1, x2, y2;
  if (el.wall==='top')    { x1=px+el.pos*pw; y1=py;    x2=x1+ew; y2=y1; }
  if (el.wall==='bottom') { x1=px+el.pos*pw; y1=py+ph; x2=x1+ew; y2=y1; }
  if (el.wall==='left')   { x1=px;    y1=py+el.pos*ph; x2=x1; y2=y1+ew; }
  if (el.wall==='right')  { x1=px+pw; y1=py+el.pos*ph; x2=x1; y2=y1+ew; }

  c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke();

  if (el.type==='window') {
    var off = (el.wall==='top'?-5:el.wall==='bottom'?5:0);
    var off2= (el.wall==='left'?-5:el.wall==='right'?5:0);
    c.globalAlpha=.5;
    for (var i=1;i<=2;i++){
      c.beginPath();
      c.moveTo(x1+off2*i, y1+off*i);
      c.lineTo(x2+off2*i, y2+off*i);
      c.stroke();
    }
    c.globalAlpha=1;
    c.font='10px Arial'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText('⊞', (x1+x2)/2+(off2?off2*3:0), (y1+y2)/2+(off?off*3:0));
  } else {
    // Door arc
    var hx = el.doorSide==='left' ? x1 : x2;
    var hy = el.doorSide==='left' ? y1 : y2;
    var inside = el.doorDir==='in';
    var arcR = ew;
    c.beginPath();
    if (el.wall==='top'||el.wall==='bottom') {
      var dy = (el.wall==='top') ? (inside?arcR:-arcR) : (inside?-arcR:arcR);
      c.moveTo(hx, hy);
      c.lineTo(hx, hy+dy);
      c.moveTo(hx, hy);
      var aStart = el.doorSide==='left' ? (inside?0:0) : (inside?Math.PI:Math.PI);
      var aEnd   = el.doorSide==='left' ? (inside?Math.PI/2:-Math.PI/2) : (inside?-Math.PI/2:Math.PI/2);
      c.arc(hx, hy, arcR, aStart + (el.wall==='bottom'?Math.PI:0), aEnd + (el.wall==='bottom'?Math.PI:0), el.doorSide==='right');
    } else {
      var dx = (el.wall==='left') ? (inside?arcR:-arcR) : (inside?-arcR:arcR);
      c.moveTo(hx, hy);
      c.lineTo(hx+dx, hy);
      c.moveTo(hx, hy);
      var bStart = el.doorSide==='left' ? Math.PI/2 : -Math.PI/2;
      var bEnd   = el.doorSide==='left' ? (inside?0:Math.PI) : (inside?Math.PI:0);
      c.arc(hx, hy, arcR, bStart + (el.wall==='right'?Math.PI:0), bEnd + (el.wall==='right'?Math.PI:0), el.doorSide==='right');
    }
    c.stroke();
    c.font='bold 10px Arial'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText('D', (x1+x2)/2, (y1+y2)/2);
  }
  c.restore();
}

/* ══════════════════════════════════════════════════════════
   MOUSE EVENTS
   ══════════════════════════════════════════════════════════ */
function mMD(e) {
  var wx = (e.offsetX - M.ox) / M.sc;
  var wy = (e.offsetY - M.oy) / M.sc;

  // Pending room placement
  if (M.pending) {
    var r = {
      id: M.nextId++, name: M.pending.name, color: M.pending.color,
      x: mSnap(wx - M.pending.w/2), y: mSnap(wy - M.pending.h/2),
      w: M.pending.w, h: M.pending.h
    };
    M.rooms.push(r);
    M.pending = null;
    M.selected = r.id;
    mDraw(); mCalc(); mShowProps(r.id);
    return;
  }

  // Place door/window on wall
  if (M.mode==='door' || M.mode==='window') {
    mPlaceEl(e.offsetX, e.offsetY);
    return;
  }

  // Delete mode
  if (M.mode==='delete') {
    mDeleteAt(e.offsetX, e.offsetY);
    return;
  }

  // Middle mouse or space+drag = pan
  if (e.button === 1 || e.altKey) {
    M.pan = {startX: e.clientX, startY: e.clientY, origOX: M.ox, origOY: M.oy};
    return;
  }

  // Try element select
  var el = mElAt(e.offsetX, e.offsetY);
  if (el) {
    M.selEl = el.id; M.selected = null;
    mShowElProps(el.id); mDraw(); return;
  }

  // Try resize handle
  if (M.selected) {
    var room = M.rooms.find(function(r){ return r.id===M.selected; });
    if (room) {
      var handle = mHandleAt(room, e.offsetX, e.offsetY);
      if (handle) {
        M.resize = {
          room: room, handle: handle,
          startX: wx, startY: wy,
          origW: room.w, origH: room.h,
          origX: room.x, origY: room.y
        };
        return;
      }
    }
  }

  // Try room select/drag
  var hit = null;
  for (var i = M.rooms.length-1; i >= 0; i--) {
    var r2 = M.rooms[i];
    if (wx>=r2.x && wx<=r2.x+r2.w && wy>=r2.y && wy<=r2.y+r2.h) {
      hit = r2; break;
    }
  }

  M.selEl = null;
  if (hit) {
    M.selected = hit.id;
    M.drag = {room: hit, dx: wx-hit.x, dy: wy-hit.y};
    mShowProps(hit.id);
  } else {
    M.selected = null;
    mHideProps();
    // Pan when clicking empty area
    M.pan = {startX: e.clientX, startY: e.clientY, origOX: M.ox, origOY: M.oy};
  }
  mDraw();
}

function mMV(e) {
  var wx = (e.offsetX - M.ox) / M.sc;
  var wy = (e.offsetY - M.oy) / M.sc;

  if (M.pan) {
    M.ox = M.pan.origOX + (e.clientX - M.pan.startX);
    M.oy = M.pan.origOY + (e.clientY - M.pan.startY);
    mDraw(); return;
  }

  if (M.drag) {
    M.drag.room.x = mSnap(wx - M.drag.dx);
    M.drag.room.y = mSnap(wy - M.drag.dy);
    mDraw(); mCalc(); mUpdatePropsLive(M.drag.room.id); return;
  }

  if (M.resize) {
    var r = M.resize.room;
    var dw = wx - M.resize.startX;
    var dh = wy - M.resize.startY;
    if (M.resize.handle==='se') {
      r.w = Math.max(0.5, mSnap(M.resize.origW + dw));
      r.h = Math.max(0.5, mSnap(M.resize.origH + dh));
    } else if (M.resize.handle==='s') {
      r.h = Math.max(0.5, mSnap(M.resize.origH + dh));
    } else if (M.resize.handle==='e') {
      r.w = Math.max(0.5, mSnap(M.resize.origW + dw));
    }
    mDraw(); mCalc(); mUpdatePropsLive(r.id);
  }
}

function mMU(e) {
  if (M.pan && M.drag === null && M.resize === null) {
    // If we panned only a little, treat as deselect
  }
  M.drag = null; M.resize = null; M.pan = null;
  M.cvs.style.cursor = 'default';
}

function mDbl(e) {
  var wx = (e.offsetX - M.ox) / M.sc;
  var wy = (e.offsetY - M.oy) / M.sc;
  for (var i = M.rooms.length-1; i >= 0; i--) {
    var r = M.rooms[i];
    if (wx>=r.x && wx<=r.x+r.w && wy>=r.y && wy<=r.y+r.h) {
      var name = prompt('Přejmenovat místnost:', r.name);
      if (name !== null && name.trim()) {
        r.name = name.trim(); mDraw(); mShowProps(r.id);
      }
      return;
    }
  }
}

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */
function mSnap(v) { return Math.round(v * 10) / 10; } // snap to 0.1m = 10cm

function mHandleAt(room, ex, ey) {
  var px = M.ox+room.x*M.sc, py = M.oy+room.y*M.sc;
  var pw = room.w*M.sc, ph = room.h*M.sc;
  var hs = 12;
  if (Math.abs(ex-(px+pw))<hs && Math.abs(ey-(py+ph))<hs) return 'se';
  if (Math.abs(ex-(px+pw/2))<hs && Math.abs(ey-(py+ph))<hs) return 's';
  if (Math.abs(ex-(px+pw))<hs && Math.abs(ey-(py+ph/2))<hs) return 'e';
  return null;
}

function mElAt(ex, ey) {
  for (var i=0; i<M.elements.length; i++) {
    var el = M.elements[i];
    var room = M.rooms.find(function(r){ return r.id===el.roomId; });
    if (!room) continue;
    var pt = mElCenter(el, room);
    if (Math.abs(ex-pt.x)<14 && Math.abs(ey-pt.y)<14) return el;
  }
  return null;
}

function mElCenter(el, room) {
  var px=M.ox+room.x*M.sc, py=M.oy+room.y*M.sc;
  var pw=room.w*M.sc, ph=room.h*M.sc;
  var ew=el.width*M.sc, p=el.pos;
  if (el.wall==='top')    return {x:px+p*pw+ew/2, y:py};
  if (el.wall==='bottom') return {x:px+p*pw+ew/2, y:py+ph};
  if (el.wall==='left')   return {x:px,            y:py+p*ph+ew/2};
  return                         {x:px+pw,          y:py+p*ph+ew/2};
}

function mPlaceEl(ex, ey) {
  var best=null, bestD=16;
  M.rooms.forEach(function(room) {
    var px=M.ox+room.x*M.sc, py=M.oy+room.y*M.sc;
    var pw=room.w*M.sc, ph=room.h*M.sc;
    [
      {id:'top',    d:Math.abs(ey-py),    pos:(ex-px)/pw, ok:ex>=px&&ex<=px+pw},
      {id:'bottom', d:Math.abs(ey-py-ph), pos:(ex-px)/pw, ok:ex>=px&&ex<=px+pw},
      {id:'left',   d:Math.abs(ex-px),    pos:(ey-py)/ph, ok:ey>=py&&ey<=py+ph},
      {id:'right',  d:Math.abs(ex-px-pw), pos:(ey-py)/ph, ok:ey>=py&&ey<=py+ph},
    ].forEach(function(w) {
      if (w.ok && w.d<bestD && w.pos>=0 && w.pos<=1) {
        bestD=w.d; best={room:room, wall:w.id, pos:Math.max(0,Math.min(0.8,w.pos-0.1))};
      }
    });
  });
  if (!best) return;
  var el = {
    id:M.nextElId++, type:M.mode,
    roomId:best.room.id, wall:best.wall, pos:best.pos,
    width: M.mode==='door' ? 0.9 : 1.2,
    doorDir:'in', doorSide:'left'
  };
  M.elements.push(el);
  M.selEl=el.id; M.selected=null;
  mDraw(); mShowElProps(el.id);
}

function mDeleteAt(ex, ey) {
  var el = mElAt(ex, ey);
  if (el) {
    M.elements = M.elements.filter(function(e){ return e.id!==el.id; });
    M.selEl=null; mHideProps(); mDraw(); return;
  }
  var wx=(ex-M.ox)/M.sc, wy=(ey-M.oy)/M.sc;
  for (var i=M.rooms.length-1; i>=0; i--) {
    var r=M.rooms[i];
    if (wx>=r.x&&wx<=r.x+r.w&&wy>=r.y&&wy<=r.y+r.h) {
      M.elements=M.elements.filter(function(e){ return e.roomId!==r.id; });
      M.rooms.splice(i,1); M.selected=null;
      mHideProps(); mDraw(); mCalc(); return;
    }
  }
}

/* ══════════════════════════════════════════════════════════
   PANEL PROPS
   ══════════════════════════════════════════════════════════ */
function mShowProps(id) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (!r) return;
  var p = document.getElementById('mPropsPanel');
  if (!p) return;
  p.innerHTML =
    '<div style="font-size:10px;font-weight:700;color:#4ade80;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">✏️ Místnost</div>' +
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:3px;">Název</div>' +
    '<input id="mRName" value="'+r.name+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;box-sizing:border-box;" oninput="mUpdateRoom('+id+')"></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">' +
    '<div><div style="font-size:11px;color:#888;margin-bottom:3px;">Šířka (m)</div>' +
    '<input id="mRW" type="number" min="0.5" max="30" step="0.1" value="'+r.w.toFixed(1)+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom('+id+')"></div>' +
    '<div><div style="font-size:11px;color:#888;margin-bottom:3px;">Hloubka (m)</div>' +
    '<input id="mRH" type="number" min="0.5" max="30" step="0.1" value="'+r.h.toFixed(1)+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom('+id+')"></div></div>' +
    '<div style="margin-bottom:10px;"><div style="font-size:11px;color:#888;margin-bottom:5px;">Barva</div>' +
    '<div style="display:flex;gap:5px;flex-wrap:wrap;">' +
    COLORS.map(function(c){ return '<div onclick="mSetColor('+id+',\''+c+'\')" style="width:20px;height:20px;border-radius:3px;background:'+c+';cursor:pointer;border:2px solid '+(c===r.color?'#fff':'transparent')+'"></div>'; }).join('') +
    '</div></div>' +
    '<div style="font-size:12px;font-weight:700;color:#4ade80;">Plocha: '+(r.w*r.h).toFixed(1)+' m²</div>' +
    '<button onclick="mDeleteRoom('+id+')" style="width:100%;margin-top:10px;padding:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:Arial;">🗑 Smazat místnost</button>';
  p.style.display = 'block';
}

function mShowElProps(id) {
  var el = M.elements.find(function(e){ return e.id===id; });
  if (!el) return;
  var p = document.getElementById('mPropsPanel');
  if (!p) return;
  var tl = el.type==='door' ? '🚪 Dveře' : '🪟 Okno';
  var doorExtra = el.type==='door' ?
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:5px;">Směr otevírání</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">' +
    '<button onclick="mElProp('+id+',\'doorDir\',\'in\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorDir==='in'?'#4ade80':'#3a3a3a')+';background:'+(el.doorDir==='in'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorDir==='in'?'#4ade80':'#888')+';font-family:Arial;">↓ Dovnitř</button>' +
    '<button onclick="mElProp('+id+',\'doorDir\',\'out\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorDir==='out'?'#4ade80':'#3a3a3a')+';background:'+(el.doorDir==='out'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorDir==='out'?'#4ade80':'#888')+';font-family:Arial;">↑ Ven</button>' +
    '</div></div>' +
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:5px;">Strana závěsu</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">' +
    '<button onclick="mElProp('+id+',\'doorSide\',\'left\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorSide==='left'?'#4ade80':'#3a3a3a')+';background:'+(el.doorSide==='left'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorSide==='left'?'#4ade80':'#888')+';font-family:Arial;">◀ Vlevo</button>' +
    '<button onclick="mElProp('+id+',\'doorSide\',\'right\')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid '+(el.doorSide==='right'?'#4ade80':'#3a3a3a')+';background:'+(el.doorSide==='right'?'rgba(74,222,128,.2)':'transparent')+';color:'+(el.doorSide==='right'?'#4ade80':'#888')+';font-family:Arial;">▶ Vpravo</button>' +
    '</div></div>' : '';

  p.innerHTML =
    '<div style="font-size:10px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">'+tl+'</div>' +
    '<div style="margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:3px;">Šířka (m)</div>' +
    '<input id="mElW" type="number" min="0.5" max="4" step="0.1" value="'+el.width.toFixed(1)+'" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateEl('+id+')"></div>' +
    doorExtra +
    '<button onclick="mDeleteEl('+id+')" style="width:100%;margin-top:10px;padding:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:Arial;">🗑 Smazat</button>';
  p.style.display = 'block';
}

function mHideProps() {
  var p = document.getElementById('mPropsPanel');
  if (p) p.innerHTML = '<div style="color:#888;font-size:12px;text-align:center;padding:20px 0;">Vyberte místnost nebo prvek<br><span style="font-size:11px;opacity:.6;">Dvojklik = přejmenovat</span></div>';
}

function mUpdateRoom(id) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (!r) return;
  var n=document.getElementById('mRName'), w=document.getElementById('mRW'), h=document.getElementById('mRH');
  if (n) r.name = n.value || r.name;
  if (w) r.w = Math.max(0.5, parseFloat(w.value)||r.w);
  if (h) r.h = Math.max(0.5, parseFloat(h.value)||r.h);
  mDraw(); mCalc();
}

function mUpdatePropsLive(id) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (!r) return;
  var w=document.getElementById('mRW'), h=document.getElementById('mRH');
  if (w) w.value = r.w.toFixed(1);
  if (h) h.value = r.h.toFixed(1);
}

function mSetColor(id, color) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (r) { r.color=color; mDraw(); mShowProps(id); }
}

function mUpdateEl(id) {
  var el = M.elements.find(function(e){ return e.id===id; });
  if (!el) return;
  var w=document.getElementById('mElW');
  if (w) el.width = Math.max(0.4, parseFloat(w.value)||el.width);
  mDraw();
}

function mElProp(id, prop, val) {
  var el = M.elements.find(function(e){ return e.id===id; });
  if (el) { el[prop]=val; mDraw(); mShowElProps(id); }
}

function mDeleteRoom(id) {
  M.rooms = M.rooms.filter(function(r){ return r.id!==id; });
  M.elements = M.elements.filter(function(e){ return e.roomId!==id; });
  M.selected=null; mHideProps(); mDraw(); mCalc();
}

function mDeleteEl(id) {
  M.elements = M.elements.filter(function(e){ return e.id!==id; });
  M.selEl=null; mHideProps(); mDraw();
}

/* ══════════════════════════════════════════════════════════
   LEVÝ PANEL — dynamicky generovaný
   ══════════════════════════════════════════════════════════ */
function mBuildPanel() {
  var el = document.getElementById('mRoomList');
  if (!el) return;
  el.innerHTML = TEMPLATES.map(function(t) {
    return '<div onclick="sipMAdd(\''+t.name+'\',\''+t.color+'\','+t.w+','+t.h+')"' +
      ' style="display:flex;align-items:center;gap:7px;padding:7px 8px;border-radius:5px;background:#1a2520;border:1px solid #3a3a3a;cursor:pointer;margin-bottom:4px;transition:border-color .2s;"' +
      ' onmouseover="this.style.borderColor=\'#4ade80\'" onmouseout="this.style.borderColor=\'#3a3a3a\'">' +
      '<div style="width:8px;height:8px;border-radius:2px;background:'+t.color+';flex-shrink:0;"></div>' +
      '<span style="font-size:11px;font-weight:600;color:#fff;flex:1;">'+t.name+'</span>' +
      '<span style="font-size:9px;color:#666;">'+t.w+'×'+t.h+'</span>' +
      '</div>';
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   ADD ROOM / CUSTOM
   ══════════════════════════════════════════════════════════ */
function sipMAdd(name, color, w, h) {
  M.pending = {name:name, color:color, w:parseFloat(w), h:parseFloat(h)};
  M.mode = 'select';
  // НЕ викликаємо mSetMode — воно чистить M.pending!
  // Просто підсвічуємо кнопку Výběr
  ['mBtnSelect','mBtnDoor','mBtnWin','mBtnDel'].forEach(function(id){
    var b=document.getElementById(id);
    if(b){b.style.background='transparent';b.style.color='#ccc';b.style.borderColor='#3a3a3a';}
  });
  var ab=document.getElementById('mBtnSelect');
  if(ab){ab.style.background='rgba(74,222,128,.2)';ab.style.color='#4ade80';ab.style.borderColor='#4ade80';}
  if (M.cvs) M.cvs.style.cursor = 'crosshair';
  mDraw();
}

function mAddCustomRoom() {
  var name  = (document.getElementById('mCustName')||{}).value || 'Místnost';
  var w     = parseFloat((document.getElementById('mCustW')||{}).value) || 3;
  var h     = parseFloat((document.getElementById('mCustH')||{}).value) || 3;
  var color = COLORS[Math.floor(Math.random()*COLORS.length)];
  sipMAdd(name.trim()||'Místnost', color, w, h);
}

/* ══════════════════════════════════════════════════════════
   MODE
   ══════════════════════════════════════════════════════════ */
function mSetMode(mode) {
  M.mode = mode; M.pending = null;
  var map = {select:'mBtnSelect', door:'mBtnDoor', window:'mBtnWin', delete:'mBtnDel'};
  ['mBtnSelect','mBtnDoor','mBtnWin','mBtnDel'].forEach(function(id){
    var b=document.getElementById(id);
    if(b){b.style.background='transparent';b.style.color='#ccc';b.style.borderColor='#3a3a3a';}
  });
  var ab = document.getElementById(map[mode]);
  if (ab) { ab.style.background='rgba(74,222,128,.2)'; ab.style.color='#4ade80'; ab.style.borderColor='#4ade80'; }
  mDraw();
}

/* ══════════════════════════════════════════════════════════
   IZOLACE
   ══════════════════════════════════════════════════════════ */
function mSetInsulation(mm) {
  M.insulation = mm;
  document.querySelectorAll('.mInsBt').forEach(function(b){
    var active = parseInt(b.dataset.mm)===mm;
    b.style.background   = active ? '#4ade80' : 'transparent';
    b.style.color        = active ? '#000' : '#888';
    b.style.borderColor  = active ? '#4ade80' : '#3a3a3a';
  });
  mDraw(); mCalc();
}

/* ══════════════════════════════════════════════════════════
   KALKULACE
   ══════════════════════════════════════════════════════════ */
function mCalc() {
  var tot = M.rooms.reduce(function(s,r){ return s+r.w*r.h; }, 0);
  var im = {100:.88, 160:1, 200:1.12, 250:1.28};
  var matE = 280*(im[M.insulation]||1)*tot;
  var dopE = tot<=80?1200:tot<=150?1500:1800;
  var monE = tot*120;
  var C    = 25;
  var totE = matE+dopE+monE;
  var rdKc = tot*1200*C;
  var save = rdKc-totE*C;

  function s(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; }
  s('mma', tot.toFixed(1)+' m²');
  s('mmr', M.rooms.length);
  s('mmm', tot>0 ? '€ '+Math.round(matE).toLocaleString('cs-CZ') : '—');
  s('mmd', tot>0 ? '€ '+Math.round(dopE).toLocaleString('cs-CZ') : '—');
  s('mmn', tot>0 ? '€ '+Math.round(monE).toLocaleString('cs-CZ') : '—');
  s('mmt', tot>0 ? Math.round(totE*C).toLocaleString('cs-CZ')+' Kč' : '—');
  s('mms', tot>0 ? 'vs RD: -'+Math.round(save).toLocaleString('cs-CZ')+' Kč' : '');

  var list = document.getElementById('mmlist');
  if (list) {
    if (M.rooms.length) {
      list.innerHTML = M.rooms.map(function(r){
        return '<div style="display:flex;align-items:center;gap:5px;padding:4px 0;border-bottom:1px solid #3a3a3a;">' +
          '<div style="width:8px;height:8px;border-radius:2px;background:'+r.color+';flex-shrink:0;"></div>' +
          '<span style="flex:1;font-size:11px;color:#ccc;">'+r.name+'</span>' +
          '<span style="font-size:11px;color:#4ade80;font-weight:700;">'+(r.w*r.h).toFixed(1)+' m²</span>' +
          '</div>';
      }).join('');
    } else {
      list.textContent = 'Zatím prázdné';
    }
  }
}

/* ══════════════════════════════════════════════════════════
   ZOOM
   ══════════════════════════════════════════════════════════ */
function sipMZoom(f) {
  if (f===0) { M.sc=36; M.ox=60; M.oy=60; }
  else {
    M.ox = M.cw/2 + (M.ox-M.cw/2)*f;
    M.oy = M.ch/2 + (M.oy-M.ch/2)*f;
    M.sc = Math.max(12, Math.min(160, M.sc*f));
  }
  mDraw();
}

/* Backward compat */
function sipMCalc() { mCalc(); }
window.sipMInit  = sipMInit;
window.sipMZoom  = sipMZoom;
window.sipMCalc  = sipMCalc;
window.sipMAdd   = sipMAdd;
window.mSetMode  = mSetMode;
window.mSetInsulation = mSetInsulation;
window.mAddCustomRoom = mAddCustomRoom;
window.mUpdateRoom    = mUpdateRoom;
window.mUpdateEl      = mUpdateEl;
window.mElProp        = mElProp;
window.mSetColor      = mSetColor;
window.mDeleteRoom    = mDeleteRoom;
window.mDeleteEl      = mDeleteEl;
