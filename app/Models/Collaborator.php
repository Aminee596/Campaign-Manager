<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'matricule',
        'email',
        'pole_id',
    ];

    public function pole()
    {
        return $this->belongsTo(Pole::class);
    }
    public function participations()
    {
        return $this->hasMany(Participation::class);
    }
}