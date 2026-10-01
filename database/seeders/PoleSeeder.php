<?php

namespace Database\Seeders;

use App\Models\Pole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pole::create(['name' => 'Meknès']);
        Pole::create(['name' => 'Fès']);
        Pole::create(['name' => 'Taza']);
    }
}
