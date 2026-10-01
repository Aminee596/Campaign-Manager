<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Collaborator;
use App\Models\Participation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $poleId = $user->isAdmin() ? null : $user->pole_id;

        $campaignQuery = Campaign::query()
            ->when($poleId, fn ($q) => $q->where('pole_id', $poleId));

        $participationQuery = Participation::query()
            ->when($poleId, fn ($q) => $q->whereHas('campaign', fn ($c) => $c->where('pole_id', $poleId)));

        $totalCampaigns = (clone $campaignQuery)->count();
        $openCampaigns = (clone $campaignQuery)->where('status', 'open')->count();
        $totalCollaborators = Collaborator::query()
            ->when($poleId, fn ($q) => $q->where('pole_id', $poleId))
            ->count();

        $totalParticipations = (clone $participationQuery)->count();
        $vaccinated = (clone $participationQuery)->where('status', 'vaccine')->count();
        $notVaccinated = (clone $participationQuery)->where('status', 'non_vaccine')->count();
        $pending = (clone $participationQuery)->where('status', 'en_instance')->count();

        $vaccinationRate = $totalParticipations > 0
            ? round($vaccinated / $totalParticipations * 100, 1)
            : 0;

        $accepted = (clone $participationQuery)->where('consent', 'accepte')->count();
        $refused = (clone $participationQuery)->where('consent', 'refuse')->count();
        $totalConsent = $accepted + $refused;
        $consentRate = $totalConsent > 0
            ? round($accepted / $totalConsent * 100, 1)
            : 0;

        $campaignBreakdown = (clone $campaignQuery)->with('pole')
            ->withCount([
                'participations as target_count',
                'participations as vaccinated_count' => fn ($q) => $q->where('status', 'vaccine'),
                'participations as not_vaccinated_count' => fn ($q) => $q->where('status', 'non_vaccine'),
                'participations as pending_count' => fn ($q) => $q->where('status', 'en_instance'),
            ])
            ->get()
            ->map(function ($campaign) {
                $rate = $campaign->target_count > 0
                    ? round($campaign->vaccinated_count / $campaign->target_count * 100, 1)
                    : 0;

                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'pole' => $campaign->pole->name,
                    'status' => $campaign->status,
                    'target' => $campaign->target_count,
                    'vaccinated' => $campaign->vaccinated_count,
                    'not_vaccinated' => $campaign->not_vaccinated_count,
                    'pending' => $campaign->pending_count,
                    'rate' => $rate,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalCampaigns' => $totalCampaigns,
                'openCampaigns' => $openCampaigns,
                'totalCollaborators' => $totalCollaborators,
                'vaccinated' => $vaccinated,
                'notVaccinated' => $notVaccinated,
                'pending' => $pending,
                'vaccinationRate' => $vaccinationRate,
                'consentRate' => $consentRate,
            ],
            'campaignBreakdown' => $campaignBreakdown,
        ]);
    }
}