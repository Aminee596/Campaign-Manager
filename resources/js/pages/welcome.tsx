import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: unknown | null } };
    const loggedIn = !!auth.user;

    return (
        <>
            <Head title="Médecine du travail — Vaccination">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
            </Head>

            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* LEFT — navy hero panel */}
                <div className="relative flex flex-col justify-between overflow-hidden bg-[oklch(0.32_0.11_260)] p-10 text-white lg:w-1/2 lg:p-14">
                    {/* pulse line motif */}
                    <svg
                        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-20"
                        viewBox="0 0 800 200"
                        fill="none"
                        preserveAspectRatio="none"
                        style={{ width: '100%', height: '220px' }}
                    >
                        <path
                            d="M0 100 H200 L230 100 L250 40 L275 160 L300 100 L330 100 L350 70 L370 130 L390 100 H800"
                            stroke="oklch(0.8 0.13 200)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: 1400,
                                strokeDashoffset: 1400,
                                animation: 'pulse-draw 3s ease-out forwards',
                            }}
                        />
                    </svg>

                                        <div className="relative z-10 flex items-center gap-2">
                        <img src="/images/Logo1.png" alt="Logo" className="h-28 w-auto" />
                        <span className="text-lg font-semibold tracking-tight"></span>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight lg:text-5xl">
                            La vaccination en entreprise, suivie de bout en bout.
                        </h1>
                        <p className="mt-5 text-base leading-relaxed text-white/70">
                            Gestion de campagnes, suivi des consentements et des vaccinations.
                        </p>
                    </div>

                    <div className="relative z-10 flex gap-8 text-sm text-white/60">
                        <div>
                            <div className="text-2xl font-bold text-white">3</div>
                            <div className="mt-0.5">Pôles</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="mt-0.5">Suivi centralisé</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">0</div>
                            <div className="mt-0.5">Feuille Excel</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — content / entry panel */}
                <div className="flex flex-1 items-center justify-center bg-background p-10 lg:p-14">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {loggedIn ? 'Bon retour' : 'Accès à la plateforme'}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {loggedIn
                                ? 'Vous êtes connecté. Accédez à votre espace de travail.'
                                : 'Connectez-vous avec votre compte professionnel pour continuer.'}
                        </p>

                        <div className="mt-8 flex flex-col gap-3">
                            {loggedIn ? (
                                <Link href="/dashboard" className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90">
                                    Ouvrir le tableau de bord
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90">
                                        Se connecter
                                    </Link>
                                    <Link href="/register" className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition hover:bg-muted">
                                        Créer un compte
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="mt-10 space-y-3 border-t border-border pt-6">
                            {[
                                ['Campagnes', 'Créez et suivez chaque campagne de vaccination.'],
                                ['Consentements', 'Enregistrez les accords et les refus en toute traçabilité.'],
                                ['Tableaux de bord', 'Visualisez les taux et la progression en temps réel.'],
                            ].map(([title, desc]) => (
                                <div key={title} className="flex gap-3">
                                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-foreground">{title}</div>
                                        <div className="text-xs text-muted-foreground">{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-draw {
                    to { stroke-dashoffset: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    [style*="pulse-draw"] { animation: none !important; stroke-dashoffset: 0 !important; }
                }
            `}</style>
        </>
    );
}