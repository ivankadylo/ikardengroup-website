/* ═══════════════════════════════════════════════════════════
   IKARDEN SIP MODELÁŘ v2.0
   - Editovatelné místnosti (název, rozměry, barva)
   - Vlastní místnosti
   - Izolace — viditelný vnější obrys
   - Okna a dveře na stěnách (s obloukem / otevřením)
   ═══════════════════════════════════════════════════════════ */

/* ── STAV ───────────────────────────────────────────────── */
var M = {
  rooms:    [],           // {id,name,color,x,y,w,h}
  elements: [],           // {id,type,roomId,wall,pos,width,doorDir,doorSide}
  sc: 32, ox: 50, oy: 50, // zoom / pan
  drag: null,             // {room, dx, dy}
  resize: null,           // {room, handle, ox,oy,ow,oh}
  selected: null,         // selected room id
  selEl: null,            // selected element id
  mode: 'select',         // 'select'|'door'|'window'|'delete'
  pending: null,          // room template about to be placed
  pendingEl: null,        // element about to be placed on wall
  insulation: 160,        // mm
  cvs: null, ctx: null, cw: 0, ch: 0,
  nextId: 1,
  nextElId: 1,
};

var ROOM_COLORS = [
  '#3b82f6','#a855f7','#f59e0b','#06b6d4',
  '#4ade80','#f97316','#ec4899','#9ca3af','#6b7280'
];

/* ── ІНІЦІАЛІЗАЦІЯ ─────────────────────────────────────── */
function sipMInit() {
  var cvs = document.getElementById('sipC');
  if (!cvs || cvs._mInit) return;
  cvs._mInit = true;
  M.cvs = cvs; M.ctx = cvs.getContext('2d');
  mResize();
  cvs.addEventListener('mousedown', mMD);
  cvs.addEventListener('mousemove', mMV);
  cvs.addEventListener('mouseup',   mMU);
  cvs.addEventListener('dblclick',  mDbl);
  cvs.addEventListener('wheel', function(e){
    e.preventDefault();
    var f = e.deltaY < 0 ? 1.12 : 0.9;
    M.ox = M.cw/2 + (M.ox - M.cw/2)*f;
    M.oy = M.ch/2 + (M.oy - M.ch/2)*f;
    M.sc = Math.max(14, Math.min(120, M.sc*f));
    mDraw();
  }, {passive:false});
  window.addEventListener('resize', mResize);
  mDraw(); mCalc(); mBuildRoomList();
}

function mResize() {
  var wrap = document.getElementById('sipCW');
  if (!wrap || !M.cvs) return;
  M.cw = M.cvs.width  = wrap.clientWidth;
  M.ch = M.cvs.height = wrap.clientHeight;
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
  for (var x = M.ox % M.sc; x < M.cw; x += M.sc) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,M.ch); c.stroke(); }
  for (var y = M.oy % M.sc; y < M.ch; y += M.sc) { c.beginPath(); c.moveTo(0,y); c.lineTo(M.cw,y); c.stroke(); }

  // Осі
  c.strokeStyle = 'rgba(74,222,128,.25)'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(M.ox,0); c.lineTo(M.ox,M.ch); c.stroke();
  c.beginPath(); c.moveTo(0,M.oy); c.lineTo(M.cw,M.oy); c.stroke();

  if (!M.rooms.length) {
    // Placeholder
    c.save();
    c.globalAlpha = .35;
    c.fillStyle = '#fff';
    c.font = 'bold 14px Arial';
    c.textAlign = 'center';
    c.fillText('Klikněte na místnost vlevo a umístěte ji na plán', M.cw/2, M.ch/2 - 10);
    c.font = '12px Arial';
    c.fillText('Poté přidejte dveře a okna nástrojovou lištou', M.cw/2, M.ch/2 + 14);
    c.restore();
    return;
  }

  // Izolace — vnější obrys
  mDrawInsulation(c);

  // Místnosti
  M.rooms.forEach(function(r) {
    var px = M.ox + r.x*M.sc, py = M.oy + r.y*M.sc;
    var pw = r.w*M.sc, ph = r.h*M.sc;

    // Výplň
    c.globalAlpha = .18;
    c.fillStyle = r.color;
    c.fillRect(px, py, pw, ph);
    c.globalAlpha = 1;

    // Obrys
    var isSelected = (r.id === M.selected);
    c.strokeStyle = isSelected ? '#4ade80' : r.color;
    c.lineWidth   = isSelected ? 2.5 : 1.8;
    c.strokeRect(px+.5, py+.5, pw-1, ph-1);

    // Název
    c.fillStyle = '#fff';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    var fs = Math.max(9, Math.min(13, pw/r.name.length*1.4));
    c.font = 'bold ' + fs + 'px Arial';
    c.fillText(r.name, px+pw/2, py+ph/2 - 8);

    // Rozměry
    c.fillStyle = r.color;
    c.font = '9px Arial';
    c.fillText(r.w + '×' + r.h + ' m', px+pw/2, py+ph/2 + 8);

    // Resize handles (wenn ausgewählt)
    if (isSelected) {
      mDrawHandles(c, px, py, pw, ph);
    }
  });

  // Dveře a okna
  M.elements.forEach(function(el) {
    mDrawElement(c, el);
  });

  // Kursor při pending
  if (M.pending) {
    M.cvs.style.cursor = 'crosshair';
  } else if (M.mode === 'door' || M.mode === 'window') {
    M.cvs.style.cursor = 'cell';
  } else if (M.mode === 'delete') {
    M.cvs.style.cursor = 'not-allowed';
  } else {
    M.cvs.style.cursor = 'default';
  }
}

