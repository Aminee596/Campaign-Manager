import { Head, Link, router } from '@inertiajs/react';

interface Pole {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    pole: Pole | null;
}

interface Props {
    users: User[];
}

export default function Index({ users }: Props) {
    return (
        <>
            <Head title="Users" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link href="/users/create" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                        + New user
                    </Link>
                </div>

                {users.length === 0 ? (
                    <p className="text-muted-foreground">No users yet.</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                                    <th className="px-4 py-3 text-left font-semibold">Pôle</th>
                                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-t border-border hover:bg-muted/50">
                                        <td className="px-4 py-3 font-medium">{u.name}</td>
                                        <td className="px-4 py-3">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{u.role}</span>
                                        </td>
                                        <td className="px-4 py-3">{u.pole?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/users/${u.id}/edit`} className="mr-3 text-primary hover:underline">Edit</Link>
                                            <button onClick={() => { if (confirm('Delete this user?')) router.delete(`/users/${u.id}`); }} className="text-destructive hover:underline">Delete</button>
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