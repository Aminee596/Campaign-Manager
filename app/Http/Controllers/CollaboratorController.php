<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\Pole;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollaboratorController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $collaborators = Collaborator::with('pole')
            ->when(! $user->isAdmin(), fn ($q) => $q->where('pole_id', $user->pole_id))
            ->get();

        return Inertia::render('collaborators/index', [
            'collaborators' => $collaborators,
        ]);
    }

    public function create()
    {
        return Inertia::render('collaborators/create', [
            'poles' => Pole::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'matricule' => 'required|string|max:255|unique:collaborators,matricule',
            'email' => 'nullable|email',
            'pole_id' => 'required|exists:poles,id',
        ]);

        Collaborator::create($validated);

        return redirect()->route('collaborators.index');
    }

    public function edit(Request $request, Collaborator $collaborator)
    {
        abort_unless($request->user()->canAccessPole($collaborator->pole_id), 403);
        return Inertia::render('collaborators/edit', [
            'collaborator' => $collaborator,
            'poles' => Pole::all(),
        ]);
    }

    public function update(Request $request, Collaborator $collaborator)
    {
        abort_unless($request->user()->canAccessPole($collaborator->pole_id), 403);
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'matricule' => 'required|string|max:255|unique:collaborators,matricule,' . $collaborator->id,
            'email' => 'nullable|email',
            'pole_id' => 'required|exists:poles,id',
        ]);

        $collaborator->update($validated);

        return redirect()->route('collaborators.index');
    }

    public function destroy(Request $request, Collaborator $collaborator)
    {
        abort_unless($request->user()->canAccessPole($collaborator->pole_id), 403);
        $collaborator->delete();

        return redirect()->route('collaborators.index');
    }
}