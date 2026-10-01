<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController; 

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Everyone logged in can see the dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Campaigns — VIEWING: doctors, nurses, and admin (oversight)
    Route::middleware('role:medecin,infirmier,admin')->group(function () {
        Route::get('campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
        Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show')->whereNumber('campaign');
    });

    // Campaigns — ACTIONS: only doctors and nurses (the medical work)
    Route::middleware('role:medecin,infirmier')->group(function () {
        Route::get('campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
        Route::post('campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
        Route::get('campaigns/{campaign}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
        Route::put('campaigns/{campaign}', [CampaignController::class, 'update'])->name('campaigns.update');
        Route::delete('campaigns/{campaign}', [CampaignController::class, 'destroy'])->name('campaigns.destroy');
        Route::post('campaigns/{campaign}/participants', [CampaignController::class, 'addParticipants'])->name('campaigns.participants.add');
        Route::put('participations/{participation}', [CampaignController::class, 'updateParticipation'])->name('participations.update');
        Route::put('campaigns/{campaign}/close', [CampaignController::class, 'close'])->name('campaigns.close');
    });

    // Collaborators — admin and RH data-entry agent
    Route::middleware('role:admin,rh_agent')->group(function () {
        Route::resource('collaborators', CollaboratorController::class)->except(['show']);
    });

    // Users — admin only
    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
