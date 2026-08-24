import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { fmt } from '../data.js';

const TYPES = ['ดอกหัก', 'ดอกตาม', 'เปียประมูลดอก', 'จับฉลาก'];

function typeBtnStyle(active) {
  return {
    flex: '1 1 130px',
    padding: '10px 12px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'center',
    border: active ? '1.5px solid hsl(var(--gold))' : '1px solid hsl(var(--border))',
    background: active ? 'hsl(var(--gold)/0.08)' : 'hsl(var(--card))',
    color: 'hsl(var(--foreground))',
    boxShadow: active ? '0 0 0 3px hsl(var(--gold)/0.15)' : 'none',
  };
}

export function CreateCircle({ form, setForm, createCircle }) {
  const pot = (Number(form.hand) || 0) * (Number(form.hands) || 0);
  const feeAmt = Math.round((pot * (Number(form.fee) || 0)) / 100);
  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setType = (t) => () => setForm({ ...form, type: t });

  return (
    <section style={{ animation: 'wj-in .4s var(--ease-brand)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>
        New Circle · คุณเป็นท้าวแชร์
      </div>
      <h1 style={{ fontSize: 28, marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 700 }}>สร้างวงแชร์</h1>
      <div style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', marginTop: 4 }}>
        กำหนดเงื่อนไขให้ชัดตั้งแต่ต้น — ระบบบันทึกกติกาและแจ้งสมาชิกทุกคนก่อนยืนยันเข้าร่วม
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14, marginTop: 20, alignItems: 'start' }}>
        <div className="glass-card" style={{ borderRadius: 'var(--radius-xl)', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="ชื่อวง" value={form.name} onChange={setF('name')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="ค่างวดต่อมือ (บาท)" value={form.hand} onChange={setF('hand')} inputMode="numeric" />
            <Input label="จำนวนมือ" value={form.hands} onChange={setF('hands')} inputMode="numeric" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>รูปแบบดอก</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TYPES.map((t) => (
                <button key={t} onClick={setType(t)} style={typeBtnStyle(form.type === t)}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: 'hsl(var(--muted-foreground))', marginTop: 8 }}>
              ดอกหัก = ผู้ยังไม่เปียจ่ายค่างวดหักดอก · ดอกตาม = จ่ายเต็ม รับดอกคืนท้ายวง · จับฉลาก = เรียงคิวไม่มีประมูล
            </div>
          </div>
          <Input
            label="ค่าดูแลท้าวแชร์ (% ของวงเงิน)"
            value={form.fee}
            onChange={setF('fee')}
            inputMode="numeric"
            hint="ตามธรรมเนียมมักเป็นมือแรกของวงหรือ 1–3%"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 'var(--radius-2xl)',
              background: 'hsl(var(--foreground))',
              color: '#fff',
              padding: 24,
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <div style={{ position: 'absolute', top: -70, right: -70, width: 200, height: 200, borderRadius: '50%', background: 'var(--pride-aura)', filter: 'blur(46px)', opacity: 0.32 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.65 }}>สรุปวงของคุณ</div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 19, marginTop: 8 }}>{form.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
                <div>
                  <div style={{ fontSize: 10.5, opacity: 0.6 }}>วงเงินรวมต่องวด</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'hsl(var(--gold))', marginTop: 2 }}>{fmt(pot)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, opacity: 0.6 }}>ระยะเวลาวง</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginTop: 2 }}>{form.hands || 0} งวด</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, opacity: 0.6 }}>ค่างวดต่อมือ</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{fmt(form.hand || 0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, opacity: 0.6 }}>ค่าดูแลท้าว</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{fmt(feeAmt)}</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '16px 0' }} />
              <div style={{ fontSize: 11.5, opacity: 0.75, lineHeight: 1.7 }}>
                รูปแบบ <b>{form.type}</b> · เปียทุกวันที่ 25 · สมาชิกยืนยันตัวตนก่อนเข้าวง · สลิปทุกงวดตรวจโดยท้าวและเก็บเป็นหลักฐานถาวร
              </div>
              <Button variant="gold" block onClick={createCircle} style={{ marginTop: 18 }}>
                สร้างวงและส่งคำเชิญ
              </Button>
            </div>
          </div>
          <div className="glass-card" style={{ borderRadius: 'var(--radius-lg)', padding: '14px 18px', fontSize: 11.5, color: 'hsl(var(--muted-foreground))', lineHeight: 1.7 }}>
            <b style={{ color: 'hsl(var(--foreground))' }}>ข้อควรทราบ</b> · วงแชร์ระหว่างบุคคลอยู่ภายใต้ พ.ร.บ. การเล่นแชร์ พ.ศ. 2534 — ท้าวแชร์บุคคลธรรมดาจัดได้ไม่เกิน 3 วง
            สมาชิกรวมไม่เกิน 30 คน และวงเงินรวมไม่เกินที่กฎหมายกำหนด
          </div>
        </div>
      </div>
    </section>
  );
}
