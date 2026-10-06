<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\ImportantDate;
use Illuminate\Database\Seeder;

class PortalExperienceSeeder extends Seeder
{
    public function run(): void
    {
        Announcement::updateOrCreate(
            ['title' => 'Welcome to CuyoTech Student Services'],
            [
                'body' => 'Use this portal for enrollment records, grades, document requests, payments, receipts, and clearance services.',
                'audience' => 'all',
                'priority' => 'normal',
                'published_at' => now(),
                'expires_at' => null,
            ]
        );

        Announcement::updateOrCreate(
            ['title' => 'Document request reminder'],
            [
                'body' => 'Check Request Status after submitting a TOR, COR, or certification request. Payment details appear after Registrar approval.',
                'audience' => 'student',
                'priority' => 'important',
                'published_at' => now(),
                'expires_at' => null,
            ]
        );

        ImportantDate::updateOrCreate(
            ['title' => 'Clearance review week', 'event_date' => '2026-10-19'],
            [
                'description' => 'Students should review pending clearance requirements before the end of the term.',
                'audience' => 'student',
            ]
        );

        ImportantDate::updateOrCreate(
            ['title' => 'Document processing review', 'event_date' => '2026-10-12'],
            [
                'description' => 'Registrar review of pending document requests.',
                'audience' => 'registrar',
            ]
        );
    }
}
