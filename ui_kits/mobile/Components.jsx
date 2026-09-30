/* global React */

// ─────────── Atomic ───────────
function Tag({label, bg, color}) {
  return <span className="tag" style={{"--tb": bg||"#e8f0e8", "--tc": color||"#2d5a2d"}}>{label}</span>;
}

function Eyebrow({children}) { return <span className="eyebrow">{children}</span>; }

function Disclaimer({kind="info", children}) {
  const styles = {
    info:    {bg:"#fffbe8", bd:"#f0d060", fg:"#7a6010", ic:"ℹ️"},
    corr:    {bg:"#f3eaf8", bd:"#c49fd8", fg:"#5b2080", ic:"📊"},
    danger:  {bg:"#fdecea", bd:"#f09090", fg:"#7a2020", ic:"⚠️"},
  };
  const s = styles[kind];
  return (
    <div className="disclaimer" style={{background:s.bg, borderColor:s.bd}}>
      <span style={{fontSize:14}}>{s.ic}</span>
      <p style={{color:s.fg}}>{children}</p>
    </div>
  );
}

function Btn({variant="primary", size, full, children, onClick}) {
  return <button className={`btn ${variant} ${size||""} ${full?"full":""}`} onClick={onClick}>{children}</button>;
}

// ─────────── App bar ───────────
function AppBar({eyebrow, title, sub, search, setSearch, tabs, activeTab, onTab}) {
  return (
    <div className="appbar">
      <div style={{textAlign:"center"}}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="display" style={{fontSize:22, lineHeight:1.2}}>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {setSearch && (
        <div className="search-dark">
          <span className="ic">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search foods, compounds, diseases…"/>
        </div>
      )}
      {tabs && (
        <div className="tabs-top">
          {tabs.map(t=>(
            <button key={t.id} className={`t ${activeTab===t.id?"active":""}`} onClick={()=>onTab(t.id)}>
              <span>{t.emoji}</span><span>{t.label}</span><span className="ct">{t.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────── Bottom tab bar (minimal, text-first) ───────────
function BottomBar({active, onChange}) {
  const tabs = [
    {id:"today", lbl:"Today"},
    {id:"foods", lbl:"Foods"},
    {id:"log",   lbl:"+ Log", fab:true},
    {id:"insights", lbl:"Insights"},
    {id:"profile",  lbl:"Profile"},
  ];
  return (
    <div className="bottombar">
      {tabs.map(t=>(
        <button key={t.id}
          className={`it ${t.fab?"fab":""} ${active===t.id?"active":""}`}
          onClick={()=>onChange(t.id)}
          aria-label={t.lbl}>
          <span>{t.lbl}</span>
          {!t.fab && <span className="dot"></span>}
        </button>
      ))}
    </div>
  );
}

// ─────────── Food card ───────────
function FoodCard({food, defaultOpen=false, onOpen}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`card ${open?"open":""}`} style={{"--bd":food.bd, "--hb":food.hb, "--ac":food.ac, marginBottom:10}}
         onClick={()=>{ setOpen(o=>!o); onOpen && onOpen(food); }}>
      <div className="head">
        <div className="top">
          <div className="ttl">
            <span className="em">{food.emoji}</span>
            <div>
              <div className="name">{food.group}</div>
              <div className="items">{food.items.length>50? food.items.slice(0,50)+"…" : food.items}</div>
            </div>
          </div>
          <span className="chev">▾</span>
        </div>
        <div style={{marginTop:10}}>
          {food.tags.map(t=><Tag key={t} label={t} bg={food.hb} color={food.ac}/>)}
          <Tag label={food.evidence.split("–")[0]} bg="#e8f5ec" color="#2d7a4f"/>
        </div>
      </div>
      {open && (
        <div className="body">
          <div className="lbl">Key compounds</div>
          <div style={{marginBottom:10}}>{food.compounds.map(c=><Tag key={c} label={c} bg="#f0f4f0" color="#3d5a3e"/>)}</div>
          <div className="lbl">Evidence-based benefits</div>
          <ul style={{margin:"0 0 10px",paddingLeft:16}}>
            {food.benefits.map((b,i)=><li key={i} style={{fontSize:12.5,color:"#2a3a2a",lineHeight:1.55,marginBottom:4}}>{b}</li>)}
          </ul>
          <div className="prep">
            <div className="h">👨‍🍳 Best preparation</div>
            <div className="b">{food.prep}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────── Organ card ───────────
function OrganCard({organ}) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="card" style={{"--bd":organ.bd, "--hb":organ.hb, "--ac":organ.ac, marginBottom:12}}>
      <div className="head" style={{borderBottom:`1px solid ${organ.bd}`}}>
        <div className="top">
          <div className="ttl">
            <span className="em" style={{fontSize:26}}>{organ.emoji}</span>
            <div>
              <div className="name" style={{fontSize:16}}>{organ.name}</div>
              <div className="items" style={{marginTop:3}}>Top protective foods</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:8}}>
          {organ.topFoods.map(f=><Tag key={f} label={f} bg={organ.hb} color={organ.ac}/>)}
        </div>
      </div>
      <div style={{padding:"10px 14px"}}>
        {organ.cards.map((c,i)=>(
          <div key={i} className="organ-card" style={{"--bd":organ.bd, "--hb":organ.hb, "--ac":organ.ac}}>
            <div className={`row ${open===i?"active":""}`} onClick={()=>setOpen(open===i?-1:i)}>
              <div className="h">{c.title}</div>
              <span style={{fontSize:13,color:"#aaa",transform:open===i?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
            </div>
            {open===i && (
              <div className="panel" style={{"--bd":organ.bd}}>
                <p>{c.body}</p>
                <div className="key" style={{color:organ.ac}}>🥗 Key foods: <span>{c.foods}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── Today rings ───────────
function ProtectionRing({r}) {
  return (
    <div className="ring" style={{"--bd":r.ac, "--hb":r.hb, "--ac":r.ac}}>
      <div className="em">{r.em}</div>
      <div className="nm">{r.nm}</div>
      <div className="pct">{r.pct}%</div>
      <div className="bar"><div style={{width:`${r.pct}%`}}/></div>
      <div className="lbl">{r.lbl}</div>
    </div>
  );
}

function MealRow({m}) {
  return (
    <div className="meal">
      <span className="em">{m.em}</span>
      <div className="who">
        <div className="h">{m.h}</div>
        <div className="s">{m.s}</div>
      </div>
      <div className="time">{m.time}</div>
    </div>
  );
}

// ─────────── Feature: streak chip ───────────
function StreakChip({days}) {
  return <span className="streak">{`● ${days}-day streak`}</span>;
}

// ─────────── Feature: plant diversity tracker ───────────
function DiversityCard({d}) {
  const pct = Math.round((d.count/d.goal)*100);
  return (
    <div className="diversity">
      <div className="top">
        <div className="n">{d.count}<span> / {d.goal} plants</span></div>
        <div className="wk">this week</div>
      </div>
      <div className="bar"><div style={{width:`${pct}%`}}/></div>
      <div className="cap">
        People eating <b>30+ different plants weekly</b> have dramatically more diverse microbiomes (American Gut Project). New this week: <b>{d.newThisWeek.join(", ")}</b>.
      </div>
    </div>
  );
}

// ─────────── Feature: daily tip ───────────
function TipCard({tip}) {
  return (
    <div className="tip">
      <div className="h"><span className="badge">{tip.badge}</span></div>
      <div className="b">{tip.text}</div>
    </div>
  );
}

// ─────────── Feature: weekly bars ───────────
function WeekBars({week, max}) {
  return (
    <div className="week-bars">
      {week.map((d,i)=>(
        <div key={i} className={`day ${d.today?"today":""}`}>
          <div className="bar" style={{height:"100%"}}>
            <div style={{height:`${Math.round((d.groups/max)*100)}%`}}/>
          </div>
          <div className="d">{d.d}</div>
        </div>
      ))}
    </div>
  );
}

function CoverageRow({c}) {
  return (
    <div className="coverage-row">
      <div className="nm">{c.nm}</div>
      <div className="track"><div style={{width:`${c.pct}%`}}/></div>
      <div className="v">{c.pct}%</div>
    </div>
  );
}

// expose
Object.assign(window, { Tag, Eyebrow, Disclaimer, Btn, AppBar, BottomBar, FoodCard, OrganCard, ProtectionRing, MealRow, StreakChip, DiversityCard, TipCard, WeekBars, CoverageRow });
