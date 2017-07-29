var Calendar = function(parent, firstDayOfWeek, events) {
	
	this.today = new Date();
	if(events)
		this.events = events;
	else 
		this.events = [];
	
	this.FIRST_DAY_OF_WEEK = firstDayOfWeek;
	this.WEEK_DAY_LABEL = "calendar.weekdays";
	// NOTE: Month is from 0 to 11
	this.FIRST_MONTH = 0;
	this.LAST_MONTH = 11;
	this.MONTH_OFFSET = 0;
	
	this.currentYear = this.today.getFullYear();
	this.currentMonth = this.today.getMonth() + this.MONTH_OFFSET;
	
	this.parent = $(parent);
	this.parent.classList.add("calendar");
	
	var index;
	var element;
	
	var labels = $("<div class='calendar_labels'></div>");
	for(var d = this.FIRST_DAY_OF_WEEK; d < this.FIRST_DAY_OF_WEEK + 7; d++)
	{
		element = $("<div class='calendar_day'><label key='" + this.WEEK_DAY_LABEL + "[" + (d % 7) + "]'></label></div>")
		labels.append(element);
	}	
	this.parent.append(labels);
	
	this.elements = [];
	for(var w = 0; w < 6; w++)
	{
		var week = $("<div class='calendar_week'></div>");
		for(var d = 0; d < 7; d++)
		{
			index = w*7 + d;
			element = $("<div class='calendar_day'></div>")
			this.elements[index] = element;
			week.append(element);
		}
		this.parent.append(week);
	}
	
	this.update = function(events) {
		if(events)
			this.events = events;
		// remove all items in calendar days
		this.parent.find(".calendar_content .calendar_day *").remove();
		
		var startOfMonth 	= new Date(this.currentYear, this.currentMonth, 1);	
		var endOfMonth   	= new Date(this.currentYear, this.currentMonth + 1, 0)
		var endOfPrevMonth  = new Date(this.currentYear, this.currentMonth, 0)
		var offset = startOfMonth.getDay() - this.FIRST_DAY_OF_WEEK;
		var daysInThisMonth = endOfMonth.getDate();
		var daysInPrevMonth = endOfPrevMonth.getDate();
		var rangeStart 	 	= new Date(this.currentYear, this.currentMonth, 1 - offset).getTime();
		var rangeEnd 	 	= new Date(this.currentYear, this.currentMonth, 1 - offset + 6*7).getTime();
		
		console.log("offset=" + offset);
		console.log(endOfMonth);
		console.log("daysInThisMonth=" + daysInThisMonth);
		var index;
		var number;
		for(var w = 0; w < 6; w++)
		{
			for(var d = 0; d < 7; d++)
			{
				index = w*7 + d;
				if(index >= offset && index < (offset + daysInThisMonth))
				{
					number = index - offset + 1;
					this.elements[w*7 + d].classList.remove("calendar_previous_month");
					this.elements[w*7 + d].classList.add("calendar_current_month");
					this.elements[w*7 + d].classList.remove("calendar_next_month");
				}
				else if(index < offset)
				{
					number = daysInPrevMonth - offset + index + 1;
					this.elements[w*7 + d].classList.add("calendar_previous_month");
					this.elements[w*7 + d].classList.remove("calendar_current_month");
					this.elements[w*7 + d].classList.remove("calendar_next_month");
				}
				else
				{
					number = index - offset - daysInThisMonth + 1;
					this.elements[w*7 + d].classList.remove("calendar_previous_month");
					this.elements[w*7 + d].classList.remove("calendar_current_month");
					this.elements[w*7 + d].classList.add("calendar_next_month");
				}
				console.log("index=" + index + " -> " + number);
				this.elements[w*7 + d].append($("<div class='calendar_number'>" + number + "</div>"));
			}
		}
		
		// display events
		var eventTime;
		for(var i = 0; i < this.events.length; i++)
		{
			eventTime = this.events[i].date.getTime();
			if(eventTime >= rangeStart && eventTime < rangeEnd)
			{
				index = this.events[i].date.getDay() + offset - 1;
				this.elements[index].append($("<div class='calendar_event'>\
													<span>" + this.events[i].title + "</span>\
												</div>"));
			}
		}
	};
	
	this.showMonth = function(year, month) {
		this.currentYear = year;
		this.currentMonth = month;
		this.update();
	};
	
	this.previousMonth = function() {
		this.currentYear = year;
		this.currentMonth--;
		if(this.currentMonth < this.FIRST_MONTH)
		{
			this.currentMonth = this.LAST_MONTH;
			this.currentYear--;
		}
		this.update();
	};
	
	this.nextMonth = function() {
		this.currentYear = year;
		this.currentMonth++;
		if(this.currentMonth > this.LAST_MONTH)
		{
			this.currentMonth = this.FIRST_MONTH;
			this.currentYear++;
		}
		this.update();
	};
	
	this.update();
};