/* ── IZOLACE ─────────────────────────────────────────────── */
function mDrawInsulation(c) {
  if (!M.rooms.length) return;
  var ins = M.insulation / 1000; // mm → m
  var px = ins * M.sc;

  c.save();
  c.strokeStyle = 'rgba(74,222,128,.5)';
  c.lineWidth = Math.max(2, px * 1.5);
  c.setLineDash([]);

  M.rooms.forEach(function(r) {
    var x = M.ox + r.x*M.sc - px/2;
    var y = M.oy + r.y*M.sc - px/2;
    var w = r.w*M.sc + px;
    var h = r.h*M.sc + px;
    c.strokeStyle = 'rgba(74,222,128,.3)';
    c.lineWidth = Math.max(3, px);
    c.strokeRect(x, y, w, h);
  });

  // Popis izolace
  if (M.rooms.length > 0) {
    var r0 = M.rooms[0];
    var lx = M.ox + r0.x*M.sc - px/2 - 4;
    var ly = M.oy + r0.y*M.sc - px/2 - 6;
    c.fillStyle = 'rgba(74,222,128,.7)';
    c.font = '9px Arial';
    c.textAlign = 'left';
    c.fillText('izolace ' + M.insulation + ' mm', lx, ly);
  }
  c.restore();
}

/* ── RESIZE HANDLES ────────────────────────────────────────── */
function mDrawHandles(c, px, py, pw, ph) {
  var hs = 7;
  var handles = [
    {x: px+pw-hs/2, y: py+ph-hs/2, cur: 'nwse-resize'},
    {x: px+pw/2-hs/2, y: py+ph-hs/2, cur: 's-resize'},
    {x: px+pw-hs/2, y: py+ph/2-hs/2, cur: 'e-resize'},
  ];
  c.fillStyle = '#4ade80';
  handles.forEach(function(h) {
    c.fillRect(h.x, h.y, hs, hs);
  });
}

