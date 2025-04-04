export const useShare = () => {
  const share = (): void => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      console.log('Share not supported on this browser, do it the old way.');
    }
  };

  return { share };
};
