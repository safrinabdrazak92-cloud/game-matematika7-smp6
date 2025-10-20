
import React, { useEffect, useState } from "react";

const TOTAL_SQUARES = 100;
const SNAKES = {16:6,49:11,62:19,87:24,95:75};
const LADDERS = {3:22,8:30,28:84,36:55,50:70};
const Q_SQUARES = [4,7,10,12,15,18,21,25,27,31,33,35,38,42,45,48,52,54,59,63,66,68,71,76,79,82,85,88,93,98];
const QUESTIONS = [
  { q: "12 + (–7) =", a: "5" },{ q: "(–9) + (–8) =", a: "-17" },{ q: "25 – (–15) =", a: "40" },
  { q: "(–20) – (–10) =", a: "-10" },{ q: "(–8) × (–3) =", a: "24" },{ q: "(–9) × 7 =", a: "-63" },
  { q: "(–56) ÷ (–8) =", a: "7" },{ q: "(–45) ÷ 9 =", a: "-5" },{ q: "18 + (–25) =", a: "-7" },
  { q: "(–14) + 9 =", a: "-5" },{ q: "(–30) – 12 =", a: "-42" },{ q: "(–9) × (–5) =", a: "45" },
  { q: "(–49) ÷ 7 =", a: "-7" },{ q: "(–6) × 8 =", a: "-48" },{ q: "(–80) ÷ (–10) =", a: "8" },
  { q: "(–18) + 20 =", a: "2" },{ q: "15 – (–7) =", a: "22" },{ q: "(–12) + (–13) =", a: "-25" },
  { q: "(–16) × (–4) =", a: "64" },{ q: "(–81) ÷ 9 =", a: "-9" },{ q: "(–5) × (–9) =", a: "45" },
  { q: "(–48) ÷ (–6) =", a: "8" },{ q: "50 – 75 =", a: "-25" },{ q: "(–15) + 30 =", a: "15" },
  { q: "(–64) ÷ 8 =", a: "-8" },{ q: "32 – (–18) =", a: "50" },{ q: "(–9) × 4 =", a: "-36" },
  { q: "(–45) + (–55) =", a: "-100" },{ q: "(–10) ÷ (–2) =", a: "5" },{ q: "Suhu awal –5°C, naik 7°C. Suhu sekarang?", a: "2°C" },
  // Additional mixed and story questions appended
  { q: "Hitung: (–3) × 5 + 2 =", a: "-13" },{ q: "Jika suhu pagi –2°C lalu turun 5°C, berapa sekarang?", a: "-7°C" },
  { q: "Sebuah batu dilempar ke bawah -5 m dari permukaan, kemudian diangkat 8 m. Posisi akhir?", a: "3 m di atas" }
];

