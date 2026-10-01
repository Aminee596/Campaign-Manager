<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Pole;
use App\Models\Collaborator;
use App\Models\Participation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $campaigns = Campaign::with('pole')
            ->when(! $user->isAdmin(), fn ($q) => $q->where('pole_id', $user->pole_id))
            ->get();

        return Inertia::render('campaigns/index', [
            'campaigns' => $campaigns,
        ]);
    }

    public function create()
    {
        return Inertia::render('campaigns/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'launch_date' => 'required|date',
            'objective' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['pole_id'] = $request->user()->pole_id;
        $validated['status'] = 'open';

        Campaign::create($validated);

        return redirect()->route('campaigns.index');
    }

    public function edit(Request $request, Campaign $campaign)
    {
        abort_unless($request->user()->canAccessPole($campaign->pole_id), 403);

        return Inertia::render('campaigns/edit', [
            'campaign' => $campaign,
        ]);
    }

    public function update(Request $request, Campaign $campaign)
    {
        abort_unless($request->user()->canAccessPole($campaign->pole_id), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'launch_date' => 'required|date',
            'objective' => 'nullable|string',
        ]);

        $campaign->update($validated);

        return redirect()->route('campaigns.index');
    }

    public function destroy(Request $request, Campaign $campaign)
    {
        abort_unless($request->user()->canAccessPole($campaign->pole_id), 403);

        $campaign->delete();

        return redirect()->route('campaigns.index');
    }

    public function show(Request $request, Campaign $campaign)
    {
        abort_unless($request->user()->canAccessPole($campaign->pole_id), 403);
        $campaign->load(['pole', 'participations.collaborator']);

        $existingIds = $campaign->participations->pluck('collaborator_id');

        $availableCollaborators = Collaborator::where('pole_id', $campaign->pole_id)
            ->whereNotIn('id', $existingIds)
            ->get();

        return Inertia::render('campaigns/show', [
            'campaign' => $campaign,
            'availableCollaborators' => $availableCollaborators,
        ]);
    }

    public function addParticipants(Request $request, Campaign $campaign)
    {
        abort_unless($request->user()->canAccessPole($campaign->pole_id), 403);

        $validated = $request->validate([
            'collaborator_ids' => 'required|array',
            'collaborator_ids.*' => 'exists:collaborators,id',
        ]);

        foreach ($validated['collaborator_ids'] as $collaboratorId) {
            $campaign->participations()->firstOrCreate([
                'collaborator_id' => $collaboratorId,
            ]);
        }

        return redirect()->route('campaigns.show', $campaign);
    }

    public function updateParticipation(Request $request, Participation $participation)
    {
        abort_unless($request->user()->canAccessPole($participation->campaign->pole_id), 403);

        $validated = $request->validate([
            'status' => 'required|in:en_instance,vaccine,non_vaccine',
            'consent' => 'nullable|in:accepte,refuse',
            'visit_date' => 'nullable|date',
        ]);

        $participation->update($validated);

        return back();
    }

    public function close(Request $request, Campaign $campaign)
    {
        abort_unless($request->user()->canAccessPole($campaign->pole_id), 403);

        $pending = $campaign->participations()->where('status', 'en_instance')->count();

        if ($pending > 0) {
            return back()->withErrors([
                'close' => "Cannot close: {$pending} collaborator(s) still en instance.",
            ]);
        }

        $campaign->update(['status' => 'closed']);

        return back();
    }
}