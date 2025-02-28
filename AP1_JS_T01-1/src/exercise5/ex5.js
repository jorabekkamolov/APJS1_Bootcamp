const dayStart = "07:30" // начало дня
const dayEnd = "17:45" // конец дня;

const StartDay = new Date();
const [s_hours, s_minutes] = dayStart.split(":").map(Number);
StartDay.setHours(s_hours, s_minutes, 0, 0);

const EndDay = new Date();
const [e_hours, e_minutes] = dayEnd.split(":").map(Number);
EndDay.setHours(e_hours, e_minutes, 0, 0);

function scheduleMeeting(startTime, durationMinutes) {
    let hours = 0;
    if(durationMinutes % 60 == 0){
        hours = durationMinutes / 60;
        durationMinutes = durationMinutes - (60 * hours);
    }
    let time = new Date();
    let [t_hours, t_minutes] = startTime.split(":").map(Number);
    time.setHours(t_hours, t_minutes, 0, 0);
    if(time < StartDay){
        return false;
    }
    time.setHours(t_hours + hours, t_minutes + durationMinutes, 0, 0);
    if(time > EndDay){
        return false;
    }
    
    return true;
}

console.log(scheduleMeeting("07:15", 30));
console.log(scheduleMeeting("07:30", 15));