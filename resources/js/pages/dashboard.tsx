import { Head } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Stats {
    totalCampaigns: number;
    openCampaigns: number;
    totalCollaborators: number;
    vaccinated: number;
    notVaccinated: number;
    pending: number;
    vaccinationRate: number;
    consentRate: number;
}

interface CampaignRow {
    id: number;
    name: string;
    pole: string;
    status: string;
    target: number;
    vaccinated: number;
    not_vaccinated: number;
    pending: number;
    rate: number;
}

interface Props {
    stats: Stats;
    campaignBreakdown: CampaignRow[];
}

function StatCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
    return (
        <div
            className={
                highlight
                    ? 'rounded-xl bg-primary p-6 text-primary-foreground shadow-sm'
                    : 'rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm'
            }
        >
            <div className="text-3xl font-bold">{value}</div>
            <div className={highlight ? 'mt-1 text-sm opacity-90' : 'mt-1 text-sm text-muted-foreground'}>{label}</div>
        </div>
    );
}

export default function Dashboard({ stats, campaignBreakdown }: Props) {
    const vaccinationData = [
        { name: 'Vaccinated', value: stats.vaccinated },
        { name: 'Not vaccinated', value: stats.notVaccinated },
        { name: 'Pending', value: stats.pending },
    ];

    const COLORS = ['oklch(0.55 0.2 260)', 'oklch(0.7 0.15 200)', 'oklch(0.7 0.05 260)'];

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total campaigns" value={stats.totalCampaigns} />
                    <StatCard label="Open campaigns" value={stats.openCampaigns} />
                    <StatCard label="Total collaborators" value={stats.totalCollaborators} />
                </div>

                <h2 className="mb-4 text-xl font-semibold">Vaccination</h2>
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <StatCard label="Vaccinated" value={stats.vaccinated} />
                    <StatCard label="Not vaccinated" value={stats.notVaccinated} />
                    <StatCard label="Pending" value={stats.pending} />
                    <StatCard label="Vaccination rate" value={`${stats.vaccinationRate}%`} highlight />
                    <StatCard label="Consent rate" value={`${stats.consentRate}%`} highlight />
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Vaccination breakdown</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={vaccinationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                                    {vaccinationData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Vaccination rate by campaign</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={campaignBreakdown} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                                <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} fontSize={12} />
                                <YAxis unit="%" domain={[0, 100]} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="rate" fill="oklch(0.55 0.2 260)" name="Vaccination rate" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <h2 className="mb-4 text-xl font-semibold">Per-campaign breakdown</h2>
                {campaignBreakdown.length === 0 ? (
                    <p className="text-muted-foreground">No campaigns yet.</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Campaign</th>
                                    <th className="px-4 py-3 text-left font-semibold">Pôle</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Target</th>
                                    <th className="px-4 py-3 text-right font-semibold">Vaccinated</th>
                                    <th className="px-4 py-3 text-right font-semibold">Not vacc.</th>
                                    <th className="px-4 py-3 text-right font-semibold">Pending</th>
                                    <th className="px-4 py-3 text-right font-semibold">Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaignBreakdown.map((c) => (
                                    <tr key={c.id} className="border-t border-border hover:bg-muted/50">
                                        <td className="px-4 py-3 font-medium">{c.name}</td>
                                        <td className="px-4 py-3">{c.pole}</td>
                                        <td className="px-4 py-3">
                                            <span className={c.status === 'open' ? 'rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary' : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">{c.target}</td>
                                        <td className="px-4 py-3 text-right">{c.vaccinated}</td>
                                        <td className="px-4 py-3 text-right">{c.not_vaccinated}</td>
                                        <td className="px-4 py-3 text-right">{c.pending}</td>
                                        <td className="px-4 py-3 text-right font-semibold">{c.rate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}