export const calculateAge = (birthday: string) => {
  const birthDate = new Date(birthday);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  if (years === 0) {
    return `${months}ヶ月`;
  }

  if (months === 0) {
    return `${years}歳`;
  }

  return `${years}歳${months}ヶ月`;
};
