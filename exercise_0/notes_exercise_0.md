✅ Exercise 0: Understanding Observables Natively (RxJS Core)
Goal

Learn what an Observable is.
Create Observables manually.
Subscribe, unsubscribe, and handle errors.
Use basic RxJS operators (map, filter, take).
Understand cold vs hot Observables.
Prepare for Angular integration.


Step 1: Setup a Playground
We’ll use Angular CLI but this exercise is pure RxJS, so you can also run it in Node or StackBlitz.

Guidelines: 
- create your own branch named it exercise 0 and create your folder and under this start following next exercise.

start with installation in all steps add Not to all server side not and zone not if you prefer add an AI agent to solve questions

Commands
# Create a new Angular project (standalone)
ng new rxjs-basics --standalone --routing=false --style=scss

cd rxjs-basics

# Install RxJS (already included in Angular, but for Node demos)
npm install rxjs

Step 2: Folder Structure
For clarity, create a playground folder inside src/app:
src/app/
└─ playground/
   ├─ observable-demo.component.ts
   └─ observable-demo.component.html

Step 3: Create a Standalone Component

File: src/app/playground/observable-demo.component.ts
```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-observable-demo',
  standalone: true,
  templateUrl: './observable-demo.component.html',
})
export class ObservableDemoComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  ngOnInit() {
    // 1. Create an Observable manually
    const myObservable = new Observable<string>((observer) => {
      observer.next('Hello');
      observer.next('RxJS');
      observer.next('World');
      // Simulate async
      setTimeout(() => {
        observer.next('Async value after 2s');
        observer.complete();
      }, 2000);

      // Error example (comment out to test)
      // observer.error('Something went wrong!');
    });

    // 2. Subscribe to it
    this.subscription = myObservable.subscribe({
      next: (value) => console.log('Received:', value),
      error: (err) => console.error('Error:', err),
      complete: () => console.log('Observable completed'),
    });
  }

  ngOnDestroy() {
    // 3. Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
      console.log('Unsubscribed');
    }
  }
}
```

File: src/app/playground/observable-demo.component.html
```
<h2>Observable Demo</h2>
<p>Check the console for output.</p>
```

Step 4: Register Component in main.ts
Replace AppComponent with ObservableDemoComponent for quick testing:
File: src/main.ts
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { ObservableDemoComponent } from './app/playground/observable-demo.component';

bootstrapApplication(ObservableDemoComponent);
```

ng serve -o

Open DevTools Console → You’ll see:
Received: Hello
Received: RxJS
Received: World
Received: Async value after 2s
Observable completed
Unsubscribed

Step 5: Add RxJS Operators
Modify the component to use operators like map, filter, take:
```ts
import { Component, OnInit } from '@angular/core';
import { Observable, map, filter, take } from 'rxjs';

@Component({
  selector: 'app-observable-demo',
  standalone: true,
  template: `<h2>RxJS Operators Demo</h2>`,
})
export class ObservableDemoComponent implements OnInit {
  ngOnInit() {
    const numbers$ = new Observable<number>((observer) => {
      let i = 1;
      const interval = setInterval(() => {
        observer.next(i++);
        if (i > 10) {
          clearInterval(interval);
          observer.complete();
        }
      }, 500);
    });

    numbers$
      .pipe(
        filter((n) => n % 2 === 0), // only even numbers
        map((n) => n * 10),         // multiply by 10
        take(5)                     // take first 5 values
      )
      .subscribe({
        next: (val) => console.log('Processed:', val),
        complete: () => console.log('Done processing'),
      });
  }
}
```

Console output:
Processed: 20
Processed: 40
Processed: 60
Processed: 80
Processed: 100
Done processing

Step 6: Cold vs Hot Observables

Cold: Starts emitting when subscribed (our examples so far).
Hot: Emits regardless of subscribers (e.g., Subject).

Quick demo:
```ts
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe((v) => console.log('Subscriber A:', v));
subject.next(1);
subject.next(2);

subject.subscribe((v) => console.log('Subscriber B:', v));
subject.next(3);
```

Output:
Subscriber A: 1
Subscriber A: 2
Subscriber A: 3
Subscriber B: 3

Step 7: Best Practices

Always unsubscribe (or use Angular’s takeUntilDestroyed()).
Use operators instead of manual logic.
Keep Observables cold for predictable behavior.
Use Subjects for multicasting or bridging imperative events.


✅ What’s Next?
Now that you understand native Observables, we can:

Move to Exercise 1: HttpClient + Signals.
Or create a cheat sheet for RxJS operators.
Or build a real-time demo with interval, timer, and Subject.


👉 midas touch