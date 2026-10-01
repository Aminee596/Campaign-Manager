import { Head, Link, router, usePage } from '@inertiajs/react';

interface Pole {
    id: number;
    name: string;
}

interface Collaborator {
    id: number;
    first_name: string;
    last_name: string;
    matricule: string;
    email: string | null;
    pole: Pole;
}

interface Props {
    collaborators: Collaborator[];
}

export default function Index({ collaborators }: Props) {
    const { auth } = usePage().props;
    const role = (auth.user as typeof auth.user & { role: string }).role;
    const canAct = role === 'admin' || role === 'rh_agent';

    return (
        <>
            <Head title="Collaborators" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Collaborators</h1>
                    {canAct ? (
                        <Link href="/collaborators/create" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                            + New collaborator
                        </Link>
                    ) : (
                        <span className="cursor-not-allowed rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-40">
                            + New collaborator
                        </span>
                    )}
                </div>

                {collaborators.length === 0 ? (
                    <p className="text-muted-foreground">No collaborators yet.</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Matricule</th>
                                    <th className="px-4 py-3 text-left font-semibold">First name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Last name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold">Pôle</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collaborators.map((c) => (
                                    <tr key={c.id} className="border-t border-border hover:bg-muted/50">
                                        <td className="px-4 py-3 font-medium">{c.matricule}</td>
                                        <td className="px-4 py-3">{c.first_name}</td>
                                        <td className="px-4 py-3">{c.last_name}</td>
                                        <td className="px-4 py-3">{c.email ?? '—'}</td>
                                        <td className="px-4 py-3">{c.pole.name}</td>
                                        <td className="px-4 py-3 text-right">
                                            {canAct ? (
                                                <>
                                                    <Link href={`/collaborators/${c.id}/edit`} className="mr-3 text-primary hover:underline">Edit</Link>
                                                    <button onClick={() => { if (confirm('Delete this collaborator?')) router.delete(`/collaborators/${c.id}`); }} className="text-destructive hover:underline">Delete</button>
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