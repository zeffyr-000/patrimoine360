import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    let html = value
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr>')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Tables
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        if (cells.every((cell: string) => /^-+$/.test(cell))) {
          return ''; // Header separator row
        }
        const cellTags = cells.map((cell: string) => `<td>${cell}</td>`).join('');
        return `<tr>${cellTags}</tr>`;
      })
      // Clean up empty lines around block elements
      .replace(/(<\/(h[1-3]|hr|ul|table|li)>)\n*/g, '$1')
      .replace(/\n*(<(h[1-3]|hr|ul|table))/g, '$1')
      // Paragraphs: only double newlines create new paragraphs
      .replace(/\n\n+/g, '</p><p>')
      // Single newlines inside paragraphs become spaces (not <br>)
      .replace(/\n/g, ' ');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = `<p>${html}</p>`;
    }

    // Wrap consecutive li in ul
    html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');

    // Wrap table rows in table
    html = html.replace(/(<tr>.*<\/tr>)+/g, '<table>$&</table>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
