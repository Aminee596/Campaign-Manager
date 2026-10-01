<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'name',
        'launch_date',
        'objective',
        'status',
        'pole_id',
        'user_id',
    ];

    public function pole()
    {
        return $this->belongsTo(Pole::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function participations()
    {
        return $this->hasMany(Participation::class);
    }
}