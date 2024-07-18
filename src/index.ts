import { createConnection, LessThanOrEqual } from "typeorm";
import { Appointment } from "./entity/Appointment";
import { messaging } from "../firebaseConfig";
import * as cron from "node-cron";

createConnection()
  .then(async (connection) => {
    const appointmentRepository = connection.getRepository(Appointment);
    cron.schedule("*/30 * * * *", async () => {
      const now = new Date();
      const appointments = await appointmentRepository.find({
        where: {
          notificationTime: LessThanOrEqual(now),
          notificationSent: false,
        },
        relations: ["user"],
      });
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
