import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { fmt } from '../data.js';

export function Live({
  phase,
  secsLabel,
  barPct,
  myBid,
  setMyBid,
  submitBid,
  topAmt,
  bids,
  winner,
  receive,
  hand,
  paidHands,
  hands,
  goCircle,
  restartLive,
}) {
  const top = bids.length ? bids.reduce((a, b) => (b.amt > a.amt ? b : a)) : null;
  const topAmtF = top ? fmt(topAmt) : '—';
  const topName = top ? top.name : 'ยังไม่มีผู้เสนอ';

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'hsl(var(--destructive))',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'hsl(var(--destructive))', animation: 'wj-pulse 1.4s infinite' }} />
            Live Auction · วงทอง 50,000 · งวด 4
          </div>
          <h1 style={{ fontSize: 28, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700 }}>ห้องเปียสด — ประมูลดอก</h1>
          <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
            แบบดอกหัก · ผู้เสนอดอกสูงสุดเมื่อหมดเวลาได้รับเงินก้อน · ผู้มีสิทธิ์ 7 มือ · ออนไลน์ 6
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 14, marginTop: 20, alignItems: 'start' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)',
            background: 'hsl(var(--foreground))',
            color: '#fff',
            padding: 26,
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          <div style={{ position: 'absolute', top: -90, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(52px)', opacity: 0.32 }} />
          <div style={{ position: 'relative' }}>
            {phase === 'open' && (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.65 }}>ปิดรับซองใน</div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 64,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginTop: 10,
                    color: 'hsl(var(--gold))',
                    animation: 'wj-tick 1s infinite',
                  }}
                >
                  {secsLabel}
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.12)', marginTop: 16, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${barPct}%`,
                      borderRadius: 99,
                      background: barPct <= 16.6 ? 'hsl(var(--destructive))' : 'var(--gradient-pride)',
                      transition: 'width 1s linear',
                    }}
                  />
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '20px 0' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.65 }}>
                  ยื่นซองของคุณ · ดอกต่อมือ (บาท)
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <input
                    value={myBid}
                    onChange={(e) => setMyBid(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="เช่น 400"
                    inputMode="numeric"
                    style={{
                      flex: 1,
                      minWidth: 120,
                      height: 46,
                      padding: '0 16px',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                  <Button variant="gold" onClick={submitBid}>
                    ส่งซองเปีย
                  </Button>
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 10 }}>ต้องสูงกว่าดอกนำ {topAmtF} · เพดาน ฿1,000 · ซองมีผลผูกพันเมื่อชนะ</div>
              </>
            )}

            {phase === 'closed' && (
              <div style={{ textAlign: 'center', padding: '44px 0' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.65 }}>หมดเวลา · ปิดรับซองแล้ว</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 21, fontWeight: 700, marginTop: 12 }}>กำลังตรวจสอบและจัดอันดับซอง…</div>
                <div style={{ height: 5, width: 160, margin: '18px auto 0', borderRadius: 99, background: 'var(--gradient-pride)', animation: 'wj-pulse 1s infinite' }} />
              </div>
            )}

            {phase === 'winner' && (
              <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.65 }}>ผลการเปียงวดที่ 4</div>
                <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '14px auto 0', background: 'var(--pride-aura)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'hsl(var(--foreground))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    🏆
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 21, fontWeight: 700, marginTop: 12 }}>{winner ? winner.name : '—'}</div>
                <div style={{ fontSize: 12.5, opacity: 0.65, marginTop: 2 }}>ชนะด้วยดอก {winner ? fmt(winner.amt) : '฿0'} ต่อมือ</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, color: 'hsl(var(--gold))', marginTop: 12, letterSpacing: '-0.02em' }}>{fmt(receive)}</div>
                <div style={{ fontSize: 11.5, opacity: 0.6 }}>ยอดรับสุทธิงวดนี้</div>
                <div
                  style={{
                    textAlign: 'left',
                    marginTop: 16,
                    padding: '14px 16px',
                    borderRadius: 'var(--radius)',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: 12,
                    lineHeight: 1.75,
                    opacity: 0.9,
                  }}
                >
                  <b>สรุปการชำระ</b>
                  <br />· ยังไม่เปีย {hands - paidHands - 1} มือ → จ่าย {fmt(hand - (winner ? winner.amt : 0))} (หักดอก)
                  <br />· เปียแล้ว {paidHands} มือ → จ่ายเต็ม {fmt(hand)}
                  <br />· ท้าวรวบรวมและโอนภายใน 24 ชม. พร้อมหลักฐาน
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    pill
                    onClick={goCircle}
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
                  >
                    ดูตารางงวด
                  </Button>
                  <Button variant="gold" size="sm" pill onClick={restartLive}>
                    จำลองเปียใหม่
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
              ซองเรียลไทม์ · {bids.length}
            </div>
            <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))' }}>
              ดอกนำ <b style={{ color: 'hsl(var(--gold))' }}>{topAmtF}</b> · {topName}
            </div>
          </div>

          {bids.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {bids.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 12px',
                    borderRadius: 'var(--radius)',
                    animation: 'wj-in .35s var(--ease-brand)',
                    background: b.isTop ? 'hsl(var(--gold)/0.08)' : b.mine ? 'hsl(var(--mist)/0.18)' : 'hsl(var(--card))',
                    border: b.isTop ? '1px solid hsl(var(--gold)/0.45)' : '1px solid hsl(var(--border)/0.6)',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'hsl(var(--secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: 'hsl(var(--muted-foreground))',
                      flexShrink: 0,
                    }}
                  >
                    {b.name.slice(0, 1)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 10.5, color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}>เหลือ {b.t}</div>
                  </div>
                  {b.isTop ? <Badge variant="gold">ดอกนำ</Badge> : null}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700 }}>{fmt(b.amt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '38px 0', textAlign: 'center', fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
              ยังไม่มีซองเข้ามา — ซองจะปรากฏทันทีที่สมาชิกยื่น
            </div>
          )}

          <div className="rule-muted" style={{ margin: '14px 0' }} />
          <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', lineHeight: 1.7 }}>
            กติกา: เห็นซองแข่งเรียลไทม์ · เสนอได้หลายครั้งจนหมดเวลา · ดอกเท่ากันถือซองที่ยื่นก่อน · ผลบันทึกในตารางงวดและแจ้งทุกสมาชิก
          </div>
        </div>
      </div>
    </section>
  );
}
