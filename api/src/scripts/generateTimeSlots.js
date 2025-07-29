const mongoose = require('mongoose');
const TimeSlot = require('../models/TimeSlot');
const logger = require('../config/logger');

// Fonction pour générer les créneaux pour une période donnée
const generateTimeSlots = async (startDate, endDate) => {
  try {
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);
    let generatedCount = 0;
    let skippedCount = 0;

    while (currentDate <= endDateTime) {
      // Vérifier si des créneaux existent déjà pour cette date
      const existingSlot = await TimeSlot.findOne({
        date: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      });

      if (existingSlot) {
        logger.info(`Slots already exist for ${currentDate.toDateString()}, skipping...`);
        skippedCount++;
      } else {
        // Générer les créneaux par défaut pour cette date
        const slotData = TimeSlot.generateDefaultSlots(new Date(currentDate));
        
        if (slotData) {
          await TimeSlot.create(slotData);
          generatedCount++;
          logger.info(`Generated slots for ${currentDate.toDateString()}`);
        } else {
          logger.info(`No slots generated for ${currentDate.toDateString()} (Sunday)`);
          skippedCount++;
        }
      }

      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }

    logger.info(`Time slots generation completed: ${generatedCount} created, ${skippedCount} skipped`);
    return { generated: generatedCount, skipped: skippedCount };

  } catch (error) {
    logger.error('Error generating time slots:', error);
    throw error;
  }
};

// Fonction pour générer les créneaux pour les 3 prochains mois
const generateNext3Months = async () => {
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  return await generateTimeSlots(today, threeMonthsLater);
};

// Fonction pour bloquer des créneaux spécifiques
const blockTimeSlots = async (date, startTime, endTime, reason = 'Indisponible') => {
  try {
    const targetDate = new Date(date);
    const timeSlot = await TimeSlot.findOne({
      date: {
        $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
        $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
      }
    });

    if (!timeSlot) {
      throw new Error(`No time slots found for ${date}`);
    }

    // Bloquer les créneaux dans la plage horaire spécifiée
    timeSlot.timeSlots.forEach(slot => {
      if (slot.startTime >= startTime && slot.startTime < endTime) {
        slot.isBlocked = true;
        slot.isAvailable = false;
        slot.blockReason = reason;
      }
    });

    await timeSlot.save();
    logger.info(`Blocked time slots from ${startTime} to ${endTime} on ${date}`);

  } catch (error) {
    logger.error('Error blocking time slots:', error);
    throw error;
  }
};

// Fonction pour créer des horaires spéciaux (jours fériés, congés, etc.)
const createSpecialHours = async (date, reason, customHours = []) => {
  try {
    const targetDate = new Date(date);
    
    // Supprimer les créneaux existants pour cette date
    await TimeSlot.deleteOne({
      date: {
        $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
        $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
      }
    });

    // Créer un nouveau créneau avec horaires spéciaux
    const specialSlotData = {
      date: targetDate,
      dayOfWeek: targetDate.getDay(),
      timeSlots: [],
      specialHours: {
        isSpecialDay: true,
        reason,
        customHours
      },
      timezone: 'Europe/Paris'
    };

    // Si des horaires personnalisés sont fournis, les convertir en créneaux
    if (customHours.length > 0) {
      customHours.forEach(customHour => {
        if (customHour.isAvailable) {
          // Générer des créneaux de 30 minutes dans la plage horaire
          const startHour = parseInt(customHour.startTime.split(':')[0]);
          const startMinute = parseInt(customHour.startTime.split(':')[1]);
          const endHour = parseInt(customHour.endTime.split(':')[0]);
          const endMinute = parseInt(customHour.endTime.split(':')[1]);

          for (let h = startHour; h < endHour || (h === endHour && startMinute < endMinute); h++) {
            for (let m = (h === startHour ? startMinute : 0); m < 60; m += 30) {
              if (h === endHour && m >= endMinute) break;

              const slotStartTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
              const nextM = m + 30;
              const nextH = nextM >= 60 ? h + 1 : h;
              const finalM = nextM >= 60 ? 0 : nextM;
              const slotEndTime = `${nextH.toString().padStart(2, '0')}:${finalM.toString().padStart(2, '0')}`;

              specialSlotData.timeSlots.push({
                startTime: slotStartTime,
                endTime: slotEndTime,
                isAvailable: true,
                serviceTypes: ['consultation', 'project-discussion'],
                location: 'online'
              });
            }
          }
        }
      });
    }

    await TimeSlot.create(specialSlotData);
    logger.info(`Created special hours for ${date}: ${reason}`);

  } catch (error) {
    logger.error('Error creating special hours:', error);
    throw error;
  }
};

// Fonction pour nettoyer les anciens créneaux
const cleanupOldSlots = async (daysToKeep = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await TimeSlot.deleteMany({
      date: { $lt: cutoffDate }
    });

    logger.info(`Cleaned up ${result.deletedCount} old time slots`);
    return result.deletedCount;

  } catch (error) {
    logger.error('Error cleaning up old slots:', error);
    throw error;
  }
};

module.exports = {
  generateTimeSlots,
  generateNext3Months,
  blockTimeSlots,
  createSpecialHours,
  cleanupOldSlots
};

// Exécuter le script si appelé directement
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB().then(async () => {
    try {
      const args = process.argv.slice(2);
      const command = args[0];

      switch (command) {
        case 'generate':
          await generateNext3Months();
          break;
        case 'cleanup':
          await cleanupOldSlots();
          break;
        case 'block':
          if (args.length < 4) {
            console.log('Usage: node generateTimeSlots.js block YYYY-MM-DD HH:MM HH:MM [reason]');
            process.exit(1);
          }
          await blockTimeSlots(args[1], args[2], args[3], args[4] || 'Indisponible');
          break;
        default:
          console.log('Available commands:');
          console.log('  generate - Generate time slots for next 3 months');
          console.log('  cleanup - Remove old time slots');
          console.log('  block DATE START_TIME END_TIME [REASON] - Block specific time slots');
          break;
      }
      
      process.exit(0);
    } catch (error) {
      logger.error('Script failed:', error);
      process.exit(1);
    }
  });
}