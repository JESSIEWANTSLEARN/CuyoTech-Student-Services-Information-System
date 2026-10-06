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
        'photo_mime',
        'photo_data',
    ];

    protected $hidden = [
        'photo_data',
    ];
}
