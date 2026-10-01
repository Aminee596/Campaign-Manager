import { Head, useForm } from '@inertiajs/react';

interface Pole {
    id: number;
    name: string;
}

interface Props {
}

export default function Create(props: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        launch_date: '',
        objective: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/campaigns');
    }

    return (
        <>
            <Head title="New campaign" />

            <div style={{ padding: '2rem', maxWidth: '500px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    New campaign
                </h1>

                <form onSubmit={submit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.name && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.name}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Launch date</label>
                        <input
                            type="date"
                            value={data.launch_date}
                            onChange={(e) => setData('launch_date', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.launch_date && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.launch_date}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Objective</label>
                        <textarea
                            value={data.objective}
                            onChange={(e) => setData('objective', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.objective && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.objective}</div>}
                    </div>


                    <button
                        type="submit"
                        disabled={processing}
                        style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {processing ? 'Saving…' : 'Create campaign'}
                    </button>
                </form>
            </div>
        </>
    );
}