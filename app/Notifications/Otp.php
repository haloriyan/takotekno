<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class Otp extends Notification
{
    use Queueable;

    protected $otp;

    protected $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($props)
    {
        $this->otp = $props['otp'];
        $this->user = $props['user'];
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kode OTP - '.$this->otp->code)
            ->line('Kode OTP untuk login adalah :')
            ->line(new HtmlString('<div style="background: #eeeeee;color: #444444;padding: 10px;border-radius: 8px;text-align: center;padding-vertical: 10px;margin-bottom: 12px;font-size: 18px;">'.$this->otp->code.'</div>'))
            ->line('Jika tidak merasa meminta ini mohon abaikan dan jangan beritahu kode ini pada siapapun.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
