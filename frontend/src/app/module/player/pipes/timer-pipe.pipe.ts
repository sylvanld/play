import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerPipe'
})
export class TimerPipePipe implements PipeTransform {

  transform(value: number): any {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + ('0' + ~~(value - minutes * 60)).slice(-2);
  }

}
