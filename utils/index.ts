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

export function calculateDaysBetweenDates(
  date1InMilliseconds: number,
  date2InMilliseconds: number
) {
  const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Calculate the difference in milliseconds between the two dates
  const timeDifference = Math.abs(date1InMilliseconds - date2InMilliseconds);

  // Calculate the number of days
  const daysDifference = Math.ceil(timeDifference / oneDayMilliseconds);

  return daysDifference;
}

export function formatNumberToTwoDecimalPlaces(number: number) {
  // Convert the number to a string with two decimal places
  const formattedNumber = number.toFixed(2);

  // Convert the string back to a number (optional, depending on your use case)
  return Number(formattedNumber);
}
