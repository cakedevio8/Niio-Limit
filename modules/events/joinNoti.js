module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.1.0",
  credits: "Cake Country",
  description: "Thông báo khi có người vào nhóm"
};

module.exports.run = async function ({ api, event }) {
  const moment = require("moment-timezone");
  const axios = require("axios");

  if (event.logMessageData.addedParticipants) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName || "Nhóm";

    for (let user of event.logMessageData.addedParticipants) {

      const name = user.fullName;
      const uid = user.userFbId;

      const time = moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("ss:mm:HH - DD/MM/YYYY");

      const memberCount = threadInfo.participantIDs.length;

      const msg =
`╔══════════════════════╗
🌸  𝑪𝑯𝑨̀𝑶 𝑴𝑼̛̀𝑵𝑮 𝑻𝑯𝑨̀𝑵𝑯 𝑽𝑰𝑬̂𝑵 𝑴𝑶̛́𝑰  🌸
╚══════════════════════╝

👋 Xin chào ${name}
🎀 Chào mừng bạn đến với nhóm:
💬 ${threadName}

⏰ Thời gian vào nhóm:
🕒 ${time}

👥 Bạn là thành viên thứ ${memberCount}

🌈 Chúc bạn một ngày vui vẻ ✨

🔗 Facebook của bạn:
https://www.facebook.com/${uid}

━━━━━━━━━━━━━━━━━━━━━━`;

      const img = (await axios.get(
        "https://i.postimg.cc/28vjGtfT/4e3295c59fecce34cf226e667ad21eed.jpg",
        { responseType: "stream" }
      )).data;

      api.sendMessage(
        {
          body: msg,
          attachment: img
        },
        event.threadID
      );
    }
  }
};module.exports.config = {
  name: "autoSet",
  version: "2.0.0",
  credits: "Cake Country",
  description: "Auto trừ ngày thuê và cập nhật biệt danh"
};

const fs = require("fs");
const path = require("path");

const rentPath = path.join(__dirname, "../../data/rent.json");

module.exports.onLoad = function ({ api }) {

  const schedule = () => {

    const now = new Date();

    const next = new Date();
    next.setDate(now.getDate() + 1);
    next.setHours(0);
    next.setMinutes(Math.floor(Math.random() * 60));
    next.setSeconds(Math.floor(Math.random() * 60));

    const delay = next - now;

    setTimeout(async () => {

      if (!fs.existsSync(rentPath)) return schedule();

      const data = JSON.parse(fs.readFileSync(rentPath));
      const today = new Date().toDateString();

      for (let threadID in data.threads) {

        const rent = data.threads[threadID];

        if (rent.remaining <= 0) continue;

        if (rent.lastUpdate !== today) {
          rent.remaining -= 1;
          rent.lastUpdate = today;
        }

        if (rent.remaining <= 0) continue;

        const prefix = global.config.PREFIX || "!";
        const dayText =
          rent.remaining === 1
            ? "1 ngày"
            : `${rent.remaining} ngày`;

        const newNickname =
          `⟬${prefix}⟭ 𝙲𝚊𝚔𝚎 ︴${dayText}`;

        await api.changeNickname(
          newNickname,
          threadID,
          api.getCurrentUserID()
        );
      }

      fs.writeFileSync(rentPath, JSON.stringify(data, null, 2));

      schedule();

    }, delay);
  };

  schedule();
};
