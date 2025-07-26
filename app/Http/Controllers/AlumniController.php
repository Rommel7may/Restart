<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AlumniController extends Controller
{
    /**
     * 🔹 Get all alumni (JSON for React table)
     */
    public function index()
    {
        return response()->json(Alumni::all());
    }

    /**
     * 🔹 Store new alumni record
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_number' => 'required|string|unique:alumni,student_number',
                'email' => 'required|email',
                'program' => 'required|string',
                'last_name' => 'required|string',
                'given_name' => 'required|string',
                'middle_initial' => 'nullable|string',
                'present_address' => 'required|string',
                'active_email' => 'required|email|unique:alumni,active_email',
                'contact_number' => 'required|string',
                'graduation_year' => 'required|integer',
                'employment_status' => 'required|string',
                'company_name' => 'nullable|string|max:255',
                'further_studies' => 'nullable|string',
                'sector' => 'nullable|string',
                'work_location' => 'nullable|string',
                'employer_classification' => 'nullable|string',
                'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
                'consent' => 'accepted',
            ]);

            if ($validated['employment_status'] !== 'employed') {
                $validated['company_name'] = null;
            }

            $alumni = Alumni::create($validated);

            return response()->json([
                'message' => '🎉 Alumni added successfully!',
                'data' => $alumni
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
                'message' => '❌ Validation failed.',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ Server error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🔹 Update existing alumni record
     */
    public function update(Request $request, $id)
    {
        try {
            $alumni = Alumni::findOrFail($id);

            $validated = $request->validate([
                'student_number' => [
                    'required',
                    'string',
                    Rule::unique('alumni', 'student_number')->ignore($alumni->id),
                ],
                'email' => 'required|email',
                'program' => 'required|string',
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
                'graduation_year' => 'required|integer',
                'employment_status' => 'required|string',
                'company_name' => 'nullable|string|max:255',
                'further_studies' => 'nullable|string',
                'sector' => 'nullable|string',
                'work_location' => 'nullable|string',
                'employer_classification' => 'nullable|string',
                'related_to_course' => ['nullable', Rule::in(['yes', 'no', 'unsure'])],
                'consent' => 'accepted',
            ]);

            if ($validated['employment_status'] !== 'employed') {
                $validated['company_name'] = null;
            }

            $alumni->update($validated);

            return response()->json([
                'message' => '✅ Alumni updated successfully!',
                'data' => $alumni
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
                'message' => '❌ Validation failed.',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ Server error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🔹 Delete alumni record
     */
    public function destroy($id)
    {
        $alumni = Alumni::find($id);

        if (!$alumni) {
            return response()->json(['message' => 'Alumni not found.'], 404);
        }

        $alumni->delete();

        return response()->json(['message' => '🗑️ Alumni deleted successfully.']);
    }
}
