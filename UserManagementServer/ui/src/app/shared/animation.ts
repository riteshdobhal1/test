import { trigger, state, style, animate, transition } from '@angular/animations';
const errorBorderColor = '#FB7374';
const successBorderColor = '#7ABA7A';
const onElementBorderColor = '#FCECAE';
const bordWidth = '1px';
const errorState = 'error';
const successState = 'success';
const onElementState = 'onElement';
const hideState = 'hide';
const showState = 'show';
const animateDelay = '100ms ease-in';

const highlightElement = trigger('validate', [
    state(errorState, style({
     borderColor: errorBorderColor,
     borderWidth: bordWidth 
    })),
    state(successState, style({
     borderColor: successBorderColor,
     borderWidth: bordWidth
    })),
    state(onElementState, style({
      borderColor: onElementBorderColor,
      borderWidth: bordWidth
     })),
    transition('*<=>*', animate(animateDelay))
]);
const highlightMessage = trigger('message', [
  state(hideState, style({visibility: 'hidden'})),
  state(showState, style({visibility: 'visible'})),
  transition('*<=>*', animate(animateDelay))
]);

export { highlightElement , highlightMessage, showState, hideState,
   onElementState, successState, errorState};
