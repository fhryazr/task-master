const parseFocusTime = (focusTime) => {
  const [hours, minutes, seconds] = focusTime.split(":");
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10)
  );
};

const calculateTotalFocusTime = (focusStats) => {
  let totalFocusTime = 0;

  for (const focusData of focusStats) {
    totalFocusTime += parseFocusTime(focusData.waktu);
  }

  return totalFocusTime;
};

const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  // Tambahkan logika pemformatan
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

// Fungsi untuk mengelompokkan entri berdasarkan tanggal
const groupFocusStatsByDay = (focusStats) => {
  const groupedStats = new Map();

  for (const focusData of focusStats) {
    const date = new Date(focusData.day);
    const formattedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ); // Hanya tanggal, bulan, dan tahun

    const dateString = formattedDate.toDateString();

    if (groupedStats.has(dateString)) {
      groupedStats.get(dateString).push(focusData);
    } else {
      groupedStats.set(dateString, [focusData]);
    }
  }

  return Array.from(groupedStats.values());
};

const getFocusTimeInInterval = (dataParam, intervalDays) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() - intervalDays);

  const focusStatsInInterval = dataParam.filter((focusData) => {
    const focusDataDate = new Date(focusData.day);
    return focusDataDate >= targetDate && focusDataDate <= now;
  });

  return calculateTotalFocusTime(focusStatsInInterval);
};

const getFocusTimeInWeekInterval = (dataParams) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() - 7); // 7 hari sebelum total value hari ini

  const focusStatsInInterval = dataParams.filter((focusData) => {
    const focusDataDate = new Date(focusData.day);
    return focusDataDate >= targetDate && focusDataDate <= now;
  });

  const groupedStats = groupFocusStatsByDay(focusStatsInInterval);

  return groupedStats.map((group) => {
    const totalFocusTime = calculateTotalFocusTime(group);
    const date = new Date(group[0].day);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`; // Hanya tanggal, bulan, dan tahun
    return {
        name: formattedDate, // Gunakan tanggal yang telah diformat
        Total: totalFocusTime,
      };
  });
};

const getFocusTimeInMonthInterval = (dataParams) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const targetDate = new Date(now);
  targetDate.setMonth(targetDate.getMonth() - 1); // 1 bulan sebelum total value bulan ini

  const focusStatsInInterval = dataParams.filter((focusData) => {
    const focusDataDate = new Date(focusData.day);
    return focusDataDate >= targetDate && focusDataDate <= now;
  });

  const groupedStats = groupFocusStatsByDay(focusStatsInInterval);

  return groupedStats.map((group) => {
    const totalFocusTime = calculateTotalFocusTime(group);
    const date = new Date(group[0].day);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`; // Hanya tanggal, bulan, dan tahun
    return {
      name: formattedDate,
      Total: totalFocusTime,
    };
  });
};

const getFocusTimeInYearInterval = (dataParams) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const targetDate = new Date(now);
  targetDate.setFullYear(targetDate.getFullYear() - 1); // 1 tahun sebelum total value tahun ini

  const focusStatsInInterval = dataParams.filter((focusData) => {
    const focusDataDate = new Date(focusData.day);
    return focusDataDate >= targetDate && focusDataDate <= now;
  });

  const groupedStats = groupFocusStatsByDay(focusStatsInInterval);

  return groupedStats.map((group) => {
    const totalFocusTime = calculateTotalFocusTime(group);
    const date = new Date(group[0].day);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`; // Hanya tanggal, bulan, dan tahun
    return {
      name: formattedDate,
      Total: totalFocusTime,
    };
  });
};

export {
  parseFocusTime,
  calculateTotalFocusTime,
  formatTime,
  groupFocusStatsByDay,
  getFocusTimeInInterval,
  getFocusTimeInWeekInterval,
  getFocusTimeInMonthInterval,
  getFocusTimeInYearInterval,
};
