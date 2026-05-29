const axios = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("RFID Simulator is running...");
});

app.listen(PORT, () => {
  console.log(`Fake Server listening on port ${PORT}`);
});

const TARGET_API =
  "https://rfid-tracking-afp3pnuxh-minhnc912s-projects.vercel.app/api/rfid-scan";
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
  "Classroom_3",
  "Classroom_4",
  "Leaving",
];

setInterval(async () => {
  const randomName =
    studentNames[Math.floor(Math.random() * studentNames.length)];
  const randomZone =
    schoolZones[Math.floor(Math.random() * schoolZones.length)];
  try {
    await axios.post(
      TARGET_API,
      {
        student_name: randomName,
        zone: randomZone,
      },
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(`[RFID] Sent: ${randomName} -> ${randomZone}`);
  } catch (err) {
    console.error("Lỗi:", err.message);
  }
}, 10000);
