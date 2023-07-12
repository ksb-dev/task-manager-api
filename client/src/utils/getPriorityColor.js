export const getPriorityColor = priority => {
  if (priority === 'low') {
    return 'lowPriority'
  }
  if (priority === 'medium') {
    return 'mediumPriority'
  }
  if (priority === 'high') {
    return 'highPriority'
  }
}
