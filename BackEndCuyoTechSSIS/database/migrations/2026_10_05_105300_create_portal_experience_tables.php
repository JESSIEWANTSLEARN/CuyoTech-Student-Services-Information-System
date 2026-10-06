<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portal_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title', 150);
            $table->string('message', 500);
            $table->string('type', 50)->default('info');
            $table->string('link', 255)->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
        });

        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->text('body');
            $table->enum('audience', [
                'all',
                'student',
                'registrar',
                'cashier',
                'department',
                'admin',
            ])->default('all');
            $table->enum('priority', ['normal', 'important'])->default('normal');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('important_dates', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('description', 500)->nullable();
            $table->date('event_date');
            $table->enum('audience', [
                'all',
                'student',
                'registrar',
                'cashier',
                'department',
                'admin',
            ])->default('all');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['event_date', 'audience']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('important_dates');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('portal_notifications');
    }
};