/* ── DVEŘE A OKNA ──────────────────────────────────────────── */
function mDrawElement(c, el) {
  var room = M.rooms.find(function(r){ return r.id === el.roomId; });
  if (!room) return;

  var px = M.ox + room.x*M.sc;
  var py = M.oy + room.y*M.sc;
  var pw = room.w*M.sc;
  var ph = room.h*M.sc;
  var ew = el.width * M.sc;
  var pos = el.pos; // 0..1 pozice na stěně

  c.save();
  var isSelected = (el.id === M.selEl);
  c.strokeStyle = isSelected ? '#f59e0b' : (el.type === 'door' ? '#ffffff' : '#60a5fa');
  c.fillStyle   = isSelected ? '#f59e0b' : (el.type === 'door' ? '#ffffff' : '#60a5fa');
  c.lineWidth   = isSelected ? 2.5 : 2;

  var x1, y1, x2, y2, ax, ay, angle;

  if (el.wall === 'top') {
    x1 = px + pos * pw;
    y1 = py;
    x2 = x1 + ew;
    y2 = y1;
  } else if (el.wall === 'bottom') {
    x1 = px + pos * pw;
    y1 = py + ph;
    x2 = x1 + ew;
    y2 = y1;
  } else if (el.wall === 'left') {
    x1 = px;
    y1 = py + pos * ph;
    x2 = x1;
    y2 = y1 + ew;
  } else { // right
    x1 = px + pw;
    y1 = py + pos * ph;
    x2 = x1;
    y2 = y1 + ew;
  }

  if (el.type === 'window') {
    // Okno — tři čáry
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    if (el.wall === 'top' || el.wall === 'bottom') {
      var mid = (y1 + y2)/2 || y1;
      var off = el.wall === 'top' ? -5 : 5;
      c.globalAlpha = .6;
      c.beginPath(); c.moveTo(x1, y1+off); c.lineTo(x2, y2+off); c.stroke();
      c.beginPath(); c.moveTo(x1, y1+off*2); c.lineTo(x2, y2+off*2); c.stroke();
    } else {
      var off2 = el.wall === 'left' ? -5 : 5;
      c.globalAlpha = .6;
      c.beginPath(); c.moveTo(x1+off2, y1); c.lineTo(x2+off2, y2); c.stroke();
      c.beginPath(); c.moveTo(x1+off2*2, y1); c.lineTo(x2+off2*2, y2); c.stroke();
    }
    c.globalAlpha = 1;
    // Značka
    var mx = (x1+x2)/2, my = (y1+y2)/2;
    c.font = '10px Arial'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText('⊞', mx, my + (el.wall==='top'?-10:el.wall==='bottom'?10:0));
  } else {
    // Dveře — čára + oblouk
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();

    // Oblouk otevírání
    var swingX, swingY, startA, endA;
    var inside = (el.doorDir === 'in');

    if (el.wall === 'top') {
      swingX = el.doorSide === 'left' ? x1 : x2;
      swingY = y1 + (inside ? ew : -ew);
      var swingFrom = el.doorSide === 'left' ? x2 : x1;
      c.beginPath();
      c.moveTo(swingX, y1);
      c.lineTo(swingX, swingY);
      c.moveTo(swingX, y1);
      startA = el.doorSide==='left' ? 0 : Math.PI;
      c.arc(swingX, y1, ew, startA, startA + (inside?Math.PI/2:-Math.PI/2), !inside);
      c.stroke();
    } else if (el.wall === 'bottom') {
      swingX = el.doorSide === 'left' ? x1 : x2;
      swingY = y1 + (inside ? -ew : ew);
      c.beginPath();
      c.moveTo(swingX, y1);
      c.lineTo(swingX, swingY);
      c.moveTo(swingX, y1);
      startA = el.doorSide==='left' ? 0 : Math.PI;
      c.arc(swingX, y1, ew, startA, startA + (inside?-Math.PI/2:Math.PI/2), inside);
      c.stroke();
    } else if (el.wall === 'left') {
      swingY = el.doorSide === 'left' ? y1 : y2;
      swingX = x1 + (inside ? ew : -ew);
      c.beginPath();
      c.moveTo(x1, swingY);
      c.lineTo(swingX, swingY);
      c.moveTo(x1, swingY);
      startA = el.doorSide==='left' ? Math.PI/2 : -Math.PI/2;
      c.arc(x1, swingY, ew, startA, startA + (inside?-Math.PI/2:Math.PI/2), !inside);
      c.stroke();
    } else { // right
      swingY = el.doorSide === 'left' ? y1 : y2;
      swingX = x1 + (inside ? -ew : ew);
      c.beginPath();
      c.moveTo(x1, swingY);
      c.lineTo(swingX, swingY);
      c.moveTo(x1, swingY);
      startA = el.doorSide==='left' ? Math.PI/2 : -Math.PI/2;
      c.arc(x1, swingY, ew, startA, startA + (inside?Math.PI/2:-Math.PI/2), inside);
      c.stroke();
    }

    // "D" značka
    var dlx = (x1+x2)/2 || x1, dly = (y1+y2)/2 || y1;
    c.font = 'bold 10px Arial'; c.textAlign='center'; c.textBaseline='middle';
    c.fillText('D', dlx + (el.wall==='left'?-8:el.wall==='right'?8:0),
                    dly + (el.wall==='top'?-8:el.wall==='bottom'?8:0));
  }
  c.restore();
}

