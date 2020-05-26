var Calendar = function(parent, showNav, firstDayOfWeek, items) {
	
	this.today = new Date();
	this.items = [];
	this.displayedItems = [];
	
	this.FIRST_DAY_OF_WEEK = firstDayOfWeek;
	this.WEEK_DAY_LABEL = "calendar.weekdays";
	this.MONTH_LABEL = "calendar.months";
	// NOTE: Month is from 0 to 11
	this.FIRST_MONTH = 0;
	this.LAST_MONTH = 11;
	this.MONTH_OFFSET = 0;
		
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
			element = Elements.fromString("<div class='calendar_day'></div>");
			element.onclick = function(cal, index) { return function() { cal.onSelect(cal.displayedItems[index]); }; }(this, index);
			this.elements[index] = element;
			week.append(element);
		}
		this.parent.append(week);
	}	
	
	this.onUpdate = function() {
		// function to be overwritten by external function to support UI specific updating after updated content
		// (e.g. label updating)
	};
	
	this.onSelect = function(items) {
		// function to be overwritten by external function to allow item displaying, when calendar day is selected
	};
	
	this.clearItems = function() {
		this.items = [];	
		this.update();
	}
	
	this.addItems = function(items) {
		this.items = items;
		this.update();
	};
	
	this.update = function() {
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
		
		// init cache for displayed items		
		this.displayedItems = new Array(42);
		for(var i = 0; i < this.displayedItems.length; i++)
			this.displayedItems[i] = [];
		
		// get displayed items
		console.log("range = " + new Date(rangeStart) + " to " + new Date(rangeEnd));
		var itemTime;
		var itemDate;
		var element;
		for(var i = 0; i < this.items.length; i++)
		{
			if(this.items[i] == null || this.items[i].date == null)
			{
				console.log("invalid item: " + (this.items[i] == null ? "null": "'" + this.items[i].title + "' (" + this.items[i].date + ")"));
				continue;
			}
			itemTime = this.items[i].date; //.getTime();
			itemDate = new Date(itemTime);
			if(itemTime >= rangeStart && itemTime < rangeEnd)
			{
				index = itemDate.getDate() + offset - 1;
				if(itemDate.getMonth() != this.currentMonth)
				{
					if(itemDate.getFullYear() > this.currentYear || (itemDate.getMonth() > this.currentMonth && itemDate.getFullYear() == this.currentYear))
					{
						index += daysInThisMonth;
					}
					else if(itemDate.getFullYear() < this.currentYear || (itemDate.getMonth() < this.currentMonth && itemDate.getFullYear() == this.currentYear))
					{
						index -= daysInPrevMonth;
					}
					else
					{
						console.err("how did we get here: " + itemDate);
					}
				}
				
				console.log("displaying item: '" + (this.items[i].title.length <= 25 ? this.items[i].title : this.items[i].title.substring(0,25)) + "' (" + this.items[i].date + ") @ " + index);
				this.displayedItems[index].push(this.items[i]);
			}
			else
			{
				console.log("skipping item: '" + (this.items[i].title.length <= 25 ? this.items[i].title : this.items[i].title.substring(0,25)) + "' (" + this.items[i].date + ") > out of range");
			}
		}
		
		// display items
		for(index = 0; index < this.displayedItems.length; index++)
		{
			if(this.displayedItems[index].length == 0)
			{
				continue;
			}
			else
			{
				for(var j = 0; j < this.displayedItems[index].length; j++)
				{
					var title = this.displayedItems[index].title;
					var entryCount = 0;
					if(this.displayedItems[index].ratings != null)
						entryCount = this.displayedItems[index].ratings.length;
					element = Elements.fromString("<div class='calendar_item'>\
													<span class='title'>" + title + "</span>\
													" + (entryCount != 0 ? "<span class='count'>" + entryCount + " <label key='calendar." + (entryCount != 1 ? "entries" : "entry") + "'></label></span>" : "") + "\
												   </div>");
												   // <span class='location'>" + this.displayedItems[index][j].location + "</span>

					this.elements[index].append(element);
				}
			}				
		}
		
		currMonthLabel.setAttribute("key", this.MONTH_LABEL + "[" + this.currentMonth + "]");
		currYearLabel.innerHTML = this.currentYear;
		if(this.onUpdate)
			this.onUpdate();
	};
	
	this.show = function(date) {
		this.currentYear = date.getFullYear();
		this.currentMonth = date.getMonth() + this.MONTH_OFFSET;
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
	Events.addEventListener(Events.CLICK, function(c) { return function(event) { c.show(c.today)     }; }(this), navLabel);
	
	this.show(this.today);
};