/**
 * 아침 운세 알림 (MVP: Mock)
 * 실제 연결: `npx expo install expo-notifications` 후 schedule()의 TODO 부분을
 * Notifications.scheduleNotificationAsync({ trigger: { hour, minute, repeats: true } })로 교체.
 */
import { storage, NotificationSettings } from './storage/storageService';

const TEMPLATES = [
  (n: string) => `${n}님, 오늘의 한 장이 넘어갔어요. 오늘은 어떤 날일까요?`,
  () => '오늘 가장 힘이 실리는 분야는 어디일까요? 한 장 넘겨 보세요.',
  (n: string) => `${n}님의 오늘 키워드가 나왔어요.`,
];

export const notificationService = {
  buildMessage(nickname: string, date = new Date()) {
    return TEMPLATES[date.getDate() % TEMPLATES.length](nickname);
  },
  async schedule(settings: NotificationSettings, nickname: string) {
    await storage.saveNotificationSettings(settings);
    // TODO(expo-notifications): 권한 요청 + 매일 반복 알림 예약
    console.log('[notification:mock]', settings.enabled ? `매일 ${settings.hour}:${String(settings.minute).padStart(2, '0')}` : 'off', this.buildMessage(nickname));
  },
};
