<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubjectEnrollment extends Model
{
    protected $fillable = [
        'enrollment_id',
        'subject_id',
        'grade',
        'is_released',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'grade' => 'decimal:2',
            'is_released' => 'boolean',
        ];
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
