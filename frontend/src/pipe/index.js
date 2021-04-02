import Vue from 'vue';
import pt from 'date-fns/locale/pt';
import { 
    parseISO, 
    format,
    subHours
} from 'date-fns';

// Pipe Date format
Vue.filter('date', (date, args) => {
    if(date){
        return format(subHours(parseISO(date), 3), args != null ? args : "'Dia' dd 'de' MMMM', às ' HH:mm'h'",{locale: pt})
    }
})
