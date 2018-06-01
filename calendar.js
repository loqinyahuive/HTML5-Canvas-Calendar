$(document).ready(function() {
  CanvasCalendar.initialize();
});

window.CanvasCalendar = {

  initialize: function() {
    var $month = $('#month');
    var $year = $('#year');

    $month.on('change', function() {
      CanvasCalendar.refreshCalendar();
    });

    $year.on('change', function() {
      CanvasCalendar.refreshCalendar();
    });

    CanvasCalendar.refreshCalendar();
  },

  refreshCalendar: function() {
    var selectedMonth = document.getElementById("month").value;
    var selectedYear = document.getElementById("year").value;
    monthDay = 0;
    selectedDate = new Date(selectedMonth + " 1, " + selectedYear);
    var thisMonth = selectedDate.getMonth() + 1;
    prevMonthLastDate = daysInMonth(thisMonth - 1, selectedYear);
    thisMonthLastDate = daysInMonth(thisMonth, selectedYear);
    thisMonthFirstDay = selectedDate.getDay();
    thisMonthFirstDate = selectedDate.getDate();

    if (thisMonth == 12)
      nextMonthFirstDay = 1;
    else
      nextMonthFirstDay = thisMonth + 1;

    dateOffset = thisMonthFirstDay;

    canvas = document.getElementById("calendar");
    context = canvas.getContext("2d");
    CanvasCalendar.drawCalendar();
  },

  drawCalendar: function() {
    for(j = 0; j < 6; ++j) {
      drawWeek(j);
    }
  },
  settings: {
    thisMonthColor: '#202020',
    prevMonthColor: '#909090',
    headColor: "#202020",
    headFont: "bold 15px sans-serif",
    contextFont: "15px sans-serif",
    white: "#ffffff",
    baseColor: "#f0f0f0"
  }
};

var canvas;
var context;
var thisMonth;
var prevMonthLastDate;
var thisMonthLastDate;
var thisMonthFirstDay;
var nextMonthFirstDay;
var monthDay;
var thisMonthColor = "#202020";
var prevMonthColor = "#909090";
var dateOffset;
var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Week Net'];
var cellWidth = 80;
var cellHeight = 50;
var gapWidth = 1;
var gapHeight = 1;
var price = '$100';

function drawWeekHead () {
  for(i=1; i<7; ++i) {
    x_offset = (cellWidth + gapWidth) * i;
    y_offset = 0;
    context.fillStyle = CanvasCalendar.settings.headColor;
    context.font = CanvasCalendar.settings.headFont;
    if (i === 6) {
      context.fillText(weeks[i], x_offset + 5, y_offset + 20);
    } else {
      context.fillText(weeks[i], x_offset + 25, y_offset + 20);
    }
  }
}

function drawWeek(j) {
  drawWeekHead();
  for(i=0; i<7; ++i) {
    drawDay(i, j);
  }
}

function drawDay(i, j) {
  x_offset = (cellWidth + gapWidth) * i;
  y_offset = 30 + (cellHeight + gapHeight) * j;

  context.fillStyle = CanvasCalendar.settings.baseColor;
  context.fillRect(x_offset, y_offset, cellWidth, cellHeight);

  // First week
  if (j == 0) {
    if (i == 0) {
      context.fillStyle = CanvasCalendar.settings.white;
      context.fillRect(x_offset, y_offset, cellWidth, cellHeight);
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '');
    } else if (i == 6) {
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '');
    } else {
      if (i < thisMonthFirstDay) {
        drawDayNumber(prevMonthLastDate - (dateOffset - i) + 1, CanvasCalendar.settings.prevMonthColor, price);
      }
      else if (i == thisMonthFirstDay) {
        monthDay = 1;
        drawDayNumber(thisMonthFirstDate + (dateOffset - i), CanvasCalendar.settings.thisMonthColor, price);
      }
      else {
        ++monthDay;
        drawDayNumber(monthDay, CanvasCalendar.settings.thisMonthColor, price);
      }
    }
  }
  // Last weeks
  else if (thisMonthLastDate <= monthDay) {
    ++monthDay;
    if (i == 0) {
      context.fillStyle = CanvasCalendar.settings.white;
      context.fillRect(x_offset, y_offset, cellWidth, cellHeight);
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '');
    } else if (i == 6) {
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '');
    } else {
      drawDayNumber(monthDay - thisMonthLastDate, CanvasCalendar.settings.prevMonthColor, price);
    }
  }
  // Other weeks
  else {
    ++monthDay;
    if (i == 0) {
      context.fillStyle = CanvasCalendar.settings.white;
      context.fillRect(x_offset, y_offset, cellWidth, cellHeight);
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '');
    } else if (i == 6) {
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '');
    } else {
      drawDayNumber(monthDay, CanvasCalendar.settings.thisMonthColor, price);
    }
  }
}

function drawDayNumber(dayNumber, color, price) {
  context.fillStyle = color;
  context.font = CanvasCalendar.settings.contextFont;
  context.fillText(dayNumber, x_offset + 5, y_offset + 20);
  context.fillText(price, x_offset + 5, y_offset + 40);
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
