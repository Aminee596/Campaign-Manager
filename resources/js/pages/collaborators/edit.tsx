import { Head, useForm } from '@inertiajs/react';

interface Pole { id: number; name: string; }
interface Collaborator {
    id: number;
    first_name: string;
    last_name: string;
    matricule: string;
    email: string | null;
    pole_id: number;
}
interface Props { collaborator: Collaborator; poles: Pole[]; }

export default function Edit({ collaborator, poles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: collaborator.first_name,
        last_name: collaborator.last_name,
        matricule: collaborator.matricule,
        email: collaborator.email ?? '',
        pole_id: String(collaborator.pole_id),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/collaborators/${collaborator.id}`);
    }

    const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30';

    return (
        <>
            <Head title="Edit collaborator" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit collaborator</h1>
                <form onSubmit={submit} className="max-w-lg space-y-4 rounded-xl border border-border p-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium">First name</label>
                        <input type="text" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className={inputClass} />
                        {errors.first_name && <p className="mt-1 text-xs text-destructive">{errors.first_name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Last name</label>
                        <input type="text" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className={inputClass} />
                        {errors.last_name && <p className="mt-1 text-xs text-destructive">{errors.last_name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Matricule</label>
                        <input type="text" value={data.matricule} onChange={(e) => setData('matricule', e.target.value)} className={inputClass} />
                        {errors.matricule && <p className="mt-1 text-xs text-destructive">{errors.matricule}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Pôle</label>
                        <select value={data.pole_id} onChange={(e) => setData('pole_id', e.target.value)} className={inputClass}>
                            <option value="">— Select a pôle —</option>
                            {poles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {errors.pole_id && <p className="mt-1 text-xs text-destructive">{errors.pole_id}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                        {processing ? 'Saving…' : 'Update collaborator'}
                    </button>
                </form>
            </div>
        </>
    );
}