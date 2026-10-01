import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import ActionButton from '@/components/action-button';

interface Pole {
    id: number;
    name: string;
}

interface Collaborator {
    id: number;
    first_name: string;
    last_name: string;
    matricule: string;
}

interface Participation {
    id: number;
    status: string;
    consent: string | null;
    visit_date: string | null;
    collaborator: Collaborator;
}

interface Campaign {
    id: number;
    name: string;
    launch_date: string;
    objective: string | null;
    status: string;
    pole: Pole;
    participations: Participation[];
}

interface Props {
    campaign: Campaign;
    availableCollaborators: Collaborator[];
}

function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
        vaccine: 'bg-[oklch(0.7_0.13_200)]/15 text-[oklch(0.5_0.13_200)]',
        non_vaccine: 'bg-[oklch(0.45_0.13_150)]/15 text-[oklch(0.45_0.13_150)]',
        en_instance: 'bg-muted text-muted-foreground',
    };
    const labels: Record<string, string> = {
        vaccine: 'vacciné',
        non_vaccine: 'non vacciné',
        en_instance: 'en instance',
    };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-muted'}`}>{labels[status] ?? status}</span>;
}

export default function Show({ campaign, availableCollaborators }: Props) {
    const pendingCount = campaign.participations.filter((p) => p.status === 'en_instance').length;
    const { data, setData, post, processing } = useForm<{ collaborator_ids: number[] }>({
        collaborator_ids: [],
    });
    const { auth } = usePage().props;
    const role = (auth.user as typeof auth.user & { role: string }).role;
    const canAct = role === 'medecin' || role === 'infirmier';

    const CYAN = 'oklch(0.7 0.13 200)';
    const DARKGREEN = 'oklch(0.45 0.13 150)';
    const MAGENTA = 'oklch(0.6 0.08 330)';

    function toggle(id: number) {
        if (data.collaborator_ids.includes(id)) {
            setData('collaborator_ids', data.collaborator_ids.filter((x) => x !== id));
        } else {
            setData('collaborator_ids', [...data.collaborator_ids, id]);
        }
    }

    function addParticipants(e: React.FormEvent) {
        e.preventDefault();
        post(`/campaigns/${campaign.id}/participants`);
    }

    function updateParticipation(participationId: number, payload: { status: string; consent?: string; visit_date?: string }) {
        router.put(`/participations/${participationId}`, payload);
    }

    function closeCampaign() {
        if (confirm('Close this campaign? This cannot be undone.')) {
            router.put(`/campaigns/${campaign.id}/close`);
        }
    }

    return (
        <>
            <Head title={campaign.name} />
            <div className="p-6">
                <Link href="/campaigns" className="text-sm text-primary hover:underline">
                    ← Back to campaigns
                </Link>

                <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{campaign.name}</h1>
                        <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                            <div>Pôle: {campaign.pole.name}</div>
                            <div>Launch date: {campaign.launch_date}</div>
                            {campaign.objective && <div>Objective: {campaign.objective}</div>}
                        </div>
                    </div>
                    <div>
                        {campaign.status === 'open' ? (
                            <div className="flex flex-col items-end gap-1">
                                <ActionButton color={DARKGREEN} disabled={!canAct || pendingCount > 0} onClick={closeCampaign} style={{ padding: '0.5rem 1rem' }}>
                                    Close campaign
                                </ActionButton>
                                {pendingCount > 0 && (
                                    <span className="text-xs text-muted-foreground">{pendingCount} still en instance</span>
                                )}
                            </div>
                        ) : (
                            <span className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground">Closed</span>
                        )}
                    </div>
                </div>

                <h2 className="mb-3 text-lg font-semibold">Participants ({campaign.participations.length})</h2>

                {campaign.participations.length === 0 ? (
                    <p className="text-muted-foreground">No collaborators added to this campaign yet.</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Matricule</th>
                                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold">Consent</th>
                                    <th className="px-4 py-3 text-left font-semibold">Visit date</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaign.participations.map((p) => (
                                    <tr key={p.id} className="border-t border-border hover:bg-muted/50">
                                        <td className="px-4 py-3">{p.collaborator.matricule}</td>
                                        <td className="px-4 py-3 font-medium">{p.collaborator.first_name} {p.collaborator.last_name}</td>
                                        <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                                        <td className="px-4 py-3">{p.consent ?? '—'}</td>
                                        <td className="px-4 py-3">{p.visit_date ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            {campaign.status === 'open' && (
                                                <>
                                                    {p.status === 'en_instance' && (
                                                        <>
                                                            <ActionButton color={CYAN} disabled={!canAct} onClick={() => updateParticipation(p.id, { status: 'vaccine', consent: 'accepte', visit_date: new Date().toISOString().slice(0, 10) })} style={{ marginRight: '0.5rem' }}>
                                                                Vaccinate
                                                            </ActionButton>
                                                            <ActionButton color={DARKGREEN} disabled={!canAct} onClick={() => updateParticipation(p.id, { status: 'non_vaccine', consent: 'refuse', visit_date: new Date().toISOString().slice(0, 10) })}>
                                                                Refuse
                                                            </ActionButton>
                                                        </>
                                                    )}
                                                    {p.status !== 'en_instance' && (
                                                        <ActionButton color={MAGENTA} disabled={!canAct} onClick={() => updateParticipation(p.id, { status: 'en_instance' })}>
                                                            Reset
                                                        </ActionButton>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {campaign.status === 'open' && availableCollaborators.length > 0 && (
                    <div className="mt-8 rounded-xl border border-border p-4">
                        <h2 className="mb-3 text-base font-semibold">Add collaborators</h2>
                        <form onSubmit={addParticipants}>
                            <div className="mb-4 max-h-52 overflow-y-auto rounded-lg border border-border p-2">
                                {availableCollaborators.map((c) => (
                                    <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted">
                                        <input type="checkbox" checked={data.collaborator_ids.includes(c.id)} onChange={() => toggle(c.id)} />
                                        <span className="text-sm">{c.matricule} — {c.first_name} {c.last_name}</span>
                                    </label>
                                ))}
                            </div>
                            <ActionButton type="submit" disabled={!canAct || processing || data.collaborator_ids.length === 0} style={{ padding: '0.5rem 1rem' }}>
                                Add selected ({data.collaborator_ids.length})
                            </ActionButton>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}