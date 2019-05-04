import './styles/index.scss';
import { CurrentSort, File } from './types/IndexTypes';

import { orderBy } from 'lodash';
import * as moment from 'moment';

class MenuPage {
  elGridBody = document.querySelector('.grid main');
  colHeaders = document.querySelectorAll('.grid header span');
  origFiles: File[];
  currentSort : CurrentSort = {
    direction: 'desc',
    field: 'presented'
  };
  isExiting = false;

  constructor() {
    for (let i = 0; i < this.colHeaders.length; i++) {
      this.colHeaders[i].addEventListener('click', (event: MouseEvent) => this.clickHeader(event));
    }

    this.getJson('http://localhost/api/files');
  }

  clickHeader(event: MouseEvent) {
    if ((event.currentTarget as HTMLElement).innerText === this.currentSort.field) {
      this.currentSort.direction = (this.currentSort.direction === 'asc') ? 'desc' : 'asc';
    } else {
      this.currentSort.field = (event.currentTarget as HTMLElement).innerText;
      this.currentSort.direction = 'asc';
    }

    let files = this.sort(this.currentSort.field, this.currentSort.direction)
    this.addSortClass((event.currentTarget as HTMLElement), this.currentSort.direction);
    this.updateGrid(files);
  }

  async getJson(url: string) {
    let response = await fetch(url);
    this.origFiles = await response.json();
    let files = this.sort();
    this.updateGrid(files);
  }

  sort(field = this.currentSort.field, direction = this.currentSort.direction) {
    field = field === 'Technology' ? 'Group' : field;
    switch (field.toLowerCase()) {
      case 'group':
      case 'title':
      case 'venue':
        return orderBy(this.origFiles, [field.toLowerCase()], direction);

      case 'presented':
        let filesByDate = this.origFiles.sort(this.sortByPresented);
        return direction === 'asc' ? filesByDate : filesByDate.reverse();

      case 'size':
        let filesBySize = this.origFiles.sort(this.sortByFilesize);
        return direction === 'asc' ? filesBySize : filesBySize.reverse();
    }
  }

  sortByPresented(a: File, b: File) {
    if (a.presented.replace('-', '') < b.presented.replace('-', '')) { return -1; }
    if (a.presented.replace('-', '') > b.presented.replace('-', '')) { return 1; }
    return 0;
  }

  sortByFilesize(a: File, b: File) {
    let arr1: string[] = a.size.split(' ');
    let arr2: string[] = b.size.split(' ');
    let num1 = parseFloat(arr1[0]) * (arr1[1] === 'kB' ? 1000 : 1);
    let num2 = parseFloat(arr2[0]) * (arr2[1] === 'kB' ? 1000 : 1);
    if (num1 < num2) { return -1; }
    if (num1 > num2) { return 1; }
    return 0;
  }

  addSortClass(el: HTMLElement, direction: string) {
    for (let i = 0; i < this.colHeaders.length; i++) {
      this.colHeaders[i].className = '';
    }
    direction === 'asc' ? el.classList.toggle('asc') : el.classList.toggle('desc');
  }

  updateGrid(files: File[]) {
    this.elGridBody.innerHTML = '';
    for (let i = 0; i < files.length; i++) {
      this.elGridBody.appendChild(this.createDataRow(files[i]));
    }
  }

  createDataRow(file: File) {
    let spanGroup = this.createElement('span', 'column', file.group);

    let spanVenue = this.createElement('span', 'column', file.venue);

    let spanTitle = this.createElement('span', 'column noPadding');
    spanTitle.appendChild(this.createLink(file.href, file.title));

    let datePresented = moment(file.presented);
    let spanPresented = this.createElement('span', 'column center', datePresented.format('YYYY-MM-DD'));
    let spanSize = this.createElement('span', 'column colSize right', file.size);

    let isNew = datePresented.diff(moment(), 'days') > -30;

    let divRow = this.createElement('div', `row${isNew ? ' new' : ''}`);
    divRow.appendChild(spanGroup);
    divRow.appendChild(spanVenue);
    divRow.appendChild(spanTitle);
    divRow.appendChild(spanPresented);
    divRow.appendChild(spanSize);
    return divRow;
  }

  createElement(type: string, className: string, content = "") {
    let el = document.createElement(type);
    el.className = className;
    el.innerText = content;
    return el;
  }

  createLink(href: string, innerText: string) {
    let el = document.createElement('a');
    el.href = href;
    el.addEventListener('click', this.exitPage);
    el.innerText = innerText;
    return el;
  }

  exitPage(event: MouseEvent) {
    if (!this.isExiting) {
      event.preventDefault();
      this.isExiting = true;
    }

    document.body.classList.add('animate-out');
    let elTarget = event.target as HTMLElement;

    setTimeout(() => {
      elTarget.click();
    }, 1500);
  }
}

new MenuPage();