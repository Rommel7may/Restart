<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UpdateAlumniFormController extends Controller
{
    /**
     * 📨 Show the update form from signed email link
     */
    public function show(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        return Inertia::render('Alumni/UpdateForm', [
            'alumni' => $alumni,
        ]);
    }

    /**
     * ✏️ Update alumni info submitted from signed email link
     */
    public function update(Request $request, $student_number)
    {
        $alumni = Alumni::where('student_number', $student_number)->firstOrFail();

        $validated = $request->validate([
            'email' => ['required', 'email', Rule::unique('alumni')->ignore($alumni->id)],
            'program' => 'required|string',
            'last_name' => 'required|string',
            'given_name' => 'required|string',
            'middle_initial' => 'nullable|string',
            'present_address' => 'required|string',
            'active_email' => ['required', 'email', Rule::unique('alumni', 'active_email')->ignore($alumni->id)],
            'contact_number' => 'required|string',
            'graduation_year' => ['required', 'digits:4'],
            'employment_status' => 'required|string',
            'company_name' => Rule::requiredIf($request->employment_status === 'employed'),
            'further_studies' => 'nullable|string',
            'sector' => 'nullable|string',
            'work_location' => 'required|string',
            'employer_classification' => 'required|string',
            'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])], // ✅ Added this line
            'consent' => 'required|boolean',
        ]);

        // 🔒 If not employed, clear company_name
        if ($validated['employment_status'] !== 'employed') {
            $validated['company_name'] = null;
        }

        $alumni->update($validated);

        return redirect()->back()->with('success', '✅ Alumni info updated successfully!');
    }
}
