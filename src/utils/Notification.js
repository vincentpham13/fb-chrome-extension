const Noti = {
  show: (title, message) => {
    chrome.notifications.create(
      new Date().getTime().toString(),
      {
        type: "basic",
        title,
        message,
        iconUrl: "logo.png"
      },
      (notiId) => {

      }
    );
  }
};

export default Noti;
