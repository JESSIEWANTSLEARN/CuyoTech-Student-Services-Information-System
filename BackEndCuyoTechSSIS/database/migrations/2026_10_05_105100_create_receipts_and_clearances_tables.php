<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('receipt_number', 80)->unique();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('issued_at');
            $table->timestamps();
        });

        Schema::create('clearances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->string('academic_year', 20);
            $table->enum('semester', ['First Semester', 'Second Semester', 'Summer']);
            $table->enum('status', ['pending', 'cleared', 'hold'])->default('pending');
            $table->text('remarks')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            // FIX: Added the closing ); for the unique constraint
            $table->unique(
                ['student_id', 'department_id', 'academic_year', 'semester'],
                'clearance_student_dept_ay_sem_unique'
            ); 
        }); // FIX: Added the closing }); for Schema::create
    }

    public function down(): void
    {
        Schema::dropIfExists('clearances');
        Schema::dropIfExists('receipts');
    }
};