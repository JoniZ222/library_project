<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Genre;
use App\Models\Author;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Jonizin12',
            'email' => 'jonasan540@gmail.com',
            'password' => Hash::make('J712117y'),
            'role' => 'admin',
            'status' => true,
        ]);

        // Crear categorías de prueba
        $categories = [
            'Ficción',
            'No Ficción',
            'Ciencia Ficción',
            'Fantasía',
            'Misterio',
            'Romance',
            'Historia',
            'Ciencia',
            'Tecnología',
            'Filosofía'
        ];

        foreach ($categories as $categoryName) {
            Category::firstOrCreate(['name' => $categoryName]);
        }

        // Crear editoriales de prueba
        $publishers = [
            'Penguin Random House',
            'HarperCollins',
            'Simon & Schuster',
            'Macmillan',
            'Hachette Book Group',
            'Scholastic',
            'Bloomsbury',
            'Vintage Books',
            'Anchor Books',
            'Bantam Books'
        ];

        foreach ($publishers as $publisherName) {
            Publisher::firstOrCreate(['name' => $publisherName]);
        }

        // Crear géneros de prueba
        $genres = [
            'Novela',
            'Cuento',
            'Poesía',
            'Ensayo',
            'Biografía',
            'Autobiografía',
            'Memorias',
            'Crónica',
            'Reportaje',
            'Manual'
        ];

        foreach ($genres as $genreName) {
            Genre::firstOrCreate(['name' => $genreName]);
        }

        // Crear autores de prueba
        $authors = [
            'Gabriel García Márquez',
            'Jorge Luis Borges',
            'Pablo Neruda',
            'Octavio Paz',
            'Carlos Fuentes',
            'Mario Vargas Llosa',
            'Isabel Allende',
            'Julio Cortázar',
            'Ernest Hemingway',
            'William Shakespeare'
        ];

        foreach ($authors as $authorName) {
            Author::firstOrCreate(['full_name' => $authorName]);
        }

        $this->command->info('Datos de prueba creados exitosamente!');
    }
}
