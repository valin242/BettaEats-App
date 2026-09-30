/* global React, FOODS, ORGANS, TODAY */

// ────── Onboarding ──────
function OnboardingScreen({onContinue}) {
  return (
    <div className="screen">
      <div className="onb">
        <div style={{
          width:56, height:56, background:"#2d7a4f", borderRadius:14,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:28
        }}>🥦</div>
        <h1 className="display" style={{fontSize:30}}>Eat for the body you're building.</h1>
        <p>BettaEats turns peer-reviewed nutritional biochemistry into a daily practice — what you ate, what it's protecting, and how to prepare it for maximum effect.</p>
        <div className="feats">
          <div className="feat"><span className="em">🥦</span><div><div className="h">12 food groups, 70+ compounds</div><div className="s">Sulforaphane, EGCG, curcumin — what they actually do, by pathway.</div></div></div>
          <div className="feat"><span className="em">❤️</span><div><div className="h">Protection by organ & disease</div><div className="s">See which systems your meals support — heart, brain, gut, immune.</div></div></div>
          <div className="feat"><span className="em">📊</span><div><div className="h">Honest evidence labels</div><div className="s">Well-established · Emerging · Correlational. Never overclaimed.</div></div></div>
        </div>
        <div className="spacer"/>
        <Btn full onClick={onContinue}>Get started</Btn>
        <div style={{textAlign:"center",fontSize:11,color:"#7a8f7b",marginTop:10}}>
          Educational reference only — not medical advice.
        </div>
      </div>
    </div>
  );
}

