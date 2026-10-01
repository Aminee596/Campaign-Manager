<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participation extends Model
{
    protected $fillable = [
        'campaign_id',
        'collaborator_id',
        'status',
        'consent',
        'visit_date',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class);
    }
    public function doses()
    {
        return $this->hasMany(Dose::class);
    }
}