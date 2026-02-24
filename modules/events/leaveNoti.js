module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Cake Country",
  description: "Thông báo khi có người rời nhóm"
};

module.exports.run = async function ({ api, event }) {
  const moment = require("moment-timezone");
  const axios = require("axios");

  if (event.logMessageData.leftParticipantFbId) {

    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName || "Nhóm";

    const uid = event.logMessageData.leftParticipantFbId;
    const userInfo = await api.getUserInfo(uid);
    const name = userInfo[uid].name;

    const time = moment()
      .tz("Asia/Ho_Chi_Minh")
      .format("ss:mm:HH - DD/MM/YYYY");

    const memberCount = threadInfo.participantIDs.length - 1;

    const type =
      uid == event.author
        ? "🚪 Tự rời nhóm"
        : "⚠️ Đã bị kick khỏi nhóm";

    const msg =
`╔══════════════════════╗
💔  𝑻𝑨̣𝑴 𝑩𝑰𝑬̣̂𝑻 𝑻𝑯𝑨̀𝑵𝑯 𝑽𝑰𝑬̂𝑵  💔
╚══════════════════════╝

👤 ${name}
📌 ${type}

🏷 Nhóm: ${threadName}

⏰ Thời gian:
🕒 ${time}

👥 Số thành viên còn lại: ${memberCount}

🔗 Facebook:
https://www.facebook.com/${uid}

━━━━━━━━━━━━━━━━━━━━━━`;

    // Gửi tin nhắn trước
    await api.sendMessage(msg, event.threadID);

    // Sau đó gửi ảnh
    const img = (await axios.get(
      "https://i.postimg.cc/sf4wWjM6/8cf0027df2103ab906e65028a93f3de1.jpg",
      { responseType: "stream" }
    )).data;

    api.sendMessage(
      {
        attachment: img
      },
      event.threadID
    );
  }
};
