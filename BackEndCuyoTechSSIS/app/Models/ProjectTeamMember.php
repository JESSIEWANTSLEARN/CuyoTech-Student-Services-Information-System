<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTeamMember extends Model
{
    protected $fillable = [
        'display_order',
        'name',
        'scrum_role',
        'deliverables',
        'support_roles',
        'photo_data',
    ];

    // Removed the $hidden array entirely so 'photo_data' is sent to React
}
