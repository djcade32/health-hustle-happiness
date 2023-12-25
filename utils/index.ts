export function formatArticleCardDate(timeInMilliseconds: number): string {
  const inputDate = new Date(timeInMilliseconds);

  const fullDate = inputDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (new Date().getFullYear() === inputDate.getFullYear()) {
    return fullDate.slice(0, fullDate.length - 6);
  }
  return fullDate;
}

export function convertSnakeCaseToTitleCase(input: string): string {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getFirstLetters(inputString: string) {
  return inputString
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}
