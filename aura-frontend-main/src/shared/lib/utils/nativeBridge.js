/**
 * Web Bridge Utility
 * Provides access to web browser features (Haptics, App Badging, Calendar, Share Sheet)
 * with graceful fallbacks.
 */

export const nativeBridge = {
  
  /**
   * HAPTIC FEEDBACK
   * Uses navigator.vibrate if available (Android browsers mostly).
   */
  haptic(type = 'light') {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heavy') navigator.vibrate([50]);
      else if (type === 'medium') navigator.vibrate([30]);
      else navigator.vibrate([15]);
    }
  },

  /**
   * APP ICON BADGING
   * Uses navigator.setAppBadge for PWA badging on supported platforms.
   */
  async setBadge(count) {
    if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
      try {
        if (count === 0) {
          await navigator.clearAppBadge();
        } else {
          await navigator.setAppBadge(count);
        }
      } catch (err) {
        console.warn('App badging failed:', err);
      }
    }
  },

  /**
   * SYNC TO CALENDAR (.ics generator)
   */
  syncToCalendar(title, description, startTime) {
    try {
      const start = new Date(startTime).toISOString().replace(/-|:|\.\d+/g, "");
      const end = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d+/g, "");
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
        `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${title}`, `DESCRIPTION:${description}`,
        "END:VEVENT", "END:VCALENDAR"
      ].join("\n");
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
      link.click();
      return true;
    } catch (err) {
      return false;
    }
  },

  /**
   * SYNC TO NOTEPAD (Web Share API)
   */
  async syncToNotes(title, content) {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: content });
        return true;
      } catch (err) {
        // If user cancelled, don't fallback to clipboard immediately, just return false
        if (err.name !== 'AbortError') {
          await navigator.clipboard.writeText(content);
          return 'clipboard';
        }
        return false;
      }
    } else {
      try {
        await navigator.clipboard.writeText(content);
        return 'clipboard';
      } catch (err) {
        return false;
      }
    }
  }
};
