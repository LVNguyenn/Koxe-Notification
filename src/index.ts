import { createConnection, LessThanOrEqual } from "typeorm";
import { Appointment } from "./entity/Appointment";
import { messaging } from "../firebaseConfig";
import * as cron from "node-cron";
const moment = require("moment-timezone");

import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Koxe Push Notification!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

createConnection()
  .then(async (connection) => {
    const appointmentRepository = connection.getRepository(Appointment);
    cron.schedule("* * * * *", async () => {
      const now = moment.tz("Asia/Ho_Chi_Minh").startOf("minute");
      console.log(now);
      let appointments = await appointmentRepository.find({
        where: {
          notificationSent: false,
        },
        relations: ["user"],
      });

      console.log("1", appointments);

      appointments = appointments.map((appointment: any) => ({
        ...appointment,
        notificationTime: moment.tz(
          appointment.notificationTime,
          "Asia/Ho_Chi_Minh"
        ),
      }));

      console.log("2", appointments);

      appointments = appointments.filter((appointment) => {
        return now.isSame(appointment.notificationTime);
      });

      console.log("3", appointments);
      appointments.forEach(async (appointment) => {
        if (appointment.user.androidFcmToken !== null) {
          const message = {
            notification: {
              title: "Lịch hẹn sắp diễn ra",
              body: "⏳︎ Cuộc hẹn của bạn sẽ diễn ra sau 30 phút",
            },
            token: appointment.user.androidFcmToken,
          };
          try {
            await messaging.send(message);
            console.log("Notification sent successfully:", appointment.id);
            appointment.notificationSent = true;
            await appointmentRepository.save(appointment);
          } catch (error) {
            console.log("Error sending notification:", error);
          }
        }
      });
    });
  })
  .catch((error) => console.log(error));
