export interface GridLayout {
  columns: number;
  cardWidth: number;
}

export const getGridLayout = (
  viewportWidth: number,
  horizontalPadding = 36,
  minimumCardWidth = 92,
  gap = 12,
  maximumColumns = 5,
): GridLayout => {
  const availableWidth = Math.max(0, viewportWidth - horizontalPadding);
  const columns = Math.max(1, Math.min(maximumColumns, Math.floor((availableWidth + gap) / (minimumCardWidth + gap))));
  const cardWidth = (availableWidth - gap * (columns - 1)) / columns;

  return { columns, cardWidth };
};