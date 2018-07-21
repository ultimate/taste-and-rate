var Calendar = function(parent, showNav, firstDayOfWeek, events) {
	
	this.today = new Date();
	if(events)
		this.events = events;
	else 
		this.events = [];
	
	this.FIRST_DAY_OF_WEEK = firstDayOfWeek;
	this.WEEK_DAY_LABEL = "calendar.weekdays";
	this.MONTH_LABEL = "calendar.months";
	// NOTE: Month is from 0 to 11
	this.FIRST_MONTH = 0;
	this.LAST_MONTH = 11;
	this.MONTH_OFFSET = 0;
	
	this.currentYear = this.today.getFullYear();
	this.currentMonth = this.today.getMonth() + this.MONTH_OFFSET;
	
	if(typeof(parent) == "string")
		parent = document.getElementById(parent);
	this.parent = parent;
	this.parent.classList.add("calendar");
	
	var index;
	var element;
	
	var nav = Elements.fromString("<div class='calendar_nav'></div>");
	var prevMonthButton = Elements.fromString("<div class='button'></div>");
	prevMonthButton.append(Elements.createSVG("0 0 100 100", "image", "#img_arrow_left"));
	var navLabel 		= Elements.fromString("<div class='label'></div>")
	var currMonthLabel  = Elements.fromString("<label key=''></div>");
	var currYearLabel   = Elements.fromString("<label key=''></div>");
	var nextMonthButton = Elements.fromString("<div class='button'></div>");
	nextMonthButton.append(Elements.createSVG("0 0 100 100", "image", "#img_arrow_right"));
	nav.append(prevMonthButton);
	navLabel.append(currMonthLabel);
	navLabel.append(currYearLabel);
	nav.append(navLabel);
	nav.append(nextMonthButton);
	if(showNav)
		this.parent.append(nav);
	
	var labels = Elements.fromString("<div class='calendar_labels'></div>");
	for(var d = this.FIRST_DAY_OF_WEEK; d < this.FIRST_DAY_OF_WEEK + 7; d++)
	{
		element = Elements.fromString("<div class='calendar_day'><label key='" + this.WEEK_DAY_LABEL + "[" + (d % 7) + "]'></label></div>");
		labels.append(element);
	}	
	this.parent.append(labels);
	
	this.elements = [];
	for(var w = 0; w < 6; w++)
	{
		var week = Elements.fromString("<div class='calendar_week'></div>");
		for(var d = 0; d < 7; d++)
		{
			index = w*7 + d;
			element = Elements.fromString("<div class='calendar_day'></div>")
			this.elements[index] = element;
			week.append(element);
		}
		this.parent.append(week);
	}	
	
	this.onUpdate = function() {
		// function to be overwritten by external function to support onUpdate event
	};
	
	this.onSelect = function(event) {
		// function to be overwritten by external function to support onSelectEvent event
	};
	
	this.update = function(events) {
		if(events)
			this.events = events;
		// remove all items in calendar days
		for(var i = 0; i < this.elements.length; i++)
		{
			Elements.removeChildren(this.elements[i]);
		}
		
		var startOfMonth 	= new Date(this.currentYear, this.currentMonth, 1);	
		var endOfMonth   	= new Date(this.currentYear, this.currentMonth + 1, 0)
		var endOfPrevMonth  = new Date(this.currentYear, this.currentMonth, 0)
		var offset = startOfMonth.getDay() - this.FIRST_DAY_OF_WEEK;
		if(offset < 0) offset += 7;
		var daysInThisMonth = endOfMonth.getDate();
		var daysInPrevMonth = endOfPrevMonth.getDate();
		var rangeStart 	 	= new Date(this.currentYear, this.currentMonth, 1 - offset).getTime();
		var rangeEnd 	 	= new Date(this.currentYear, this.currentMonth, 1 - offset + 6*7).getTime();
		
		//console.log("offset=" + offset);
		//console.log(endOfMonth);
		//console.log("daysInThisMonth=" + daysInThisMonth);
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
				//console.log("index=" + index + " -> " + number);
				this.elements[w*7 + d].append(Elements.fromString("<div class='calendar_number'>" + number + "</div>"));
			}
		}
		
		// display events
		console.log("range = " + new Date(rangeStart) + " to " + new Date(rangeEnd));
		var eventTime;
		var element;
		for(var i = 0; i < this.events.length; i++)
		{
			if(this.events[i] == null || this.events[i].date == null)
			{
				console.log("invalid event: " + (this.events[i] == null ? "null": "'" + this.events[i].title + "' (" + this.events[i].date + ")"));
				continue;
			}
			eventTime = this.events[i].date.getTime();
			if(eventTime >= rangeStart && eventTime < rangeEnd)
			{
				index = this.events[i].date.getDate() + offset - 1;
				if(this.events[i].date.getMonth() != this.currentMonth)
				{
					if(this.events[i].date.getYear() > this.currentYear || this.events[i].date.getMonth() > this.currentMonth)
					{
						index += daysInThisMonth;
					}
					else if(this.events[i].date.getYear() < this.currentYear || this.events[i].date.getMonth() < this.currentMonth)
					{
						index -= daysInPrevMonth;
					}
					else
					{
						console.err("how did we get here: " + this.events[i].date);
					}
				}
				console.log("displaying event: '" + this.events[i].title + "' (" + this.events[i].date + ") @ " + index);
				element = Elements.fromString("<div class='calendar_event'>\
												<span class='title'>" + this.events[i].title + "</span>\
												<span class='location'>" + this.events[i].location + "</span>\
											   </div>")
				element.onclick = function(cal, i) { return function() { cal.onSelect(cal.events[i]); }; }(this, i);
				this.elements[index].append(element);			
			}
			else
			{
				console.log("skipping event: '" + this.events[i].title + "' (" + this.events[i].date + ") > out of range");
			}
		}
		
		currMonthLabel.setAttribute("key", this.MONTH_LABEL + "[" + this.currentMonth + "]");
		currYearLabel.innerHTML = this.currentYear;
		if(this.onUpdate)
			this.onUpdate();
	};
	
	this.showMonth = function(year, month) {
		this.currentYear = year;
		this.currentMonth = month;
		this.update();
	};
	
	this.previousMonth = function() {
		this.currentMonth--;
		if(this.currentMonth < this.FIRST_MONTH)
		{
			this.currentMonth = this.LAST_MONTH;
			this.currentYear--;
		}
		this.update();
	};
	
	this.nextMonth = function() {
		this.currentMonth++;
		if(this.currentMonth > this.LAST_MONTH)
		{
			this.currentMonth = this.FIRST_MONTH;
			this.currentYear++;
		}
		this.update();
	};
		
	Events.addEventListener(Events.CLICK, function(c) { return function(event) { c.previousMonth() }; }(this), prevMonthButton);
	Events.addEventListener(Events.CLICK, function(c) { return function(event) { c.nextMonth()     }; }(this), nextMonthButton);
	
	this.update();
};