/* ══════════════════════════════════════════════════════════
   MYŠ — EVENTS
   ══════════════════════════════════════════════════════════ */
function mMD(e) {
  var wx = (e.offsetX - M.ox) / M.sc;
  var wy = (e.offsetY - M.oy) / M.sc;

  // Pending místnost — umístit
  if (M.pending) {
    var r = {
      id: M.nextId++, name: M.pending.name, color: M.pending.color,
      x: mSnap(wx - M.pending.w/2), y: mSnap(wy - M.pending.h/2),
      w: M.pending.w, h: M.pending.h
    };
    M.rooms.push(r);
    M.pending = null;
    M.selected = r.id;
    mDraw(); mCalc(); mBuildRoomList(); mShowProps(r.id);
    return;
  }

  // Mód door/window — přidat na stěnu
  if (M.mode === 'door' || M.mode === 'window') {
    mPlaceOnWall(e.offsetX, e.offsetY);
    return;
  }

  // Mód delete
  if (M.mode === 'delete') {
    mDeleteAtPoint(e.offsetX, e.offsetY);
    return;
  }

  // Select / drag
  // Nejprve zkusit element
  var el = mElementAtPoint(e.offsetX, e.offsetY);
  if (el) {
    M.selEl = el.id; M.selected = null;
    mShowElProps(el.id);
    mDraw(); return;
  }

  // Zkusit resize handle
  if (M.selected) {
    var room = M.rooms.find(function(r){ return r.id===M.selected; });
    if (room) {
      var handle = mHandleAtPoint(room, e.offsetX, e.offsetY);
      if (handle) {
        M.resize = {room:room, handle:handle, ox:room.x, oy:room.y, ow:room.w, oh:room.h, mx:wx, my:wy};
        return;
      }
    }
  }

  // Zkusit místnost
  var hit = null;
  for (var i = M.rooms.length-1; i >= 0; i--) {
    var r2 = M.rooms[i];
    if (wx >= r2.x && wx <= r2.x+r2.w && wy >= r2.y && wy <= r2.y+r2.h) {
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
  }
  mDraw();
}

function mMV(e) {
  var wx = (e.offsetX - M.ox) / M.sc;
  var wy = (e.offsetY - M.oy) / M.sc;

  if (M.drag) {
    M.drag.room.x = mSnap(wx - M.drag.dx);
    M.drag.room.y = mSnap(wy - M.drag.dy);
    mDraw(); mCalc(); mUpdatePropsLive(M.drag.room.id);
    return;
  }
  if (M.resize) {
    var r = M.resize.room;
    var dw = wx - M.resize.mx;
    var dh = wy - M.resize.my;
    if (M.resize.handle === 'se') {
      r.w = Math.max(1, mSnap(M.resize.ow + dw));
      r.h = Math.max(1, mSnap(M.resize.oh + dh));
    } else if (M.resize.handle === 's') {
      r.h = Math.max(1, mSnap(M.resize.oh + dh));
    } else if (M.resize.handle === 'e') {
      r.w = Math.max(1, mSnap(M.resize.ow + dw));
    }
    mDraw(); mCalc(); mUpdatePropsLive(r.id);
  }
}

function mMU(e) {
  M.drag = null; M.resize = null;
}

function mDbl(e) {
  var wx = (e.offsetX - M.ox) / M.sc;
  var wy = (e.offsetY - M.oy) / M.sc;
  for (var i = M.rooms.length-1; i >= 0; i--) {
    var r = M.rooms[i];
    if (wx >= r.x && wx <= r.x+r.w && wy >= r.y && wy <= r.y+r.h) {
      var name = prompt('Přejmenovat místnost:', r.name);
      if (name !== null && name.trim()) {
        r.name = name.trim();
        mDraw(); mBuildRoomList(); mShowProps(r.id);
      }
      return;
    }
  }
}

/* ── HELPERS ──────────────────────────────────────────────── */
function mSnap(v) { return Math.round(v * 2) / 2; }

function mHandleAtPoint(room, ex, ey) {
  var px = M.ox + room.x*M.sc, py = M.oy + room.y*M.sc;
  var pw = room.w*M.sc, ph = room.h*M.sc;
  var hs = 10;
  if (Math.abs(ex-(px+pw)) < hs && Math.abs(ey-(py+ph)) < hs) return 'se';
  if (Math.abs(ex-(px+pw/2)) < hs && Math.abs(ey-(py+ph)) < hs) return 's';
  if (Math.abs(ex-(px+pw)) < hs && Math.abs(ey-(py+ph/2)) < hs) return 'e';
  return null;
}

function mElementAtPoint(ex, ey) {
  for (var i = 0; i < M.elements.length; i++) {
    var el = M.elements[i];
    var room = M.rooms.find(function(r){ return r.id===el.roomId; });
    if (!room) continue;
    var pt = mElementCenter(el, room);
    if (Math.abs(ex-pt.x) < 12 && Math.abs(ey-pt.y) < 12) return el;
  }
  return null;
}

function mElementCenter(el, room) {
  var px = M.ox + room.x*M.sc, py = M.oy + room.y*M.sc;
  var pw = room.w*M.sc, ph = room.h*M.sc;
  var ew = el.width*M.sc;
  var p = el.pos;
  if (el.wall === 'top')    return {x: px+p*pw+ew/2, y: py};
  if (el.wall === 'bottom') return {x: px+p*pw+ew/2, y: py+ph};
  if (el.wall === 'left')   return {x: px,            y: py+p*ph+ew/2};
  return                           {x: px+pw,          y: py+p*ph+ew/2};
}

function mPlaceOnWall(ex, ey) {
  // Najít stěnu místnosti
  var best = null, bestDist = 12;
  M.rooms.forEach(function(room) {
    var px = M.ox + room.x*M.sc, py = M.oy + room.y*M.sc;
    var pw = room.w*M.sc, ph = room.h*M.sc;
    var walls = [
      {id:'top',    d: Math.abs(ey-py),    pos:(ex-px)/pw, ok: ex>=px && ex<=px+pw},
      {id:'bottom', d: Math.abs(ey-py-ph), pos:(ex-px)/pw, ok: ex>=px && ex<=px+pw},
      {id:'left',   d: Math.abs(ex-px),    pos:(ey-py)/ph, ok: ey>=py && ey<=py+ph},
      {id:'right',  d: Math.abs(ex-px-pw), pos:(ey-py)/ph, ok: ey>=py && ey<=py+ph},
    ];
    walls.forEach(function(w) {
      if (w.ok && w.d < bestDist && w.pos >= 0 && w.pos <= 1) {
        bestDist = w.d;
        best = {room:room, wall:w.id, pos:Math.max(0, Math.min(0.8, w.pos - 0.1))};
      }
    });
  });
  if (!best) return;

  var elWidth = M.mode === 'door' ? 0.9 : 1.2; // m
  var el = {
    id: M.nextElId++,
    type: M.mode,
    roomId: best.room.id,
    wall: best.wall,
    pos: best.pos,
    width: elWidth,
    doorDir: 'in',
    doorSide: 'left',
  };
  M.elements.push(el);
  M.selEl = el.id;
  M.selected = null;
  mDraw(); mShowElProps(el.id);
}

function mDeleteAtPoint(ex, ey) {
  // Smazat element
  var el = mElementAtPoint(ex, ey);
  if (el) {
    M.elements = M.elements.filter(function(e){ return e.id !== el.id; });
    M.selEl = null;
    mHideProps(); mDraw(); return;
  }
  // Smazat místnost
  var wx = (ex - M.ox)/M.sc, wy = (ey - M.oy)/M.sc;
  for (var i = M.rooms.length-1; i >= 0; i--) {
    var r = M.rooms[i];
    if (wx>=r.x && wx<=r.x+r.w && wy>=r.y && wy<=r.y+r.h) {
      M.elements = M.elements.filter(function(e){ return e.roomId !== r.id; });
      M.rooms.splice(i, 1);
      M.selected = null;
      mHideProps(); mDraw(); mCalc(); mBuildRoomList(); return;
    }
  }
}

/* ══════════════════════════════════════════════════════════
   PANEL VLASTNOSTÍ
   ══════════════════════════════════════════════════════════ */
function mShowProps(id) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (!r) return;
  var p = document.getElementById('mPropsPanel');
  if (!p) return;
  p.innerHTML = `
    <div style="font-size:10px;font-weight:700;color:#4ade80;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">✏️ Místnost</div>
    <div style="margin-bottom:8px;">
      <div style="font-size:11px;color:#888;margin-bottom:3px;">Název</div>
      <input id="mRName" value="${r.name}" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom(${id})">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
      <div>
        <div style="font-size:11px;color:#888;margin-bottom:3px;">Šířka (m)</div>
        <input id="mRW" type="number" min="1" max="20" step="0.5" value="${r.w}" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom(${id})">
      </div>
      <div>
        <div style="font-size:11px;color:#888;margin-bottom:3px;">Hloubka (m)</div>
        <input id="mRH" type="number" min="1" max="20" step="0.5" value="${r.h}" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateRoom(${id})">
      </div>
    </div>
    <div style="margin-bottom:10px;">
      <div style="font-size:11px;color:#888;margin-bottom:5px;">Barva</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;">
        ${ROOM_COLORS.map(function(c){
          return '<div onclick="mSetColor('+id+',\''+c+'\')" style="width:20px;height:20px;border-radius:3px;background:'+c+';cursor:pointer;border:2px solid '+(c===r.color?'#fff':'transparent')+'"></div>';
        }).join('')}
      </div>
    </div>
    <div style="font-size:12px;font-weight:700;color:#4ade80;margin-top:4px;">Plocha: ${(r.w*r.h).toFixed(1)} m²</div>
    <button onclick="mDeleteRoom(${id})" style="width:100%;margin-top:10px;padding:7px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:Arial;">🗑 Smazat místnost</button>
  `;
  p.style.display = 'block';
}

