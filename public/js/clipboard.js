// @ts-check
export const copyToClipboard = (string) => {
    const element = document.createElement('textarea');
    element.value = string;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
};
