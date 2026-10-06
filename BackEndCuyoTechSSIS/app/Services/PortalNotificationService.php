<?php

namespace App\Services;

use App\Models\PortalNotification;
use App\Models\User;

class PortalNotificationService
{
    public static function notifyUser(
        int $userId,
        string $title,
        string $message,
        ?string $link = null,
        string $type = 'info'
    ): void {
        PortalNotification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'type' => $type,
        ]);
    }

    public static function notifyRole(
        string $role,
        string $title,
        string $message,
        ?string $link = null,
        string $type = 'info'
    ): void {
        User::query()
            ->where('role', $role)
            ->where('status', 'active')
            ->pluck('id')
            ->each(function (int $userId) use ($title, $message, $link, $type): void {
                self::notifyUser($userId, $title, $message, $link, $type);
            });
    }
}
