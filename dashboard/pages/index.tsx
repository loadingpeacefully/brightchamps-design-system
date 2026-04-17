/**
 * dashboard/pages/index.tsx
 *
 * BrightChamps Design System — Drift Review Dashboard
 * Design team uses this to approve/reject each drift item.
 *
 * Run: npm run drift:review (from project root)
 */

import { useState, useEffect } from 'react'
import type { DriftItem, DriftReport } from '../../src/types/index.js'

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#CA8A04',
  low: '#16A34A',
}

const SEVERITY_BG: Record<string, string> = {
  critical: '#FEF2F2',
  high: '#FFF7ED',
  medium: '#FEFCE8',
  low: '#F0FDF4',
}

export default function DriftReviewDashboard() {
  const [report, setReport] = useState<DriftReport | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/drift/latest')
      .then(r => r.json())
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDecision = async (itemId: string, decision: 'approved' | 'rejected', canonicalValue?: string) => {
    await fetch('/api/drift/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, decision, canonicalValue }),
    })
    // Refresh report
    const updated = await fetch('/api/drift/latest').then(r => r.json())
    setReport(updated as DriftReport)
  }

  if (loading) return <div style={{ padding: 32, fontFamily: 'system-ui' }}>Loading drift report...</div>
  if (!report) return <div style={{ padding: 32, fontFamily: 'system-ui' }}>No drift report found. Run <code>npm run drift:detect</code> first.</div>

  const items = report.items.filter(i => filter === 'all' || i.status === filter)

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        BrightChamps Design System — Drift Review
      </h1>
      <p style={{ color: '#6B7280', marginBottom: 24, fontSize: 14 }}>
        Generated {new Date(report.generatedAt).toLocaleString()} · {report.summary.total} items
      </p>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
          <div key={sev} style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: SEVERITY_BG[sev],
            color: SEVERITY_COLORS[sev],
            fontWeight: 600,
            fontSize: 13,
          }}>
            {sev}: {report.summary[sev]}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#6B7280', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>✅ {report.summary.approved} approved</span>
          <span>❌ {report.summary.rejected} rejected</span>
          <span>⏳ {report.summary.pending} pending</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: filter === f ? '#1D4ED8' : 'transparent',
              color: filter === f ? 'white' : '#6B7280',
              borderRadius: '6px 6px 0 0',
              fontWeight: filter === f ? 600 : 400,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {f} ({f === 'all' ? report.summary.total : report.summary[f as keyof typeof report.summary]})
          </button>
        ))}
      </div>

      {/* Drift items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.length === 0 && (
          <p style={{ color: '#6B7280', textAlign: 'center', padding: 40 }}>
            No {filter} items. {filter === 'pending' ? '🎉 All resolved!' : ''}
          </p>
        )}
        {items.map(item => (
          <DriftCard key={item.id} item={item} onDecide={handleDecision} />
        ))}
      </div>
    </div>
  )
}

function DriftCard({
  item,
  onDecide,
}: {
  item: DriftItem
  onDecide: (id: string, decision: 'approved' | 'rejected', value?: string) => void
}) {
  const [customValue, setCustomValue] = useState('')

  return (
    <div style={{
      border: `1px solid ${item.status === 'pending' ? '#E5E7EB' : '#D1FAE5'}`,
      borderLeft: `4px solid ${SEVERITY_COLORS[item.severity]}`,
      borderRadius: 8,
      padding: 16,
      background: item.status === 'approved' ? '#F0FDF4' : item.status === 'rejected' ? '#FFF1F2' : 'white',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <code style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{item.tokenName}</code>
          <span style={{
            marginLeft: 8,
            fontSize: 11,
            background: SEVERITY_BG[item.severity],
            color: SEVERITY_COLORS[item.severity],
            padding: '2px 8px',
            borderRadius: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>{item.severity}</span>
          <span style={{ marginLeft: 8, fontSize: 12, color: '#6B7280' }}>{item.surface}</span>
        </div>
        {item.status !== 'pending' && (
          <span style={{ fontSize: 12, color: item.status === 'approved' ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
            {item.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>FIGMA</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {item.figmaValue.startsWith('#') && (
              <div style={{ width: 20, height: 20, borderRadius: 4, background: item.figmaValue, border: '1px solid #E5E7EB' }} />
            )}
            <code style={{ fontSize: 14, fontWeight: 600 }}>{item.figmaValue}</code>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>LIVE (DOM)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {item.domValue.startsWith('#') && (
              <div style={{ width: 20, height: 20, borderRadius: 4, background: item.domValue, border: '1px solid #E5E7EB' }} />
            )}
            <code style={{ fontSize: 14, fontWeight: 600 }}>{item.domValue}</code>
          </div>
        </div>
      </div>

      {item.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button
            onClick={() => onDecide(item.id, 'approved', item.figmaValue)}
            style={{ padding: '6px 14px', background: '#2563EB', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Use Figma
          </button>
          <button
            onClick={() => onDecide(item.id, 'approved', item.domValue)}
            style={{ padding: '6px 14px', background: '#059669', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Use Live
          </button>
          <input
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            placeholder="Custom value..."
            style={{ padding: '6px 10px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 13, width: 140 }}
          />
          {customValue && (
            <button
              onClick={() => onDecide(item.id, 'approved', customValue)}
              style={{ padding: '6px 14px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
            >
              Use Custom
            </button>
          )}
          <button
            onClick={() => onDecide(item.id, 'rejected')}
            style={{ padding: '6px 14px', background: 'white', color: '#DC2626', border: '1px solid #DC2626', borderRadius: 6, cursor: 'pointer', fontSize: 13, marginLeft: 'auto' }}
          >
            Skip
          </button>
        </div>
      )}
    </div>
  )
}