// ────── Today ──────
function TodayScreen({onOpenFood}) {
  return (
    <div className="screen">
      <AppBar
        eyebrow="Tuesday · April 28"
        title="Today's protection"
        sub={`${TODAY.pct}% of daily groups covered`}/>
      <div className="scroll">
        <div className="section" style={{paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <StreakChip days={TODAY.streak}/>
          <span style={{fontSize:11, color:"var(--fg-4)"}}>Logged every day since April 16</span>
        </div>

        <div className="section">
          <DiversityCard d={TODAY.diversity}/>
        </div>

        <div className="section">
          <h2>Food group rings</h2>
          <div className="meta">Hit each group at least once daily for full protection coverage.</div>
          <div className="ring-row">
            {TODAY.rings.map(r=><ProtectionRing key={r.id} r={r}/>)}
          </div>
        </div>

        <div className="section">
          <TipCard tip={TODAY.tip}/>
        </div>

        <div className="section">
          <h2>Logged meals</h2>
          <div className="meta">{TODAY.meals.length} meals · 14 distinct compounds</div>
          {TODAY.meals.map(m=><MealRow key={m.id} m={m}/>)}
          <Btn variant="secondary" full onClick={()=>{}} >+ Log another meal</Btn>
        </div>

        <div className="section">
          <h2>Suggested next</h2>
          <div className="meta">You're missing <b style={{color:"var(--brand)"}}>legumes</b> today — high-fiber, butyrate-feeding.</div>
          <FoodCard food={FOODS.find(f=>f.id==="leafy")} onOpen={onOpenFood}/>
        </div>

        <div className="section" style={{paddingBottom:8}}>
          <Disclaimer kind="info">
            <strong>Educational reference only.</strong> Information is based on peer-reviewed research but should not replace medical advice.
          </Disclaimer>
        </div>
      </div>
    </div>
  );
}

// ────── Insights ──────
function InsightsScreen() {
  return (
    <div className="screen">
      <AppBar
        eyebrow="This week"
        title="Insights"
        sub="Coverage, diversity, and where to focus next"/>
      <div className="scroll">
        <div className="section" style={{paddingTop:14}}>
          <div className="insight-card">
            <h3>Food groups per day</h3>
            <div className="sub">Goal: 6+ of 12 groups daily</div>
            <WeekBars week={INSIGHTS.week} max={INSIGHTS.maxGroups}/>
          </div>

          <div className="insight-card">
            <h3>Organ protection coverage</h3>
            <div className="sub">Share of each system's top foods you ate this week</div>
            {INSIGHTS.coverage.map(c=><CoverageRow key={c.nm} c={c}/>)}
          </div>

          <div className="insight-card">
            <h3>Top compounds this week</h3>
            <div className="sub">From your logged meals</div>
            <div>{INSIGHTS.topCompounds.map(c=><Tag key={c} label={c} bg="#f0f4f0" color="#3d5a3e"/>)}</div>
          </div>

          <div className="insight-card" style={{borderColor:"var(--brand-soft-border)", background:"var(--brand-soft)"}}>
            <h3>Biggest gap: {INSIGHTS.gap.nm} {INSIGHTS.gap.em}</h3>
            <div style={{fontSize:13, color:"var(--fg-2)", lineHeight:1.55, marginTop:4}}>{INSIGHTS.gap.why}</div>
            <div style={{marginTop:10}}><Btn size="sm">See legume recipes</Btn></div>
          </div>

          <Disclaimer kind="corr">
            <strong>Coverage is a heuristic.</strong> Scores reflect how often you logged each system's protective foods — they are not a clinical measure of organ health.
          </Disclaimer>
          <div style={{height:16}}/>
        </div>
      </div>
    </div>
  );
}

// ────── Foods (search + tabs) ──────
const TABS = [
  {id:"foods",    emoji:"🥦", label:"Foods",    count:FOODS.length},
  {id:"organs",   emoji:"❤️", label:"Organs",   count:ORGANS.length},
  {id:"diseases", emoji:"🎗️", label:"Diseases", count:6},
];

function ExploreScreen({onOpenFood}) {
  const [tab, setTab] = React.useState("foods");
  const [search, setSearch] = React.useState("");
  const filteredFoods = React.useMemo(()=>FOODS.filter(f=>!search||
    f.group.toLowerCase().includes(search.toLowerCase()) ||
    f.compounds.some(c=>c.toLowerCase().includes(search.toLowerCase()))
  ),[search]);
  return (
    <div className="screen">
      <AppBar
        eyebrow="EVIDENCE-BASED DIETARY HEALTH REFERENCE"
        title="Food as Medicine"
        sub="How foods, compounds, and prep affect your health"
        search={search} setSearch={setSearch}
        tabs={TABS} activeTab={tab} onTab={setTab}/>
      <div className="scroll">
        <Disclaimer kind="info">
          <strong>Educational reference only.</strong> Consult a healthcare provider before significant dietary changes, especially if managing a condition or taking medications.
        </Disclaimer>
        <div className="section">
          {tab==="foods" && (
            <div className="fade-up">
              <div className="meta" style={{textAlign:"center",fontFamily:"var(--font-display)"}}>{filteredFoods.length} food groups — tap to expand</div>
              {filteredFoods.map(f=><FoodCard key={f.id} food={f} onOpen={onOpenFood}/>)}
            </div>
          )}
          {tab==="organs" && (
            <div className="fade-up">
              <div className="meta" style={{textAlign:"center",fontFamily:"var(--font-display)"}}>{ORGANS.length} organs & systems</div>
              {ORGANS.map(o=><OrganCard key={o.id} organ={o}/>)}
            </div>
          )}
          {tab==="diseases" && (
            <div className="fade-up">
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:10}}>
                <Tag label="🛡️ Prevention" bg="#e8f5ec" color="#2d7a4f"/>
                <Tag label="⚕️ Alleviation" bg="#fef0e0" color="#b06010"/>
                <Tag label="💊 Treatment" bg="#fdecea" color="#b02020"/>
              </div>
              <Disclaimer kind="corr">
                <strong>Correlational evidence noted where applicable.</strong> Many disease–diet relationships come from observational studies; causation requires RCTs.
              </Disclaimer>
              <div style={{height:8}}/>
              {ORGANS.map(o=><OrganCard key={o.id} organ={o}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ────── Food detail ──────
function FoodDetailScreen({food, onBack}) {
  return (
    <div className="screen">
      <div className="appbar" style={{paddingBottom:14}}>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>
      <div className="scroll" style={{paddingBottom:120}}>
        <div className="detail-hero" style={{"--hb":food.hb, "--bd":food.bd, background:food.hb, borderColor:food.bd}}>
          <span className="em">{food.emoji}</span>
          <h1>{food.group}</h1>
          <div className="items">{food.items}</div>
          <div style={{marginTop:8}}>
            {food.tags.map(t=><Tag key={t} label={t} bg="#fff" color={food.ac}/>)}
          </div>
        </div>
        <div className="section">
          <h2>Key compounds</h2>
          <div>{food.compounds.map(c=><Tag key={c} label={c} bg="#f0f4f0" color="#3d5a3e"/>)}</div>
        </div>
        <div className="section">
          <h2>Evidence-based benefits</h2>
          <ul style={{margin:0,paddingLeft:16}}>
            {food.benefits.map((b,i)=><li key={i} style={{fontSize:13.5,color:"#2a3a2a",lineHeight:1.6,marginBottom:7}}>{b}</li>)}
          </ul>
        </div>
        <div className="section">
          <div className="prep" style={{"--hb":food.hb, "--ac":food.ac, background:food.hb, borderLeftColor:food.ac}}>
            <div className="h" style={{color:food.ac, fontSize:11}}>👨‍🍳 Best preparation</div>
            <div className="b" style={{fontSize:13}}>{food.prep}</div>
          </div>
        </div>
        <div className="section">
          <Disclaimer kind="corr">
            <strong>Note on evidence.</strong> "{food.evidence}" — claims are mechanistic where based on lab studies, and population-level where based on epidemiology. Effect sizes vary.
          </Disclaimer>
        </div>
        <div className="section" style={{paddingBottom:24}}>
          <Btn full>+ Log {food.group.toLowerCase()} today</Btn>
          <div style={{height:8}}/>
          <Btn variant="secondary" full>Save to favorites</Btn>
        </div>
      </div>
    </div>
  );
}

// ────── Log meal (modal-ish) ──────
function LogMealScreen({onClose}) {
  const [picked, setPicked] = React.useState(["cruciferous","leafy"]);
  const toggle = id => setPicked(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return (
    <div className="screen">
      <div className="appbar" style={{paddingBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button className="back-btn" onClick={onClose}>← Cancel</button>
          <span style={{color:"var(--brand)",fontSize:11,letterSpacing:".15em",textTransform:"uppercase",fontWeight:700}}>Log a meal</span>
          <span style={{width:50}}/>
        </div>
        <h1 className="display" style={{fontSize:22,marginTop:8,textAlign:"center"}}>What did you eat?</h1>
      </div>
      <div className="scroll" style={{paddingBottom:140}}>
        <div className="section">
          <h2>Meal</h2>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {["Breakfast","Lunch","Dinner","Snack"].map((m,i)=>(
              <button key={m} className="btn sm" style={{
                background: i===1?"#2d7a4f":"#fff",
                color: i===1?"#fff":"#3d5a3e",
                border: i===1?"none":"1.5px solid #dde8d8"
              }}>{m}</button>
            ))}
          </div>
          <h2>Tap food groups</h2>
          <div className="meta">Don't worry about portions — we estimate from group + meal type.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
            {FOODS.map(f=>(
              <div key={f.id}
                onClick={()=>toggle(f.id)}
                style={{
                  background: picked.includes(f.id)?f.hb:"#fff",
                  border:`1.5px solid ${picked.includes(f.id)?f.bd:"#dde8d8"}`,
                  borderRadius:12, padding:"10px 12px",
                  display:"flex",gap:8,alignItems:"center",cursor:"pointer"
                }}>
                <span style={{fontSize:22}}>{f.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--font-display)",fontSize:12.5,fontWeight:700,color:"#1c2b1c"}}>{f.group}</div>
                  <div style={{fontSize:10.5,color:"#7a8f7b",marginTop:1}}>{f.items.split(",")[0]}, …</div>
                </div>
                {picked.includes(f.id) && <span style={{color:f.ac,fontWeight:700}}>✓</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="section" style={{paddingBottom:20}}>
          <Btn full onClick={onClose}>Save meal · {picked.length} groups</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingScreen, TodayScreen, ExploreScreen, FoodDetailScreen, LogMealScreen, InsightsScreen, TABS });
