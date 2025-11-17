const parseCustomDate = (dateString) => {
  const [datePart, timePart] = dateString.split(", ");
  return new Date(`${datePart} ${timePart}`);
};

export const validateDates = (dateTime, returnDateTime) => {
  const pickup = parseCustomDate(dateTime);
  const returnD = parseCustomDate(returnDateTime);

  if (isNaN(pickup.getTime()) || isNaN(returnD.getTime())) {
    return { valid: false, message: "Invalid date format" };
  }

  if (returnD <= pickup) {
    return {
      valid: false,
      message: "Return date & time must be greater than travel date & time.",
    };
  }

  return { valid: true };
};
