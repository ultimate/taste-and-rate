var Calendar = function(firstDayOfWeek, events) {
	
	this.today = new Date();
	if(events)
		this.events = events;
	else 
		this.events = [];
	
	this.FIRST_DAY_OF_WEEK = firstDayOfWeek;
	// NOTE: Month is from 0 to 11
	this.FIRST_MONTH = 0;
	this.LAST_MONTH = 11;
	this.MONTH_OFFSET = 0;
	
	this.currentYear = this.today.getFullYear();
	this.currentMonth = this.today.getMonth() + this.MONTH_OFFSET;
	
	this.elements = [];
	for(var w = 0; w < 6; w++)
	{
		for(var d = 0; d < 7; d++)
		{
			this.elements[w*7 + d] = $("<div class='calendar_day'></div>")
		}
	}
	
	this.update = function(events) {
		if(events)
			this.events = events;
		// remove all items in calendar days
		$(".calendar_day *").remove();
		
		var startOfMonth = new Date(this.currentYear, this.currentMonth);
		var rangeStart 	 = new Date(this.currentYear, this.currentMonth, 1 - startOfMonth.getDay() + this.FIRST_DAY_OF_WEEK).getTime();
		var rangeEnd 	 = new Date(this.currentYear, this.currentMonth, 1 - startOfMonth.getDay() + this.FIRST_DAY_OF_WEEK + 6*7).getTime();
		
		var eventTime;
		var index;
		for(var i = 0; i < events.length; i++)
		{
			eventTime = events[i].date;
			if(eventTime) >= rangeStart && eventTime < rangeEnd)
			{
				index = 0;
				this.elements[index].append( /**/ );
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
};