<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AlumniFormController extends Controller
{
    // 📄 Show the blank public form for initial submission
    public function show($student_number)
    {
        return Inertia::render('AlumniForm', [
            'mode' => 'create',
            'student_number' => $student_number,
            'email' => '',
            'program_id' => '', // ✅ correct
        ]);
    }

    // 💾 Save new alumni info
    public function store(Request $request, $student_number)
    {
        $validated = $request->validate([
            'student_number' => [
                'required',
                'string',
                Rule::unique('alumni', 'student_number'),
            ],
            'email' => 'required|email',
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => [
                'required',
                'email',
                Rule::unique('alumni', 'active_email'),
            ],
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'employment_status' => 'required|string',
            'company_name' => 'nullable|string|max:255',
            'further_studies' => 'nullable|string',
            'sector' => 'nullable|string',
            'work_location' => 'required|string',
            'employer_classification' => 'required|string',
            'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
            'consent' => 'required|boolean',
        ]);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
        }

        Alumni::create($validated);

        return redirect()->back()->with('success', '🎉 Form submitted successfully!');
    }

    // ✏️ ✅ NEW METHOD: Update alumni via dashboard modal
    public function update(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        $validated = $request->validate([
            'email' => ['required', 'email', Rule::unique('alumni')->ignore($alumni->id)],
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => [
                'required',
                'email',
                Rule::unique('alumni', 'active_email')->ignore($alumni->id),
            ],
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'employment_status' => 'required|string',
            'company_name' => 'nullable|string|max:255',
            'further_studies' => 'nullable|string',
            'sector' => 'nullable|string',
            'work_location' => 'required|string',
            'employer_classification' => 'required|string',
            'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
            'consent' => 'required|boolean',
        ]);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
        }

        $alumni->update($validated);

        return response()->json(['alumni' => $alumni, 'message' => '✅ Alumni info updated successfully!']);
    }

    // 📨 Show the form for editing via signed email link
    public function showUpdateForm(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        return Inertia::render('Alumni/UpdateForm', [
            'alumni' => $alumni,
        ]);
    }

    // ✏️ Handle update from email link
    public function updateFromEmail(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        $validated = $request->validate([
            'email' => ['required', 'email', Rule::unique('alumni')->ignore($alumni->id)],
            'program_id' => 'required|exists:programs,id',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => [
                'required',
                'email',
                Rule::unique('alumni', 'active_email')->ignore($alumni->id),
            ],
            'contact_number' => 'required|string',
            'graduation_year' => 'required|digits:4',
            'employment_status' => 'required|string',
            'company_name' => 'nullable|string|max:255',
            'further_studies' => 'nullable|string',
            'sector' => 'nullable|string',
            'work_location' => 'required|string',
            'employer_classification' => 'required|string',
            'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
            'consent' => 'required|boolean',
        ]);

        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
        }

        $alumni->update($validated);

        return redirect()->back()->with('success', '✅ Alumni info updated successfully!');
    }

    // 🔍 Check if active email already exists (used via frontend)
    public function checkActiveEmail(Request $request)
    {
        $email = $request->query('email');

        $exists = Alumni::where('active_email', $email)->exists();

        return response()->json(['exists' => $exists]);
    }
}
