export let isSocialValid = false;
export let isEmailValid = false;
export let isInstagramInvalid = false;
export let isLinkInvalid = false;
export let isTiktokValid = false;
export let isPhoneValid = false;
export let isNumber;
export let isTwitterValid = false;

export const emailRegex = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const numberRegex = (number) => {
  const re = /^[0-9]+$/;
  return re.test(String(number).toLowerCase());
};

export const socialValidator = (value) => {
  const social = value.trim();
  social.startsWith('http://') ||
  social.startsWith('https://') ||
  social.startsWith('www')
    ? (isSocialValid = true)
    : (isSocialValid = false);
};

export const linkValidator = (value) => {
  const link = value.trim();
  link.startsWith('http://') ||
  link.startsWith('https://') ||
  link.startsWith('www')
    ? (isLinkInvalid = false)
    : (isLinkInvalid = true);
};

export const emailValidator = (value) => {
  const email = value.trim();
  emailRegex(email) ? (isEmailValid = false) : (isEmailValid = true);
};

export const withAtValidator = (value, type) => {
  value = value.trim();
  if (value.startsWith('@')) {
    if (type === 'tiktok') isTiktokValid = false;
    if (type === 'ig') isInstagramInvalid = true;
    if (type === 'twitter') isTwitterValid = true;
  } else {
    if (type === 'tiktok') isTiktokValid = true;
    if (type === 'ig') isInstagramInvalid = false;
    if (type === 'twitter') isTwitterValid = false;
  }
};
