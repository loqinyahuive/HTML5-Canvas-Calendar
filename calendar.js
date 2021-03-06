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
    // var selectedMonth = "January";
    // var selectedYear = 2018;
    monthDay = 0;
    selectedDate = new Date(selectedMonth + " 1, " + selectedYear);
    var thisMonth = selectedDate.getMonth() + 1;
    prevMonthLastDate = daysInMonth(thisMonth - 1, selectedYear);
    thisMonthLastDate = daysInMonth(thisMonth, selectedYear);
    thisMonthLastDay = new Date(selectedMonth + " " + thisMonthLastDate +", " + selectedYear).getDay();
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
    for(j = 0; j < 5; ++j) {
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
var thisMonthLastDay;
var monthDay;
var thisMonthColor = "#202020";
var prevMonthColor = "#909090";
var dateOffset;
var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Week Net'];
var cellWidth = 80;
var cellHeight = 50;
var gapWidth = 1;
var gapHeight = 1;
var prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
              16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

function drawWeekHead () {
  for(i=1; i<7; ++i) {
    x_offset = (cellWidth + gapWidth) * (i - 1);
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
  if (i == 0) i = 6;
  x_offset = (cellWidth + gapWidth) * (i - 1);
  y_offset = 30 + (cellHeight + gapHeight) * j;

  context.fillStyle = CanvasCalendar.settings.baseColor;
  context.fillRect(x_offset, y_offset, cellWidth, cellHeight);

  // First week
  if (j == 0) {
    if (i == 6) {
      ++monthDay;
      var firstWeekPrice = 0;
      if (thisMonthFirstDay === 5) {
        firstWeekPrice = prices[0];
      } else if (thisMonthFirstDay === 4) {
        firstWeekPrice = prices[0] + prices[1];
      } else if (thisMonthFirstDay === 3) {
        firstWeekPrice = prices[0] + prices[1] + prices[2];
      } else if (thisMonthFirstDay === 2) {
        firstWeekPrice = prices[0] + prices[1] + prices[2] + prices[3];
      } else if (thisMonthFirstDay === 1) {
        firstWeekPrice = prices[0] + prices[1] + prices[2] + prices[3] + prices[4];
      } else if (thisMonthFirstDay === 0) {
        firstWeekPrice = prices[1] + prices[2] + prices[3] + prices[4] + prices[5];
      }
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '$' + firstWeekPrice);
    } else {
      if (i < thisMonthFirstDay) {
        drawDayNumber(prevMonthLastDate - (dateOffset - i) + 1, CanvasCalendar.settings.prevMonthColor, '');
      }
      else if (i == thisMonthFirstDay) {
        monthDay = 1;
        drawDayNumber(thisMonthFirstDate + (dateOffset - i), CanvasCalendar.settings.thisMonthColor, '$' + prices[monthDay-1]);
      }
      else {
        ++monthDay;
        drawDayNumber(monthDay, CanvasCalendar.settings.thisMonthColor, '$' + prices[monthDay-1]);
      }
    }
  }
  // Last weeks
  else if (thisMonthLastDate <= monthDay) {
    ++monthDay;
      if (i == 6) {
        var lastWeekPrice = 0;
        if (thisMonthLastDay == 5) {
          lastWeekPrice = prices[thisMonthLastDate-1] + prices[thisMonthLastDate-2] + prices[thisMonthLastDate-3] + prices[thisMonthLastDate-4] + prices[thisMonthLastDate-5];
        } else if (thisMonthLastDay == 4) {
          lastWeekPrice = prices[thisMonthLastDate-1] + prices[thisMonthLastDate-2] + prices[thisMonthLastDate-3] + prices[thisMonthLastDate-4];
        } else if (thisMonthLastDay == 3) {
          lastWeekPrice = prices[thisMonthLastDate-1] + prices[thisMonthLastDate-2] + prices[thisMonthLastDate-3];
        } else if (thisMonthLastDay == 2) {
          lastWeekPrice = prices[thisMonthLastDate-1] + prices[thisMonthLastDate-2];
        } else if (thisMonthLastDay == 1) {
          lastWeekPrice = prices[thisMonthLastDate-1];
        }
        drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '$' + lastWeekPrice);
      } else {
        drawDayNumber(monthDay - thisMonthLastDate, CanvasCalendar.settings.prevMonthColor, '');
      }
  }
  // Other weeks
  else {
    ++monthDay;
    if (i == 6) {
      drawDayNumber('', CanvasCalendar.settings.thisMonthColor, '$' + (prices[monthDay-2] + prices[monthDay-3] + prices[monthDay-4] + prices[monthDay-5] + prices[monthDay-6]));
    } else {
      drawDayNumber(monthDay, CanvasCalendar.settings.thisMonthColor, '$' + prices[monthDay-1]);
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
