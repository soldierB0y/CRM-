import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const Reportes = () => {
    const [apartments, setApartments] = useState([])
    const [bills, setBills] = useState([])
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterMonth, setFilterMonth] = useState("all")

    useEffect(() => {
        (async () => {
            const [resAp, resBills, resPays] = await Promise.all([
                window.api.getApartments(),
                window.api.getBills(),
                window.api.getPayments()
            ])
            const aps = resAp.result == 1 ? resAp.object.map(a => a.dataValues) : []
            const bs = resBills.result == true ? resBills.object : []
            const ps = resPays.result == true ? resPays.object : []
            setApartments(aps)
            setBills(bs)
            setPayments(ps)
            setLoading(false)
        })()
    }, [])

    // ── Helpers ──────────────────────────────────────────────────────────────
    const fmt = (n) => Number(n ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

    const monthOptions = () => {
        const months = new Set()
        bills.forEach(b => {
            const d = new Date(b.createdAt)
            if (!isNaN(d)) months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
        })
        return [...months].sort().reverse()
    }

    const filteredBills = filterMonth === "all"
        ? bills
        : bills.filter(b => {
            const d = new Date(b.createdAt)
            return !isNaN(d) && `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === filterMonth
        })

    // ── Summary metrics ───────────────────────────────────────────────────────
    const totalRent = apartments.reduce((s, a) => s + Number(a.rent ?? 0), 0)
    const totalCollected = payments.reduce((s, p) => s + Number(p.amount ?? 0), 0)
    const pendingBills = filteredBills.filter(b => b.state === 0)
    const paidBills = filteredBills.filter(b => b.state === 1)
    const pendingDebt = pendingBills.reduce((s, b) => s + Number(b.debt ?? 0), 0)
    const paidAmount = paidBills.reduce((s, b) => s + Number(b.debt ?? 0), 0)

    // ── Per-apartment stats ───────────────────────────────────────────────────
    const apStats = apartments.map(ap => {
        const apBills = filteredBills.filter(b => b.IDApartment === ap.IDApartment)
        const apPaid = apBills.filter(b => b.state === 1)
        const apPending = apBills.filter(b => b.state === 0)
        const apPayments = payments.filter(p =>
            apBills.some(b => b.IDMonthlyBill === p.IDMonthlyBill)
        )
        const collected = apPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0)
        const pendingAmt = apPending.reduce((s, b) => s + Number(b.debt ?? 0), 0)
        const pct = ap.rent > 0 ? Math.min(100, Math.round((collected / Number(ap.rent)) * 100)) : 0
        return { ...ap, apBills, apPaid, apPending, collected, pendingAmt, pct }
    })

    // ── Recent payments (last 10) ─────────────────────────────────────────────
    const recentPayments = [...payments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)

    // ── Chart data ────────────────────────────────────────────────────────────
    const pieData = [
        { name: 'Pagadas', value: paidBills.length },
        { name: 'Pendientes', value: pendingBills.length },
    ]
    const PIE_COLORS = ['#6fcf97', '#eb5757']
    const barData = apStats.map(ap => ({
        name: ap.name.length > 12 ? ap.name.slice(0, 12) + '…' : ap.name,
        Renta: Number(ap.rent ?? 0),
        Cobrado: ap.collected,
    }))

    // ── Exports ───────────────────────────────────────────────────────────────
    const exportExcel = () => {
        const rows = apStats.map(ap => ({
            ID: ap.IDApartment,
            Nombre: ap.name,
            Renta: Number(ap.rent ?? 0),
            Cobrado: ap.collected,
            Pendiente: ap.pendingAmt,
            'Facturas Pagadas': ap.apPaid.length,
            'Facturas Pendientes': ap.apPending.length,
            'Recaudacion %': ap.pct,
        }))
        const ws = XLSX.utils.json_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
        XLSX.writeFile(wb, `reporte_${filterMonth}_${new Date().toISOString().slice(0, 10)}.xlsx`)
    }

    const exportPDF = () => {
        const doc = new jsPDF()
        const periodo = filterMonth === 'all' ? 'Todos los periodos' : filterMonth
        doc.setFontSize(14)
        doc.text(`Reporte de Apartamentos - ${periodo}`, 14, 15)
        autoTable(doc, {
            head: [['ID', 'Nombre', 'Renta', 'Cobrado', 'Pendiente', 'F.Pagadas', 'F.Pendientes', '%']],
            body: apStats.map(ap => [
                ap.IDApartment, ap.name, fmt(ap.rent), fmt(ap.collected),
                fmt(ap.pendingAmt), ap.apPaid.length, ap.apPending.length, `${ap.pct}%`
            ]),
            startY: 25,
            styles: { fontSize: 9 },
        })
        doc.save(`reporte_${filterMonth}_${new Date().toISOString().slice(0, 10)}.pdf`)
    }

    if (loading) return (
        <div className="principalCol" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#e6e6e6', fontSize: 22 }}>Cargando reportes…</p>
        </div>
    )

    return (
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">Reportes</h1>

            {/* ── Filter bar ── */}
            <div className="searchButtons" style={{ padding: '10px 10px 0' }}>
                <label style={{ color: '#e6e6e6', marginRight: 8 }}>Periodo:</label>
                <select
                    value={filterMonth}
                    onChange={e => setFilterMonth(e.target.value)}
                    style={{ height: 38, borderRadius: 8, fontSize: 16, padding: '0 10px' }}
                >
                    <option value="all">Todos los periodos</option>
                    {monthOptions().map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <button className="openCrudBtn" onClick={exportExcel}>⬇ Excel</button>
                <button className="openCrudBtn" onClick={exportPDF} style={{ background: '#eb5757', color: '#fff' }}>⬇ PDF</button>
            </div>

            {/* ── Summary cards ── */}
            <div className="rpt-cards">
                <div className="rpt-card rpt-card--blue">
                    <span className="rpt-card__label">Renta mensual total</span>
                    <span className="rpt-card__value">{fmt(totalRent)}</span>
                </div>
                <div className="rpt-card rpt-card--green">
                    <span className="rpt-card__label">Total cobrado (historial)</span>
                    <span className="rpt-card__value">{fmt(totalCollected)}</span>
                </div>
                <div className="rpt-card rpt-card--yellow">
                    <span className="rpt-card__label">Deuda pendiente</span>
                    <span className="rpt-card__value">{fmt(pendingDebt)}</span>
                    <span className="rpt-card__sub">{pendingBills.length} factura(s)</span>
                </div>
                <div className="rpt-card rpt-card--teal">
                    <span className="rpt-card__label">Facturas pagadas</span>
                    <span className="rpt-card__value">{fmt(paidAmount)}</span>
                    <span className="rpt-card__sub">{paidBills.length} factura(s)</span>
                </div>
            </div>

            {/* ── Charts ── */}
            <div className="rpt-charts-row">
                <div className="rpt-chart-box">
                    <h2>Estado de Facturas</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%" cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="rpt-chart-box">
                    <h2>Renta vs Cobrado por Apartamento</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" tick={{ fill: '#e6e6e6', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#e6e6e6', fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                formatter={v => fmt(v)}
                                contentStyle={{ background: '#2e2e2e', border: '1px solid #555', borderRadius: 8 }}
                                labelStyle={{ color: '#e6e6e6' }}
                            />
                            <Legend />
                            <Bar dataKey="Renta" fill="#4a90e2" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Cobrado" fill="#6fcf97" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Per-apartment breakdown ── */}
            <div className="containerCover">
                <div className="apartContainer" style={{ flex: 2 }}>
                    <h2>Resumen por apartamento</h2>
                    <div className="searchContainer" style={{ marginTop: 12 }}>
                        <table className="tableInfo">
                            <thead>
                                <tr className="mainRow">
                                    <td>ID</td>
                                    <td>Nombre</td>
                                    <td>Renta</td>
                                    <td>Cobrado</td>
                                    <td>Pendiente</td>
                                    <td>Facturas</td>
                                    <td>Recaudación</td>
                                </tr>
                            </thead>
                            <tbody>
                                {apStats.length > 0 ? apStats.map((ap, i) => (
                                    <tr key={i}>
                                        <td>{ap.IDApartment}</td>
                                        <td>{ap.name}</td>
                                        <td>{fmt(ap.rent)}</td>
                                        <td style={{ color: '#e6e6e6' }}>{fmt(ap.collected)}</td>
                                        <td style={{ color: ap.pendingAmt > 0 ? '#b3b3b3' : '#e6e6e6' }}>{fmt(ap.pendingAmt)}</td>
                                        <td>
                                            <span style={{ color: '#6fcf97' }}>{ap.apPaid.length}✓</span>
                                            {' / '}
                                            <span style={{ color: '#eb5757' }}>{ap.apPending.length}✗</span>
                                        </td>
                                        <td style={{ minWidth: 100 }}>
                                            <div className="rpt-bar__wrap">
                                                <div className="rpt-bar__fill" style={{ width: `${ap.pct}%` }} />
                                                <span className="rpt-bar__label" style={{ color: '#121212' }}>{ap.pct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7}><p className="visible">Sin apartamentos registrados</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Recent payments ── */}
                <div className="apartContainer" style={{ flex: 1, minWidth: 300 }}>
                    <h2>Últimos pagos</h2>
                    <div className="searchContainer" style={{ marginTop: 12 }}>
                        <table className="tableInfo">
                            <thead>
                                <tr className="mainRow">
                                    <td>ID</td>
                                    <td>Factura</td>
                                    <td>Monto</td>
                                    <td>Pagador</td>
                                    <td>Fecha</td>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPayments.length > 0 ? recentPayments.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.IDPaymentModel}</td>
                                        <td>{p.IDMonthlyBill}</td>
                                        <td>{fmt(p.amount)}</td>
                                        <td>{p.payerName}</td>
                                        <td>{new Date(p.createdAt).toLocaleDateString('es-MX')}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5}><p className="visible">Sin pagos registrados</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}