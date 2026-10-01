import { Head, useForm } from '@inertiajs/react';

interface Pole { id: number; name: string; }
interface User { id: number; name: string; email: string; role: string; pole_id: number | null; }
interface Props { user: User; poles: Pole[]; roles: string[]; }

export default function Edit({ user, poles, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        pole_id: user.pole_id ? String(user.pole_id) : '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/users/${user.id}`);
    }

    const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30';

    return (
        <>
            <Head title="Edit user" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit user</h1>
                <form onSubmit={submit} className="max-w-lg space-y-4 rounded-xl border border-border p-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Password <span className="text-xs text-muted-foreground">(leave blank to keep current)</span></label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} />
                        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Role</label>
                        <select value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass}>
                            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Pôle (optional)</label>
                        <select value={data.pole_id} onChange={(e) => setData('pole_id', e.target.value)} className={inputClass}>
                            <option value="">— None —</option>
                            {poles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {errors.pole_id && <p className="mt-1 text-xs text-destructive">{errors.pole_id}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                        {processing ? 'Saving…' : 'Update user'}
                    </button>
                </form>
            </div>
        </>
    );
}