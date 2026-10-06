<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->string('code', 30)->unique();
            $table->string('name', 150);
            $table->decimal('units', 4, 1)->default(3);
            $table->timestamps();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->string('academic_year', 20);
            $table->enum('semester', ['First Semester', 'Second Semester', 'Summer']);
            $table->unsignedTinyInteger('year_level')->default(1);
            $table->enum('status', ['enrolled', 'completed', 'cancelled'])->default('enrolled');
            $table->timestamps();

            $table->unique(['student_id', 'academic_year', 'semester']);
        });

        Schema::create('subject_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->restrictOnDelete();
            $table->decimal('grade', 4, 2)->nullable();
            $table->boolean('is_released')->default(false);
            $table->enum('status', ['enrolled', 'completed', 'dropped'])->default('enrolled');
            $table->timestamps();

            $table->unique(['enrollment_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_enrollments');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('subjects');
    }
};
