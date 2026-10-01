<?php

namespace Database\Seeders;

use App\Models\Collaborator;
use App\Models\Pole;
use Illuminate\Database\Seeder;

class CollaboratorSeeder extends Seeder
{
    public function run(): void
    {
        $poles = Pole::all();
        $faker = \Faker\Factory::create('fr_FR');

        foreach (range(1, 30) as $i) {
            Collaborator::create([
                'first_name' => $faker->firstName(),
                'last_name' => $faker->lastName(),
                'matricule' => 'MAT' . str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                'email' => $faker->unique()->safeEmail(),
                'pole_id' => $poles->random()->id,
            ]);
        }
    }
}