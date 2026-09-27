interface KpiCardProps {
    label: string
    value: string
    unit?: string
}

function KpiCard({ label, value, unit }: KpiCardProps) {
    return (
        <article className="block kpi">
            <h2>{label}</h2>
            <p className="kpi-value">
                {value}
                {unit && <span className="kpi-unit"> {unit}</span>}
            </p>
        </article>
    )
}

export default KpiCard