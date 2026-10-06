<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('project_team_members');

        Schema::create('project_team_members', function (Blueprint $table) {
            $table->id();
            $table->integer('display_order')->default(0);
            $table->string('name', 150);
            $table->string('scrum_role', 100)->nullable();
            $table->text('deliverables')->nullable();
            $table->text('support_roles')->nullable();

            // This holds the base64 image data for React
            $table->longText('photo_data')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_team_members');
    }
};
