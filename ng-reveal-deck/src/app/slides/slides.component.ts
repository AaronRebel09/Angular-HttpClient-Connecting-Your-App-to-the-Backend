import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// Static imports are fine because we're NOT using SSR in this project.
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

@Component({
  selector: 'app-slides',
  standalone: true,
  template: `
  <div #deck class="reveal">
    <div class="slides">
      <!-- ✅ Minimal external Markdown -->
      <section data-markdown="/assets/slides.md"></section>

      <section data-markdown="/assets/slides/02-http-requests.md"></section>
      <section data-markdown="/assets/slides/03-observables.md"></section>
      <section data-markdown="/assets/slides/04-example.md"></section>


      



    </div>
  </div>
`
})
export class SlidesComponent implements AfterViewInit {
  @ViewChild('deck', { static: true }) deck!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      Reveal.initialize({
        hash: true,
        transition: 'slide',
        autoAnimate: true,
        plugins: [Markdown, Highlight],
      });
    }, 0);
  }
}