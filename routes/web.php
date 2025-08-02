<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    SendController,
    StudentController,
    AlumniController,
    ListController,
    DataController,
    JobController,
    AlumniFormController,
    UpdateAlumniFormController,
    ChartController,
    AlumniExportController,
    UpdateEmailController,
    YesNoController,
    LocationController,
    ProgramController
};

// 🌐 Public Welcome Page
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// 📝 Public Alumni Form (Initial Submission)
Route::get('/alumni-form/{student_number}', [AlumniFormController::class, 'show'])->name('alumni.form');
Route::post('/alumni-form/{student_number}/submit', [AlumniFormController::class, 'store'])->name('alumni.store');

// 🔗 Shareable Blank Form Page (optional)
Route::get('/alumni-form-link', fn () => Inertia::render('AlumniForm'))->name('alumni.form.link');

// 🔄 Signed Alumni Update Form (via email link)
Route::get('/alumni-update-form/{student_number}', [UpdateAlumniFormController::class, 'show'])
    ->middleware('signed')
    ->name('alumni.update.form');

Route::put('/alumni-update-form/{student_number}', [UpdateAlumniFormController::class, 'update'])
    ->name('alumni.update.submit');

// ✅ Check for duplicate active email
Route::get('/check-active-email', [AlumniFormController::class, 'checkActiveEmail'])->name('alumni.email.check');

// 📊 Public Charts and Export
Route::get('/alumni-chart', [ChartController::class, 'alumniPie'])->name('alumni.chart');
Route::get('/related', [YesNoController::class, 'YesNo'])->name('related.chart');
Route::get('/location', [LocationController::class, 'location'])->name('location.chart');
Route::get('/export-alumni', [AlumniExportController::class, 'export'])->name('alumni.export');

// 🧪 Test Email Blade Preview
Route::get('/test-email-view', fn () => view('emails.AlumniUpdateForm', [
    'student' => (object)[
        'student_number' => '2023-00001',
        'given_name' => 'Juan',
    ],
    'formUrl' => url('/alumni-update-form/2023-00001'),
]))->name('test.email.view');

// 🔐 Admin-Only Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {

    // 📊 Dashboard
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    // 📧 Email Sending
    Route::post('/send-email', [SendController::class, 'sendEmail'])->name('email.send');
    Route::post('/send-email-to-alumni', [SendController::class, 'sendToProgram'])->name('email.to.program');
    Route::post('/send-email-to-all-alumni', [UpdateEmailController::class, 'sendToAll'])->name('email.to.all.alumni');

    // 👨‍🎓 Alumni CRUD
    Route::get('/alumni-data', [AlumniController::class, 'index'])->name('alumni.index');
    Route::post('/alumni', [AlumniController::class, 'store'])->name('alumni.store');
    Route::put('/alumni/{id}', [AlumniController::class, 'update'])->name('alumni.update');
    Route::delete('/alumni/{id}', [AlumniController::class, 'destroy'])->name('alumni.destroy');

    // 👩‍🎓 Student CRUD
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    // 📦 Resource Routes
    Route::resource('/send', SendController::class)->only(['index', 'create', 'store']);
    Route::resource('/list', ListController::class);
    Route::resource('/data', DataController::class);
    Route::resource('/job', JobController::class);
    Route::resource('/program', ProgramController::class);

    //program setting
    Route::get('/settings/program', function () {
    $programs = \App\Models\Program::all();
    return Inertia::render('settings/ProgramCrud', [
        'programs' => $programs,
    ]);
});
    
//crud program
    Route::get('/program', [ProgramController::class, 'index']);
    Route::post('/program', [ProgramController::class, 'store']);
    Route::put('/program/{id}', [ProgramController::class, 'update']);
    Route::delete('/program/{id}', [ProgramController::class, 'destroy']);
//api
    Route::get('/alumni-form', [ProgramController::class, 'create']);
    Route::get('/alumni/create', [AlumniController::class, 'create']);
    Route::get('/api/programs', function () {
    return \App\Models\Program::all(); // adjust model path if needed
});
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
