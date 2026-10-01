<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dose extends Model
{
    protected $fillable = [
        'participation_id',
        'dose_number',
        'administered_date',
    ];

    public function participation()
    {
        return $this->belongsTo(Participation::class);
    }
}