export default function UlarTanggaApp(){
  const [showSplash, setShowSplash] = useState(true);
  const [playersCount,setPlayersCount] = useState(2);
  const [players,setPlayers] = useState([{pos:1,color:'#2b6cb0'},{pos:1,color:'#f6ad55'}]);
  const [current,setCurrent] = useState(0);
  const [dice,setDice] = useState(null);
  const [log,setLog] = useState([]);
  const [showQuestion,setShowQuestion] = useState(false);
  const [qIndex,setQIndex] = useState(null);
  const [input,setInput] = useState('');
  const [winner,setWinner] = useState(null);

  useEffect(()=>{
    const t = setTimeout(()=> setShowSplash(false), 2000);
    return ()=> clearTimeout(t);
  },[]);

  function initGame(n){ setPlayersCount(n); const arr=[]; for(let i=0;i<n;i++) arr.push({pos:1,color: i===0? '#2b6cb0':'#f6ad55'}); setPlayers(arr); setCurrent(0); setDice(null); setLog([]); setWinner(null); setShowQuestion(false); }

  function roll(){
    if(winner) return;
    const r = Math.floor(Math.random()*6)+1;
    setDice(r);
    const newPlayers = [...players];
    let np = newPlayers[current].pos + r;
    if(np>100) np=100;
    addLog(`P${current+1} melempar dadu: ${r} (dari ${newPlayers[current].pos} → ${np})`);
    newPlayers[current].pos = np;
    if(LADDERS[np]){ addLog(`Naik tangga ke ${LADDERS[np]}`); newPlayers[current].pos = LADDERS[np]; }
    else if(SNAKES[np]){ addLog(`Turun ular ke ${SNAKES[np]}`); newPlayers[current].pos = SNAKES[np]; }
    if(Q_SQUARES.includes(newPlayers[current].pos)){
      setPlayers(newPlayers); setQIndex(Q_SQUARES.indexOf(newPlayers[current].pos)); setShowQuestion(true); setInput(''); return;
    }
    setPlayers(newPlayers);
    if(newPlayers[current].pos===100){ setWinner(current); addLog(`P${current+1} menang!`); return; }
    setCurrent((current+1)%playersCount);
  }

  function submitAns(){
    const q = QUESTIONS[qIndex];
    const correct = q.a.replace(/\s+/g,'').toLowerCase();
    const given = input.replace(/\s+/g,'').toLowerCase();
    const newPlayers = [...players];
    if(given===correct){ newPlayers[current].pos = Math.min(100, newPlayers[current].pos + 2); addLog(`P${current+1} benar. Maju 2 langkah → ${newPlayers[current].pos}`); }
    else{ newPlayers[current].pos = Math.max(1, newPlayers[current].pos - 1); addLog(`P${current+1} salah. Mundur 1 langkah → ${newPlayers[current].pos}`); }
    setPlayers(newPlayers); setShowQuestion(false); setQIndex(null); setInput('');
    const pos = newPlayers[current].pos;
    if(LADDERS[pos]){ addLog(`Setelah jawaban: naik tangga ke ${LADDERS[pos]}`); newPlayers[current].pos = LADDERS[pos]; setPlayers([...newPlayers]); }
    else if(SNAKES[pos]){ addLog(`Setelah jawaban: turun ular ke ${SNAKES[pos]}`); newPlayers[current].pos = SNAKES[pos]; setPlayers([...newPlayers]); }
    if(newPlayers[current].pos===100){ setWinner(current); addLog(`P${current+1} menang!`); return; }
    setCurrent((current+1)%playersCount);
  }

  function addLog(t){ setLog(prev=> [t,...prev].slice(0,50)); }

  return (
    <div className="container">
      {showSplash && (
        <div style={{textAlign:'center',padding:40,background:'#e6f6ff',borderRadius:12}}>
          <h2 className="school">SMP Negeri 6 Satap Paguyaman Pantai</h2>
          <h1 className="title">Ular Tangga Bilangan Bulat Seru!</h1>
          <p style={{color:'#334155'}}>Tema: Cerah & Pastel — Versi Aplikasi</p>
        </div>
      )}
      {!showSplash && (
        <>
          <header className="header">
            <div>
              <div className="school">SMP Negeri 6 Satap Paguyaman Pantai</div>
              <h1 className="title">Ular Tangga Bilangan Bulat Seru!</h1>
              <p style={{color:'#64748b'}}>Operasi bilangan bulat — campuran & soal cerita</p>
            </div>
            <div>
              <label>Jumlah pemain: </label>
              <select value={playersCount} onChange={(e)=>initGame(Number(e.target.value))}>
                <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
              </select>
              <button onClick={()=>initGame(playersCount)} style={{marginLeft:8}}>Mulai Ulang</button>
            </div>
          </header>
          <main style={{display:'flex',gap:16}}>
            <section style={{flex:2}}>
              <div className="board-grid">
                {Array.from({length:100}).map((_,i)=>{
                  const num = 100 - i;
                  const isQ = Q_SQUARES.includes(num);
                  const isSnake = Object.keys(SNAKES).includes(String(num));
                  const isLadder = Object.keys(LADDERS).includes(String(num));
                  return (
                    <div key={num} className="cell" title={`Kotak ${num}`}>
                      <div style={{position:'absolute',left:6,top:4,fontSize:11,color:'#475569'}}>{num}</div>
                      {isQ && <div className="q-badge">Q</div>}
                      {isSnake && <div style={{position:'absolute',bottom:4,left:6}}>🐍</div>}
                      {isLadder && <div style={{position:'absolute',bottom:4,right:6}}>🪜</div>}
                      <div style={{display:'flex',gap:6}}>
                        {players.map((p,idx)=> p.pos===num ? <div key={idx} className="token" style={{background:p.color}}></div> : null)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="controls">
                <div className="panel"><b>Giliran:</b> Pemain {current+1}</div>
                <div className="panel"><b>Dadu:</b> <span style={{fontSize:20}}>{dice ?? '—'}</span></div>
                <div><button onClick={roll} style={{background:'#06b6d4',color:'white',padding:'8px 12px',borderRadius:8}}>Lempar Dadu</button></div>
              </div>
            </section>
            <aside style={{flex:1}}>
              <div className="panel">
                <h3>Aturan Cepat</h3>
                <ol>
                  <li>Jika mendarat di Q → jawab pertanyaan.</li>
                  <li>Benar → maju 2, Salah → mundur 1.</li>
                  <li>Ular & Tangga bekerja otomatis.</li>
                  <li>Pemenang: sampai kotak 100.</li>
                </ol>
              </div>
              <div className="panel" style={{marginTop:12}}>
                <h3>Log</h3>
                <div style={{maxHeight:220,overflow:'auto'}}>{log.length===0 ? <div style={{color:'#94a3b8'}}>Belum ada aksi</div> : log.map((l,i)=>(<div key={i} style={{marginBottom:6}}>{l}</div>))}</div>
              </div>
            </aside>
          </main>

          {showQuestion && (
            <div className="modal">
              <div className="modal-content">
                <h3>Soal untuk Pemain {current+1}</h3>
                <div style={{fontSize:18,fontWeight:600,marginTop:8}}>{QUESTIONS[qIndex].q}</div>
                <input value={input} onChange={(e)=>setInput(e.target.value)} style={{width:'100%',padding:8,marginTop:12,borderRadius:6,border:'1px solid #e2e8f0'}} placeholder="Ketik jawaban..." />
                <div style={{textAlign:'right',marginTop:12}}>
                  <button onClick={()=>{ setShowQuestion(false); setInput(''); setCurrent((current+1)%playersCount); }} style={{marginRight:8}}>Lewati</button>
                  <button onClick={submitAns} style={{background:'#6366f1',color:'white',padding:'8px 12px',borderRadius:6}}>Kirim Jawaban</button>
                </div>
              </div>
            </div>
          )}

          {winner!==null && (
            <div className="modal">
              <div className="modal-content" style={{textAlign:'center'}}>
                <h2>Pemenang: Pemain {winner+1} 🎉</h2>
                <p>Selamat! Anda menguasai operasi bilangan bulat.</p>
                <div style={{marginTop:12}}><button onClick={()=>initGame(playersCount)} style={{background:'#10b981',color:'white',padding:'8px 12px',borderRadius:6}}>Main Lagi</button></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
