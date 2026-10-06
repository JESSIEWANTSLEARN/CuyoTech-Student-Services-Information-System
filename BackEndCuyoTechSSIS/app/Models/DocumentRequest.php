<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DocumentRequest extends Model
{
    protected $fillable = [
        'student_id',
        'document_type_id',
        'purpose',
        'status',
        'fee_amount_snapshot',
        'reviewed_by',
        'registrar_notes',
        'submitted_at',
        'released_at',
    ];

    protected function casts(): array
    {
        return [
            'fee_amount_snapshot' => 'decimal:2',
            'submitted_at' => 'datetime',
            'released_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
