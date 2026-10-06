<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentType extends Model
{
    protected $fillable = ['code', 'name', 'fee_amount', 'is_active'];

    protected function casts(): array
    {
        return [
            'fee_amount' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function documentRequests(): HasMany
    {
        return $this->hasMany(DocumentRequest::class);
    }
}