function mShowElProps(id) {
  var el = M.elements.find(function(e){ return e.id===id; });
  if (!el) return;
  var p = document.getElementById('mPropsPanel');
  if (!p) return;
  var typeLabel = el.type === 'door' ? '🚪 Dveře' : '🪟 Okno';
  p.innerHTML = `
    <div style="font-size:10px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${typeLabel}</div>
    <div style="margin-bottom:8px;">
      <div style="font-size:11px;color:#888;margin-bottom:3px;">Šířka (m)</div>
      <input id="mElW" type="number" min="0.6" max="3" step="0.1" value="${el.width}" style="width:100%;background:#1a2520;border:2px solid #3a3a3a;border-radius:5px;padding:6px;color:#fff;font-size:13px;font-family:Arial;" oninput="mUpdateEl(${id})">
    </div>
    ${el.type==='door' ? `
    <div style="margin-bottom:8px;">
      <div style="font-size:11px;color:#888;margin-bottom:5px;">Směr otevírání</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
        <button onclick="mElProp(${id},'doorDir','in')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid ${el.doorDir==='in'?'#4ade80':'#3a3a3a'};background:${el.doorDir==='in'?'rgba(74,222,128,.2)':'transparent'};color:${el.doorDir==='in'?'#4ade80':'#888'};">↓ Dovnitř</button>
        <button onclick="mElProp(${id},'doorDir','out')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid ${el.doorDir==='out'?'#4ade80':'#3a3a3a'};background:${el.doorDir==='out'?'rgba(74,222,128,.2)':'transparent'};color:${el.doorDir==='out'?'#4ade80':'#888'};">↑ Ven</button>
      </div>
    </div>
    <div style="margin-bottom:8px;">
      <div style="font-size:11px;color:#888;margin-bottom:5px;">Strana závěsu</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
        <button onclick="mElProp(${id},'doorSide','left')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid ${el.doorSide==='left'?'#4ade80':'#3a3a3a'};background:${el.doorSide==='left'?'rgba(74,222,128,.2)':'transparent'};color:${el.doorSide==='left'?'#4ade80':'#888'};">◀ Vlevo</button>
        <button onclick="mElProp(${id},'doorSide','right')" style="padding:6px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:2px solid ${el.doorSide==='right'?'#4ade80':'#3a3a3a'};background:${el.doorSide==='right'?'rgba(74,222,128,.2)':'transparent'};color:${el.doorSide==='right'?'#4ade80':'#888'};">▶ Vpravo</button>
      </div>
    </div>
    ` : ''}
    <button onclick="mDeleteEl(${id})" style="width:100%;margin-top:10px;padding:7px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:Arial;">🗑 Smazat</button>
  `;
  p.style.display = 'block';
}

