let navigateFunction: (path: string) => void;

export const setNavigate = (navigate: (path: string) => void) => {
  navigateFunction = navigate;
};

export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.warn("Navigate function not initialized.");
  }
};
