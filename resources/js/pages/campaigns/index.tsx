import { Head, Link, router, usePage } from '@inertiajs/react';

interface Pole {
    id: number;
    name: string;
}

interface Campaign {
    id: number;
    name: string;
    launch_date: string;
    status: string;
    pole: Pole;
}

interface Props {
    campaigns: Campaign[];
}

export default function Index({ campaigns }: Props) {
    const { auth } = usePage().props;
    const role = (auth.user as typeof auth.user & { role: string }).role;
    const canAct = role === 'medecin' || role === 'infirmier';

    return (
        <>
            <Head title="Campaigns" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Campaigns</h1>
                    {canAct ? (
                        <Link
                            href="/campaigns/create"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            + New campaign
                        </Link>
                    ) : (
                        <span className="cursor-not-allowed rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-40">
                            + New campaign
                        </span>
                    )}
                </div>

                {campaigns.length === 0 ? (
                    <p className="text-muted-foreground">No campaigns yet.</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Pôle</th>
                                    <th className="px-4 py-3 text-left font-semibold">Launch date</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-t border-border hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <Link href={`/campaigns/${campaign.id}`} className="font-medium text-primary hover:underline">
                                                {campaign.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">{campaign.pole.name}</td>
                                        <td className="px-4 py-3">{campaign.launch_date}</td>
                                        <td className="px-4 py-3">
                                            <span className={campaign.status === 'open' ? 'rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary' : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {canAct ? (
                                                <>
                                                    <Link href={`/campaigns/${campaign.id}/edit`} className="mr-3 text-primary hover:underline">
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => { if (confirm('Delete this campaign?')) router.delete(`/campaigns/${campaign.id}`); }}
                                                        className="text-destructive hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="mr-3 text-primary opacity-40">Edit</span>
                                                    <span className="text-destructive opacity-40">Delete</span>
                                                </>
                                            )}
                                        </td>
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