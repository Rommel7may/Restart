<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    // 👇 Specify the correct table name
    protected $table = 'alumni';

    // ✅ Define the fillable fields (make sure 'program_id' only is used)
    protected $fillable = [
        'student_number',
        'email',
        'program_id', // ✅ this is the correct foreign key
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
        'related_to_course',
        'consent',
    ];

    /**
     * 🔗 Define the relationship: Alumni belongs to a Program
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
