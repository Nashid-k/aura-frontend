export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function getFrequencyLabel(habit) {
  const mode = habit.frequency?.mode || 'daily';

  if (mode === 'daily') {
    return 'Daily rhythm';
  }

  if (mode === 'weekdays') {
    const days = habit.frequency?.daysOfWeek || [];
    return days.length ? `${days.length} custom days` : 'Selected weekdays';
  }

  return `${habit.frequency?.targetCount || 1}x per week`;
}

export function getKindLabel(kind) {
  return kind === 'quit' ? 'Quit habit' : 'Build habit';
}
