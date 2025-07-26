<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    // Tell Laravel to use "alumni" table (not default plural "alumnis")
    protected $table = 'alumni';

    // Fields that are mass-assignable
    protected $fillable = [
        'student_number',
        'email',
        'program',
        'last_name',
        'given_name',
        'middle_initial',
        'present_address',
        'active_email',
        'contact_number',
        'graduation_year',
        'employment_status',
        'company_name',
        'further_studies',
        'sector',
        'work_location',
        'employer_classification',
        'related_to_course', // ✅ Newly added
        'consent',
    ];
}
