---
title: "Nöbet Çizelgem"
description: "A free mobile app that helps shift workers keep track of their duty schedules."
weight: 1
# Publish only the resized screenshots, not the originals
build:
  publishResources: false
platforms: ["Android", "iOS"]
links:
  appStore: "https://apps.apple.com/app/hem%C5%9Fire-n%C3%B6bet-%C3%A7izelgem/id6476260555"
  googlePlay: "https://play.google.com/store/apps/details?id=com.dizdardev.hemsirenobetcizelgem&hl=en"
---

**Nöbet Çizelgem** is a free mobile app built to help shift workers keep track of their duty schedules with ease. It lets you mark different shift types visually on a calendar and calculates your total working hours for the month.

## ✨ Features

### 📅 Shift Management
- **Visual Calendar**: Monthly view of your duty schedule
- **Shift Types**:
  - 🌞 8-16 (8 hours – Day)
  - 🌚 16-8 (16 hours – Night)
  - 🌞🌚 8-8 (24 hours – Full day)
  - 🌞🌞 8-24 (16 hours – Double day)
  - 🌚🌚 16-24 (8 hours – Double night)
- **Colour Coding**: A different colour for each shift type
- **Quick Selection**: Tap a date to assign a shift

### 📊 Statistics
- **Monthly Total**: Total working hours for the selected month
- **Real Time**: Statistics update automatically as you add shifts

### 🕒 Custom Shifts
- **Define Your Own Shifts**: Besides the 5 built-in shift types, create custom shift types by choosing a start and end time
- **Automatic Duration**: Working time is calculated from the start and end times, including shifts that run past midnight

### 💾 Data Management
- **Local Storage**: Your data is stored safely on the device with AsyncStorage
- **Export**: Save your data as a real `.json` backup file to Files/Drive/iCloud through the native share menu
- **Import**: Restore from a backup file using the file picker (backups are validated; invalid files are rejected)
- **Reset**: Option to clear the whole schedule

### 🎨 User Experience
- **Dark/Light Mode**: Follows your system theme
- **Turkish and English Localization**: Full language support
- **Responsive Design**: Works on different screen sizes
- **Modern UI**: Clean design with React Native Paper (Material Design 3) and the Poppins font family