function mHideProps() {
  var p = document.getElementById('mPropsPanel');
  if (p) p.innerHTML = '<div style="color:#888;font-size:12px;text-align:center;padding:20px 0;">Vyberte místnost nebo prvek</div>';
}

function mUpdateRoom(id) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (!r) return;
  var n = document.getElementById('mRName');
  var w = document.getElementById('mRW');
  var h = document.getElementById('mRH');
  if (n) r.name = n.value || r.name;
  if (w) r.w = Math.max(1, parseFloat(w.value)||r.w);
  if (h) r.h = Math.max(1, parseFloat(h.value)||r.h);
  mDraw(); mCalc(); mBuildRoomList();
  var el = document.getElementById('mRArea');
  if (el) el.textContent = (r.w*r.h).toFixed(1) + ' m²';
}

function mUpdatePropsLive(id) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (!r) return;
  var w = document.getElementById('mRW'), h = document.getElementById('mRH');
  if (w) w.value = r.w;
  if (h) h.value = r.h;
}

function mSetColor(id, color) {
  var r = M.rooms.find(function(r){ return r.id===id; });
  if (r) { r.color = color; mDraw(); mBuildRoomList(); mShowProps(id); }
}

function mUpdateEl(id) {
  var el = M.elements.find(function(e){ return e.id===id; });
  if (!el) return;
  var w = document.getElementById('mElW');
  if (w) el.width = Math.max(0.5, parseFloat(w.value)||el.width);
  mDraw();
}

