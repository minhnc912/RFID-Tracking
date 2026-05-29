const axios = require("axios");

const TARGET_API = "http://localhost:3000/api/rfid-scan";

const studentNames = [
  "Học sinh Nguyễn Văn A",
  "Học sinh Trần Thị B",
  "Học sinh Hoàng Văn C",
];
const schoolZones = [
  "Entrance",
  "Classroom_1",
  "Cafeteria",
  "Classroom_2",
  "Restroom",
  "Lab",
  "Recess",
  "Classroom_3",
  "Classroom_4",
  "Leaving",
];

console.log(
  "🛰️ Hệ thống Giả lập RFID đang kích hoạt phát tín hiệu (Chu kỳ 4s)...",
);

setInterval(async () => {
  const randomName =
    studentNames[Math.floor(Math.random() * studentNames.length)];
  const randomZone =
    schoolZones[Math.floor(Math.random() * schoolZones.length)];

  try {
    const res = await axios.post(TARGET_API, {
      student_name: randomName,
      zone: randomZone,
    });
    console.log(
      `[RFID TRIGGERED] -> ${randomName} di chuyển tới [${randomZone}] | Status:`,
      res.status === 200 ? "Thành công" : "Thất bại",
    );
  } catch (err) {
    console.error("❌ Lỗi đồng bộ tín hiệu:", err.message);
  }
}, 4000);
