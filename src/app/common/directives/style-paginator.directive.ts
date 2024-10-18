import {
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input,
  AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';


interface PageObject {
    length: number;
    pageIndex: number;
    pageSize: number;
    previousPageIndex: number;
}

@Directive({
  standalone: true,
  selector: '[gastroSelector]',
})
export class StylePaginatorDirective implements AfterViewInit {
  private pageGapTxt = '...';
  private rangeStart: number;
  private rangeEnd: number;
  private buttons = [];
  private curPageObj: PageObject = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0
  };

    @Input()
  get showTotalPages(): number {
    return this.initShowTotalPages;
  }
    set showTotalPages(value: number) {
      this.initShowTotalPages = value % 2 === 0 ? value + 1 : value;
    }
    private initShowTotalPages = 2;

    get halfOfPages(): number {
      return this.initShowTotalPages % 2 === 0 ? this.showTotalPages / 2 : (this.showTotalPages - 1) / 2;
    }

    get numOfPages(): number {
      return this.matPag.getNumberOfPages();
    }

    get lastPageIndex(): number {
      return this.matPag.getNumberOfPages() - 1;
    }

    constructor(
        @Host() @Self() @Optional() private readonly matPag: MatPaginator,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2
    ) {
      this.matPag.page.subscribe((e: PageObject) => {
        if (
          this.curPageObj.pageSize !== e.pageSize &&
                this.curPageObj.pageIndex !== 0
        ) {
          e.pageIndex = 0;
          this.rangeStart = 0;
          this.rangeEnd = this.initShowTotalPages - 1;
        }
        this.curPageObj = e;

        this.initPageRange();
      });
    }

    public buildPageNumbers(sizeOfActualButtons: number) {
      let actionContainer = this.viewContainerRef.element.nativeElement.querySelector(
        'div.mat-paginator-range-actions'
      );
      let nextPageNode = this.viewContainerRef.element.nativeElement.querySelector(
        'button.mat-paginator-navigation-next'
      );
      if (this.buttons.length > 0) {
        this.buttons.forEach(button => {
          this.renderer.removeChild(actionContainer, button);
        });
        this.buttons.length = 0;
      }
      for (let i = 0; i < sizeOfActualButtons; i++) {
        if (i >= this.rangeStart && i <= this.rangeEnd) {
          this.renderer.insertBefore(
            actionContainer,
            this.createButton(i, this.matPag.pageIndex),
            nextPageNode
          );
        }

        if (i === this.rangeEnd) {
          this.renderer.insertBefore(
            actionContainer,
            this.createButton(this.pageGapTxt, this.rangeEnd),
            nextPageNode
          );
        }
      }
    }

    private createButton(enumerationButton: any, pageIndex: number): any {
      let linkBtn: MatButton = this.renderer.createElement('button');
      let pagingTxt = isNaN(enumerationButton) ? this.pageGapTxt : +(enumerationButton + 1);
      let text = this.renderer.createText(pagingTxt + '');

      switch (enumerationButton) {
      case pageIndex:
        this.renderer.setAttribute(linkBtn, 'disabled', 'disabled');
        break;
      case this.pageGapTxt:
        let newIndex = this.curPageObj.pageIndex + this.initShowTotalPages;

        if (newIndex >= this.numOfPages) newIndex = this.lastPageIndex;

        if (pageIndex !== this.lastPageIndex) {
          this.renderer.listen(linkBtn, 'click', () => {
            this.switchPage(newIndex);
          });
        }

        if (pageIndex === this.lastPageIndex) {
          this.renderer.setAttribute(linkBtn, 'disabled', 'disabled');
        }
        break;
      default:
        this.renderer.listen(linkBtn, 'click', () => {
          this.switchPage(enumerationButton);
        });
        break;
      }

      this.renderer.appendChild(linkBtn, text);
      this.buttons.push(linkBtn);
      return linkBtn;
    }

    private initPageRange(): void {
      let middleIndex = (this.rangeStart + this.rangeEnd) / 2;

      this.rangeStart = this.calcRangeStart(middleIndex);
      this.rangeEnd = this.calcRangeEnd(middleIndex);

      this.buildPageNumbers(this.numOfPages);
    }

    private calcRangeStart(middleIndex: number): number {
      switch (true) {
      case this.curPageObj.pageIndex === 0 && this.rangeStart !== 0:
        return 0;
      case this.curPageObj.pageIndex > this.rangeEnd:
        return this.curPageObj.pageIndex + this.halfOfPages > this.lastPageIndex
          ? this.lastPageIndex - this.halfOfPages * 2
          : this.curPageObj.pageIndex - this.halfOfPages;
      case this.curPageObj.pageIndex > this.curPageObj.previousPageIndex &&
                this.curPageObj.pageIndex > middleIndex &&
                this.rangeEnd < this.lastPageIndex:
        return this.rangeStart + 1;
      case this.curPageObj.pageIndex < this.curPageObj.previousPageIndex &&
                this.curPageObj.pageIndex < middleIndex &&
                this.rangeStart > 0:
        return this.rangeStart - 1;
      default:
        return this.rangeStart;
      }
    }

    private calcRangeEnd(middleIndex: number): number {
      switch (true) {
      case this.curPageObj.pageIndex === 0 &&
                this.rangeEnd !== this.initShowTotalPages:
        return this.initShowTotalPages - 1;
      case this.curPageObj.pageIndex > this.rangeEnd:
        return this.curPageObj.pageIndex + this.halfOfPages > this.lastPageIndex
          ? this.lastPageIndex
          : this.curPageObj.pageIndex + 1;
      case this.curPageObj.pageIndex > this.curPageObj.previousPageIndex &&
                this.curPageObj.pageIndex > middleIndex &&
                this.rangeEnd < this.lastPageIndex:
        return this.rangeEnd + 1;
      case this.curPageObj.pageIndex < this.curPageObj.previousPageIndex &&
                this.curPageObj.pageIndex < middleIndex &&
                this.rangeStart >= 0 &&
                this.rangeEnd > this.initShowTotalPages - 1:
        return this.rangeEnd - 1;
      default:
        return this.rangeEnd;
      }
    }
    public switchPage(newPage: number): void {
      let previousPageIndex = this.matPag.pageIndex;
      this.matPag.pageIndex = newPage;
      this.matPag['_emitPageEvent'](previousPageIndex);
      this.initPageRange();
    }

    public ngAfterViewInit() {
      this.rangeStart = 0;
      this.rangeEnd = this.initShowTotalPages - 1;
      this.initPageRange();
    }
}