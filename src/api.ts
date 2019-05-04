import { File } from "./types/IndexTypes";

import * as fs from 'fs';
import * as nodedir from 'node-dir';
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;
import * as prettyBytes from 'pretty-bytes';
import * as moment from 'moment';

export class api {
  constructor(app: any) { // TODO :Figure out what app is
    app.get('/api/files', this.getPresentations);
  }

  getPresentations(req: string, res: XMLHttpRequest) {
    let files: File[] = [];
    nodedir.readFiles('./src/presentations', { recursive: true }, (err: any, content: string | Buffer, fileName: string, nextFile: () => void) => {
      let isWin = process.platform === 'win32';
      let group = '';
      let href = '';
      if (isWin) {
        group = fileName.split('\\')[2];
        href = fileName.replace('src\\', '/').split('\\').join('/');
      } else {
        group = fileName.split('/')[2];
        href = fileName.replace('src/', '/');
      }

      if (group === 'index.html' || href.indexOf('/images/') > 0) {
        nextFile();
        return;
      }
      group = group.replace('-', ' ');
      group = group.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      group = group.replace('script', 'Script');
      group = group.replace('Css', 'CSS');
      let title = '';
      let author = '';
      let presented = '';
      let venue = '';

      let dom = new JSDOM(content);
      let document = dom.window.document;
      let head = document.getElementsByTagName('head')[0];
      if (head && head.children.length > 0) {
        title = document.title ? document.title : '';

        let elAuthor = head.querySelector('meta[name="author"]') as HTMLMetaElement;
        author = elAuthor ? elAuthor.content : '';

        let elPresented = head.querySelector('meta[name="presented"]') as HTMLMetaElement;
        presented = elPresented ? elPresented.content : '';

        let elVenue = head.querySelector('meta[name="venue"]') as HTMLMetaElement;
        venue = elVenue ? elVenue.content : '';
      }

      let stats = fs.statSync(fileName);
      let size = prettyBytes(stats.size);
      let modified = moment(stats.mtime).toString();
      let newFile = { group, title, href, author, venue, presented, modified, size };
      files.push(newFile);

      nextFile();
    }, (err, output) => {
      res.send(files as any); // TODO: What is this?
    });
  }

  public toTitleCase(str: string) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
}