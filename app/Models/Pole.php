<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pole extends Model
{
    protected $fillable = ['name'];

    public function collaborators()
    {
        return $this->hasMany(Collaborator::class);
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function participations()
    {
        return $this->hasMany(Participation::class);
    }
}\App\Models\Pole::find(1)->users;