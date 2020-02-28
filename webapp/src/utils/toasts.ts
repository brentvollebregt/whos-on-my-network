import cogoToast from "cogo-toast";

export const showInfoToast = (title: string, content?: string) => {
  const { hide } = cogoToast.info(content, {
    position: "bottom-center",
    heading: title,
    hideAfter: 20,
    onClick: () => hide !== undefined && hide()
  });
};

export const showErrorToast = (title: string, content: string) => {
  const { hide } = cogoToast.error(content, {
    position: "bottom-center",
    heading: title,
    hideAfter: 20,
    onClick: () => hide !== undefined && hide()
  });
};

export const genericApiErrorMessage = (summary: string) =>
  showErrorToast(
    `Failed to get ${summary}`,
    `Failed to get ${summary}, please make sure the server is available.`
  );
