import { Head, useForm } from '@inertiajs/react';

interface Campaign {
    id: number;
    name: string;
    launch_date: string;
    objective: string | null;
}

interface Props {
    campaign: Campaign;
}

export default function Edit({ campaign }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: campaign.name,
        launch_date: campaign.launch_date,
        objective: campaign.objective ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/campaigns/${campaign.id}`);
    }

    const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30';

    return (
        <>
            <Head title="Edit campaign" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit campaign</h1>
                <form onSubmit={submit} className="max-w-lg space-y-4 rounded-xl border border-border p-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Launch date</label>
                        <input type="date" value={data.launch_date} onChange={(e) => setData('launch_date', e.target.value)} className={inputClass} />
                        {errors.launch_date && <p className="mt-1 text-xs text-destructive">{errors.launch_date}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Objective</label>
                        <textarea value={data.objective} onChange={(e) => setData('objective', e.target.value)} className={inputClass} rows={3} />
                        {errors.objective && <p className="mt-1 text-xs text-destructive">{errors.objective}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                        {processing ? 'Saving…' : 'Update campaign'}
                    </button>
                </form>
            </div>
        </>
    );
}