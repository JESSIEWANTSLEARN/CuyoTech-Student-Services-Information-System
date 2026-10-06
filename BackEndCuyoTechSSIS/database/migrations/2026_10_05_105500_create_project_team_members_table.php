<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_team_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('display_order')->default(1);
            $table->string('name', 120);
            $table->string('scrum_role', 160);
            $table->text('deliverables');
            $table->text('support_roles')->nullable();
            $table->string('photo_mime', 50)->nullable();
            $table->longText('photo_data')->nullable();
            $table->timestamps();

            $table->unique('name');
            $table->index('display_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_team_members');
    }
};
