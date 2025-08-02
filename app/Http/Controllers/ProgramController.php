<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Program;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::all();
        return Inertia::render('ProgramCrud', [
            'programs' => $programs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Program::create($validated);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Program::findOrFail($id)->update($validated);
    }

    public function destroy($id)
    {
        Program::findOrFail($id)->delete();
    }
    
    
public function create()
{
    $programs = Program::select('name')->get();

    return Inertia::render('AlumniForm', [
        'programs' => $programs,
    ]);
}

}