function mElProp(id, prop, val) {
  var el = M.elements.find(function(e){ return e.id===id; });
  if (el) { el[prop] = val; mDraw(); mShowElProps(id); }
}

function mDeleteRoom(id) {
  M.rooms = M.rooms.filter(function(r){ return r.id!==id; });
  M.elements = M.elements.filter(function(e){ return e.roomId!==id; });
  M.selected = null; mHideProps(); mDraw(); mCalc(); mBuildRoomList();
}

function mDeleteEl(id) {
  M.elements = M.elements.filter(function(e){ return e.id!==id; });
  M.selEl = null; mHideProps(); mDraw();
}

/* ══════════════════════════════════════════════════════════
   LEVÝ PANEL — seznam místností
   ══════════════════════════════════════════════════════════ */
var ROOM_TEMPLATES = [
  {name:'Obývací pokoj', color:'#3b82f6', w:6, h:4},
  {name:'Kuchyň',        color:'#f59e0b', w:3, h:4},
  {name:'Ložnice',       color:'#a855f7', w:4, h:4},
  {name:'Dětský pokoj',  color:'#06b6d4', w:3, h:3},
  {name:'Koupelna',      color:'#4ade80', w:2.5, h:2},
  {name:'Zádveří',       color:'#9ca3af', w:2, h:2},
  {name:'Garáž',         color:'#6b7280', w:6, h:3},
  {name:'Pracovna',      color:'#ec4899', w:3, h:3},
  {name:'Spíž',          color:'#f97316', w:1.5, h:2},
];

function mBuildRoomList() {
  var el = document.getElementById('mRoomList');
  if (!el) return;
  el.innerHTML = ROOM_TEMPLATES.map(function(t) {
    return `<div onclick="sipMAdd('${t.name}','${t.color}',${t.w},${t.h})"
      style="display:flex;align-items:center;gap:7px;padding:7px 8px;border-radius:5px;background:#1a2520;border:1px solid #3a3a3a;cursor:pointer;margin-bottom:4px;transition:border-color .2s;"
      onmouseover="this.style.borderColor='#4ade80'" onmouseout="this.style.borderColor='#3a3a3a'">
      <div style="width:8px;height:8px;border-radius:2px;background:${t.color};flex-shrink:0;"></div>
      <span style="font-size:11px;font-weight:600;color:#fff;flex:1;">${t.name}</span>
      <span style="font-size:9px;color:#666;">${t.w}×${t.h}</span>
    </div>`;
  }).join('');
}

/* ── ADD ROOM ────────────────────────────────────────────── */
function sipMAdd(name, color, w, h) {
  M.pending = {name:name, color:color, w:w, h:h};
  M.mode = 'select';
  mSetMode('select');
  mDraw();
}

