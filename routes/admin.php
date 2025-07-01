<?php 
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ManagementUsers;

Route::get('/admin/dashboard', function () {
    return Inertia::render('admin/dashboard');
})->name('admin.dashboard');

Route::match(['get', 'post'], '/admin/users', [ManagementUsers::class, 'create_admin'])->name('admin.users');
Route::post('/admin/users/store', [ManagementUsers::class, 'store_admin'])->name('admin.users.store');
Route::get('/admin/users/{user}/edit', [ManagementUsers::class, 'edit_admin'])->name('admin.users.edit');
Route::put('/admin/users/{user}/update', [ManagementUsers::class, 'update_admin'])->name('admin.users.update');
Route::delete('/admin/users/{user}/destroy', [ManagementUsers::class, 'destroy_admin'])->name('admin.users.destroy');

Route::match(['get', 'post'], '/admin/librarians', [ManagementUsers::class, 'create_librarian'])->name('admin.librarians');
Route::post('/admin/librarians/store', [ManagementUsers::class, 'store_librarian'])->name('admin.librarians.store');
Route::get('/admin/librarians/{user}/edit', [ManagementUsers::class, 'edit_librarian'])->name('admin.librarians.edit');
Route::put('/admin/librarians/{user}/update', [ManagementUsers::class, 'update_librarian'])->name('admin.librarians.update');
Route::delete('/admin/librarians/{user}/destroy', [ManagementUsers::class, 'destroy_librarian'])->name('admin.librarians.destroy');