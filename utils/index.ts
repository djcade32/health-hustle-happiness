export function formatArticleCardDate(timeInMilliseconds: number) {
  const inputDate = new Date(timeInMilliseconds);

  const fullDate = inputDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (new Date().getFullYear() === inputDate.getFullYear()) {
    return fullDate.slice(0, fullDate.length - 6);
  }
}