/* ── ADD CUSTOM ROOM ─────────────────────────────────────── */
function mAddCustomRoom() {
  var name  = document.getElementById('mCustName').value.trim() || 'Místnost';
  var w     = parseFloat(document.getElementById('mCustW').value) || 3;
  var h     = parseFloat(document.getElementById('mCustH').value) || 3;
  var color = ROOM_COLORS[Math.floor(Math.random() * ROOM_COLORS.length)];
  sipMAdd(name, color, w, h);
}

/* ── SET MODE ────────────────────────────────────────────── */
function mSetMode(mode) {
  M.mode = mode;
  M.pending = null;
  ['mBtnSelect','mBtnDoor','mBtnWin','mBtnDel'].forEach(function(id){
    var b = document.getElementById(id);
    if (b) { b.style.background='transparent'; b.style.color='#ccc'; b.style.borderColor='#3a3a3a'; }
  });
  var active = {select:'mBtnSelect', door:'mBtnDoor', window:'mBtnWin', delete:'mBtnDel'}[mode];
  if (active) {
    var b = document.getElementById(active);
    if (b) { b.style.background='rgba(74,222,128,.2)'; b.style.color='#4ade80'; b.style.borderColor='#4ade80'; }
  }
  mDraw();
}

/* ── IZOLACE ─────────────────────────────────────────────── */
function mSetInsulation(mm) {
  M.insulation = mm;
  document.querySelectorAll('.mInsBt').forEach(function(b){
    b.style.background = parseInt(b.dataset.mm)===mm ? '#4ade80' : 'transparent';
    b.style.color      = parseInt(b.dataset.mm)===mm ? '#000'    : '#888';
    b.style.borderColor= parseInt(b.dataset.mm)===mm ? '#4ade80' : '#3a3a3a';
  });
  mDraw(); mCalc();
}

/* ══════════════════════════════════════════════════════════
   KALKULACE
   ══════════════════════════════════════════════════════════ */
function mCalc() {
  var tot = M.rooms.reduce(function(s,r){ return s+r.w*r.h; }, 0);
  var im = {100:.88, 160:1, 200:1.12, 250:1.28};
  var matE = 280 * (im[M.insulation]||1) * tot;
  var dopE = tot<=80?1200:tot<=150?1500:1800;
  var monE = tot*120;
  var C = 25;
  var totE = matE+dopE+monE;
  var rdKc = tot*1200*C;
  var save = rdKc-totE*C;

  var s = function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  s('mma', tot.toFixed(1)+' m²');
  s('mmr', M.rooms.length);
  s('mmm', tot>0 ? '€ '+Math.round(matE).toLocaleString('cs-CZ') : '—');
  s('mmd', tot>0 ? '€ '+Math.round(dopE).toLocaleString('cs-CZ') : '—');
  s('mmn', tot>0 ? '€ '+Math.round(monE).toLocaleString('cs-CZ') : '—');
  s('mmt', tot>0 ? Math.round(totE*C).toLocaleString('cs-CZ')+' Kč' : '—');
  s('mms', tot>0 ? 'vs RD: -'+Math.round(save).toLocaleString('cs-CZ')+' Kč' : '');

  // Zoznam místností
  var list = document.getElementById('mmlist');
  if (list) {
    if (M.rooms.length) {
      list.innerHTML = M.rooms.map(function(r){
        return `<div style="display:flex;align-items:center;gap:5px;padding:4px 0;border-bottom:1px solid #3a3a3a;">
          <div style="width:8px;height:8px;border-radius:2px;background:${r.color};flex-shrink:0;"></div>
          <span style="flex:1;font-size:11px;color:#ccc;">${r.name}</span>
          <span style="font-size:11px;color:#4ade80;font-weight:700;">${(r.w*r.h).toFixed(1)} m²</span>
        </div>`;
      }).join('');
    } else {
      list.textContent = 'Zatím prázdné';
    }
  }
}

/* ── ZOOM ─────────────────────────────────────────────────── */
function sipMZoom(f) {
  if (f===0) { M.sc=32; M.ox=50; M.oy=50; }
  else {
    M.ox = M.cw/2 + (M.ox-M.cw/2)*f;
    M.oy = M.ch/2 + (M.oy-M.ch/2)*f;
    M.sc = Math.max(14, Math.min(120, M.sc*f));
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
