<?php

namespace App\Http\Controllers;

use App\Models\Pole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    private array $roles = ['admin', 'medecin', 'infirmier', 'rh_agent', 'rh_consultant'];

    public function index()
    {
        $users = User::with('pole')->get();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $this->roles,
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'poles' => Pole::all(),
            'roles' => $this->roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::defaults()],
            'role' => 'required|in:admin,medecin,infirmier,rh_agent,rh_consultant',
            'pole_id' => 'nullable|exists:poles,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('users.index');
    }

    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => $user,
            'poles' => Pole::all(),
            'roles' => $this->roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => ['nullable', Password::defaults()],
            'role' => 'required|in:admin,medecin,infirmier,rh_agent,rh_consultant',
            'pole_id' => 'nullable|exists:poles,id',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('users.index');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index');
    }
}