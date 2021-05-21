export const responsiveHide = (
  hiddenOn: string,
  showValue: string = "inherit",
  hideValue: string = "none"
) => {
  if (hiddenOn === "xs") {
    return [hideValue, showValue, showValue, showValue, showValue];
  }
  if (hiddenOn === "sm") {
    return [hideValue, hideValue, showValue, showValue, showValue];
  }
  if (hiddenOn === "md") {
    return [hideValue, hideValue, hideValue, showValue, showValue];
  }
  if (hiddenOn === "lg") {
    return [hideValue, hideValue, hideValue, hideValue, showValue];
  }

  return [showValue, showValue, showValue, showValue, showValue];
};

export const responsiveShow = (
  hiddenOn: string,
  shownValue: string = "inherit",
  hiddenValue: string = "none"
) => {
  if (hiddenOn === "xs") {
    return [shownValue, hiddenValue, hiddenValue, hiddenValue, hiddenValue];
  }
  if (hiddenOn === "sm") {
    return [shownValue, shownValue, hiddenValue, hiddenValue, hiddenValue];
  }
  if (hiddenOn === "md") {
    return [shownValue, shownValue, shownValue, hiddenValue, hiddenValue];
  }
  if (hiddenOn === "lg") {
    return [shownValue, shownValue, shownValue, shownValue, hiddenValue];
  }

  return [shownValue, shownValue, shownValue, shownValue, shownValue];
};

export const responsiveVisibiity = (
  hiddenOn: string | undefined,
  shownOn: string | undefined,
  shownValue: string,
  hiddenValue: string
) => {
  if (hiddenOn && hiddenOn !== "none") {
    return responsiveHide(hiddenOn, shownValue, hiddenValue);
  }
  if (shownOn && shownOn !== "none") {
    return responsiveShow(shownOn, shownValue, hiddenValue);
  }

  return shownValue;
};
